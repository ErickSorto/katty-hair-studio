import { decryptSecret, encryptSecret } from "@/lib/security/encryption";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type StoredGoogleCalendarConnection = {
  connectedEmail: string;
  refreshToken: string;
  scopes: string[];
};

export async function storeProductionGoogleCalendarConnection(
  connection: StoredGoogleCalendarConnection,
) {
  const encryptedToken = encryptSecret(connection.refreshToken);
  const { error } = await getSupabaseAdmin().from("calendar_connections").upsert({
    connected_at: new Date().toISOString(),
    connected_email: connection.connectedEmail,
    id: 1,
    provider: "google",
    refresh_token_ciphertext: encryptedToken.ciphertext,
    refresh_token_iv: encryptedToken.initializationVector,
    refresh_token_tag: encryptedToken.authenticationTag,
    scopes: connection.scopes,
  });

  if (error) {
    throw new Error(`Unable to store the Google Calendar connection: ${error.message}`);
  }
}

export async function getProductionGoogleCalendarConnection(): Promise<StoredGoogleCalendarConnection> {
  const { data, error } = await getSupabaseAdmin()
    .from("calendar_connections")
    .select(
      "connected_email, refresh_token_ciphertext, refresh_token_iv, refresh_token_tag, scopes",
    )
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load the Google Calendar connection: ${error.message}`);
  }

  if (!data) {
    throw new Error("Google Calendar has not been connected yet.");
  }

  return {
    connectedEmail: data.connected_email,
    refreshToken: decryptSecret({
      authenticationTag: data.refresh_token_tag,
      ciphertext: data.refresh_token_ciphertext,
      initializationVector: data.refresh_token_iv,
    }),
    scopes: data.scopes ?? [],
  };
}
