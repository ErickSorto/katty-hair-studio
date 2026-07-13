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

type DemoStaff = {
  displayName: string;
  id: string;
  serviceIds: string[];
};

export const demoServices: DemoService[] = [
  {
    description: "A smooth, polished finish with movement and shine.",
    durationMinutes: 90,
    id: "11111111-1111-4111-8111-111111111111",
    name: "Dominican blowout",
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

export const demoStaff: DemoStaff[] = [
  {
    displayName: "Katty",
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    serviceIds: demoServices.map((service) => service.id),
  },
  {
    displayName: "Maria",
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    serviceIds: [demoServices[0].id, demoServices[1].id],
  },
  {
    displayName: "Ana",
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    serviceIds: [demoServices[0].id, demoServices[2].id, demoServices[3].id],
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
    promotion: {
      amount: 10,
      label: "Mondays are $10 off all services",
      weekday: 1,
    },
    services: demoServices,
    staff: demoStaff,
    timezone: DEMO_TIMEZONE,
  };
}

export function getDemoAvailability(input: {
  date: string;
  serviceId: string;
  staffId?: string;
}) {
  const service = demoServices.find((item) => item.id === input.serviceId);
  const requestedDate = fromZonedTime(`${input.date}T12:00:00`, DEMO_TIMEZONE);
  const dayOfWeek = Number(formatInTimeZone(requestedDate, DEMO_TIMEZONE, "i")) % 7;

  if (!service || dayOfWeek === 2) {
    return { slots: [] as AvailableSlot[], timezone: DEMO_TIMEZONE };
  }

  const eligibleStaff = demoStaff.filter(
    (person) =>
      person.serviceIds.includes(service.id) && (!input.staffId || person.id === input.staffId),
  );
  const slots: AvailableSlot[] = [];

  for (const [staffIndex, person] of eligibleStaff.entries()) {
    const dayStart = fromZonedTime(`${input.date}T09:00:00`, DEMO_TIMEZONE);
    const lastStartHour = service.durationMinutes >= 180 ? 14 : 16;

    for (let minutes = 0; minutes <= (lastStartHour - 9) * 60; minutes += 30) {
      const slotIndex = minutes / 30;

      if ((slotIndex + staffIndex * 2 + dayOfWeek) % 5 === 1) {
        continue;
      }

      const startsAt = addMinutes(dayStart, minutes);
      const endsAt = addMinutes(startsAt, service.durationMinutes);

      slots.push({
        blockedEndsAt: addMinutes(endsAt, 10).toISOString(),
        blockedStartsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        label: formatInTimeZone(startsAt, DEMO_TIMEZONE, "h:mm a"),
        staffId: person.id,
        staffName: person.displayName,
        startsAt: startsAt.toISOString(),
      });
    }
  }

  slots.sort((left, right) => left.startsAt.localeCompare(right.startsAt));
  return { slots, timezone: DEMO_TIMEZONE };
}
