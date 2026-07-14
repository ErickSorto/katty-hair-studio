import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { after, NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/booking/availability";
import {
  demoServices,
  getDemoAvailability,
  isBookingDemoEnabled,
} from "@/lib/booking/demo";
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
import { isLocalDevelopmentRuntime } from "@/lib/runtime/environment";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const bookingSchema = z.object({
  customerEmail: z.string().trim().email().max(254),
  customerName: z.string().trim().min(2).max(100),
  customerNotes: z.string().trim().max(1000).optional(),
  customerPhone: z.string().trim().max(30).optional(),
  serviceId: z.string().uuid(),
  smsConsent: z.boolean().default(false),
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
    return NextResponse.json(
      { error: "Review the appointment and contact details." },
      { status: 400 },
    );
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

  if (isBookingDemoEnabled(request.nextUrl.searchParams)) {
    const service = demoServices.find((item) => item.id === parsed.data.serviceId);
    const date = formatInTimeZone(
      new Date(parsed.data.startsAt),
      "America/New_York",
      "yyyy-MM-dd",
    );
    const availability = getDemoAvailability({ date, serviceId: parsed.data.serviceId });
    const selectedSlot = availability.slots.find(
      (slot) => slot.startsAt === parsed.data.startsAt,
    );

    if (!service || !selectedSlot) {
      return NextResponse.json(
        { error: "That preview appointment time is no longer available." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        booking: {
          confirmationCode: confirmationCode(),
          endsAt: selectedSlot.endsAt,
          serviceName: service.name,
          startsAt: selectedSlot.startsAt,
        },
      },
      { status: 201 },
    );
  }

  const configuration = await getAvailabilityConfiguration(parsed.data.serviceId).catch(
    (error) => ({ error }),
  );

  if ("error" in configuration) {
    console.error("Booking configuration unavailable", configuration.error);
    return NextResponse.json(
      { error: "Online booking is temporarily unavailable. Please call the salon." },
      { status: 503 },
    );
  }

  const { service, settings, team } = configuration;

  if (!team || !service || !settings.bookingCalendarId) {
    return NextResponse.json(
      { error: "Online booking is still being configured. Please call the salon." },
      { status: 409 },
    );
  }

  const date = formatInTimeZone(
    new Date(parsed.data.startsAt),
    settings.timezone,
    "yyyy-MM-dd",
  );

  try {
    await expireStaleBookingHolds();
    const availability = await getAvailableSlots({ date, serviceId: service.id });
    const selectedSlot = availability.slots.find(
      (slot) => slot.startsAt === parsed.data.startsAt,
    );

    if (!selectedSlot) {
      return NextResponse.json(
        { error: "That appointment time is no longer available." },
        { status: 409 },
      );
    }

    if (isLocalDevelopmentRuntime()) {
      const code = `LOCAL-${randomBytes(3).toString("hex").toUpperCase()}`;
      const googleEvent = await createGoogleCalendarEvent({
        bookingId: `local-${randomUUID()}`,
        calendarId: settings.bookingCalendarId,
        description: [
          "LOCAL TEST BOOKING — no production booking record or notification was created.",
          `Test confirmation: ${code}`,
          `Customer: ${parsed.data.customerName}`,
          `Email entered: ${parsed.data.customerEmail}`,
          customerPhone ? `Phone entered: ${customerPhone}` : undefined,
          parsed.data.customerNotes ? `Notes: ${parsed.data.customerNotes}` : undefined,
        ]
          .filter(Boolean)
          .join("\n"),
        end: selectedSlot.endsAt,
        location: settings.address,
        sendUpdates: "none",
        start: selectedSlot.startsAt,
        summary: `[LOCAL TEST] ${service.name} — ${parsed.data.customerName}`,
        timeZone: settings.timezone,
      });

      return NextResponse.json(
        {
          booking: {
            confirmationCode: code,
            endsAt: selectedSlot.endsAt,
            googleEventLink: googleEvent.htmlLink,
            localTest: true,
            serviceName: service.name,
            startsAt: selectedSlot.startsAt,
          },
        },
        { status: 201 },
      );
    }

    const cancellationToken = randomBytes(32).toString("base64url");
    const cancellationTokenHash = createHash("sha256")
      .update(cancellationToken)
      .digest("hex");
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
      holdExpiresAt: addMinutes(new Date(), settings.holdMinutes).toISOString(),
      serviceId: service.id,
      smsConsentAt: parsed.data.smsConsent ? new Date().toISOString() : undefined,
      startsAt: selectedSlot.startsAt,
    });
    let googleEvent: { htmlLink?: string; id: string } | undefined;

    try {
      googleEvent = await createGoogleCalendarEvent({
        attendeeEmail: parsed.data.customerEmail,
        bookingId,
        calendarId: settings.bookingCalendarId,
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
        location: settings.address,
        start: selectedSlot.startsAt,
        summary: `${service.name} — ${parsed.data.customerName}`,
        timeZone: settings.timezone,
      });
      await confirmBooking(bookingId, googleEvent);
    } catch (error) {
      await failPendingBooking(bookingId);

      if (googleEvent) {
        await deleteGoogleCalendarEvent(settings.bookingCalendarId, googleEvent.id).catch(
          () => undefined,
        );
      }

      throw error;
    }

    after(async () => {
      const results = await sendBookingConfirmation({
        bookingId,
        cancellationToken,
        confirmationCode: code,
        customerEmail: parsed.data.customerEmail,
        customerName: parsed.data.customerName,
        customerNotes: parsed.data.customerNotes,
        customerPhone,
        endsAt: selectedSlot.endsAt,
        googleEventLink: googleEvent?.htmlLink,
        salonAddress: settings.address,
        salonEmail: settings.email,
        salonName: settings.salonName,
        salonPhone: settings.phone,
        serviceName: service.name,
        smsConsent: parsed.data.smsConsent,
        startsAt: selectedSlot.startsAt,
        timezone: settings.timezone,
      });

      results.forEach((result) => {
        if (!result.ok) console.error("Booking notification failed", result.error);
      });
    });

    return NextResponse.json(
      {
        booking: {
          confirmationCode: code,
          endsAt: selectedSlot.endsAt,
          serviceName: service.name,
          startsAt: selectedSlot.startsAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking creation failed", error);
    const capacityConflict =
      error instanceof Error && /time was just taken|time is no longer available/i.test(error.message);
    const message = capacityConflict
      ? error.message
      : "We couldn't confirm that appointment. Choose another time or call the salon.";
    return NextResponse.json({ error: message }, { status: capacityConflict ? 409 : 503 });
  }
}
