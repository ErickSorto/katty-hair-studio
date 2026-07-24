const DEFAULT_RETRY_DELAYS_MS = [250, 750, 2_000] as const;

const TRANSIENT_READ_ERROR_PATTERNS = [
  "jwt issued at future",
  "fetch failed",
  "network",
  "timeout",
  "timed out",
  "econnreset",
  "econnrefused",
  "enotfound",
  "eai_again",
  "socket",
  "bad gateway",
  "service unavailable",
  "gateway timeout",
] as const;

export class RetryableBookingReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RetryableBookingReadError";
  }
}

export function isTransientBookingReadError(error: unknown) {
  if (error instanceof RetryableBookingReadError) {
    return true;
  }

  const message =
    error instanceof Error
      ? `${error.name}: ${error.message}`.toLowerCase()
      : String(error).toLowerCase();

  return TRANSIENT_READ_ERROR_PATTERNS.some((pattern) =>
    message.includes(pattern),
  );
}

function waitForRetry(delayMs: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException("The operation was aborted.", "AbortError"));
      return;
    }

    const timeout = setTimeout(resolve, delayMs);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout);
        reject(signal.reason ?? new DOMException("The operation was aborted.", "AbortError"));
      },
      { once: true },
    );
  });
}

export async function withTransientBookingReadRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: {
    delaysMs?: readonly number[];
    shouldRetry?: (error: unknown) => boolean;
    signal?: AbortSignal;
  } = {},
) {
  const delaysMs = options.delaysMs ?? DEFAULT_RETRY_DELAYS_MS;
  const shouldRetry = options.shouldRetry ?? isTransientBookingReadError;
  let attempt = 0;

  while (true) {
    try {
      return await operation(attempt);
    } catch (error) {
      if (
        options.signal?.aborted ||
        attempt >= delaysMs.length ||
        !shouldRetry(error)
      ) {
        throw error;
      }

      await waitForRetry(delaysMs[attempt], options.signal);
      attempt += 1;
    }
  }
}
