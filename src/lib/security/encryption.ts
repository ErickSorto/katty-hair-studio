import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export type EncryptedSecret = {
  authenticationTag: string;
  ciphertext: string;
  initializationVector: string;
};

function getEncryptionKey() {
  const encodedKey = process.env.GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY?.trim();

  if (!encodedKey) {
    throw new Error(
      "Missing GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY. Generate one with: openssl rand -base64 32",
    );
  }

  const key = Buffer.from(encodedKey, "base64");

  if (key.length !== 32) {
    throw new Error("GOOGLE_CALENDAR_TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes.");
  }

  return key;
}

export function encryptSecret(secret: string): EncryptedSecret {
  const initializationVector = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), initializationVector);
  const ciphertext = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);

  return {
    authenticationTag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
    initializationVector: initializationVector.toString("base64"),
  };
}

export function decryptSecret(encrypted: EncryptedSecret) {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(encrypted.initializationVector, "base64"),
  );
  decipher.setAuthTag(Buffer.from(encrypted.authenticationTag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
