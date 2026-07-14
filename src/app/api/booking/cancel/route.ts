import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getBookingErrorMessage,
  normalizeBookingLocale,
  type BookingErrorCode,
  type BookingLocale,
} from "@/lib/booking/localization";
import {
  cancelBookingRecord,
  getBookingCalendarId,
  getBookingForCancellation,
} from "@/lib/booking/repository";
import { deleteGoogleCalendarEvent } from "@/lib/google-calendar/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const requestSchema = z.object({
  confirmationCode: z.string().regex(/^KHS-[A-F0-9]{6}$/),
  customerLocale: z.enum(["en", "es"]).default("en"),
  reason: z.string().trim().max(500).default("Customer cancelled online"),
  token: z.string().min(20).max(200),
});

function tokenMatches(token: string, expectedHash: string) {
  const receivedHash = createHash("sha256").update(token).digest("hex");
  return (
    receivedHash.length === expectedHash.length &&
    timingSafeEqual(Buffer.from(receivedHash), Buffer.from(expectedHash))
  );
}

function cancellationErrorResponse(
  locale: BookingLocale,
  errorCode: BookingErrorCode,
  status: number,
) {
  return NextResponse.json(
    { error: getBookingErrorMessage(locale, errorCode), errorCode },
    { status },
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const hasExplicitLocale =
    body &&
    typeof body === "object" &&
    "customerLocale" in body &&
    (body.customerLocale === "en" || body.customerLocale === "es");
  const requestedLocale = normalizeBookingLocale(
    body && typeof body === "object" && "customerLocale" in body
      ? body.customerLocale
      : undefined,
  );
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return cancellationErrorResponse(
      requestedLocale,
      "INVALID_CANCELLATION_LINK",
      400,
    );
  }

  let customerLocale = parsed.data.customerLocale;

  try {
    const booking = await getBookingForCancellation(parsed.data.confirmationCode);

    if (!booking || !tokenMatches(parsed.data.token, booking.cancellation_token_hash)) {
      return cancellationErrorResponse(
        requestedLocale,
        "INVALID_CANCELLATION_LINK",
        404,
      );
    }

    if (!hasExplicitLocale) {
      customerLocale = normalizeBookingLocale(booking.customer_locale);
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({ cancelled: true });
    }

    if (!booking.google_event_id) {
      return cancellationErrorResponse(
        customerLocale,
        "CANCELLATION_UNAVAILABLE",
        409,
      );
    }

    const calendarId = await getBookingCalendarId();
    await deleteGoogleCalendarEvent(calendarId, booking.google_event_id);
    await cancelBookingRecord(booking.id, parsed.data.reason || "Customer cancelled online");

    return NextResponse.json({ cancelled: true });
  } catch (error) {
    console.error("Booking cancellation failed", error);
    return cancellationErrorResponse(customerLocale, "CANCELLATION_FAILED", 503);
  }
}
