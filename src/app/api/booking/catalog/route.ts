import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getDemoCatalog, isBookingDemoEnabled } from "@/lib/booking/demo";
import { getBookingCatalog, getSalonSettings } from "@/lib/booking/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (isBookingDemoEnabled(request.nextUrl.searchParams)) {
    return NextResponse.json(getDemoCatalog(), { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const [catalog, settings] = await Promise.all([getBookingCatalog(), getSalonSettings()]);
    return NextResponse.json(
      {
        ...catalog,
        bookingWindowDays: settings.bookingWindowDays,
        maxConcurrentBookings: settings.maxConcurrentBookings,
        promotion: {
          amount: 10,
          label: "Mondays are $10 off all services",
          weekday: 1,
        },
        timezone: settings.timezone,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Booking catalog unavailable", error);
    return NextResponse.json(
      { error: "Online booking is being prepared. Please call the salon for an appointment." },
      { status: 503 },
    );
  }
}
