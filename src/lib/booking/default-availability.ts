import { addDays, format, isAfter, parseISO } from "date-fns";
import { isSalonClosedWeekday } from "@/lib/booking/schedule";

const DEFAULT_AVAILABILITY_LOOKAHEAD_DAYS = 14;

type AvailabilityWithSlots = {
  slots: readonly unknown[];
};

export async function findDefaultBookingAvailability<
  Availability extends AvailabilityWithSlots,
>(input: {
  bookingWindowDays: number;
  date: string;
  loadAvailability: (date: string) => Promise<Availability>;
  today: string;
}) {
  const initialAvailability = await input.loadAvailability(input.date);

  if (initialAvailability.slots.length) {
    return { availability: initialAvailability, date: input.date };
  }

  const lastSearchDate = addDays(
    parseISO(input.today),
    Math.min(input.bookingWindowDays, DEFAULT_AVAILABILITY_LOOKAHEAD_DAYS),
  );
  let firstFutureOpenDate:
    | { availability: Availability; date: string }
    | undefined;
  let candidate = addDays(parseISO(input.date), 1);

  while (!isAfter(candidate, lastSearchDate)) {
    if (!isSalonClosedWeekday(candidate.getDay())) {
      const candidateDate = format(candidate, "yyyy-MM-dd");
      const availability = await input.loadAvailability(candidateDate);
      firstFutureOpenDate ??= { availability, date: candidateDate };

      if (availability.slots.length) {
        return { availability, date: candidateDate };
      }
    }

    candidate = addDays(candidate, 1);
  }

  return (
    firstFutureOpenDate ?? { availability: initialAvailability, date: input.date }
  );
}
