import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  assertMatchingRedirectOrigin,
  createGoogleAuthorizationUrl,
  getGoogleOAuthConfig,
  GOOGLE_OAUTH_STATE_COOKIE,
  isLocalRequest,
} from "@/lib/google-calendar/oauth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    if (!isLocalRequest(request.nextUrl) && !isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            "Production Calendar connection requires Supabase persistent token storage.",
        },
        { status: 503 },
      );
    }

    const config = getGoogleOAuthConfig();

    if (!isLocalRequest(request.nextUrl) && !config.ownerEmail) {
      throw new Error(
        "GOOGLE_CALENDAR_OWNER_EMAIL is required before production Calendar authorization.",
      );
    }
    assertMatchingRedirectOrigin(request.nextUrl, config.redirectUri);

    const state = randomBytes(32).toString("base64url");
    const response = NextResponse.redirect(createGoogleAuthorizationUrl(config, state));

    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      maxAge: 10 * 60,
      path: "/api/integrations/google-calendar",
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start Google OAuth.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
