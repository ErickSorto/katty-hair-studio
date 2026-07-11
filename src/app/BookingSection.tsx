"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Clock, DoorOpen, Phone, Sparkles } from "lucide-react";

type Service = {
  description: string | null;
  durationMinutes: number;
  id: string;
  name: string;
  priceFrom: number | null;
  requiresQuote: boolean;
};

type Staff = {
  displayName: string;
  id: string;
  serviceIds: string[];
};

type Slot = {
  endsAt: string;
  label: string;
  staffId: string;
  staffName: string;
  startsAt: string;
};

type BookingConfirmation = {
  confirmationCode: string;
  endsAt: string;
  serviceName: string;
  staffName: string;
  startsAt: string;
};

function getLocalDateValue(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return date.toISOString().slice(0, 10);
}

export default function BookingSection({
  phoneDisplay,
  phoneNumber,
}: {
  phoneDisplay: string;
  phoneNumber: string;
}) {
  const today = getLocalDateValue();
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [startsAt, setStartsAt] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  const selectedService = services.find((service) => service.id === serviceId);
  const eligibleStaff = useMemo(
    () => staff.filter((person) => person.serviceIds.includes(serviceId)),
    [serviceId, staff],
  );
  const effectiveStaffId = eligibleStaff.some((person) => person.id === staffId)
    ? staffId
    : eligibleStaff[0]?.id ?? "";

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const response = await fetch("/api/booking/catalog", {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json()) as {
          error?: string;
          services?: Service[];
          staff?: Staff[];
        };

        if (!response.ok || !result.services || !result.staff) {
          throw new Error(result.error || "Online booking is still being configured.");
        }

        setServices(result.services);
        setStaff(result.staff);
        setServiceId(result.services[0]?.id ?? "");
      } catch (catalogError) {
        if (!controller.signal.aborted) {
          setError(
            catalogError instanceof Error
              ? catalogError.message
              : "Online booking is still being configured.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCatalogLoading(false);
        }
      }
    }

    loadCatalog();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!serviceId || !effectiveStaffId || !date) {
      return;
    }

    const controller = new AbortController();

    async function loadAvailability() {
      setAvailabilityLoading(true);
      setError("");

      try {
        const query = new URLSearchParams({ date, serviceId, staffId: effectiveStaffId });
        const response = await fetch(`/api/booking/availability?${query}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json()) as { error?: string; slots?: Slot[] };

        if (!response.ok || !result.slots) {
          throw new Error(result.error || "Unable to check availability.");
        }

        setSlots(result.slots);
        setStartsAt(result.slots[0]?.startsAt ?? "");
      } catch (availabilityError) {
        if (!controller.signal.aborted) {
          setSlots([]);
          setStartsAt("");
          setError(
            availabilityError instanceof Error
              ? availabilityError.message
              : "Unable to check availability.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false);
        }
      }
    }

    loadAvailability();
    return () => controller.abort();
  }, [date, effectiveStaffId, serviceId]);

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!serviceId || !effectiveStaffId || !startsAt || !customerName || !customerEmail) {
      setError("Complete the appointment and contact details.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/booking", {
        body: JSON.stringify({
          customerEmail,
          customerName,
          customerNotes: customerNotes || undefined,
          customerPhone: customerPhone || undefined,
          serviceId,
          smsConsent,
          staffId: effectiveStaffId,
          startsAt,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as {
        booking?: BookingConfirmation;
        error?: string;
      };

      if (!response.ok || !result.booking) {
        throw new Error(result.error || "Unable to request the appointment.");
      }

      setConfirmation(result.booking);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to request the appointment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="booking-section" id="booking" data-reveal>
      <div className="booking-copy">
        <p className="eyebrow">Booking</p>
        <h2>Choose your service, stylist, and time.</h2>
        <p>
          Live availability is checked before every confirmation. Walk-ins remain welcome during
          posted hours.
        </p>
        <div className="booking-proof" aria-label="Booking notes">
          <span>
            <Sparkles aria-hidden="true" />
            Quote confirmed first
          </span>
          <span>
            <DoorOpen aria-hidden="true" />
            Walk-ins welcome
          </span>
          <span>
            <Clock aria-hidden="true" />
            Tuesday closed
          </span>
        </div>
      </div>

      {confirmation ? (
        <div className="booking-form booking-confirmation" role="status">
          <Check aria-hidden="true" />
          <p className="eyebrow">Confirmed</p>
          <h3>{confirmation.confirmationCode}</h3>
          <p>
            {confirmation.serviceName} with {confirmation.staffName}. A calendar invitation and
            confirmation will be sent to you.
          </p>
          <button className="secondary-dark-link" onClick={() => setConfirmation(null)} type="button">
            Book another appointment
          </button>
        </div>
      ) : (
        <form className="booking-form" onSubmit={submitBooking}>
          <div className="booking-field">
            <label htmlFor="booking-service">Service</label>
            <select
              disabled={catalogLoading || !services.length}
              id="booking-service"
              onChange={(event) => {
                setServiceId(event.target.value);
                setStaffId("");
                setSlots([]);
                setStartsAt("");
              }}
              value={serviceId}
            >
              {catalogLoading ? <option>Loading services…</option> : null}
              {!catalogLoading && !services.length ? <option>Call to book</option> : null}
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {selectedService ? (
              <small>
                About {selectedService.durationMinutes} minutes
                {selectedService.requiresQuote ? " · quote confirmed separately" : ""}
              </small>
            ) : null}
          </div>

          <div className="booking-field">
            <label htmlFor="booking-staff">Stylist</label>
            <select
              disabled={!eligibleStaff.length}
              id="booking-staff"
              onChange={(event) => {
                setStaffId(event.target.value);
                setSlots([]);
                setStartsAt("");
              }}
              value={effectiveStaffId}
            >
              {!eligibleStaff.length ? <option>No stylist configured</option> : null}
              {eligibleStaff.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="booking-field">
            <label htmlFor="booking-date">Date</label>
            <input
              id="booking-date"
              min={today}
              onChange={(event) => {
                setDate(event.target.value);
                setSlots([]);
                setStartsAt("");
              }}
              type="date"
              value={date}
            />
          </div>

          <div className="booking-field">
            <label htmlFor="booking-time">Available time</label>
            <select
              disabled={availabilityLoading || !slots.length}
              id="booking-time"
              onChange={(event) => setStartsAt(event.target.value)}
              value={startsAt}
            >
              {availabilityLoading ? <option>Checking Google Calendar…</option> : null}
              {!availabilityLoading && !slots.length ? <option>No times available</option> : null}
              {slots.map((slot) => (
                <option key={`${slot.staffId}-${slot.startsAt}`} value={slot.startsAt}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>

          {startsAt ? (
            <div className="booking-contact-fields">
              <div className="booking-field">
                <label htmlFor="booking-name">Your name</label>
                <input
                  autoComplete="name"
                  id="booking-name"
                  onChange={(event) => setCustomerName(event.target.value)}
                  required
                  type="text"
                  value={customerName}
                />
              </div>
              <div className="booking-field">
                <label htmlFor="booking-email">Email</label>
                <input
                  autoComplete="email"
                  id="booking-email"
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  required
                  type="email"
                  value={customerEmail}
                />
              </div>
              <div className="booking-field">
                <label htmlFor="booking-phone">Phone</label>
                <input
                  autoComplete="tel"
                  id="booking-phone"
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  type="tel"
                  value={customerPhone}
                />
              </div>
              <div className="booking-field booking-field-wide">
                <label htmlFor="booking-notes">Notes or requested look</label>
                <textarea
                  id="booking-notes"
                  maxLength={1000}
                  onChange={(event) => setCustomerNotes(event.target.value)}
                  rows={3}
                  value={customerNotes}
                />
              </div>
              <label className="booking-consent booking-field-wide">
                <input
                  checked={smsConsent}
                  onChange={(event) => setSmsConsent(event.target.checked)}
                  type="checkbox"
                />
                <span>
                  Text me appointment confirmations and updates. Message and data rates may apply.
                  Reply STOP to opt out.
                </span>
              </label>
            </div>
          ) : null}

          {error ? <p className="booking-status booking-status-error">{error}</p> : null}

          <div className="booking-actions">
            <button
              className="primary-link calendar-booking-button"
              disabled={!startsAt || submitting}
              type="submit"
            >
              <CalendarDays aria-hidden="true" />
              {submitting ? "Confirming…" : "Confirm appointment"}
            </button>
            <a className="secondary-dark-link" href={`tel:${phoneNumber}`}>
              <Phone aria-hidden="true" />
              Call {phoneDisplay}
            </a>
          </div>

          <p className="booking-footnote">
            <CalendarDays aria-hidden="true" />
            Availability is rechecked before your appointment is created.
          </p>
        </form>
      )}
    </section>
  );
}
