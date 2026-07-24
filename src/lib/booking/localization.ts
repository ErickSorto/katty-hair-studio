import { enUS, es } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

export const bookingLocales = ["en", "es"] as const;
export type BookingLocale = (typeof bookingLocales)[number];

export type BookingErrorCode =
  | "AVAILABILITY_UNAVAILABLE"
  | "BOOKING_CAPACITY_REACHED"
  | "BOOKING_FAILED"
  | "BOOKING_NOT_CONFIGURED"
  | "BOOKING_UNAVAILABLE"
  | "CANCELLATION_FAILED"
  | "CANCELLATION_UNAVAILABLE"
  | "CATALOG_UNAVAILABLE"
  | "INVALID_BOOKING_DETAILS"
  | "INVALID_CANCELLATION_LINK"
  | "INVALID_PHONE"
  | "INVALID_SERVICE_DATE"
  | "PREVIEW_SLOT_UNAVAILABLE"
  | "SLOT_UNAVAILABLE"
  | "SMS_PHONE_REQUIRED";

const bookingErrorMessages: Record<BookingLocale, Record<BookingErrorCode, string>> = {
  en: {
    AVAILABILITY_UNAVAILABLE:
      "Live availability is temporarily unavailable. Please call the salon.",
    BOOKING_CAPACITY_REACHED:
      "That appointment time was just taken. Choose another available time.",
    BOOKING_FAILED:
      "We couldn't confirm that appointment. Choose another time or call the salon.",
    BOOKING_NOT_CONFIGURED:
      "Online booking is still being configured. Please call the salon.",
    BOOKING_UNAVAILABLE:
      "Online booking is temporarily unavailable. Please call the salon.",
    CANCELLATION_FAILED:
      "We couldn't cancel the appointment. Please try again or call the salon.",
    CANCELLATION_UNAVAILABLE:
      "This appointment can no longer be cancelled online. Please call the salon.",
    CATALOG_UNAVAILABLE:
      "Booking is temporarily unavailable. Please try again or call the salon.",
    INVALID_BOOKING_DETAILS: "Review the appointment and contact details.",
    INVALID_CANCELLATION_LINK: "This cancellation link is invalid.",
    INVALID_PHONE: "Enter a valid 10-digit US phone number.",
    INVALID_SERVICE_DATE: "Choose a valid service and date.",
    PREVIEW_SLOT_UNAVAILABLE:
      "That preview appointment time is no longer available.",
    SLOT_UNAVAILABLE: "That appointment time is no longer available.",
    SMS_PHONE_REQUIRED:
      "A phone number is required when SMS confirmations are selected.",
  },
  es: {
    AVAILABILITY_UNAVAILABLE:
      "La disponibilidad en vivo no está disponible temporalmente. Llama al salón.",
    BOOKING_CAPACITY_REACHED:
      "Ese horario acaba de ser reservado. Elige otro horario disponible.",
    BOOKING_FAILED:
      "No pudimos confirmar esa cita. Elige otro horario o llama al salón.",
    BOOKING_NOT_CONFIGURED:
      "Las reservas en línea aún se están configurando. Llama al salón.",
    BOOKING_UNAVAILABLE:
      "Las reservas en línea no están disponibles temporalmente. Llama al salón.",
    CANCELLATION_FAILED:
      "No pudimos cancelar la cita. Inténtalo de nuevo o llama al salón.",
    CANCELLATION_UNAVAILABLE:
      "Esta cita ya no se puede cancelar en línea. Llama al salón.",
    CATALOG_UNAVAILABLE:
      "Las reservas no están disponibles temporalmente. Inténtalo de nuevo o llama al salón.",
    INVALID_BOOKING_DETAILS:
      "Revisa los datos de la cita y tu información de contacto.",
    INVALID_CANCELLATION_LINK: "Este enlace de cancelación no es válido.",
    INVALID_PHONE:
      "Ingresa un número de teléfono válido de 10 dígitos de EE. UU.",
    INVALID_SERVICE_DATE: "Elige un servicio y una fecha válidos.",
    PREVIEW_SLOT_UNAVAILABLE:
      "El horario de esta cita de prueba ya no está disponible.",
    SLOT_UNAVAILABLE: "Ese horario ya no está disponible.",
    SMS_PHONE_REQUIRED:
      "Se requiere un número de teléfono si seleccionas confirmaciones por SMS.",
  },
};

const spanishServiceCopy: Record<string, { description: string; name: string }> = {
  "beauty-supply": {
    description:
      "Ayuda para elegir cabello para extensiones, pelucas o productos para el cuidado del cabello.",
    name: "Consulta sobre productos para el cabello",
  },
  braids: {
    description: "Peinado protector con un acabado limpio y pulido.",
    name: "Trenzas",
  },
  "color-highlights": {
    description:
      "Color con dimensión, planificado según tu historial y la salud de tu cabello.",
    name: "Coloración o mechas",
  },
  "cut-barber": {
    description: "Un corte personalizado según tu textura y tu rutina.",
    name: "Corte de cabello",
  },
  "dominican-blowout": {
    description: "Un acabado suave y pulido, con movimiento y brillo.",
    name: "Blowout dominicano",
  },
  "extensions-wig": {
    description:
      "Instalación, integración y peinado adaptados al acabado que deseas.",
    name: "Servicio de extensiones o peluca",
  },
};

export function normalizeBookingLocale(value: unknown): BookingLocale {
  return value === "es" ? "es" : "en";
}

export function getBookingErrorMessage(
  locale: BookingLocale,
  code: BookingErrorCode,
) {
  return bookingErrorMessages[locale][code];
}

export function getBookingPromotionLabel(locale: BookingLocale) {
  return locale === "es"
    ? "Los lunes, ahorra $10 en todos los servicios"
    : "Mondays are $10 off all services";
}

export function getLocalizedBookingServiceName(
  slug: string,
  englishName: string,
  locale: BookingLocale,
) {
  return locale === "es" ? spanishServiceCopy[slug]?.name || englishName : englishName;
}

export function getLocalizedBookingServiceDescription(
  slug: string,
  englishDescription: string | null,
  locale: BookingLocale,
) {
  return locale === "es"
    ? spanishServiceCopy[slug]?.description || englishDescription
    : englishDescription;
}

function dateFnsLocale(locale: BookingLocale) {
  return locale === "es" ? es : enUS;
}

function polishSpanishTime(value: string, locale: BookingLocale) {
  if (locale !== "es") return value;

  return value.replaceAll("a.m.", "a. m.").replaceAll("p.m.", "p. m.");
}

export function formatBookingDate(
  value: Date | string,
  timezone: string,
  locale: BookingLocale,
) {
  return formatInTimeZone(
    new Date(value),
    timezone,
    locale === "es" ? "EEEE, d 'de' MMMM 'de' yyyy" : "EEEE, MMMM d, yyyy",
    { locale: dateFnsLocale(locale) },
  );
}

export function formatBookingTimeRange(
  startsAt: Date | string,
  endsAt: Date | string,
  timezone: string,
  locale: BookingLocale,
) {
  const timeFormat = locale === "es" ? "h:mm aaaa" : "h:mm a";
  const endTimeFormat = locale === "es" ? "h:mm aaaa zzz" : "h:mm a zzz";
  const value = `${formatInTimeZone(new Date(startsAt), timezone, timeFormat, {
    locale: dateFnsLocale(locale),
  })}–${formatInTimeZone(new Date(endsAt), timezone, endTimeFormat, {
    locale: dateFnsLocale(locale),
  })}`;

  return polishSpanishTime(value, locale);
}

export function formatBookingAppointmentWhen(
  startsAt: Date | string,
  timezone: string,
  locale: BookingLocale,
) {
  const value = formatInTimeZone(
    new Date(startsAt),
    timezone,
    locale === "es"
      ? "EEEE, d 'de' MMMM 'a las' h:mm aaaa zzz"
      : "EEEE, MMMM d 'at' h:mm a zzz",
    { locale: dateFnsLocale(locale) },
  );

  return polishSpanishTime(value, locale);
}

export function formatBookingSlotTime(
  startsAt: Date | string,
  timezone: string,
  locale: BookingLocale,
) {
  const value = formatInTimeZone(
    new Date(startsAt),
    timezone,
    locale === "es" ? "h:mm aaaa" : "h:mm a",
    { locale: dateFnsLocale(locale) },
  );

  return polishSpanishTime(value, locale);
}
