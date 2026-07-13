import { addMinutes } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import type { AvailableSlot } from "@/lib/booking/types";

const DEMO_TIMEZONE = "America/New_York";

type DemoService = {
  description: string;
  durationMinutes: number;
  id: string;
  name: string;
  priceFrom: number | null;
  requiresQuote: boolean;
};

export const demoServices: DemoService[] = [
  {
    description: "A smooth, polished finish with movement and shine.",
    durationMinutes: 90,
    id: "11111111-1111-4111-8111-111111111111",
    name: "Signature blowout",
    priceFrom: 65,
    requiresQuote: false,
  },
  {
    description: "Dimensional color planned around your history and hair health.",
    durationMinutes: 150,
    id: "22222222-2222-4222-8222-222222222222",
    name: "Color or highlights",
    priceFrom: 120,
    requiresQuote: true,
  },
  {
    description: "Install, blending, and styling tailored to your desired finish.",
    durationMinutes: 180,
    id: "33333333-3333-4333-8333-333333333333",
    name: "Extensions or wig service",
    priceFrom: null,
    requiresQuote: true,
  },
  {
    description: "Protective styling with a clean, polished finish.",
    durationMinutes: 180,
    id: "44444444-4444-4444-8444-444444444444",
    name: "Braids",
    priceFrom: 140,
    requiresQuote: true,
  },
];

export function isBookingDemoEnabled(searchParams: URLSearchParams) {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.BOOKING_DEMO_MODE === "true" &&
    searchParams.get("demo") === "1"
  );
}

export function getDemoCatalog() {
  return {
    bookingWindowDays: 90,
    maxConcurrentBookings: 4,
    promotion: {
      amount: 10,
      label: "Mondays are $10 off all services",
      weekday: 1,
    },
    services: demoServices,
    timezone: DEMO_TIMEZONE,
  };
}

export function getDemoAvailability(input: { date: string; serviceId: string }) {
  const service = demoServices.find((item) => item.id === input.serviceId);
  const requestedDate = fromZonedTime(`${input.date}T12:00:00`, DEMO_TIMEZONE);
  const dayOfWeek = Number(formatInTimeZone(requestedDate, DEMO_TIMEZONE, "i")) % 7;

  if (!service || dayOfWeek === 2) {
    return { slots: [] as AvailableSlot[], timezone: DEMO_TIMEZONE };
  }

  const slots: AvailableSlot[] = [];
  const dayStart = fromZonedTime(`${input.date}T09:00:00`, DEMO_TIMEZONE);
  const lastStartHour = service.durationMinutes >= 180 ? 14 : 16;

  for (let minutes = 0; minutes <= (lastStartHour - 9) * 60; minutes += 30) {
    const slotIndex = minutes / 30;

    if ((slotIndex + dayOfWeek) % 7 === 1) {
      continue;
    }

    const startsAt = addMinutes(dayStart, minutes);
    const endsAt = addMinutes(startsAt, service.durationMinutes);

    slots.push({
      blockedEndsAt: addMinutes(endsAt, 10).toISOString(),
      blockedStartsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      label: formatInTimeZone(startsAt, DEMO_TIMEZONE, "h:mm a"),
      remainingCapacity: 4 - ((slotIndex + dayOfWeek) % 3),
      startsAt: startsAt.toISOString(),
    });
  }

  slots.sort((left, right) => left.startsAt.localeCompare(right.startsAt));
  return { slots, timezone: DEMO_TIMEZONE };
}
