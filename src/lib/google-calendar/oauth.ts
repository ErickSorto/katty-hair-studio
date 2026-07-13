const GOOGLE_AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export const GOOGLE_OAUTH_STATE_COOKIE = "khs_google_oauth_state";

export const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.app.created",
  "https://www.googleapis.com/auth/calendar.freebusy",
  "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
] as const;

export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  ownerEmail?: string;
  redirectUri: string;
};

export type GoogleTokenResponse = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
};

function requireEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getGoogleOAuthConfig(): GoogleOAuthConfig {
  const redirectUri = requireEnvironmentVariable("GOOGLE_CALENDAR_REDIRECT_URI");

  try {
    new URL(redirectUri);
  } catch {
    throw new Error("GOOGLE_CALENDAR_REDIRECT_URI must be a valid absolute URL.");
  }

  return {
    clientId: requireEnvironmentVariable("GOOGLE_CALENDAR_CLIENT_ID"),
    clientSecret: requireEnvironmentVariable("GOOGLE_CALENDAR_CLIENT_SECRET"),
    ownerEmail: process.env.GOOGLE_CALENDAR_OWNER_EMAIL?.trim() || undefined,
    redirectUri,
  };
}

export function createGoogleAuthorizationUrl(config: GoogleOAuthConfig, state: string) {
  const authorizationUrl = new URL(GOOGLE_AUTHORIZATION_URL);
  const parameters = new URLSearchParams({
    access_type: "offline",
    client_id: config.clientId,
    prompt: "consent",
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: GOOGLE_CALENDAR_SCOPES.join(" "),
    state,
  });

  if (config.ownerEmail) {
    parameters.set("login_hint", config.ownerEmail);
  }

  authorizationUrl.search = parameters.toString();
  return authorizationUrl;
}

export function assertMatchingRedirectOrigin(requestUrl: URL, redirectUri: string) {
  const redirectUrl = new URL(redirectUri);

  if (requestUrl.origin !== redirectUrl.origin) {
    throw new Error(
      `OAuth redirect origin mismatch. This app is running at ${requestUrl.origin}, but ` +
        `GOOGLE_CALENDAR_REDIRECT_URI uses ${redirectUrl.origin}.`,
    );
  }
}

export function isLocalRequest(url: URL) {
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}

export async function exchangeGoogleAuthorizationCode(
  config: GoogleOAuthConfig,
  code: string,
): Promise<GoogleTokenResponse> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: config.redirectUri,
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
    expires_in?: number;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || "Google token exchange failed.");
  }

  if (!payload.access_token || !payload.refresh_token || !payload.scope) {
    throw new Error(
      "Google did not return the required access token, refresh token, and granted scopes. " +
        "Revoke the app's prior access in the Google Account and run the connection again.",
    );
  }

  const grantedScopes = new Set(payload.scope.split(" ").filter(Boolean));
  const missingScopes = GOOGLE_CALENDAR_SCOPES.filter((scope) => !grantedScopes.has(scope));

  if (missingScopes.length) {
    throw new Error(
      "Google did not grant every required Calendar permission. Revoke the app's access in " +
        "your Google Account, reconnect, and approve all requested permissions.",
    );
  }

  const unexpectedCalendarScopes = [...grantedScopes].filter(
    (scope) =>
      scope.startsWith("https://www.googleapis.com/auth/calendar") &&
      !GOOGLE_CALENDAR_SCOPES.includes(scope as (typeof GOOGLE_CALENDAR_SCOPES)[number]),
  );

  if (unexpectedCalendarScopes.length) {
    throw new Error(
      "Google returned permissions from an older Calendar connection. Revoke Katty Hair " +
        "Studio in your Google Account's third-party access settings, then reconnect.",
    );
  }

  return {
    accessToken: payload.access_token,
    expiresIn: payload.expires_in ?? 3600,
    refreshToken: payload.refresh_token,
    scope: payload.scope,
    tokenType: payload.token_type ?? "Bearer",
  };
}

export async function getPrimaryCalendarId(accessToken: string) {
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList/primary",
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const payload = (await response.json()) as {
    error?: { message?: string };
    id?: string;
    summary?: string;
  };

  if (!response.ok || !payload.id) {
    throw new Error(payload.error?.message || "Unable to identify the connected Google Calendar.");
  }

  return {
    id: payload.id,
    summary: payload.summary || payload.id,
  };
}
