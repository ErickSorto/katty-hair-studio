"use client";

import Image from "next/image";
import Link from "next/link";
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
import { enUS, es as esLocale } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import { isSalonClosedWeekday } from "@/lib/booking/schedule";
import { formatBookingSlotTime } from "@/lib/booking/localization";
import { localizePath, type Locale } from "@/app/i18n/config";
import {
  bookingServicePresentations,
  bookingUiCopy,
  type BookingPeriod,
} from "@/app/i18n/booking-copy";
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
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Service = {
  description: string | null;
  durationMinutes: number;
  id: string;
  name: string;
  priceFrom: number | null;
  requiresQuote: boolean;
  slug: string;
};

type Slot = {
  endsAt: string;
  label: string;
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
  googleEventLink?: string;
  localTest?: boolean;
  serviceName: string;
  startsAt: string;
};

type BookingStep = 1 | 2 | 3;

const directionsUrl =
  "https://www.google.com/maps/search/?api=1&query=3816%20Bladensburg%20Rd%2C%20Brentwood%2C%20MD%2020722";
const defaultPromotions: Record<Locale, Promotion> = {
  en: { amount: 10, label: "Mondays are $10 off all services", weekday: 1 },
  es: { amount: 10, label: "Los lunes ahorras $10 en todos los servicios", weekday: 1 },
};
function getServicePresentation(service: Service, locale: Locale) {
  const presentations = bookingServicePresentations[locale] as Record<
    string,
    { readonly included: readonly string[]; readonly title: string }
  >;

  return presentations[service.slug] || {
    title: service.name,
    included: [bookingUiCopy[locale].serviceStep.fallback],
  };
}

function getServiceIcon(slug: string) {
  if (slug === "dominican-blowout") return "/booking-icons/blowout.png";
  if (slug === "color-highlights") return "/booking-icons/color.png";
  if (slug === "extensions-wig") return "/booking-icons/extensions.png";
  if (slug === "braids") return "/booking-icons/braids.png";
  if (slug === "beauty-supply") return "/booking-icons/beauty-supply.png";
  return "/booking-icons/cut.png";
}

function getLocalDateValue(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function getInitialBookingDate(today: string) {
  const date = parseISO(today);
  return format(isSalonClosedWeekday(date.getDay()) ? addDays(date, 1) : date, "yyyy-MM-dd");
}

function formatPrice(service: Service, locale: Locale) {
  const copy = bookingUiCopy[locale].price;
  return service.requiresQuote ? copy.consultation : copy.confirmed;
}

function formatDuration(minutes: number, locale: Locale) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  const hour = bookingUiCopy[locale].price.hour;
  return remainder ? `${hours} ${hour} ${remainder} min` : `${hours} ${hour}`;
}

function MonthCalendar({
  bookingWindowDays,
  date,
  locale,
  onChange,
  promotion,
  today,
}: {
  bookingWindowDays: number;
  date: string;
  locale: Locale;
  onChange: (date: string) => void;
  promotion: Promotion;
  today: string;
}) {
  const copy = bookingUiCopy[locale].calendar;
  const dateLocale = locale === "es" ? esLocale : enUS;
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
          aria-label={copy.previous}
          disabled={previousDisabled}
          onClick={() => setVisibleMonth(previousMonth)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <strong>{format(visibleMonth, "MMMM yyyy", { locale: dateLocale })}</strong>
        <button
          aria-label={copy.next}
          disabled={nextDisabled}
          onClick={() => setVisibleMonth(nextMonth)}
          type="button"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <div aria-hidden="true" className="reservation-calendar-weekdays">
        {copy.weekdays.map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="reservation-calendar-days">
        {days.map((day) => {
          const salonClosed = isSalonClosedWeekday(day.getDay());
          const disabled =
            salonClosed ||
            !isSameMonth(day, visibleMonth) ||
            isBefore(day, todayDate) ||
            isAfter(day, maximumDate);
          const mondayOffer = day.getDay() === promotion.weekday && !disabled;
          const selected = !disabled && isSameDay(day, selectedDate);
          const dateValue = format(day, "yyyy-MM-dd");

          return (
            <button
              aria-label={`${format(day, locale === "es" ? "EEEE, d 'de' MMMM" : "EEEE, MMMM d", { locale: dateLocale })}${salonClosed ? `, ${copy.closed}` : mondayOffer ? `, ${copy.save} $${promotion.amount}` : ""}`}
              aria-pressed={selected}
              className={`${selected ? "is-selected" : ""} ${mondayOffer ? "has-offer" : ""}`}
              disabled={disabled}
              key={dateValue}
              onClick={() => onChange(dateValue)}
              type="button"
            >
              <span>{format(day, "d")}</span>
              {mondayOffer ? <small>${promotion.amount} {copy.off}</small> : null}
            </button>
          );
        })}
      </div>
      <p className="reservation-calendar-offer">
        <BadgePercent aria-hidden="true" />
        {copy.offer(promotion.amount)}
      </p>
    </div>
  );
}

export default function BookingSection({
  locale = "en",
  mode = "section",
  phoneDisplay,
  phoneNumber,
}: {
  locale?: Locale;
  mode?: "page" | "section";
  phoneDisplay: string;
  phoneNumber: string;
}) {
  const copy = bookingUiCopy[locale];
  const dateLocale = locale === "es" ? esLocale : enUS;
  const defaultPromotion = defaultPromotions[locale];
  const today = getLocalDateValue();
  const initialBookingDate = getInitialBookingDate(today);
  const demoMode = process.env.NEXT_PUBLIC_BOOKING_DEMO_MODE === "true";
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState<BookingStep>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(initialBookingDate);
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
  const selectedServicePresentation = selectedService
    ? getServicePresentation(selectedService, locale)
    : null;
  const selectedDateIsMonday = parseISO(date).getDay() === promotion.weekday;
  const uniqueSlots = useMemo(() => {
    const uniqueByStart = new Map<string, Slot>();
    for (const slot of slots) {
      if (!uniqueByStart.has(slot.startsAt)) {
        uniqueByStart.set(slot.startsAt, slot);
      }
    }
    return [...uniqueByStart.values()];
  }, [slots]);
  const slotsByPeriod = useMemo(() => {
    const periods: Record<BookingPeriod, Slot[]> = {
      morning: [],
      afternoon: [],
      evening: [],
    };

    for (const slot of uniqueSlots) {
      const hour = Number(formatInTimeZone(new Date(slot.startsAt), timezone, "H"));
      periods[hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening"].push(slot);
    }
    return periods;
  }, [timezone, uniqueSlots]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const query = new URLSearchParams({ locale });
        if (demoMode) query.set("demo", "1");
        const response = await fetch(`/api/booking/catalog?${query}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json()) as {
          bookingWindowDays?: number;
          error?: string;
          promotion?: Promotion;
          services?: Service[];
          timezone?: string;
        };

        if (!response.ok || !result.services) {
          throw new Error(result.error || copy.errors.catalog);
        }

        setServices(result.services);
        setTimezone(result.timezone || "America/New_York");
        setBookingWindowDays(result.bookingWindowDays || 90);
        setPromotion(result.promotion || defaultPromotion);
      } catch (catalogError) {
        if (!controller.signal.aborted) {
          setError(
            catalogError instanceof Error
              ? catalogError.message
              : copy.errors.catalog,
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
  }, [copy.errors.catalog, defaultPromotion, demoMode, locale]);

  useEffect(() => {
    if (step < 2 || !serviceId || !date) {
      return;
    }

    const controller = new AbortController();

    async function loadAvailability() {
      setAvailabilityLoading(true);
      setError("");

      try {
        const query = new URLSearchParams({ date, locale, serviceId });
        if (demoMode) query.set("demo", "1");

        const response = await fetch(`/api/booking/availability?${query}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json()) as { error?: string; slots?: Slot[] };

        if (!response.ok || !result.slots) {
          throw new Error(result.error || copy.errors.availability);
        }

        setSlots(result.slots);
      } catch (availabilityError) {
        if (!controller.signal.aborted) {
          setSlots([]);
          setError(
            availabilityError instanceof Error
              ? availabilityError.message
              : copy.errors.availability,
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
  }, [copy.errors.availability, date, demoMode, locale, serviceId, step]);

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
    setStartsAt("");
    setSlots([]);
    setError("");
  }

  function chooseDate(nextDate: string) {
    setDate(nextDate);
    setStartsAt("");
    setSlots([]);
  }

  function resetBooking() {
    setStep(1);
    setServiceId("");
    setDate(initialBookingDate);
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
      setError(copy.errors.incomplete);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/booking${demoMode ? "?demo=1" : ""}`, {
        body: JSON.stringify({
          customerEmail,
          customerLocale: locale,
          customerName,
          customerNotes: customerNotes || undefined,
          customerPhone,
          serviceId,
          smsConsent,
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
        throw new Error(result.error || copy.errors.submit);
      }

      setConfirmation(result.booking);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : copy.errors.submit,
      );
    } finally {
      setSubmitting(false);
    }
  }

  const formattedSelection = startsAt
    ? formatInTimeZone(
        new Date(startsAt),
        timezone,
        locale === "es" ? "EEEE, d 'de' MMMM 'a las' h:mm aaaa" : "EEEE, MMMM d 'at' h:mm a",
        { locale: dateLocale },
      ).replaceAll("a.m.", "a. m.").replaceAll("p.m.", "p. m.")
    : null;

  return (
    <section
      className={`booking-experience booking-experience--${mode}`}
      data-reveal={mode === "section" ? "" : undefined}
      id="booking"
    >
      <div className="reservation-atmosphere">
        <Image
          alt={copy.atmosphere.alt}
          fill
          loading={mode === "page" ? "eager" : "lazy"}
          sizes={mode === "page" ? "(max-width: 900px) 100vw, 42vw" : "(max-width: 1100px) 100vw, 42vw"}
          src="/editorial/katty-client-plan-result-v2.webp"
        />
        <div className="reservation-atmosphere-shade" />
        <div className="reservation-atmosphere-copy">
          <p className="eyebrow">{copy.atmosphere.eyebrow}</p>
          <h2>{copy.atmosphere.title}</h2>
          <p>{copy.atmosphere.body}</p>
          <div className="reservation-atmosphere-notes">
            <span><BadgePercent aria-hidden="true" />{copy.atmosphere.monday}</span>
            <span><CheckCircle2 aria-hidden="true" />{copy.atmosphere.payment}</span>
          </div>
        </div>
      </div>

      <div className="reservation-workspace" id="booking-container">
        {confirmation ? (
          <div aria-live="polite" className="reservation-confirmation" role="status">
            <div className="reservation-confirmation-mark"><Check aria-hidden="true" /></div>
            <p className="reservation-kicker">{copy.confirmation.kicker}</p>
            <h2 ref={confirmationHeadingRef} tabIndex={-1}>{copy.confirmation.title(customerName.split(" ")[0])}</h2>
            <p className="reservation-confirmation-lead">
              {copy.confirmation.when} {formattedSelection}.
            </p>
            <dl className="reservation-confirmation-details">
              <div><dt>{copy.confirmation.service}</dt><dd>{selectedServicePresentation?.title || confirmation.serviceName}</dd></div>
              <div><dt>{copy.confirmation.code}</dt><dd>{confirmation.confirmationCode}</dd></div>
            </dl>
            <div className="reservation-message-status">
              <Mail aria-hidden="true" />
              <span>
                {confirmation.localTest
                  ? copy.confirmation.local
                  : copy.confirmation.email(customerEmail, smsConsent)}
              </span>
            </div>
            <div className="reservation-confirmation-actions">
              {confirmation.localTest && confirmation.googleEventLink ? (
                <a className="reservation-primary-action" href={confirmation.googleEventLink} rel="noreferrer" target="_blank">
                  <CalendarDays aria-hidden="true" />{copy.confirmation.testCalendar}
                </a>
              ) : (
                <a className="reservation-primary-action" href={directionsUrl} rel="noreferrer" target="_blank">
                  <MapPin aria-hidden="true" />{copy.confirmation.directions}
                </a>
              )}
              <button className="reservation-text-action" onClick={resetBooking} type="button">
                {copy.confirmation.another}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="reservation-workspace-head">
              <div>
                <p className="reservation-kicker">{copy.workspace.eyebrow}</p>
                <strong>{copy.workspace.current[step - 1]}</strong>
              </div>
              <a href={`tel:${phoneNumber}`}><Phone aria-hidden="true" />{copy.workspace.call} {phoneDisplay}</a>
            </div>

            <ol aria-label={copy.workspace.progress} className="reservation-progress">
              {copy.workspace.steps.map((label, index) => ({ label, value: index + 1 })).map((item) => (
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
                    <p>{copy.serviceStep.step}</p>
                    <h2 ref={stepHeadingRef} tabIndex={-1}>{copy.serviceStep.title}</h2>
                    <span>{copy.serviceStep.body}</span>
                  </div>

                  {catalogLoading ? (
                    <div aria-label={copy.serviceStep.loading} className="reservation-service-skeletons">
                      <span /><span /><span />
                    </div>
                  ) : services.length ? (
                    <div aria-label={copy.serviceStep.choose} className="reservation-service-list" role="radiogroup">
                      {services.map((service) => {
                        const selected = service.id === serviceId;
                        const presentation = getServicePresentation(service, locale);
                        const serviceIconSrc = getServiceIcon(service.slug);
                        const detailsId = `service-details-${service.id}`;
                        return (
                          <article
                            className={`reservation-service-option ${selected ? "is-expanded" : ""}`}
                            key={service.id}
                          >
                            <button
                              aria-checked={selected}
                              aria-controls={selected ? detailsId : undefined}
                              className={selected ? "is-selected" : ""}
                              onClick={() => chooseService(service.id)}
                              role="radio"
                              type="button"
                            >
                              <span className="reservation-service-icon">
                                <Image alt="" aria-hidden="true" height={52} src={serviceIconSrc} width={52} />
                              </span>
                              <span className="reservation-service-copy">
                                <strong>{presentation.title}</strong>
                                <span>{formatDuration(service.durationMinutes, locale)} <i aria-hidden="true" /> {formatPrice(service, locale)}</span>
                              </span>
                              <span className="reservation-service-check">{selected ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</span>
                            </button>
                            {selected ? (
                              <div className="reservation-service-details" id={detailsId}>
                                <div>
                                  <p>{copy.serviceStep.category}</p>
                                  <ul>
                                    {presentation.included.map((item) => <li key={item}>{item}</li>)}
                                  </ul>
                                </div>
                                <button
                                  className="reservation-service-book"
                                  onClick={() => moveToStep(2)}
                                  type="button"
                                >
                                  <span><small>{copy.serviceStep.selected}</small>{copy.serviceStep.book}</span>
                                  <ArrowRight aria-hidden="true" />
                                </button>
                              </div>
                            ) : null}
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="reservation-unavailable">
                      <Sparkles aria-hidden="true" />
                      <h3>{copy.serviceStep.unavailable}</h3>
                      <p>{error || copy.serviceStep.unavailableBody}</p>
                      <a href={`tel:${phoneNumber}`}>{copy.workspace.call} {phoneDisplay}</a>
                    </div>
                  )}

                </div>
              ) : null}

              {step === 2 ? (
                <div className="reservation-step reservation-step--schedule" key="schedule-step">
                  <div className="reservation-step-heading">
                    <p>{copy.scheduleStep.step}</p>
                    <h2 ref={stepHeadingRef} tabIndex={-1}>{copy.scheduleStep.title}</h2>
                    <span>{copy.scheduleStep.body}</span>
                  </div>

                  <div className="reservation-schedule-grid">
                    <MonthCalendar
                      bookingWindowDays={bookingWindowDays}
                      date={date}
                      locale={locale}
                      onChange={chooseDate}
                      promotion={promotion}
                      today={today}
                    />

                    <div className="reservation-times" aria-live="polite">
                      <div className="reservation-times-head">
                        <div><CalendarDays aria-hidden="true" /><span><strong>{format(parseISO(date), "EEEE", { locale: dateLocale })}</strong><small>{format(parseISO(date), locale === "es" ? "d 'de' MMMM" : "MMMM d", { locale: dateLocale })}</small></span></div>
                        {selectedDateIsMonday ? <span className="reservation-savings">{copy.scheduleStep.savings} ${promotion.amount}</span> : null}
                      </div>

                      {availabilityLoading ? (
                        <div className="reservation-time-skeletons"><span /><span /><span /><span /></div>
                      ) : uniqueSlots.length ? (
                        <div className="reservation-time-groups">
                          {(Object.keys(slotsByPeriod) as Array<keyof typeof slotsByPeriod>).map((period) =>
                            slotsByPeriod[period].length ? (
                              <div key={period}>
                                <p>{copy.periods[period]}</p>
                                <div>
                                  {slotsByPeriod[period].map((slot) => (
                                    <button
                                      aria-pressed={startsAt === slot.startsAt}
                                      className={startsAt === slot.startsAt ? "is-selected" : ""}
                                      key={slot.startsAt}
                                      onClick={() => setStartsAt(slot.startsAt)}
                                      type="button"
                                    >
                                      {formatBookingSlotTime(slot.startsAt, timezone, locale)}
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
                          <strong>{copy.scheduleStep.noTimes}</strong>
                          <span>{copy.scheduleStep.tryAnother}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {error ? <p className="reservation-error" role="alert">{error}</p> : null}
                  <div className="reservation-step-actions">
                    <button className="reservation-back-action" onClick={() => moveToStep(1)} type="button"><ArrowLeft aria-hidden="true" />{copy.scheduleStep.back}</button>
                    <button className="reservation-primary-action" disabled={!startsAt} onClick={() => moveToStep(3)} type="button">{copy.scheduleStep.continue}<ArrowRight aria-hidden="true" /></button>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="reservation-step reservation-step--details" key="details-step">
                  <div className="reservation-step-heading">
                    <p>{copy.detailsStep.step}</p>
                    <h2 ref={stepHeadingRef} tabIndex={-1}>{copy.detailsStep.title}</h2>
                    <span>{copy.detailsStep.body}</span>
                  </div>

                  <div className="reservation-selection-summary">
                    <div><Scissors aria-hidden="true" /><span><small>{copy.detailsStep.service}</small><strong>{selectedServicePresentation?.title}</strong></span></div>
                    <div><CalendarDays aria-hidden="true" /><span><small>{copy.detailsStep.dateTime}</small><strong>{formattedSelection}</strong></span></div>
                    {selectedDateIsMonday ? <p><BadgePercent aria-hidden="true" />{copy.detailsStep.monday(promotion.amount)}</p> : null}
                  </div>

                  <div className="reservation-contact-grid">
                    <label><span>{copy.detailsStep.name}</span><input autoComplete="name" onChange={(event) => setCustomerName(event.target.value)} required type="text" value={customerName} /></label>
                    <label><span>{copy.detailsStep.email}</span><input autoComplete="email" onChange={(event) => setCustomerEmail(event.target.value)} required type="email" value={customerEmail} /></label>
                    <label><span>{copy.detailsStep.phone}</span><input autoComplete="tel" inputMode="tel" onChange={(event) => setCustomerPhone(event.target.value)} required type="tel" value={customerPhone} /></label>
                    <label className="reservation-contact-wide"><span>{copy.detailsStep.notes}</span><textarea maxLength={1000} onChange={(event) => setCustomerNotes(event.target.value)} rows={3} value={customerNotes} /></label>
                    <label className="reservation-sms-consent reservation-contact-wide">
                      <input checked={smsConsent} onChange={(event) => setSmsConsent(event.target.checked)} type="checkbox" />
                      <span>{copy.detailsStep.sms}</span>
                    </label>
                  </div>

                  {error ? <p className="reservation-error" role="alert">{error}</p> : null}
                  <div className="reservation-step-actions">
                    <button className="reservation-back-action" onClick={() => moveToStep(2)} type="button"><ArrowLeft aria-hidden="true" />{copy.detailsStep.back}</button>
                    <button className="reservation-primary-action" disabled={submitting} type="submit">
                      {submitting ? copy.detailsStep.reserving : copy.detailsStep.reserve}<Check aria-hidden="true" />
                    </button>
                  </div>
                  <p className="reservation-submit-note"><CheckCircle2 aria-hidden="true" />{copy.detailsStep.note}</p>
                </div>
              ) : null}
            </form>
          </>
        )}

        <div className="reservation-app-purpose">
          <p>{copy.purpose.body}</p>
          <Link href={localizePath("/privacy", locale)}>{copy.purpose.link}</Link>
        </div>
      </div>
    </section>
  );
}
