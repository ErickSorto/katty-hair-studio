import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/booking/availability";
import { getDemoAvailability, isBookingDemoEnabled } from "@/lib/booking/demo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceId: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    date: request.nextUrl.searchParams.get("date"),
    serviceId: request.nextUrl.searchParams.get("serviceId"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a valid service and date." }, { status: 400 });
  }

  if (isBookingDemoEnabled(request.nextUrl.searchParams)) {
    return NextResponse.json(getDemoAvailability(parsed.data), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const result = await getAvailableSlots(parsed.data);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Booking availability unavailable", error);
    return NextResponse.json(
      { error: "Live availability is temporarily unavailable. Please call the salon." },
      { status: 503 },
    );
  }
}
