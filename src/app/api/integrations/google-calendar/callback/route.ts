import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { storeLocalGoogleCalendarConnection } from "@/lib/google-calendar/local-token-store";
import { storeProductionGoogleCalendarConnection } from "@/lib/google-calendar/connection-store";
import {
  assertMatchingRedirectOrigin,
  exchangeGoogleAuthorizationCode,
  getGoogleOAuthConfig,
  getPrimaryCalendarId,
  GOOGLE_OAUTH_STATE_COOKIE,
  isLocalRequest,
} from "@/lib/google-calendar/oauth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function statesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

function htmlEscape(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "'": "&#39;",
      '"': "&quot;",
      "<": "&lt;",
      ">": "&gt;",
    };

    return entities[character];
  });
}

function page(title: string, message: string, status: number) {
  return new NextResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${htmlEscape(title)}</title>
    <style>
      body { background: #f7f1ea; color: #261d18; font: 16px/1.6 system-ui, sans-serif; margin: 0; }
      main { margin: 12vh auto; max-width: 42rem; padding: 2rem; }
      a { color: #7a352b; }
    </style>
  </head>
  <body>
    <main>
      <h1>${htmlEscape(title)}</h1>
      <p>${htmlEscape(message)}</p>
      <p><a href="/">Return to Katty Hair Studio</a></p>
    </main>
  </body>
</html>`,
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
      },
      status,
    },
  );
}

export async function GET(request: NextRequest) {
  const localRequest = isLocalRequest(request.nextUrl);

  if (!localRequest && !isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Production Calendar connection requires Supabase persistent token storage.",
      },
      { status: 503 },
    );
  }

  const oauthError = request.nextUrl.searchParams.get("error");
  const code = request.nextUrl.searchParams.get("code");
  const receivedState = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  if (oauthError) {
    return page("Google Calendar was not connected", oauthError, 400);
  }

  if (!code || !receivedState || !expectedState || !statesMatch(expectedState, receivedState)) {
    return page(
      "Google Calendar connection expired",
      "Start the connection again. The authorization response could not be verified.",
      400,
    );
  }

  try {
    const config = getGoogleOAuthConfig();
    assertMatchingRedirectOrigin(request.nextUrl, config.redirectUri);

    const tokens = await exchangeGoogleAuthorizationCode(config, code);
    const primaryCalendar = await getPrimaryCalendarId(tokens.accessToken);

    if (
      config.ownerEmail &&
      primaryCalendar.id.toLocaleLowerCase() !== config.ownerEmail.toLocaleLowerCase()
    ) {
      throw new Error(
        `Connect the configured business account (${config.ownerEmail}), not ${primaryCalendar.id}.`,
      );
    }

    if (localRequest) {
      await storeLocalGoogleCalendarConnection({
        calendarId: primaryCalendar.id,
        calendarSummary: primaryCalendar.summary,
        connectedAt: new Date().toISOString(),
        refreshToken: tokens.refreshToken,
        scope: tokens.scope,
      });
    } else {
      await storeProductionGoogleCalendarConnection({
        connectedEmail: primaryCalendar.id,
        refreshToken: tokens.refreshToken,
        scopes: tokens.scope.split(" ").filter(Boolean),
      });
    }

    const response = page(
      "Google Calendar connected",
      `The ${localRequest ? "local development" : "production"} connection for ${primaryCalendar.id} was stored securely.`,
      200,
    );
    response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google Calendar connection failed.";
    const response = page("Google Calendar connection failed", message, 500);
    response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
    return response;
  }
}
