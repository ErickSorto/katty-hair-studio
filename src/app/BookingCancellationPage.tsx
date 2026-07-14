"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { localizePath, type Locale } from "@/app/i18n/config";

const cancellationCopy = {
  en: {
    cancel: "Cancel appointment",
    cancelledBody:
      "The calendar has been updated. Call the salon if you would like to choose another time.",
    cancelledTitle: "Your appointment is cancelled.",
    cancelling: "Cancelling…",
    confirmation: "Confirmation",
    eyebrow: "Appointment",
    fallbackError: "Unable to cancel the appointment.",
    loading: "Loading appointment…",
    notFound: "not found",
    reason: "Reason (optional)",
    reasonPlaceholder: "Tell us anything the salon should know.",
    returnToBooking: "Return to booking",
    title: "Cancel your appointment",
  },
  es: {
    cancel: "Cancelar cita",
    cancelledBody:
      "El calendario se ha actualizado. Llama al salón si deseas elegir otro horario.",
    cancelledTitle: "Tu cita ha sido cancelada.",
    cancelling: "Cancelando…",
    confirmation: "Confirmación",
    eyebrow: "Cita",
    fallbackError: "No pudimos cancelar la cita.",
    loading: "Cargando cita…",
    notFound: "no encontrada",
    reason: "Motivo (opcional)",
    reasonPlaceholder: "Cuéntanos si hay algo que el salón deba saber.",
    returnToBooking: "Volver a reservas",
    title: "Cancelar tu cita",
  },
} as const;

function CancellationForm({ locale }: { locale: Locale }) {
  const copy = cancellationCopy[locale];
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
        body: JSON.stringify({
          confirmationCode,
          customerLocale: locale,
          reason,
          token,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as {
        cancelled?: boolean;
        error?: string;
      };

      if (!response.ok || !result.cancelled) {
        throw new Error(result.error || copy.fallbackError);
      }

      setCancelled(true);
    } catch (cancelError) {
      setError(
        cancelError instanceof Error ? cancelError.message : copy.fallbackError,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      aria-busy={submitting}
      aria-labelledby="booking-cancellation-title"
      className="booking-manage-page"
    >
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 id="booking-cancellation-title">
        {cancelled ? copy.cancelledTitle : copy.title}
      </h1>
      {cancelled ? (
        <p aria-live="polite" role="status">
          {copy.cancelledBody}
        </p>
      ) : (
        <>
          <p>
            {copy.confirmation} {confirmationCode || copy.notFound}
          </p>
          <label className="booking-field">
            <span>{copy.reason}</span>
            <textarea
              maxLength={500}
              onChange={(event) => setReason(event.target.value)}
              placeholder={copy.reasonPlaceholder}
              rows={4}
              value={reason}
            />
          </label>
          {error ? (
            <p className="booking-status booking-status-error" role="alert">
              {error}
            </p>
          ) : null}
          <button
            className="primary-link"
            disabled={!confirmationCode || !token || submitting}
            onClick={cancelAppointment}
            type="button"
          >
            {submitting ? copy.cancelling : copy.cancel}
          </button>
        </>
      )}
      <Link
        className="secondary-dark-link"
        href={localizePath("/#booking", locale)}
      >
        {copy.returnToBooking}
      </Link>
    </section>
  );
}

export default function BookingCancellationPage({ locale }: { locale: Locale }) {
  const copy = cancellationCopy[locale];

  return (
    <Suspense
      fallback={
        <section
          aria-live="polite"
          className="booking-manage-page"
          role="status"
        >
          {copy.loading}
        </section>
      }
    >
      <CancellationForm locale={locale} />
    </Suspense>
  );
}
