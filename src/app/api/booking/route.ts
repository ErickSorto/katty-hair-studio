import { createHash, randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/booking/availability";
import { sendBookingConfirmation } from "@/lib/booking/notifications";
import {
  confirmBooking,
  createPendingBooking,
  expireStaleBookingHolds,
  failPendingBooking,
  getAvailabilityConfiguration,
} from "@/lib/booking/repository";
import {
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
} from "@/lib/google-calendar/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const bookingSchema = z.object({
  customerEmail: z.string().trim().email().max(254),
  customerName: z.string().trim().min(2).max(100),
  customerNotes: z.string().trim().max(1000).optional(),
  customerPhone: z.string().trim().max(30).optional(),
  serviceId: z.string().uuid(),
  smsConsent: z.boolean().default(false),
  staffId: z.string().uuid(),
  startsAt: z.string().datetime({ offset: true }),
});

function normalizeUsPhone(phone?: string) {
  if (!phone) {
    return undefined;
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  throw new Error("Enter a valid 10-digit US phone number.");
}

function confirmationCode() {
  return `KHS-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  const parsed = bookingSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Review the appointment and contact details." }, { status: 400 });
  }

  let customerPhone: string | undefined;

  try {
    customerPhone = normalizeUsPhone(parsed.data.customerPhone);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enter a valid phone number." },
      { status: 400 },
    );
  }

  if (parsed.data.smsConsent && !customerPhone) {
    return NextResponse.json(
      { error: "A phone number is required when SMS confirmations are selected." },
      { status: 400 },
    );
  }

  const configuration = await getAvailabilityConfiguration(
    parsed.data.serviceId,
    parsed.data.staffId,
  ).catch((error) => ({ error }));

  if ("error" in configuration) {
    console.error("Booking configuration unavailable", configuration.error);
    return NextResponse.json(
      { error: "Online booking is temporarily unavailable. Please call the salon." },
      { status: 503 },
    );
  }

  const staff = configuration.staff.find((person) => person.id === parsed.data.staffId);
  const service = configuration.service;

  if (!staff || !service) {
    return NextResponse.json({ error: "That stylist or service is unavailable." }, { status: 409 });
  }

  const date = formatInTimeZone(
    new Date(parsed.data.startsAt),
    configuration.settings.timezone,
    "yyyy-MM-dd",
  );

  try {
    await expireStaleBookingHolds();
    const availability = await getAvailableSlots({
      date,
      serviceId: service.id,
      staffId: staff.id,
    });
    const selectedSlot = availability.slots.find(
      (slot) => slot.staffId === staff.id && slot.startsAt === parsed.data.startsAt,
    );

    if (!selectedSlot) {
      return NextResponse.json(
        { error: "That appointment time is no longer available." },
        { status: 409 },
      );
    }

    const cancellationToken = randomBytes(32).toString("base64url");
    const cancellationTokenHash = createHash("sha256").update(cancellationToken).digest("hex");
    const code = confirmationCode();
    const bookingId = await createPendingBooking({
      blockedEndsAt: selectedSlot.blockedEndsAt,
      blockedStartsAt: selectedSlot.blockedStartsAt,
      cancellationTokenHash,
      confirmationCode: code,
      customerEmail: parsed.data.customerEmail,
      customerName: parsed.data.customerName,
      customerNotes: parsed.data.customerNotes,
      customerPhone,
      endsAt: selectedSlot.endsAt,
      holdExpiresAt: addMinutes(new Date(), configuration.settings.holdMinutes).toISOString(),
      serviceId: service.id,
      smsConsentAt: parsed.data.smsConsent ? new Date().toISOString() : undefined,
      staffId: staff.id,
      startsAt: selectedSlot.startsAt,
    });
    let googleEvent: { htmlLink?: string; id: string } | undefined;

    try {
      googleEvent = await createGoogleCalendarEvent({
        attendeeEmail: parsed.data.customerEmail,
        calendarId: staff.calendarId,
        description: [
          `Booking ${code}`,
          `Customer: ${parsed.data.customerName}`,
          `Email: ${parsed.data.customerEmail}`,
          customerPhone ? `Phone: ${customerPhone}` : undefined,
          parsed.data.customerNotes ? `Notes: ${parsed.data.customerNotes}` : undefined,
        ]
          .filter(Boolean)
          .join("\n"),
        end: selectedSlot.endsAt,
        location: configuration.settings.address,
        start: selectedSlot.startsAt,
        summary: `${service.name} — ${parsed.data.customerName}`,
        timeZone: configuration.settings.timezone,
      });
      await confirmBooking(bookingId, googleEvent);
    } catch (error) {
      await failPendingBooking(bookingId);

      if (googleEvent) {
        await deleteGoogleCalendarEvent(staff.calendarId, googleEvent.id).catch(() => undefined);
      }

      throw error;
    }

    await sendBookingConfirmation({
      bookingId,
      cancellationToken,
      confirmationCode: code,
      customerEmail: parsed.data.customerEmail,
      customerName: parsed.data.customerName,
      customerPhone,
      serviceName: service.name,
      smsConsent: parsed.data.smsConsent,
      staffName: staff.displayName,
      startsAt: selectedSlot.startsAt,
      timezone: configuration.settings.timezone,
    });

    return NextResponse.json(
      {
        booking: {
          confirmationCode: code,
          endsAt: selectedSlot.endsAt,
          serviceName: service.name,
          staffName: staff.displayName,
          startsAt: selectedSlot.startsAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking creation failed", error);
    const message =
      error instanceof Error && /time was just taken|time is no longer available/i.test(error.message)
        ? error.message
        : "We couldn't confirm that appointment. Choose another time or call the salon.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
