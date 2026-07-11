import { getProductionGoogleCalendarConnection } from "@/lib/google-calendar/connection-store";
import { getLocalGoogleCalendarConnection } from "@/lib/google-calendar/local-token-store";
import { getGoogleOAuthConfig } from "@/lib/google-calendar/oauth";

type GoogleApiError = {
  error?: {
    message?: string;
  };
};

export type GoogleBusyPeriod = {
  end: string;
  start: string;
};

async function getStoredConnection() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const localConnection = await getLocalGoogleCalendarConnection();
    return {
      connectedEmail: localConnection.calendarId,
      refreshToken: localConnection.refreshToken,
      scopes: localConnection.scope.split(" ").filter(Boolean),
    };
  }

  return getProductionGoogleCalendarConnection();
}

async function getAccessToken() {
  const config = getGoogleOAuthConfig();
  const connection = await getStoredConnection();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "refresh_token",
      refresh_token: connection.refreshToken,
    }),
    cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const payload = (await response.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !payload.access_token) {
    throw new Error(
      payload.error_description || payload.error || "Unable to refresh Google Calendar access.",
    );
  }

  return payload.access_token;
}

async function googleRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = await getAccessToken();
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    ...init,
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    const payload = (await response.json()) as GoogleApiError;
    throw new Error(payload.error?.message || `Google Calendar request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

export async function listGoogleCalendars() {
  const result = await googleRequest<{
    items?: Array<{
      accessRole?: string;
      id?: string;
      primary?: boolean;
      summary?: string;
      timeZone?: string;
    }>;
  }>("/users/me/calendarList?maxResults=250&showHidden=true");

  return (result.items ?? []).flatMap((calendar) =>
    calendar.id
      ? [
          {
            accessRole: calendar.accessRole ?? "reader",
            id: calendar.id,
            primary: Boolean(calendar.primary),
            summary: calendar.summary ?? calendar.id,
            timeZone: calendar.timeZone,
          },
        ]
      : [],
  );
}

export async function createGoogleCalendar(summary: string, timeZone: string) {
  return googleRequest<{ id: string; summary: string; timeZone?: string }>("/calendars", {
    body: JSON.stringify({ summary, timeZone }),
    method: "POST",
  });
}

export async function shareGoogleCalendar(
  calendarId: string,
  email: string,
  role: "reader" | "writer" | "owner" = "writer",
) {
  return googleRequest<{ id: string }>(`/calendars/${encodeURIComponent(calendarId)}/acl`, {
    body: JSON.stringify({
      role,
      scope: { type: "user", value: email },
    }),
    method: "POST",
  });
}

export async function queryGoogleFreeBusy(
  calendarIds: string[],
  timeMin: string,
  timeMax: string,
) {
  if (!calendarIds.length) {
    return new Map<string, GoogleBusyPeriod[]>();
  }

  const result = await googleRequest<{
    calendars?: Record<
      string,
      {
        busy?: GoogleBusyPeriod[];
        errors?: Array<{ reason?: string }>;
      }
    >;
  }>("/freeBusy", {
    body: JSON.stringify({
      items: calendarIds.map((id) => ({ id })),
      timeMax,
      timeMin,
    }),
    method: "POST",
  });

  const busyByCalendar = new Map<string, GoogleBusyPeriod[]>();

  for (const calendarId of calendarIds) {
    const calendar = result.calendars?.[calendarId];

    if (calendar?.errors?.length) {
      throw new Error(
        `Google could not read availability for a configured calendar (${calendar.errors[0].reason ?? "unknown error"}).`,
      );
    }

    busyByCalendar.set(calendarId, calendar?.busy ?? []);
  }

  return busyByCalendar;
}

export async function createGoogleCalendarEvent(input: {
  attendeeEmail: string;
  calendarId: string;
  description: string;
  end: string;
  location: string;
  start: string;
  summary: string;
  timeZone: string;
}) {
  const query = new URLSearchParams({ sendUpdates: "all" });

  return googleRequest<{ htmlLink?: string; id: string }>(
    `/calendars/${encodeURIComponent(input.calendarId)}/events?${query}`,
    {
      body: JSON.stringify({
        attendees: [{ email: input.attendeeEmail }],
        description: input.description,
        end: { dateTime: input.end, timeZone: input.timeZone },
        location: input.location,
        start: { dateTime: input.start, timeZone: input.timeZone },
        summary: input.summary,
      }),
      method: "POST",
    },
  );
}

export async function deleteGoogleCalendarEvent(calendarId: string, eventId: string) {
  const accessToken = await getAccessToken();
  const query = new URLSearchParams({ sendUpdates: "all" });
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?${query}`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${accessToken}` },
      method: "DELETE",
    },
  );

  if (!response.ok && response.status !== 404) {
    const payload = (await response.json()) as GoogleApiError;
    throw new Error(payload.error?.message || "Unable to remove the Google Calendar event.");
  }
}
