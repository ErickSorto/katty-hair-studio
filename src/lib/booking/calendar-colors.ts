const googleCalendarEventColorIds = {
  banana: "5",
  blueberry: "9",
  graphite: "8",
  grape: "3",
  sage: "2",
  tangerine: "6",
} as const;

const bookingEventColorByServiceSlug: Partial<Record<string, string>> = {
  "beauty-supply": googleCalendarEventColorIds.graphite,
  braids: googleCalendarEventColorIds.sage,
  "color-highlights": googleCalendarEventColorIds.banana,
  "cut-barber": googleCalendarEventColorIds.tangerine,
  "dominican-blowout": googleCalendarEventColorIds.blueberry,
  "extensions-wig": googleCalendarEventColorIds.grape,
};

export function getBookingEventColorId(serviceSlug: string) {
  return bookingEventColorByServiceSlug[serviceSlug];
}
