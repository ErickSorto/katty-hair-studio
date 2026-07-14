import { addDays, addMinutes, isBefore } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import {
  listGoogleCalendarEvents,
  type GoogleCalendarEvent,
} from "@/lib/google-calendar/client";
import {
  expireStaleBookingHolds,
  getActiveBookingOccupancy,
  getAvailabilityConfiguration,
} from "@/lib/booking/repository";
import type { AvailableSlot, BookingOccupancy } from "@/lib/booking/types";
import { isSalonClosedWeekday } from "@/lib/booking/schedule";
import { isLocalDevelopmentRuntime } from "@/lib/runtime/environment";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function timeOnDate(date: string, time: string, timeZone: string) {
  return fromZonedTime(`${date}T${time.slice(0, 8)}`, timeZone);
}

function eventBoundary(
  value: GoogleCalendarEvent["start"] | GoogleCalendarEvent["end"],
  timeZone: string,
) {
  if (value?.dateTime) {
    return new Date(value.dateTime);
  }

  if (value?.date) {
    return timeOnDate(value.date, "00:00:00", timeZone);
  }

  return null;
}

function googleEventOccupancy(event: GoogleCalendarEvent, timeZone: string) {
  if (event.status === "cancelled" || event.transparency === "transparent") {
    return null;
  }

  const start = eventBoundary(event.start, timeZone);
  const end = eventBoundary(event.end, timeZone);

  if (!start || !end || start >= end) {
    return null;
  }

  return {
    end: end.toISOString(),
    googleEventId: event.id ?? null,
    start: start.toISOString(),
  } satisfies BookingOccupancy;
}

function overlaps(start: Date, end: Date, occupancy: BookingOccupancy) {
  return start < new Date(occupancy.end) && end > new Date(occupancy.start);
}

function peakConcurrentOccupancy(
  start: Date,
  end: Date,
  occupancy: BookingOccupancy[],
) {
  const overlapping = occupancy.filter((period) => overlaps(start, end, period));
  const checkpoints = new Set<number>([start.getTime()]);

  for (const period of overlapping) {
    const periodStart = new Date(period.start).getTime();

    if (periodStart >= start.getTime() && periodStart < end.getTime()) {
      checkpoints.add(periodStart);
    }
  }

  let peak = 0;

  for (const checkpoint of checkpoints) {
    const concurrent = overlapping.filter(
      (period) =>
        new Date(period.start).getTime() <= checkpoint &&
        new Date(period.end).getTime() > checkpoint,
    ).length;
    peak = Math.max(peak, concurrent);
  }

  return peak;
}

export async function getAvailableSlots(input: { date: string; serviceId: string }) {
  if (!DATE_PATTERN.test(input.date)) {
    throw new Error("Date must use YYYY-MM-DD format.");
  }

  const configuration = await getAvailabilityConfiguration(input.serviceId);
  const bookingCalendarId = configuration.settings.bookingCalendarId;

  if (
    !configuration.service ||
    !configuration.team ||
    !bookingCalendarId
  ) {
    return { slots: [], timezone: configuration.settings.timezone };
  }

  const { availability, settings, team } = configuration;
  const requestedDay = timeOnDate(input.date, "12:00:00", settings.timezone);
  const dayOfWeek = Number(formatInTimeZone(requestedDay, settings.timezone, "i")) % 7;
  const dayStart = timeOnDate(input.date, "00:00:00", settings.timezone);
  const nextDate = formatInTimeZone(addDays(requestedDay, 1), settings.timezone, "yyyy-MM-dd");
  const dayEnd = timeOnDate(nextDate, "00:00:00", settings.timezone);
  const now = new Date();
  const earliestBooking = addMinutes(now, settings.minimumNoticeMinutes);
  const today = formatInTimeZone(now, settings.timezone, "yyyy-MM-dd");
  const lastBookingDate = formatInTimeZone(
    addDays(now, settings.bookingWindowDays),
    settings.timezone,
    "yyyy-MM-dd",
  );

  if (input.date < today || input.date > lastBookingDate) {
    return { slots: [], timezone: settings.timezone };
  }

  if (isSalonClosedWeekday(dayOfWeek)) {
    return { slots: [], timezone: settings.timezone };
  }

  const occupancyStart = addMinutes(dayStart, -team.bufferBeforeMinutes).toISOString();
  const occupancyEnd = addMinutes(dayEnd, team.bufferAfterMinutes).toISOString();

  const localDevelopment = isLocalDevelopmentRuntime();

  if (!localDevelopment) {
    await expireStaleBookingHolds();
  }

  const [bookings, googleEvents] = await Promise.all([
    localDevelopment
      ? Promise.resolve([] as BookingOccupancy[])
      : getActiveBookingOccupancy(occupancyStart, occupancyEnd),
    listGoogleCalendarEvents(bookingCalendarId, occupancyStart, occupancyEnd),
  ]);
  const bookingEventIds = new Set(
    bookings.flatMap((booking) =>
      booking.googleEventId ? [booking.googleEventId] : [],
    ),
  );
  const calendarOccupancy = googleEvents.flatMap((event) => {
    if (event.id && bookingEventIds.has(event.id)) {
      return [];
    }

    const period = googleEventOccupancy(event, settings.timezone);
    return period ? [period] : [];
  });
  const occupancy = [...bookings, ...calendarOccupancy];
  const windows = availability.filter(
    (window) => window.staffId === team.id && window.dayOfWeek === dayOfWeek,
  );
  const slotsByStart = new Map<string, AvailableSlot>();

  for (const window of windows) {
    const windowStart = timeOnDate(input.date, window.startTime, settings.timezone);
    const windowEnd = timeOnDate(input.date, window.endTime, settings.timezone);

    for (
      let startsAt = windowStart;
      addMinutes(startsAt, team.durationMinutes) <= windowEnd;
      startsAt = addMinutes(startsAt, settings.slotIntervalMinutes)
    ) {
      const endsAt = addMinutes(startsAt, team.durationMinutes);
      const blockedStartsAt = addMinutes(startsAt, -team.bufferBeforeMinutes);
      const blockedEndsAt = addMinutes(endsAt, team.bufferAfterMinutes);

      if (isBefore(startsAt, earliestBooking)) {
        continue;
      }

      const occupiedSpots = peakConcurrentOccupancy(
        blockedStartsAt,
        blockedEndsAt,
        occupancy,
      );

      if (occupiedSpots >= settings.maxConcurrentBookings) {
        continue;
      }

      const slot: AvailableSlot = {
        blockedEndsAt: blockedEndsAt.toISOString(),
        blockedStartsAt: blockedStartsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        label: formatInTimeZone(startsAt, settings.timezone, "h:mm a"),
        remainingCapacity: settings.maxConcurrentBookings - occupiedSpots,
        startsAt: startsAt.toISOString(),
      };
      const existing = slotsByStart.get(slot.startsAt);

      if (!existing || slot.remainingCapacity > existing.remainingCapacity) {
        slotsByStart.set(slot.startsAt, slot);
      }
    }
  }

  const slots = [...slotsByStart.values()].sort((left, right) =>
    left.startsAt.localeCompare(right.startsAt),
  );

  return { slots, timezone: settings.timezone };
}
