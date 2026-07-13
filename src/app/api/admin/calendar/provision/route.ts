import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createGoogleCalendar, getGoogleCalendar } from "@/lib/google-calendar/client";
import { getSalonSettings } from "@/lib/booking/repository";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const availabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
});

const requestSchema = z.object({
  availability: z.array(availabilitySchema).min(1).optional(),
  bookingCalendarName: z
    .string()
    .trim()
    .min(2)
    .default("Katty Hair Studio Bookings"),
  managerEmails: z.array(z.string().email()).default([]),
  maxConcurrentBookings: z.number().int().min(1).max(20).default(4),
});

function uniqueEmails(emails: string[]) {
  const seen = new Set<string>();

  return emails.flatMap((email) => {
    const value = email.trim();
    const normalized = value.toLowerCase();

    if (!value || seen.has(normalized)) {
      return [];
    }

    seen.add(normalized);
    return [value];
  });
}

function authorized(request: NextRequest) {
  const expected = process.env.ADMIN_SETUP_TOKEN?.trim();
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";

  if (!expected || expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

async function loadOrCreateCalendar(
  existingCalendarId: string | null,
  summary: string,
  timeZone: string,
) {
  if (existingCalendarId) {
    try {
      return await getGoogleCalendar(existingCalendarId);
    } catch {
      throw new Error(
        `The stored calendar for ${summary} is not managed by this OAuth application. ` +
          "Clear the stored booking Calendar ID before retrying.",
      );
    }
  }

  return createGoogleCalendar(summary, timeZone);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Review the salon calendar provisioning request." },
      { status: 400 },
    );
  }

  try {
    const database = getSupabaseAdmin();
    const settings = await getSalonSettings();
    const bookingCalendar = await loadOrCreateCalendar(
      settings.bookingCalendarId,
      parsed.data.bookingCalendarName,
      settings.timezone,
    );
    const { error: settingsError } = await database
      .from("salon_settings")
      .update({
        booking_calendar_id: bookingCalendar.id,
        max_concurrent_bookings: parsed.data.maxConcurrentBookings,
        operations_calendar_id: bookingCalendar.id,
      })
      .eq("id", 1);

    if (settingsError) {
      throw new Error(`Unable to save the booking calendar: ${settingsError.message}`);
    }

    const { error: retireStaffError } = await database
      .from("staff")
      .update({
        accepts_online_bookings: false,
        active: false,
        google_calendar_id: null,
      })
      .neq("external_key", "salon-team");

    if (retireStaffError) {
      throw new Error(`Unable to retire individual stylist calendars: ${retireStaffError.message}`);
    }

    const { data: team, error: teamError } = await database
      .from("staff")
      .upsert(
        {
          accepts_online_bookings: true,
          active: true,
          display_name: "Katty Hair Studio team",
          external_key: "salon-team",
          google_calendar_id: bookingCalendar.id,
          sort_order: 0,
        },
        { onConflict: "external_key" },
      )
      .select("id")
      .single();

    if (teamError || !team) {
      throw new Error(`Unable to save the salon team: ${teamError?.message ?? "no row"}`);
    }

    const { data: services, error: servicesError } = await database
      .from("services")
      .select("id")
      .eq("active", true);

    if (servicesError || !services?.length) {
      throw new Error(`Unable to load active services: ${servicesError?.message ?? "no services"}`);
    }

    const { error: deactivateMappingsError } = await database
      .from("staff_services")
      .update({ active: false })
      .eq("staff_id", team.id);

    if (deactivateMappingsError) {
      throw new Error(
        `Unable to refresh salon services: ${deactivateMappingsError.message}`,
      );
    }

    const { error: mappingError } = await database.from("staff_services").upsert(
      services.map((service) => ({
        active: true,
        service_id: service.id,
        staff_id: team.id,
      })),
      { onConflict: "staff_id,service_id" },
    );

    if (mappingError) {
      throw new Error(`Unable to map salon services: ${mappingError.message}`);
    }

    if (parsed.data.availability) {
      const { error: deleteAvailabilityError } = await database
        .from("weekly_availability")
        .delete()
        .eq("staff_id", team.id);

      if (deleteAvailabilityError) {
        throw new Error(
          `Unable to replace salon availability: ${deleteAvailabilityError.message}`,
        );
      }

      const { error: availabilityError } = await database.from("weekly_availability").insert(
        parsed.data.availability.map((window) => ({
          day_of_week: window.dayOfWeek,
          end_time: window.endTime,
          staff_id: team.id,
          start_time: window.startTime,
        })),
      );

      if (availabilityError) {
        throw new Error(`Unable to save salon availability: ${availabilityError.message}`);
      }
    }

    return NextResponse.json({
      bookingCalendar: {
        calendarId: bookingCalendar.id,
        calendarName: bookingCalendar.summary,
        shareWith: uniqueEmails(parsed.data.managerEmails),
      },
      maxConcurrentBookings: parsed.data.maxConcurrentBookings,
      scheduleUpdated: Boolean(parsed.data.availability),
      teamId: team.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to provision the calendar.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
