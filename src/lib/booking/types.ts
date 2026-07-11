export type SalonSettings = {
  address: string;
  bookingWindowDays: number;
  email: string;
  holdMinutes: number;
  minimumNoticeMinutes: number;
  operationsCalendarId: string | null;
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

export type BookingStaff = {
  calendarId: string;
  displayName: string;
  email: string | null;
  id: string;
  serviceIds: string[];
  sortOrder: number;
};

export type StaffServiceConfiguration = {
  bufferAfterMinutes: number;
  bufferBeforeMinutes: number;
  calendarId: string;
  displayName: string;
  durationMinutes: number;
  email: string | null;
  id: string;
  sortOrder: number;
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
  staffId: string;
  staffName: string;
  startsAt: string;
};
