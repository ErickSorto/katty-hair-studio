export type SalonSettings = {
  address: string;
  bookingCalendarId: string | null;
  bookingWindowDays: number;
  email: string;
  holdMinutes: number;
  maxConcurrentBookings: number;
  minimumNoticeMinutes: number;
  salonName: string;
  slotIntervalMinutes: number;
  timezone: string;
  phone: string;
};

export type BookingService = {
  active: boolean;
  bufferAfterMinutes: number;
  bufferBeforeMinutes: number;
  description: string | null;
  durationMinutes: number;
  id: string;
  name: string;
  priceFrom: number | null;
  requiresQuote: boolean;
  slug: string;
};

export type SalonTeamConfiguration = {
  bufferAfterMinutes: number;
  bufferBeforeMinutes: number;
  durationMinutes: number;
  id: string;
};

export type WeeklyAvailability = {
  dayOfWeek: number;
  endTime: string;
  id: string;
  staffId: string;
  startTime: string;
};

export type AvailableSlot = {
  blockedEndsAt: string;
  blockedStartsAt: string;
  endsAt: string;
  label: string;
  remainingCapacity: number;
  startsAt: string;
};

export type BookingOccupancy = {
  end: string;
  googleEventId: string | null;
  start: string;
};
