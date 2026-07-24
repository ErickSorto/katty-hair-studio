import assert from "node:assert/strict";
import {
  RetryableBookingReadError,
  withTransientBookingReadRetry,
} from "../src/lib/booking/read-retry";

let transientAttempts = 0;
const transientResult = await withTransientBookingReadRetry(
  async () => {
    transientAttempts += 1;

    if (transientAttempts < 3) {
      throw new Error("Unable to load salon settings: JWT issued at future");
    }

    return "ready";
  },
  { delaysMs: [0, 0, 0] },
);

assert.equal(transientResult, "ready");
assert.equal(transientAttempts, 3);

let responseAttempts = 0;
await withTransientBookingReadRetry(
  async () => {
    responseAttempts += 1;

    if (responseAttempts === 1) {
      throw new RetryableBookingReadError("Booking catalog returned 503");
    }
  },
  { delaysMs: [0] },
);
assert.equal(responseAttempts, 2);

let permanentAttempts = 0;
await assert.rejects(
  withTransientBookingReadRetry(
    async () => {
      permanentAttempts += 1;
      throw new Error("The salon booking calendar is not configured.");
    },
    { delaysMs: [0, 0] },
  ),
);
assert.equal(permanentAttempts, 1);

console.log("Booking resilience checks passed.");
