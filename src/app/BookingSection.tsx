"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock, DoorOpen, Phone, Sparkles } from "lucide-react";

const services = [
  "Dominican blowout",
  "Color or highlights",
  "Extensions or wig service",
  "Braids",
  "Cut or barber service",
  "Beauty supply question",
] as const;

const weekdaySlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "5:30 PM",
];
const saturdaySlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "3:30 PM",
];
const sundaySlots = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "2:30 PM"];

function getLocalDateValue(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return date.toISOString().slice(0, 10);
}

function getSlotsForDate(dateValue: string) {
  if (!dateValue) {
    return weekdaySlots;
  }

  const date = new Date(`${dateValue}T12:00:00`);
  const day = date.getDay();

  if (day === 0) {
    return sundaySlots;
  }

  if (day === 2) {
    return [];
  }

  if (day === 6) {
    return saturdaySlots;
  }

  return weekdaySlots;
}

export default function BookingSection({
  phoneDisplay,
  phoneNumber,
}: {
  phoneDisplay: string;
  phoneNumber: string;
}) {
  const today = getLocalDateValue();
  const [service, setService] = useState<string>(services[0]);
  const [date, setDate] = useState(today);
  const availableSlots = useMemo(() => getSlotsForDate(date), [date]);
  const [timeSlot, setTimeSlot] = useState(availableSlots[0] ?? "");
  const selectedSlot = availableSlots.includes(timeSlot) ? timeSlot : availableSlots[0] ?? "";
  const hasAvailableSlot = Boolean(selectedSlot);

  return (
    <section className="booking-section" id="booking" data-reveal>
      <div className="booking-copy">
        <p className="eyebrow">Booking</p>
        <h2>Choose your service, date, and preferred time.</h2>
        <p>
          Choose the details that work for you, or walk in during posted hours. Live
          Google Calendar availability will appear here once connected.
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

      <form className="booking-form" onSubmit={(event) => event.preventDefault()}>
        <div className="booking-field">
          <label htmlFor="booking-service">Service</label>
          <select
            id="booking-service"
            onChange={(event) => setService(event.target.value)}
            value={service}
          >
            {services.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="booking-field">
          <label htmlFor="booking-date">Date</label>
          <input
            id="booking-date"
            min={today}
            onChange={(event) => setDate(event.target.value)}
            type="date"
            value={date}
          />
        </div>

        <div className="booking-field">
          <label htmlFor="booking-time">Preferred time</label>
          <select
            disabled={!availableSlots.length}
            id="booking-time"
            onChange={(event) => setTimeSlot(event.target.value)}
            value={selectedSlot}
          >
            {availableSlots.length ? (
              availableSlots.map((slot) => <option key={slot}>{slot}</option>)
            ) : (
              <option>Closed Tuesday</option>
            )}
          </select>
        </div>

        <div className="booking-actions">
          {hasAvailableSlot ? (
            <button
              aria-describedby="booking-calendar-note"
              className="primary-link calendar-booking-button"
              disabled
              type="button"
            >
              <CalendarDays aria-hidden="true" />
              Request appointment
            </button>
          ) : (
            <span aria-disabled="true" className="disabled-action">
              <CalendarDays aria-hidden="true" />
              Choose another date
            </span>
          )}
          <a className="secondary-dark-link" href={`tel:${phoneNumber}`}>
            <Phone aria-hidden="true" />
            Call {phoneDisplay}
          </a>
        </div>

        <p className="booking-footnote" id="booking-calendar-note">
          <CalendarDays aria-hidden="true" />
          Google Calendar booking will open here once availability is connected.
        </p>
      </form>
    </section>
  );
}
