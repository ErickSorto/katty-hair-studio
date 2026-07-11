"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function CancellationForm() {
  const searchParams = useSearchParams();
  const confirmationCode = searchParams.get("code") ?? "";
  const token = searchParams.get("token") ?? "";
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState("");

  async function cancelAppointment() {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/booking/cancel", {
        body: JSON.stringify({ confirmationCode, reason, token }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as { cancelled?: boolean; error?: string };

      if (!response.ok || !result.cancelled) {
        throw new Error(result.error || "Unable to cancel the appointment.");
      }

      setCancelled(true);
    } catch (cancelError) {
      setError(
        cancelError instanceof Error ? cancelError.message : "Unable to cancel the appointment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="booking-manage-page">
      <p className="eyebrow">Appointment</p>
      <h1>{cancelled ? "Your appointment is cancelled." : "Cancel your appointment"}</h1>
      {cancelled ? (
        <p>The calendar has been updated. Call the salon if you would like to choose another time.</p>
      ) : (
        <>
          <p>Confirmation {confirmationCode || "not found"}</p>
          <label className="booking-field">
            <span>Reason (optional)</span>
            <textarea
              maxLength={500}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
              value={reason}
            />
          </label>
          {error ? <p className="booking-status booking-status-error">{error}</p> : null}
          <button
            className="primary-link"
            disabled={!confirmationCode || !token || submitting}
            onClick={cancelAppointment}
            type="button"
          >
            {submitting ? "Cancelling…" : "Cancel appointment"}
          </button>
        </>
      )}
      <Link className="secondary-dark-link" href="/#booking">
        Return to booking
      </Link>
    </main>
  );
}

export default function BookingCancellationPage() {
  return (
    <Suspense fallback={<main className="booking-manage-page">Loading appointment…</main>}>
      <CancellationForm />
    </Suspense>
  );
}
