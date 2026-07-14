import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/booking/availability";
import { getDemoAvailability, isBookingDemoEnabled } from "@/lib/booking/demo";
import {
  formatBookingSlotTime,
  getBookingErrorMessage,
  normalizeBookingLocale,
} from "@/lib/booking/localization";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceId: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  const locale = normalizeBookingLocale(request.nextUrl.searchParams.get("locale"));
  const parsed = querySchema.safeParse({
    date: request.nextUrl.searchParams.get("date"),
    serviceId: request.nextUrl.searchParams.get("serviceId"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: getBookingErrorMessage(locale, "INVALID_SERVICE_DATE"),
        errorCode: "INVALID_SERVICE_DATE",
      },
      { status: 400 },
    );
  }

  if (isBookingDemoEnabled(request.nextUrl.searchParams)) {
    return NextResponse.json(getDemoAvailability(parsed.data, locale), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const result = await getAvailableSlots(parsed.data);
    return NextResponse.json(
      {
        ...result,
        slots: result.slots.map((slot) => ({
          ...slot,
          label: formatBookingSlotTime(slot.startsAt, result.timezone, locale),
        })),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Booking availability unavailable", error);
    return NextResponse.json(
      {
        error: getBookingErrorMessage(locale, "AVAILABILITY_UNAVAILABLE"),
        errorCode: "AVAILABILITY_UNAVAILABLE",
      },
      { status: 503 },
    );
  }
}
