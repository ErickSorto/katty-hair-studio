import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getLocalGoogleBookingCalendarId } from "@/lib/google-calendar/local-token-store";
import { isLocalDevelopmentRuntime } from "@/lib/runtime/environment";
import type { BookingLocale } from "@/lib/booking/localization";
import type {
  BookingOccupancy,
  BookingService,
  SalonSettings,
  SalonTeamConfiguration,
  WeeklyAvailability,
} from "@/lib/booking/types";

function assertNoError(error: { message: string } | null, action: string) {
  if (error) {
    throw new Error(`${action}: ${error.message}`);
  }
}

function requireData<T>(data: T | null, error: { message: string } | null, action: string): T {
  assertNoError(error, action);

  if (data === null) {
    throw new Error(`${action}: no data was returned.`);
  }

  return data;
}

export async function getSalonSettings(): Promise<SalonSettings> {
  const { data, error } = await getSupabaseAdmin()
    .from("salon_settings")
    .select(
      "salon_name, address, phone, email, timezone, booking_calendar_id, slot_interval_minutes, minimum_notice_minutes, booking_window_days, hold_minutes, max_concurrent_bookings",
    )
    .eq("id", 1)
    .single();

  const settings = requireData(data, error, "Unable to load salon settings");
  const bookingCalendarId = isLocalDevelopmentRuntime()
    ? await getLocalGoogleBookingCalendarId()
    : settings.booking_calendar_id;

  return {
    address: settings.address,
    bookingCalendarId,
    bookingWindowDays: settings.booking_window_days,
    email: settings.email,
    holdMinutes: settings.hold_minutes,
    maxConcurrentBookings: settings.max_concurrent_bookings,
    minimumNoticeMinutes: settings.minimum_notice_minutes,
    salonName: settings.salon_name,
    slotIntervalMinutes: settings.slot_interval_minutes,
    timezone: settings.timezone,
    phone: settings.phone,
  };
}

export async function expireStaleBookingHolds() {
  const { error } = await getSupabaseAdmin()
    .from("bookings")
    .update({ status: "failed" })
    .eq("status", "pending")
    .lt("hold_expires_at", new Date().toISOString());

  assertNoError(error, "Unable to clear expired booking holds");
}

export async function createPendingBooking(input: {
  blockedEndsAt: string;
  blockedStartsAt: string;
  cancellationTokenHash: string;
  confirmationCode: string;
  customerEmail: string;
  customerLocale: BookingLocale;
  customerName: string;
  customerNotes?: string;
  customerPhone?: string;
  endsAt: string;
  holdExpiresAt: string;
  serviceId: string;
  smsConsentAt?: string;
  startsAt: string;
}) {
  const { data, error } = await getSupabaseAdmin().rpc("reserve_salon_booking", {
    p_blocked_ends_at: input.blockedEndsAt,
    p_blocked_starts_at: input.blockedStartsAt,
    p_cancellation_token_hash: input.cancellationTokenHash,
    p_confirmation_code: input.confirmationCode,
    p_customer_email: input.customerEmail,
    p_customer_locale: input.customerLocale,
    p_customer_name: input.customerName,
    p_customer_notes: input.customerNotes || null,
    p_customer_phone: input.customerPhone || null,
    p_ends_at: input.endsAt,
    p_hold_expires_at: input.holdExpiresAt,
    p_service_id: input.serviceId,
    p_sms_consent_at: input.smsConsentAt || null,
    p_starts_at: input.startsAt,
  });

  if (error) {
    if (error.message.includes("BOOKING_CAPACITY_REACHED")) {
      throw new BookingCapacityError();
    }

    throw new Error(`Unable to reserve the appointment: ${error.message}`);
  }

  if (typeof data !== "string") {
    throw new Error("Unable to reserve the appointment: no booking ID was returned.");
  }

  return data;
}

export class BookingCapacityError extends Error {
  constructor() {
    super("BOOKING_CAPACITY_REACHED");
    this.name = "BookingCapacityError";
  }
}

export async function confirmBooking(
  bookingId: string,
  googleEvent: { htmlLink?: string; id: string },
) {
  const { error } = await getSupabaseAdmin()
    .from("bookings")
    .update({
      google_event_id: googleEvent.id,
      google_event_link: googleEvent.htmlLink || null,
      hold_expires_at: null,
      status: "confirmed",
    })
    .eq("id", bookingId)
    .eq("status", "pending");

  assertNoError(error, "Unable to confirm the appointment");
}

export async function failPendingBooking(bookingId: string) {
  const { error } = await getSupabaseAdmin()
    .from("bookings")
    .update({ status: "failed" })
    .eq("id", bookingId)
    .eq("status", "pending");

  assertNoError(error, "Unable to release the failed booking hold");
}

export async function logNotificationDelivery(input: {
  bookingId: string;
  channel: "email" | "sms";
  errorMessage?: string;
  providerMessageId?: string;
  recipient: string;
  status: "sent" | "failed";
  templateKey: string;
}) {
  const { error } = await getSupabaseAdmin().from("notification_deliveries").upsert(
    {
      booking_id: input.bookingId,
      channel: input.channel,
      error_message: input.errorMessage || null,
      provider_message_id: input.providerMessageId || null,
      recipient: input.recipient,
      sent_at: input.status === "sent" ? new Date().toISOString() : null,
      status: input.status,
      template_key: input.templateKey,
    },
    { onConflict: "booking_id,channel,template_key" },
  );

  assertNoError(error, "Unable to record notification delivery");
}

export async function getBookingForCancellation(confirmationCode: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("bookings")
    .select(
      "id, status, cancellation_token_hash, google_event_id, service_id, customer_email, customer_locale, customer_phone, customer_name, starts_at",
    )
    .eq("confirmation_code", confirmationCode)
    .maybeSingle();

  assertNoError(error, "Unable to find the appointment");
  return data;
}

export async function cancelBookingRecord(bookingId: string, reason: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("bookings")
    .update({
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString(),
      status: "cancelled",
    })
    .eq("id", bookingId)
    .in("status", ["pending", "confirmed"])
    .select("id")
    .maybeSingle();

  assertNoError(error, "Unable to cancel the appointment");

  if (!data) {
    throw new Error("This appointment can no longer be cancelled online.");
  }
}

export async function getBookingCalendarId() {
  const settings = await getSalonSettings();

  if (!settings.bookingCalendarId) {
    throw new Error("The salon booking calendar is not configured.");
  }

  return settings.bookingCalendarId;
}

export async function getBookingCatalog() {
  const servicesResult = await getSupabaseAdmin()
    .from("services")
    .select(
      "id, slug, name, description, duration_minutes, buffer_before_minutes, buffer_after_minutes, price_from, requires_quote, active",
    )
    .eq("active", true)
    .order("sort_order");

  const serviceRows = requireData(
    servicesResult.data,
    servicesResult.error,
    "Unable to load services",
  );
  const services: BookingService[] = serviceRows.map((service) => ({
    active: service.active,
    bufferAfterMinutes: service.buffer_after_minutes,
    bufferBeforeMinutes: service.buffer_before_minutes,
    description: service.description,
    durationMinutes: service.duration_minutes,
    id: service.id,
    name: service.name,
    priceFrom: service.price_from === null ? null : Number(service.price_from),
    requiresQuote: service.requires_quote,
    slug: service.slug,
  }));
  return { services };
}

export async function getAvailabilityConfiguration(serviceId: string) {
  const database = getSupabaseAdmin();
  const [settings, serviceResult, teamResult] = await Promise.all([
    getSalonSettings(),
    database
      .from("services")
      .select(
        "id, slug, name, description, duration_minutes, buffer_before_minutes, buffer_after_minutes, price_from, requires_quote, active",
      )
      .eq("id", serviceId)
      .eq("active", true)
      .single(),
    database
      .from("staff")
      .select("id")
      .eq("external_key", "salon-team")
      .eq("active", true)
      .eq("accepts_online_bookings", true)
      .single(),
  ]);

  const serviceRow = requireData(
    serviceResult.data,
    serviceResult.error,
    "Unable to load the selected service",
  );
  const teamRow = requireData(teamResult.data, teamResult.error, "Unable to load the salon team");

  const [mappingResult, availabilityResult] = await Promise.all([
    database
      .from("staff_services")
      .select("duration_minutes, buffer_before_minutes, buffer_after_minutes")
      .eq("staff_id", teamRow.id)
      .eq("service_id", serviceId)
      .eq("active", true)
      .maybeSingle(),
    database
      .from("weekly_availability")
      .select("id, staff_id, day_of_week, start_time, end_time")
      .eq("staff_id", teamRow.id),
  ]);

  assertNoError(mappingResult.error, "Unable to load the salon service configuration");
  const availabilityRows = requireData(
    availabilityResult.data,
    availabilityResult.error,
    "Unable to load salon availability",
  );

  if (!mappingResult.data) {
    return { availability: [], service: null, settings, team: null };
  }

  const team: SalonTeamConfiguration = {
    bufferAfterMinutes:
      mappingResult.data.buffer_after_minutes ?? serviceRow.buffer_after_minutes,
    bufferBeforeMinutes:
      mappingResult.data.buffer_before_minutes ?? serviceRow.buffer_before_minutes,
    durationMinutes: mappingResult.data.duration_minutes ?? serviceRow.duration_minutes,
    id: teamRow.id,
  };
  const availability: WeeklyAvailability[] = availabilityRows.map((window) => ({
    dayOfWeek: window.day_of_week,
    endTime: window.end_time,
    id: window.id,
    staffId: window.staff_id,
    startTime: window.start_time,
  }));
  const service: BookingService = {
    active: serviceRow.active,
    bufferAfterMinutes: serviceRow.buffer_after_minutes,
    bufferBeforeMinutes: serviceRow.buffer_before_minutes,
    description: serviceRow.description,
    durationMinutes: serviceRow.duration_minutes,
    id: serviceRow.id,
    name: serviceRow.name,
    priceFrom: serviceRow.price_from === null ? null : Number(serviceRow.price_from),
    requiresQuote: serviceRow.requires_quote,
    slug: serviceRow.slug,
  };

  return { availability, service, settings, team };
}

export async function getActiveBookingOccupancy(timeMin: string, timeMax: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("bookings")
    .select("blocked_starts_at, blocked_ends_at, google_event_id")
    .in("status", ["pending", "confirmed"])
    .lt("blocked_starts_at", timeMax)
    .gt("blocked_ends_at", timeMin);
  const rows = requireData(data, error, "Unable to load current booking capacity");

  return rows.map(
    (booking): BookingOccupancy => ({
      end: booking.blocked_ends_at,
      googleEventId: booking.google_event_id,
      start: booking.blocked_starts_at,
    }),
  );
}
