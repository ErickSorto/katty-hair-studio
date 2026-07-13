import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createGoogleCalendar,
  getGoogleCalendar,
} from "@/lib/google-calendar/client";
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
  managerEmails: z.array(z.string().email()).default([]),
  operationsCalendarName: z.string().trim().min(2).default("Katty Hair Studio - Operations"),
  staff: z
    .array(
      z.object({
        availability: z.array(availabilitySchema).min(1),
        displayName: z.string().trim().min(2).max(100),
        email: z.string().email().optional(),
        key: z.string().regex(/^[a-z0-9-]+$/),
        serviceSlugs: z.array(z.string()).min(1),
      }),
    )
    .min(1),
});

function uniqueEmails(emails: Array<string | undefined>) {
  const seen = new Set<string>();

  return emails.flatMap((email) => {
    const value = email?.trim();
    const normalized = value?.toLowerCase();

    if (!value || !normalized || seen.has(normalized)) {
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
  existingCalendarId: string | null | undefined,
  summary: string,
  timeZone: string,
) {
  if (existingCalendarId) {
    try {
      return await getGoogleCalendar(existingCalendarId);
    } catch {
      throw new Error(
        `The stored calendar for ${summary} is not managed by this OAuth application. ` +
          "Reconnect the correct Google account or clear the stored Calendar ID before retrying.",
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
    return NextResponse.json({ error: "Review the staff provisioning request." }, { status: 400 });
  }

  try {
    const database = getSupabaseAdmin();
    const settings = await getSalonSettings();
    const operationsCalendar = await loadOrCreateCalendar(
      settings.operationsCalendarId,
      parsed.data.operationsCalendarName,
      settings.timezone,
    );

    const { error: settingsError } = await database
      .from("salon_settings")
      .update({ operations_calendar_id: operationsCalendar.id })
      .eq("id", 1);

    if (settingsError) {
      throw new Error(`Unable to save the Operations calendar: ${settingsError.message}`);
    }

    const { data: existingStaff, error: existingStaffError } = await database
      .from("staff")
      .select("external_key, google_calendar_id")
      .in(
        "external_key",
        parsed.data.staff.map((person) => person.key),
      );

    if (existingStaffError) {
      throw new Error(`Unable to load existing staff calendars: ${existingStaffError.message}`);
    }

    const calendarIdByStaffKey = new Map(
      (existingStaff ?? []).map((person) => [person.external_key, person.google_calendar_id]),
    );
    const provisionedStaff = [];

    for (const person of parsed.data.staff) {
      const calendar = await loadOrCreateCalendar(
        calendarIdByStaffKey.get(person.key),
        `Katty Hair Studio - ${person.displayName} Appointments`,
        settings.timezone,
      );

      const { data: staffRow, error: staffError } = await database
        .from("staff")
        .upsert(
          {
            display_name: person.displayName,
            email: person.email || null,
            external_key: person.key,
            google_calendar_id: calendar.id,
          },
          { onConflict: "external_key" },
        )
        .select("id")
        .single();

      if (staffError || !staffRow) {
        throw new Error(`Unable to save ${person.displayName}: ${staffError?.message ?? "no row"}`);
      }

      const { data: serviceRows, error: serviceError } = await database
        .from("services")
        .select("id, slug")
        .in("slug", person.serviceSlugs)
        .eq("active", true);

      if (serviceError || !serviceRows) {
        throw new Error(`Unable to map services for ${person.displayName}.`);
      }

      const missingServices = person.serviceSlugs.filter(
        (slug) => !serviceRows.some((service) => service.slug === slug),
      );

      if (missingServices.length) {
        throw new Error(`Unknown service slugs: ${missingServices.join(", ")}`);
      }

      const { error: mappingError } = await database.from("staff_services").upsert(
        serviceRows.map((service) => ({
          active: true,
          service_id: service.id,
          staff_id: staffRow.id,
        })),
        { onConflict: "staff_id,service_id" },
      );

      if (mappingError) {
        throw new Error(`Unable to map services for ${person.displayName}: ${mappingError.message}`);
      }

      const { error: deleteAvailabilityError } = await database
        .from("weekly_availability")
        .delete()
        .eq("staff_id", staffRow.id);

      if (deleteAvailabilityError) {
        throw new Error(
          `Unable to replace availability for ${person.displayName}: ${deleteAvailabilityError.message}`,
        );
      }

      const { error: availabilityError } = await database.from("weekly_availability").insert(
        person.availability.map((window) => ({
          day_of_week: window.dayOfWeek,
          end_time: window.endTime,
          staff_id: staffRow.id,
          start_time: window.startTime,
        })),
      );

      if (availabilityError) {
        throw new Error(
          `Unable to save availability for ${person.displayName}: ${availabilityError.message}`,
        );
      }

      provisionedStaff.push({
        calendarId: calendar.id,
        calendarName: calendar.summary,
        displayName: person.displayName,
        id: staffRow.id,
        shareWith: uniqueEmails([person.email, ...parsed.data.managerEmails]),
      });
    }

    return NextResponse.json({
      manualSharing: {
        instructions:
          "On a computer, optionally share each calendar in Google Calendar settings. Use See all event details for view-only staff. Use Make changes to events only for trusted managers who need to add or clear blocks; that permission can also edit appointment events.",
        operations: {
          calendarId: operationsCalendar.id,
          calendarName: operationsCalendar.summary,
          shareWith: uniqueEmails(parsed.data.managerEmails),
        },
      },
      operationsCalendarId: operationsCalendar.id,
      staff: provisionedStaff,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to provision calendars.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
