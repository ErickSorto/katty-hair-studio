import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createGoogleCalendar,
  listGoogleCalendars,
  shareGoogleCalendar,
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

function authorized(request: NextRequest) {
  const expected = process.env.ADMIN_SETUP_TOKEN?.trim();
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";

  if (!expected || expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

async function findOrCreateCalendar(
  calendars: Awaited<ReturnType<typeof listGoogleCalendars>>,
  summary: string,
  timeZone: string,
) {
  const existing = calendars.find(
    (calendar) =>
      calendar.summary.toLocaleLowerCase() === summary.toLocaleLowerCase() &&
      ["owner", "writer"].includes(calendar.accessRole),
  );

  if (existing) {
    return existing;
  }

  const created = await createGoogleCalendar(summary, timeZone);
  const calendar = {
    accessRole: "owner",
    id: created.id,
    primary: false,
    summary: created.summary,
    timeZone: created.timeZone,
  };
  calendars.push(calendar);
  return calendar;
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
    const calendars = await listGoogleCalendars();
    const operationsCalendar = await findOrCreateCalendar(
      calendars,
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

    for (const managerEmail of parsed.data.managerEmails) {
      await shareGoogleCalendar(operationsCalendar.id, managerEmail, "writer");
    }

    const provisionedStaff = [];

    for (const person of parsed.data.staff) {
      const calendar = await findOrCreateCalendar(
        calendars,
        `Katty Hair Studio - ${person.displayName} Appointments`,
        settings.timezone,
      );

      if (person.email) {
        await shareGoogleCalendar(calendar.id, person.email, "writer");
      }

      for (const managerEmail of parsed.data.managerEmails) {
        if (managerEmail.toLocaleLowerCase() !== person.email?.toLocaleLowerCase()) {
          await shareGoogleCalendar(calendar.id, managerEmail, "writer");
        }
      }

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
        displayName: person.displayName,
        id: staffRow.id,
      });
    }

    return NextResponse.json({
      operationsCalendarId: operationsCalendar.id,
      staff: provisionedStaff,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to provision calendars.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
