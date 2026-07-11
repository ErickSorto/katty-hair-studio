import { NextResponse } from "next/server";
import { getBookingCatalog, getSalonSettings } from "@/lib/booking/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const [catalog, settings] = await Promise.all([getBookingCatalog(), getSalonSettings()]);
    return NextResponse.json(
      { ...catalog, timezone: settings.timezone },
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
