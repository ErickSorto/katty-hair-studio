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
  getBookingErrorMessage,
  getLocalizedBookingServiceName,
  normalizeBookingLocale,
  type BookingErrorCode,
  type BookingLocale,
} from "@/lib/booking/localization";
import {
  BookingCapacityError,
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
  customerLocale: z.enum(["en", "es"]).default("en"),
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

function bookingErrorResponse(
  locale: BookingLocale,
  errorCode: BookingErrorCode,
  status: number,
) {
  return NextResponse.json(
    { error: getBookingErrorMessage(locale, errorCode), errorCode },
    { status },
  );
}

function calendarEventContent(input: {
  confirmationCode: string;
  customerEmail: string;
  customerLocale: BookingLocale;
  customerName: string;
  customerNotes?: string;
  customerPhone?: string;
  localTest?: boolean;
  serviceName: string;
  serviceSlug: string;
}) {
  const localizedServiceName = getLocalizedBookingServiceName(
    input.serviceSlug,
    input.serviceName,
    input.customerLocale,
  );

  if (input.customerLocale === "es") {
    return {
      description: [
        input.localTest
          ? "LOCAL TEST BOOKING / RESERVA LOCAL DE PRUEBA — no production record or notification was created / no se creó ningún registro ni aviso de producción."
          : `Booking / Reserva ${input.confirmationCode}`,
        input.localTest ? `Test confirmation / Confirmación de prueba: ${input.confirmationCode}` : undefined,
        `Customer / Cliente: ${input.customerName}`,
        `Email / Correo electrónico: ${input.customerEmail}`,
        input.customerPhone
          ? `Phone / Teléfono: ${input.customerPhone}`
          : undefined,
        input.customerNotes ? `Notes / Notas: ${input.customerNotes}` : undefined,
      ]
        .filter(Boolean)
        .join("\n"),
      summary: `${input.localTest ? "[LOCAL TEST / PRUEBA LOCAL] " : ""}${input.serviceName} / ${localizedServiceName} — ${input.customerName}`,
    };
  }

  return {
    description: [
      input.localTest
        ? "LOCAL TEST BOOKING — no production booking record or notification was created."
        : `Booking ${input.confirmationCode}`,
      input.localTest ? `Test confirmation: ${input.confirmationCode}` : undefined,
      `Customer: ${input.customerName}`,
      input.localTest
        ? `Email entered: ${input.customerEmail}`
        : `Email: ${input.customerEmail}`,
      input.customerPhone
        ? `${input.localTest ? "Phone entered" : "Phone"}: ${input.customerPhone}`
        : undefined,
      input.customerNotes ? `Notes: ${input.customerNotes}` : undefined,
    ]
      .filter(Boolean)
      .join("\n"),
    summary: `${input.localTest ? "[LOCAL TEST] " : ""}${input.serviceName} — ${input.customerName}`,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const requestedLocale = normalizeBookingLocale(
    body && typeof body === "object" && "customerLocale" in body
      ? body.customerLocale
      : undefined,
  );
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return bookingErrorResponse(requestedLocale, "INVALID_BOOKING_DETAILS", 400);
  }

  const customerLocale = parsed.data.customerLocale;

  let customerPhone: string | undefined;

  try {
    customerPhone = normalizeUsPhone(parsed.data.customerPhone);
  } catch {
    return bookingErrorResponse(customerLocale, "INVALID_PHONE", 400);
  }

  if (parsed.data.smsConsent && !customerPhone) {
    return bookingErrorResponse(customerLocale, "SMS_PHONE_REQUIRED", 400);
  }

  if (isBookingDemoEnabled(request.nextUrl.searchParams)) {
    const service = demoServices.find((item) => item.id === parsed.data.serviceId);
    const date = formatInTimeZone(
      new Date(parsed.data.startsAt),
      "America/New_York",
      "yyyy-MM-dd",
    );
    const availability = getDemoAvailability(
      { date, serviceId: parsed.data.serviceId },
      customerLocale,
    );
    const selectedSlot = availability.slots.find(
      (slot) => slot.startsAt === parsed.data.startsAt,
    );

    if (!service || !selectedSlot) {
      return bookingErrorResponse(customerLocale, "PREVIEW_SLOT_UNAVAILABLE", 409);
    }

    const localizedServiceName = getLocalizedBookingServiceName(
      service.slug,
      service.name,
      customerLocale,
    );

    return NextResponse.json(
      {
        booking: {
          confirmationCode: confirmationCode(),
          endsAt: selectedSlot.endsAt,
          serviceName: localizedServiceName,
          serviceSlug: service.slug,
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
    return bookingErrorResponse(customerLocale, "BOOKING_UNAVAILABLE", 503);
  }

  const { service, settings, team } = configuration;

  if (!team || !service || !settings.bookingCalendarId) {
    return bookingErrorResponse(customerLocale, "BOOKING_NOT_CONFIGURED", 409);
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
      return bookingErrorResponse(customerLocale, "SLOT_UNAVAILABLE", 409);
    }

    if (isLocalDevelopmentRuntime()) {
      const code = `LOCAL-${randomBytes(3).toString("hex").toUpperCase()}`;
      const eventContent = calendarEventContent({
        confirmationCode: code,
        customerEmail: parsed.data.customerEmail,
        customerLocale,
        customerName: parsed.data.customerName,
        customerNotes: parsed.data.customerNotes,
        customerPhone,
        localTest: true,
        serviceName: service.name,
        serviceSlug: service.slug,
      });
      const googleEvent = await createGoogleCalendarEvent({
        bookingId: `local-${randomUUID()}`,
        calendarId: settings.bookingCalendarId,
        description: eventContent.description,
        end: selectedSlot.endsAt,
        location: settings.address,
        sendUpdates: "none",
        start: selectedSlot.startsAt,
        summary: eventContent.summary,
        timeZone: settings.timezone,
      });

      return NextResponse.json(
        {
          booking: {
            confirmationCode: code,
            endsAt: selectedSlot.endsAt,
            googleEventLink: googleEvent.htmlLink,
            localTest: true,
            serviceName: getLocalizedBookingServiceName(
              service.slug,
              service.name,
              customerLocale,
            ),
            serviceSlug: service.slug,
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
      customerLocale,
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
      const eventContent = calendarEventContent({
        confirmationCode: code,
        customerEmail: parsed.data.customerEmail,
        customerLocale,
        customerName: parsed.data.customerName,
        customerNotes: parsed.data.customerNotes,
        customerPhone,
        serviceName: service.name,
        serviceSlug: service.slug,
      });
      googleEvent = await createGoogleCalendarEvent({
        attendeeEmail: parsed.data.customerEmail,
        bookingId,
        calendarId: settings.bookingCalendarId,
        description: eventContent.description,
        end: selectedSlot.endsAt,
        location: settings.address,
        start: selectedSlot.startsAt,
        summary: eventContent.summary,
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
        customerLocale,
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
        serviceSlug: service.slug,
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
          serviceName: getLocalizedBookingServiceName(
            service.slug,
            service.name,
            customerLocale,
          ),
          serviceSlug: service.slug,
          startsAt: selectedSlot.startsAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking creation failed", error);
    const capacityConflict = error instanceof BookingCapacityError;
    return bookingErrorResponse(
      customerLocale,
      capacityConflict ? "BOOKING_CAPACITY_REACHED" : "BOOKING_FAILED",
      capacityConflict ? 409 : 503,
    );
  }
}
