"use client";

import Image from "next/image";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Scissors,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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

type Promotion = {
  amount: number;
  label: string;
  weekday: number;
};

type BookingConfirmation = {
  confirmationCode: string;
  endsAt: string;
  serviceName: string;
  staffName: string;
  startsAt: string;
};

type BookingStep = 1 | 2 | 3;

const directionsUrl =
  "https://www.google.com/maps/search/?api=1&query=3816%20Bladensburg%20Rd%2C%20Brentwood%2C%20MD%2020722";
const defaultPromotion: Promotion = {
  amount: 10,
  label: "Mondays are $10 off all services",
  weekday: 1,
};

function getLocalDateValue(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function formatPrice(service: Service) {
  if (service.priceFrom !== null) {
    return `From $${service.priceFrom.toFixed(0)}`;
  }

  return service.requiresQuote ? "Consultation first" : "Price confirmed at salon";
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
}

function MonthCalendar({
  bookingWindowDays,
  date,
  onChange,
  promotion,
  today,
}: {
  bookingWindowDays: number;
  date: string;
  onChange: (date: string) => void;
  promotion: Promotion;
  today: string;
}) {
  const todayDate = parseISO(today);
  const selectedDate = parseISO(date);
  const maximumDate = addDays(todayDate, bookingWindowDays);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(selectedDate));
  const calendarStart = startOfWeek(startOfMonth(visibleMonth));
  const calendarEnd = endOfWeek(endOfMonth(visibleMonth));
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const previousMonth = addMonths(visibleMonth, -1);
  const nextMonth = addMonths(visibleMonth, 1);
  const previousDisabled = isBefore(endOfMonth(previousMonth), todayDate);
  const nextDisabled = isAfter(startOfMonth(nextMonth), maximumDate);

  return (
    <div className="reservation-calendar">
      <div className="reservation-calendar-head">
        <button
          aria-label="Show previous month"
          disabled={previousDisabled}
          onClick={() => setVisibleMonth(previousMonth)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <strong>{format(visibleMonth, "MMMM yyyy")}</strong>
        <button
          aria-label="Show next month"
          disabled={nextDisabled}
          onClick={() => setVisibleMonth(nextMonth)}
          type="button"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <div aria-hidden="true" className="reservation-calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <span key={day}>{day.slice(0, 1)}</span>
        ))}
      </div>
      <div className="reservation-calendar-days">
        {days.map((day) => {
          const disabled =
            !isSameMonth(day, visibleMonth) || isBefore(day, todayDate) || isAfter(day, maximumDate);
          const mondayOffer = day.getDay() === promotion.weekday && !disabled;
          const selected = isSameDay(day, selectedDate);
          const dateValue = format(day, "yyyy-MM-dd");

          return (
            <button
              aria-label={`${format(day, "EEEE, MMMM d")}${mondayOffer ? `, save $${promotion.amount}` : ""}`}
              aria-pressed={selected}
              className={`${selected ? "is-selected" : ""} ${mondayOffer ? "has-offer" : ""}`}
              disabled={disabled}
              key={dateValue}
              onClick={() => onChange(dateValue)}
              type="button"
            >
              <span>{format(day, "d")}</span>
              {mondayOffer ? <small>−${promotion.amount}</small> : null}
            </button>
          );
        })}
      </div>
      <p className="reservation-calendar-offer">
        <BadgePercent aria-hidden="true" />
        Mondays save ${promotion.amount}. Discount is applied at the salon.
      </p>
    </div>
  );
}

export default function BookingSection({
  mode = "section",
  phoneDisplay,
  phoneNumber,
}: {
  mode?: "page" | "section";
  phoneDisplay: string;
  phoneNumber: string;
}) {
  const today = getLocalDateValue();
  const demoMode = process.env.NEXT_PUBLIC_BOOKING_DEMO_MODE === "true";
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState<BookingStep>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [startsAt, setStartsAt] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [bookingWindowDays, setBookingWindowDays] = useState(90);
  const [promotion, setPromotion] = useState<Promotion>(defaultPromotion);
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
  const selectedStaff = staff.find((person) => person.id === staffId);
  const selectedDateIsMonday = parseISO(date).getDay() === promotion.weekday;
  const eligibleStaff = useMemo(
    () => staff.filter((person) => person.serviceIds.includes(serviceId)),
    [serviceId, staff],
  );
  const visibleSlots = useMemo(() => {
    if (staffId) {
      return slots.filter((slot) => slot.staffId === staffId);
    }

    const uniqueByStart = new Map<string, Slot>();
    for (const slot of slots) {
      if (!uniqueByStart.has(slot.startsAt)) {
        uniqueByStart.set(slot.startsAt, slot);
      }
    }
    return [...uniqueByStart.values()];
  }, [slots, staffId]);
  const slotsByPeriod = useMemo(() => {
    const periods: Record<"Morning" | "Afternoon" | "Evening", Slot[]> = {
      Morning: [],
      Afternoon: [],
      Evening: [],
    };

    for (const slot of visibleSlots) {
      const hour = Number(formatInTimeZone(new Date(slot.startsAt), timezone, "H"));
      periods[hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening"].push(slot);
    }
    return periods;
  }, [timezone, visibleSlots]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const response = await fetch(`/api/booking/catalog${demoMode ? "?demo=1" : ""}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json()) as {
          bookingWindowDays?: number;
          error?: string;
          promotion?: Promotion;
          services?: Service[];
          staff?: Staff[];
          timezone?: string;
        };

        if (!response.ok || !result.services || !result.staff) {
          throw new Error(result.error || "Online booking is still being configured.");
        }

        setServices(result.services);
        setStaff(result.staff);
        setTimezone(result.timezone || "America/New_York");
        setBookingWindowDays(result.bookingWindowDays || 90);
        setPromotion(result.promotion || defaultPromotion);
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
  }, [demoMode]);

  useEffect(() => {
    if (step < 2 || !serviceId || !date) {
      return;
    }

    const controller = new AbortController();

    async function loadAvailability() {
      setAvailabilityLoading(true);
      setError("");

      try {
        const query = new URLSearchParams({ date, serviceId });
        if (staffId) query.set("staffId", staffId);
        if (demoMode) query.set("demo", "1");

        const response = await fetch(`/api/booking/availability?${query}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json()) as { error?: string; slots?: Slot[] };

        if (!response.ok || !result.slots) {
          throw new Error(result.error || "Unable to check availability.");
        }

        setSlots(result.slots);
      } catch (availabilityError) {
        if (!controller.signal.aborted) {
          setSlots([]);
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
  }, [date, demoMode, serviceId, staffId, step]);

  useEffect(() => {
    if (!confirmation) {
      return;
    }

    window.requestAnimationFrame(() => {
      const workspace = document.getElementById("booking-container");
      const header = document.querySelector<HTMLElement>(".site-header");

      if (workspace) {
        const top = workspace.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          top: Math.max(0, top - (header?.offsetHeight ?? 0) - 12),
        });
      }

      confirmationHeadingRef.current?.focus({ preventScroll: true });
    });
  }, [confirmation]);

  function moveToStep(nextStep: BookingStep) {
    setError("");
    setStep(nextStep);
    window.requestAnimationFrame(() => {
      const heading = stepHeadingRef.current;
      const header = document.querySelector<HTMLElement>(".site-header");

      if (!heading) {
        return;
      }

      heading.focus({ preventScroll: true });
      const top = heading.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        top: Math.max(0, top - (header?.offsetHeight ?? 0) - 28),
      });
    });
  }

  function chooseService(id: string) {
    setServiceId(id);
    setStaffId("");
    setStartsAt("");
    setSlots([]);
    setError("");
  }

  function chooseDate(nextDate: string) {
    setDate(nextDate);
    setStartsAt("");
    setSlots([]);
  }

  function chooseStaff(id: string) {
    setStaffId(id);
    setStartsAt("");
    setSlots([]);
  }

  function resetBooking() {
    setStep(1);
    setServiceId("");
    setStaffId("");
    setDate(today);
    setSlots([]);
    setStartsAt("");
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setCustomerNotes("");
    setSmsConsent(false);
    setConfirmation(null);
    setError("");
  }

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!serviceId || !startsAt || !customerName || !customerEmail || !customerPhone) {
      setError("Complete your name, email, and phone number to reserve this appointment.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/booking${demoMode ? "?demo=1" : ""}`, {
        body: JSON.stringify({
          customerEmail,
          customerName,
          customerNotes: customerNotes || undefined,
          customerPhone,
          serviceId,
          smsConsent,
          staffId: staffId || null,
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
        throw new Error(result.error || "Unable to reserve the appointment.");
      }

      setConfirmation(result.booking);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to reserve the appointment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const formattedSelection = startsAt
    ? formatInTimeZone(new Date(startsAt), timezone, "EEEE, MMMM d 'at' h:mm a")
    : null;

  return (
    <section
      className={`booking-experience booking-experience--${mode}`}
      data-reveal={mode === "section" ? "" : undefined}
      id="booking"
    >
      <div className="reservation-atmosphere">
        <Image
          alt="Katty Hair Studio client with polished, layered waves"
          fill
          loading={mode === "page" ? "eager" : "lazy"}
          sizes={mode === "page" ? "(max-width: 900px) 100vw, 42vw" : "(max-width: 1100px) 100vw, 42vw"}
          src="/editorial/katty-client-plan-result-v2.webp"
        />
        <div className="reservation-atmosphere-shade" />
        <div className="reservation-atmosphere-copy">
          <p className="eyebrow">Katty Hair Studio</p>
          <h2>Your next look starts here.</h2>
          <p>Choose what you need. We’ll find the time and the right hands for it.</p>
          <div className="reservation-atmosphere-notes">
            <span><BadgePercent aria-hidden="true" />Mondays save $10</span>
            <span><CheckCircle2 aria-hidden="true" />No payment today</span>
          </div>
        </div>
      </div>

      <div className="reservation-workspace" id="booking-container">
        {confirmation ? (
          <div aria-live="polite" className="reservation-confirmation" role="status">
            <div className="reservation-confirmation-mark"><Check aria-hidden="true" /></div>
            <p className="reservation-kicker">Appointment reserved</p>
            <h2 ref={confirmationHeadingRef} tabIndex={-1}>You’re booked, {customerName.split(" ")[0]}.</h2>
            <p className="reservation-confirmation-lead">
              We’ll see you {formatInTimeZone(new Date(confirmation.startsAt), timezone, "EEEE, MMMM d 'at' h:mm a")}.
            </p>
            <dl className="reservation-confirmation-details">
              <div><dt>Service</dt><dd>{confirmation.serviceName}</dd></div>
              <div><dt>Stylist</dt><dd>{confirmation.staffName}</dd></div>
              <div><dt>Confirmation</dt><dd>{confirmation.confirmationCode}</dd></div>
            </dl>
            <div className="reservation-message-status">
              <Mail aria-hidden="true" />
              <span>Email sent to {customerEmail}{smsConsent ? " · Text confirmation sent" : ""}</span>
            </div>
            <div className="reservation-confirmation-actions">
              <a className="reservation-primary-action" href={directionsUrl} rel="noreferrer" target="_blank">
                <MapPin aria-hidden="true" />Get directions
              </a>
              <button className="reservation-text-action" onClick={resetBooking} type="button">
                Book another appointment
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="reservation-workspace-head">
              <div>
                <p className="reservation-kicker">Reserve your appointment</p>
                <strong>{step === 1 ? "Choose" : step === 2 ? "Schedule" : "Your details"}</strong>
              </div>
              <a href={`tel:${phoneNumber}`}><Phone aria-hidden="true" />Call {phoneDisplay}</a>
            </div>

            <ol aria-label="Booking progress" className="reservation-progress">
              {[
                { label: "Service", value: 1 },
                { label: "Schedule", value: 2 },
                { label: "Details", value: 3 },
              ].map((item) => (
                <li className={step === item.value ? "is-current" : step > item.value ? "is-complete" : ""} key={item.value}>
                  <button
                    aria-current={step === item.value ? "step" : undefined}
                    disabled={item.value > step}
                    onClick={() => item.value < step && moveToStep(item.value as BookingStep)}
                    type="button"
                  >
                    <span>{step > item.value ? <Check aria-hidden="true" /> : item.value}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ol>

            <form className="reservation-form" onSubmit={submitBooking}>
              {step === 1 ? (
                <div className="reservation-step reservation-step--service" key="service-step">
                  <div className="reservation-step-heading">
                    <p>Step 1 of 3</p>
                    <h2 ref={stepHeadingRef} tabIndex={-1}>What are we doing today?</h2>
                    <span>Select one service to see matching availability.</span>
                  </div>

                  {catalogLoading ? (
                    <div aria-label="Loading services" className="reservation-service-skeletons">
                      <span /><span /><span />
                    </div>
                  ) : services.length ? (
                    <div aria-label="Choose a service" className="reservation-service-list" role="radiogroup">
                      {services.map((service) => {
                        const selected = service.id === serviceId;
                        return (
                          <button
                            aria-checked={selected}
                            className={selected ? "is-selected" : ""}
                            key={service.id}
                            onClick={() => chooseService(service.id)}
                            role="radio"
                            type="button"
                          >
                            <span className="reservation-service-icon"><Scissors aria-hidden="true" /></span>
                            <span className="reservation-service-copy">
                              <strong>{service.name}</strong>
                              <small>{service.description || "Your service plan is confirmed before the chair."}</small>
                              <span>{formatDuration(service.durationMinutes)} <i aria-hidden="true" /> {formatPrice(service)}</span>
                            </span>
                            <span className="reservation-service-check">{selected ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="reservation-unavailable">
                      <Sparkles aria-hidden="true" />
                      <h3>Online booking is being prepared.</h3>
                      <p>{error || "Call the salon and we’ll help plan your appointment."}</p>
                      <a href={`tel:${phoneNumber}`}>Call {phoneDisplay}</a>
                    </div>
                  )}

                  {services.length ? (
                    <div className="reservation-step-actions reservation-step-actions--end">
                      <button
                        className="reservation-primary-action"
                        disabled={!serviceId}
                        onClick={() => moveToStep(2)}
                        type="button"
                      >
                        Choose a time<ArrowRight aria-hidden="true" />
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {step === 2 ? (
                <div className="reservation-step reservation-step--schedule" key="schedule-step">
                  <div className="reservation-step-heading">
                    <p>Step 2 of 3</p>
                    <h2 ref={stepHeadingRef} tabIndex={-1}>Choose a date and time.</h2>
                    <span>First available shows the widest choice of appointments.</span>
                  </div>

                  <fieldset className="reservation-preference">
                    <legend>Stylist preference</legend>
                    <div className="reservation-preference-options">
                      <button
                        aria-pressed={!staffId}
                        className={!staffId ? "is-selected" : ""}
                        onClick={() => chooseStaff("")}
                        type="button"
                      >
                        <Sparkles aria-hidden="true" />
                        <span><strong>First available</strong><small>Most appointment times</small></span>
                      </button>
                      {eligibleStaff.map((person) => (
                        <button
                          aria-pressed={staffId === person.id}
                          className={staffId === person.id ? "is-selected" : ""}
                          key={person.id}
                          onClick={() => chooseStaff(person.id)}
                          type="button"
                        >
                          <UserRound aria-hidden="true" />
                          <span><strong>{person.displayName}</strong><small>Choose this stylist</small></span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="reservation-schedule-grid">
                    <MonthCalendar
                      bookingWindowDays={bookingWindowDays}
                      date={date}
                      onChange={chooseDate}
                      promotion={promotion}
                      today={today}
                    />

                    <div className="reservation-times" aria-live="polite">
                      <div className="reservation-times-head">
                        <div><CalendarDays aria-hidden="true" /><span><strong>{format(parseISO(date), "EEEE")}</strong><small>{format(parseISO(date), "MMMM d")}</small></span></div>
                        {selectedDateIsMonday ? <span className="reservation-savings">Save ${promotion.amount}</span> : null}
                      </div>

                      {availabilityLoading ? (
                        <div className="reservation-time-skeletons"><span /><span /><span /><span /></div>
                      ) : visibleSlots.length ? (
                        <div className="reservation-time-groups">
                          {(Object.keys(slotsByPeriod) as Array<keyof typeof slotsByPeriod>).map((period) =>
                            slotsByPeriod[period].length ? (
                              <div key={period}>
                                <p>{period}</p>
                                <div>
                                  {slotsByPeriod[period].map((slot) => (
                                    <button
                                      aria-pressed={startsAt === slot.startsAt}
                                      className={startsAt === slot.startsAt ? "is-selected" : ""}
                                      key={slot.startsAt}
                                      onClick={() => setStartsAt(slot.startsAt)}
                                      type="button"
                                    >
                                      {slot.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : null,
                          )}
                        </div>
                      ) : (
                        <div className="reservation-no-times">
                          <Clock3 aria-hidden="true" />
                          <strong>No online times for this date.</strong>
                          <span>Try another day{staffId ? " or choose First available" : ""}.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {error ? <p className="reservation-error" role="alert">{error}</p> : null}
                  <div className="reservation-step-actions">
                    <button className="reservation-back-action" onClick={() => moveToStep(1)} type="button"><ArrowLeft aria-hidden="true" />Back</button>
                    <button className="reservation-primary-action" disabled={!startsAt} onClick={() => moveToStep(3)} type="button">Your details<ArrowRight aria-hidden="true" /></button>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="reservation-step reservation-step--details" key="details-step">
                  <div className="reservation-step-heading">
                    <p>Step 3 of 3</p>
                    <h2 ref={stepHeadingRef} tabIndex={-1}>Almost yours.</h2>
                    <span>We’ll use these details only for your appointment.</span>
                  </div>

                  <div className="reservation-selection-summary">
                    <div><Scissors aria-hidden="true" /><span><small>Service</small><strong>{selectedService?.name}</strong></span></div>
                    <div><CalendarDays aria-hidden="true" /><span><small>Date & time</small><strong>{formattedSelection}</strong></span></div>
                    <div><UserRound aria-hidden="true" /><span><small>Stylist</small><strong>{selectedStaff?.displayName || "First available"}</strong></span></div>
                    {selectedDateIsMonday ? <p><BadgePercent aria-hidden="true" />Monday savings: −${promotion.amount}, applied at the salon.</p> : null}
                  </div>

                  <div className="reservation-contact-grid">
                    <label><span>Your name *</span><input autoComplete="name" onChange={(event) => setCustomerName(event.target.value)} required type="text" value={customerName} /></label>
                    <label><span>Email *</span><input autoComplete="email" onChange={(event) => setCustomerEmail(event.target.value)} required type="email" value={customerEmail} /></label>
                    <label><span>Phone *</span><input autoComplete="tel" inputMode="tel" onChange={(event) => setCustomerPhone(event.target.value)} required type="tel" value={customerPhone} /></label>
                    <label className="reservation-contact-wide"><span>Notes or requested look</span><textarea maxLength={1000} onChange={(event) => setCustomerNotes(event.target.value)} rows={3} value={customerNotes} /></label>
                    <label className="reservation-sms-consent reservation-contact-wide">
                      <input checked={smsConsent} onChange={(event) => setSmsConsent(event.target.checked)} type="checkbox" />
                      <span>Text me appointment confirmations and updates. Message and data rates may apply. Reply STOP to opt out.</span>
                    </label>
                  </div>

                  {error ? <p className="reservation-error" role="alert">{error}</p> : null}
                  <div className="reservation-step-actions">
                    <button className="reservation-back-action" onClick={() => moveToStep(2)} type="button"><ArrowLeft aria-hidden="true" />Back</button>
                    <button className="reservation-primary-action" disabled={submitting} type="submit">
                      {submitting ? "Reserving…" : "Reserve appointment"}<Check aria-hidden="true" />
                    </button>
                  </div>
                  <p className="reservation-submit-note"><CheckCircle2 aria-hidden="true" />No payment today. Availability is rechecked before confirmation.</p>
                </div>
              ) : null}
            </form>
          </>
        )}
      </div>
    </section>
  );
}
