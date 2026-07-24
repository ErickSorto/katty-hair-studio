import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getDemoCatalog, isBookingDemoEnabled } from "@/lib/booking/demo";
import {
  getBookingErrorMessage,
  getBookingPromotionLabel,
  getLocalizedBookingServiceDescription,
  getLocalizedBookingServiceName,
  normalizeBookingLocale,
} from "@/lib/booking/localization";
import { withTransientBookingReadRetry } from "@/lib/booking/read-retry";
import { getBookingCatalog, getSalonSettings } from "@/lib/booking/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const catalogCacheControl =
  "public, max-age=60, s-maxage=300, stale-while-revalidate=86400, stale-if-error=86400";

export async function GET(request: NextRequest) {
  const locale = normalizeBookingLocale(request.nextUrl.searchParams.get("locale"));

  if (isBookingDemoEnabled(request.nextUrl.searchParams)) {
    return NextResponse.json(getDemoCatalog(locale), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const [catalog, settings] = await withTransientBookingReadRetry(() =>
      Promise.all([getBookingCatalog(), getSalonSettings()]),
    );
    return NextResponse.json(
      {
        ...catalog,
        bookingWindowDays: settings.bookingWindowDays,
        maxConcurrentBookings: settings.maxConcurrentBookings,
        promotion: {
          amount: 10,
          label: getBookingPromotionLabel(locale),
          weekday: 1,
        },
        services: catalog.services.map((service) => ({
          ...service,
          description: getLocalizedBookingServiceDescription(
            service.slug,
            service.description,
            locale,
          ),
          name: getLocalizedBookingServiceName(service.slug, service.name, locale),
        })),
        timezone: settings.timezone,
      },
      { headers: { "Cache-Control": catalogCacheControl } },
    );
  } catch (error) {
    console.error("Booking catalog unavailable", error);
    return NextResponse.json(
      {
        error: getBookingErrorMessage(locale, "CATALOG_UNAVAILABLE"),
        errorCode: "CATALOG_UNAVAILABLE",
      },
      { status: 503 },
    );
  }
}
