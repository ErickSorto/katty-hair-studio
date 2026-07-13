import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
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

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "This cancellation link is invalid." }, { status: 400 });
  }

  try {
    const booking = await getBookingForCancellation(parsed.data.confirmationCode);

    if (!booking || !tokenMatches(parsed.data.token, booking.cancellation_token_hash)) {
      return NextResponse.json({ error: "This cancellation link is invalid." }, { status: 404 });
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({ cancelled: true });
    }

    if (!booking.google_event_id) {
      throw new Error("This appointment does not have an active Google Calendar event.");
    }

    const calendarId = await getBookingCalendarId();
    await deleteGoogleCalendarEvent(calendarId, booking.google_event_id);
    await cancelBookingRecord(booking.id, parsed.data.reason || "Customer cancelled online");

    return NextResponse.json({ cancelled: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to cancel the appointment.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
