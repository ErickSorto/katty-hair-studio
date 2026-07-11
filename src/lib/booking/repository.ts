import { getSupabaseAdmin } from "@/lib/supabase/server";
import type {
  BookingService,
  BookingStaff,
  SalonSettings,
  StaffServiceConfiguration,
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
      "salon_name, address, phone, email, timezone, operations_calendar_id, slot_interval_minutes, minimum_notice_minutes, booking_window_days, hold_minutes",
    )
    .eq("id", 1)
    .single();

  const settings = requireData(data, error, "Unable to load salon settings");

  return {
    address: settings.address,
    bookingWindowDays: settings.booking_window_days,
    email: settings.email,
    holdMinutes: settings.hold_minutes,
    minimumNoticeMinutes: settings.minimum_notice_minutes,
    operationsCalendarId: settings.operations_calendar_id,
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
  customerName: string;
  customerNotes?: string;
  customerPhone?: string;
  endsAt: string;
  holdExpiresAt: string;
  serviceId: string;
  smsConsentAt?: string;
  staffId: string;
  startsAt: string;
}) {
  const { data, error } = await getSupabaseAdmin()
    .from("bookings")
    .insert({
      blocked_ends_at: input.blockedEndsAt,
      blocked_starts_at: input.blockedStartsAt,
      cancellation_token_hash: input.cancellationTokenHash,
      confirmation_code: input.confirmationCode,
      customer_email: input.customerEmail,
      customer_name: input.customerName,
      customer_notes: input.customerNotes || null,
      customer_phone: input.customerPhone || null,
      ends_at: input.endsAt,
      hold_expires_at: input.holdExpiresAt,
      service_id: input.serviceId,
      sms_consent_at: input.smsConsentAt || null,
      staff_id: input.staffId,
      starts_at: input.startsAt,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23P01") {
      throw new Error("That appointment time was just taken. Choose another available time.");
    }

    throw new Error(`Unable to reserve the appointment: ${error.message}`);
  }

  return data.id as string;
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
      "id, status, cancellation_token_hash, google_event_id, staff_id, service_id, customer_email, customer_phone, customer_name, starts_at",
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

export async function getStaffCalendarId(staffId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("staff")
    .select("google_calendar_id")
    .eq("id", staffId)
    .single();
  const staff = requireData(data, error, "Unable to load the staff calendar");

  if (!staff.google_calendar_id) {
    throw new Error("The staff calendar is not configured.");
  }

  return staff.google_calendar_id as string;
}

export async function getBookingCatalog() {
  const database = getSupabaseAdmin();
  const [servicesResult, staffResult, mappingsResult] = await Promise.all([
    database
      .from("services")
      .select(
        "id, slug, name, description, duration_minutes, buffer_before_minutes, buffer_after_minutes, price_from, requires_quote, active",
      )
      .eq("active", true)
      .order("sort_order"),
    database
      .from("staff")
      .select("id, display_name, email, google_calendar_id, sort_order")
      .eq("active", true)
      .eq("accepts_online_bookings", true)
      .not("google_calendar_id", "is", null)
      .order("sort_order"),
    database.from("staff_services").select("staff_id, service_id").eq("active", true),
  ]);

  const serviceRows = requireData(
    servicesResult.data,
    servicesResult.error,
    "Unable to load services",
  );
  const staffRows = requireData(staffResult.data, staffResult.error, "Unable to load staff");
  const mappingRows = requireData(
    mappingsResult.data,
    mappingsResult.error,
    "Unable to load staff-service mappings",
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
  const serviceIdsByStaff = new Map<string, string[]>();

  for (const mapping of mappingRows) {
    serviceIdsByStaff.set(mapping.staff_id, [
      ...(serviceIdsByStaff.get(mapping.staff_id) ?? []),
      mapping.service_id,
    ]);
  }

  const staff: BookingStaff[] = staffRows.flatMap((person) =>
    person.google_calendar_id
      ? [
          {
            calendarId: person.google_calendar_id,
            displayName: person.display_name,
            email: person.email,
            id: person.id,
            serviceIds: serviceIdsByStaff.get(person.id) ?? [],
            sortOrder: person.sort_order,
          },
        ]
      : [],
  );

  return { services, staff };
}

export async function getAvailabilityConfiguration(serviceId: string, staffId?: string) {
  const database = getSupabaseAdmin();
  const [settings, serviceResult, mappingsResult] = await Promise.all([
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
      .from("staff_services")
      .select(
        "staff_id, duration_minutes, buffer_before_minutes, buffer_after_minutes, active",
      )
      .eq("service_id", serviceId)
      .eq("active", true),
  ]);

  const serviceRow = requireData(
    serviceResult.data,
    serviceResult.error,
    "Unable to load the selected service",
  );
  const mappingRows = requireData(
    mappingsResult.data,
    mappingsResult.error,
    "Unable to load eligible staff",
  );

  const selectedMappings = staffId
    ? mappingRows.filter((mapping) => mapping.staff_id === staffId)
    : mappingRows;
  const staffIds = selectedMappings.map((mapping) => mapping.staff_id);

  if (!staffIds.length) {
    return { availability: [], service: null, settings, staff: [] };
  }

  const [staffResult, availabilityResult] = await Promise.all([
    database
      .from("staff")
      .select("id, display_name, email, google_calendar_id, sort_order")
      .in("id", staffIds)
      .eq("active", true)
      .eq("accepts_online_bookings", true)
      .not("google_calendar_id", "is", null),
    database
      .from("weekly_availability")
      .select("id, staff_id, day_of_week, start_time, end_time")
      .in("staff_id", staffIds),
  ]);

  const staffRows = requireData(
    staffResult.data,
    staffResult.error,
    "Unable to load staff calendars",
  );
  const availabilityRows = requireData(
    availabilityResult.data,
    availabilityResult.error,
    "Unable to load staff availability",
  );

  const mappingByStaff = new Map(selectedMappings.map((mapping) => [mapping.staff_id, mapping]));
  const staff: StaffServiceConfiguration[] = staffRows.flatMap((person) => {
    const mapping = mappingByStaff.get(person.id);

    if (!mapping || !person.google_calendar_id) {
      return [];
    }

    return [
      {
        bufferAfterMinutes:
          mapping.buffer_after_minutes ?? serviceRow.buffer_after_minutes,
        bufferBeforeMinutes:
          mapping.buffer_before_minutes ?? serviceRow.buffer_before_minutes,
        calendarId: person.google_calendar_id,
        displayName: person.display_name,
        durationMinutes: mapping.duration_minutes ?? serviceRow.duration_minutes,
        email: person.email,
        id: person.id,
        sortOrder: person.sort_order,
      },
    ];
  });
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

  return { availability, service, settings, staff };
}
