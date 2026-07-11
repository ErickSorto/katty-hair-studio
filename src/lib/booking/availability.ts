import { addDays, addMinutes, isAfter, isBefore, startOfDay } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { queryGoogleFreeBusy, type GoogleBusyPeriod } from "@/lib/google-calendar/client";
import { getAvailabilityConfiguration } from "@/lib/booking/repository";
import type { AvailableSlot } from "@/lib/booking/types";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function timeOnDate(date: string, time: string, timeZone: string) {
  return fromZonedTime(`${date}T${time.slice(0, 8)}`, timeZone);
}

function overlaps(start: Date, end: Date, busy: GoogleBusyPeriod[]) {
  return busy.some((period) => start < new Date(period.end) && end > new Date(period.start));
}

export async function getAvailableSlots(input: {
  date: string;
  serviceId: string;
  staffId?: string;
}) {
  if (!DATE_PATTERN.test(input.date)) {
    throw new Error("Date must use YYYY-MM-DD format.");
  }

  const configuration = await getAvailabilityConfiguration(input.serviceId, input.staffId);

  if (!configuration.service || !configuration.staff.length) {
    return { slots: [], timezone: configuration.settings.timezone };
  }

  const { availability, settings, staff } = configuration;
  const requestedDay = timeOnDate(input.date, "12:00:00", settings.timezone);
  const dayOfWeek = Number(formatInTimeZone(requestedDay, settings.timezone, "i")) % 7;
  const dayStart = timeOnDate(input.date, "00:00:00", settings.timezone);
  const nextDate = formatInTimeZone(addDays(requestedDay, 1), settings.timezone, "yyyy-MM-dd");
  const dayEnd = timeOnDate(nextDate, "00:00:00", settings.timezone);
  const now = new Date();
  const earliestBooking = addMinutes(now, settings.minimumNoticeMinutes);
  const bookingWindowEnd = addDays(startOfDay(now), settings.bookingWindowDays + 1);

  if (isBefore(dayEnd, now) || isAfter(dayStart, bookingWindowEnd)) {
    return { slots: [], timezone: settings.timezone };
  }

  const calendarIds = [
    ...new Set([
      ...staff.map((person) => person.calendarId),
      ...(settings.operationsCalendarId ? [settings.operationsCalendarId] : []),
    ]),
  ];
  const busyByCalendar = await queryGoogleFreeBusy(
    calendarIds,
    dayStart.toISOString(),
    dayEnd.toISOString(),
  );
  const operationsBusy = settings.operationsCalendarId
    ? (busyByCalendar.get(settings.operationsCalendarId) ?? [])
    : [];
  const slots: AvailableSlot[] = [];

  for (const person of staff) {
    const staffBusy = busyByCalendar.get(person.calendarId) ?? [];
    const windows = availability.filter(
      (window) => window.staffId === person.id && window.dayOfWeek === dayOfWeek,
    );

    for (const window of windows) {
      const windowStart = timeOnDate(input.date, window.startTime, settings.timezone);
      const windowEnd = timeOnDate(input.date, window.endTime, settings.timezone);

      for (
        let startsAt = windowStart;
        addMinutes(startsAt, person.durationMinutes) <= windowEnd;
        startsAt = addMinutes(startsAt, settings.slotIntervalMinutes)
      ) {
        const endsAt = addMinutes(startsAt, person.durationMinutes);
        const blockedStartsAt = addMinutes(startsAt, -person.bufferBeforeMinutes);
        const blockedEndsAt = addMinutes(endsAt, person.bufferAfterMinutes);

        if (
          isBefore(startsAt, earliestBooking) ||
          overlaps(blockedStartsAt, blockedEndsAt, staffBusy) ||
          overlaps(blockedStartsAt, blockedEndsAt, operationsBusy)
        ) {
          continue;
        }

        slots.push({
          blockedEndsAt: blockedEndsAt.toISOString(),
          blockedStartsAt: blockedStartsAt.toISOString(),
          endsAt: endsAt.toISOString(),
          label: formatInTimeZone(startsAt, settings.timezone, "h:mm a"),
          staffId: person.id,
          staffName: person.displayName,
          startsAt: startsAt.toISOString(),
        });
      }
    }
  }

  slots.sort((left, right) =>
    left.startsAt === right.startsAt
      ? left.staffName.localeCompare(right.staffName)
      : left.startsAt.localeCompare(right.startsAt),
  );

  return { slots, timezone: settings.timezone };
}
