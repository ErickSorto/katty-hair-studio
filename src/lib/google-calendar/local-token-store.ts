import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { decryptSecret, encryptSecret } from "@/lib/security/encryption";

type LocalGoogleCalendarConnection = {
  calendarId: string;
  calendarSummary: string;
  connectedAt: string;
  refreshToken: string;
  scope: string;
};

export async function storeLocalGoogleCalendarConnection(
  connection: LocalGoogleCalendarConnection,
) {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    throw new Error(
      "Production OAuth token storage is not configured yet. Connect persistent encrypted " +
        "database storage before authorizing the production calendar.",
    );
  }

  const encryptedConnection = encryptSecret(JSON.stringify(connection));
  const dataDirectory = path.join(process.cwd(), ".data");
  const connectionPath = path.join(dataDirectory, "google-calendar-connection.json");

  await mkdir(dataDirectory, { mode: 0o700, recursive: true });
  await writeFile(
    connectionPath,
    JSON.stringify(
      {
        ...encryptedConnection,
        version: 1,
      },
      null,
      2,
    ),
    { mode: 0o600 },
  );
}

export async function getLocalGoogleCalendarConnection() {
  const connectionPath = path.join(
    process.cwd(),
    ".data",
    "google-calendar-connection.json",
  );
  const encryptedConnection = JSON.parse(await readFile(connectionPath, "utf8")) as {
    authenticationTag: string;
    ciphertext: string;
    initializationVector: string;
    version: number;
  };

  if (encryptedConnection.version !== 1) {
    throw new Error("Unsupported local Google Calendar connection format.");
  }

  return JSON.parse(decryptSecret(encryptedConnection)) as LocalGoogleCalendarConnection;
}
