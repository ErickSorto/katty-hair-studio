import {
  formatBookingDate,
  formatBookingTimeRange,
  getLocalizedBookingServiceName,
  type BookingLocale,
} from "@/lib/booking/localization";

export type BookingEmailDetails = {
  bookingId: string;
  cancellationToken: string;
  confirmationCode: string;
  customerEmail: string;
  customerLocale: BookingLocale;
  customerName: string;
  customerNotes?: string;
  customerPhone?: string;
  endsAt: string;
  googleEventLink?: string;
  salonAddress: string;
  salonEmail: string;
  salonName: string;
  salonPhone: string;
  serviceName: string;
  serviceSlug: string;
  smsConsent: boolean;
  startsAt: string;
  timezone: string;
};

type RenderedEmail = {
  html: string;
  subject: string;
  text: string;
};

const colors = {
  accent: "#A92D50",
  blush: "#F4C8D0",
  brass: "#C19365",
  canvas: "#FCEFF2",
  ink: "#331B26",
  line: "#E9CED7",
  muted: "#765E68",
  paper: "#FFFEFD",
  peach: "#FFF7F8",
  wine: "#591333",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "'": "&#39;",
      '"': "&quot;",
      "<": "&lt;",
      ">": "&gt;",
    };

    return entities[character];
  });
}

function withLineBreaks(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

function siteUrl() {
  return (process.env.SITE_URL?.trim() || "https://www.kattyhairstudio.com").replace(
    /\/$/,
    "",
  );
}

function cancellationUrl(booking: BookingEmailDetails) {
  const pathname = booking.customerLocale === "es" ? "/es/booking/cancel" : "/booking/cancel";
  return `${siteUrl()}${pathname}?code=${encodeURIComponent(booking.confirmationCode)}&token=${encodeURIComponent(booking.cancellationToken)}`;
}

function calendarUrl(
  booking: BookingEmailDetails,
  locale: BookingLocale,
  serviceName: string,
) {
  const toCalendarDate = (value: string) =>
    new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    dates: `${toCalendarDate(booking.startsAt)}/${toCalendarDate(booking.endsAt)}`,
    details:
      locale === "es"
        ? `${serviceName} en ${booking.salonName}. Confirmación ${booking.confirmationCode}.`
        : `${serviceName} at ${booking.salonName}. Confirmation ${booking.confirmationCode}.`,
    location: booking.salonAddress,
    text: `${serviceName} — ${booking.salonName}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function directionsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function formatPhone(phone?: string, locale: BookingLocale = "en") {
  if (!phone) return locale === "es" ? "No proporcionado" : "Not provided";

  const digits = phone.replace(/\D/g, "");
  const localDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (localDigits.length === 10) {
    return `(${localDigits.slice(0, 3)}) ${localDigits.slice(3, 6)}-${localDigits.slice(6)}`;
  }

  return phone;
}

function appointmentParts(booking: BookingEmailDetails, locale: BookingLocale) {
  return {
    date: formatBookingDate(
      booking.startsAt,
      booking.timezone,
      locale,
    ),
    time: formatBookingTimeRange(
      booking.startsAt,
      booking.endsAt,
      booking.timezone,
      locale,
    ),
  };
}

function detailRow(label: string, value: string, options?: { href?: string; last?: boolean }) {
  const content = options?.href
    ? `<a href="${escapeHtml(options.href)}" style="color:${colors.wine};font-weight:700;text-decoration:underline;text-decoration-color:${colors.blush};text-underline-offset:3px;">${escapeHtml(value)}</a>`
    : escapeHtml(value);

  return `<tr>
    <td valign="top" style="width:34%;padding:14px 0;${options?.last ? "" : `border-bottom:1px solid ${colors.line};`}font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:${colors.muted};">${escapeHtml(label)}</td>
    <td valign="top" style="padding:14px 0;${options?.last ? "" : `border-bottom:1px solid ${colors.line};`}font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:${colors.ink};">${content}</td>
  </tr>`;
}

function button(label: string, href: string, secondary = false) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="display:inline-table;margin:0 8px 8px 0;">
    <tr>
      <td style="border-radius:5px;background:${secondary ? colors.paper : colors.wine};border:1px solid ${colors.wine};">
        <a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 19px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-weight:700;letter-spacing:.7px;text-decoration:none;text-transform:uppercase;color:${secondary ? colors.wine : colors.paper};">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;
}

function header(label: string) {
  const crestUrl = `${siteUrl()}/brand/katty-official-crest.png`;

  return `<tr>
    <td style="padding:22px 28px;background:${colors.wine};">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td valign="middle" style="width:58px;">
            <img src="${escapeHtml(crestUrl)}" width="48" height="48" alt="" style="display:block;width:48px;height:48px;border:0;" />
          </td>
          <td valign="middle" style="font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:24px;letter-spacing:.2px;color:${colors.paper};">Katty Hair Studio</td>
          <td valign="middle" align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:15px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${colors.blush};">${escapeHtml(label)}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function shell({
  preheader,
  body,
  label,
  locale,
}: {
  preheader: string;
  body: string;
  label: string;
  locale: BookingLocale;
}) {
  const transactionalNotice =
    locale === "es"
      ? "Este es un mensaje transaccional sobre una cita reservada en kattyhairstudio.com."
      : "This is a transactional message about an appointment made at kattyhairstudio.com.";

  return `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(preheader)}</title>
  </head>
  <body style="margin:0;padding:0;background:${colors.canvas};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0;background:${colors.canvas};">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:${colors.paper};border:1px solid ${colors.line};border-radius:8px;overflow:hidden;">
            ${header(label)}
            ${body}
            <tr>
              <td align="center" style="padding:22px 28px;background:${colors.peach};border-top:1px solid ${colors.line};font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:18px;color:${colors.muted};">
                ${escapeHtml("Katty Hair Studio · 3816 Bladensburg Rd, Brentwood, MD 20722")}<br />
                ${escapeHtml(transactionalNotice)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderOwnerBookingEmail(booking: BookingEmailDetails): RenderedEmail {
  const { date, time } = appointmentParts(booking, "en");
  const displayPhone = formatPhone(booking.customerPhone, "en");
  const notes = booking.customerNotes?.trim() || "No notes were added.";
  const eventUrl = booking.googleEventLink || calendarUrl(booking, "en", booking.serviceName);
  const body = `<tr>
    <td style="padding:38px 34px 18px;">
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${colors.accent};">New online reservation</p>
      <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:40px;font-weight:400;color:${colors.ink};">${escapeHtml(booking.customerName)} just booked.</h1>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:25px;color:${colors.muted};">Everything the salon needs to prepare for this visit is below.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:6px 34px 22px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
        ${detailRow("Service", booking.serviceName)}
        ${detailRow("Date", date)}
        ${detailRow("Time", time)}
        ${detailRow("Client", booking.customerName)}
        ${detailRow("Email", booking.customerEmail, { href: `mailto:${booking.customerEmail}` })}
        ${detailRow("Phone", displayPhone, booking.customerPhone ? { href: phoneHref(booking.customerPhone) } : undefined)}
        ${detailRow("Confirmation", booking.confirmationCode, { last: true })}
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 34px 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:${colors.peach};border-left:4px solid ${colors.brass};">
        <tr>
          <td style="padding:18px 20px;">
            <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:15px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${colors.accent};">Client notes</p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:${colors.ink};">${withLineBreaks(notes)}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 34px 34px;">
      ${button("Email client", `mailto:${booking.customerEmail}`)}
      ${booking.customerPhone ? button("Call client", phoneHref(booking.customerPhone), true) : ""}
      ${button("View calendar", eventUrl, true)}
    </td>
  </tr>`;

  return {
    html: shell({
      body,
      label: "Salon notification",
      locale: "en",
      preheader: `${booking.customerName} booked ${booking.serviceName} for ${date} at ${time}.`,
    }),
    subject: `New booking: ${booking.customerName} — ${booking.serviceName}`,
    text: [
      "NEW ONLINE RESERVATION",
      "",
      `${booking.customerName} booked at ${booking.salonName}.`,
      "",
      `Service: ${booking.serviceName}`,
      `Date: ${date}`,
      `Time: ${time}`,
      `Client: ${booking.customerName}`,
      `Email: ${booking.customerEmail}`,
      `Phone: ${displayPhone}`,
      `Confirmation: ${booking.confirmationCode}`,
      "",
      "Client notes:",
      notes,
      "",
      `Calendar: ${eventUrl}`,
    ].join("\n"),
  };
}

export function renderClientBookingEmail(booking: BookingEmailDetails): RenderedEmail {
  const locale = booking.customerLocale;
  const spanish = locale === "es";
  const { date, time } = appointmentParts(booking, locale);
  const serviceName = getLocalizedBookingServiceName(
    booking.serviceSlug,
    booking.serviceName,
    locale,
  );
  const heroUrl = `${siteUrl()}/email/katty-salon-booking-hero.jpg`;
  const cancelUrl = cancellationUrl(booking);
  const calendarInvitationUrl =
    booking.googleEventLink || calendarUrl(booking, locale, serviceName);
  const calendarButtonLabel = booking.googleEventLink
    ? spanish
      ? "Ver invitación del calendario"
      : "View calendar invitation"
    : spanish
      ? "Agregar al calendario"
      : "Add to calendar";
  const mapUrl = directionsUrl(booking.salonAddress);
  const copy = spanish
    ? {
        cancel: "Cancelar esta cita en línea",
        changePlans: "¿Necesitas cambiar tus planes?",
        confirmation: "Confirmación",
        date: "Fecha",
        directions: "Cómo llegar",
        googleInvitation:
          "Google también enviará una invitación de calendario por separado. Si es tu primera cita, es posible que se te pida confirmar a Katty Hair Studio como remitente.",
        heroAlt: "El acogedor interior rosado de Katty Hair Studio",
        kicker: "Cita confirmada",
        lead:
          "Tu horario está reservado. Ven a relajarte; nosotros nos encargamos del resto.",
        phone: "Teléfono",
        questionsAfterPhone: "o responde a este correo.",
        questionsBeforePhone: "¿Tienes preguntas? Llama al",
        reservationConfirmed: "Reserva confirmada",
        service: "Servicio",
        time: "Hora",
        yourService: "Tu servicio",
      }
    : {
        cancel: "Cancel this appointment online",
        changePlans: "Need to change your plans?",
        confirmation: "Confirmation",
        date: "Date",
        directions: "Get directions",
        googleInvitation:
          "Google will also send a separate calendar invitation. First-time guests may be asked to confirm Katty Hair Studio as the sender.",
        heroAlt: "The warm pink interior of Katty Hair Studio",
        kicker: "Appointment confirmed",
        lead: "Your time is reserved. Come ready to relax—we’ll take care of the rest.",
        phone: "Phone",
        questionsAfterPhone: "or reply to this email.",
        questionsBeforePhone: "Questions? Call",
        reservationConfirmed: "Reservation confirmed",
        service: "Service",
        time: "Time",
        yourService: "Your service",
      };
  const body = `<tr>
    <td>
      <img src="${escapeHtml(heroUrl)}" width="640" alt="${escapeHtml(copy.heroAlt)}" style="display:block;width:100%;max-width:640px;height:auto;border:0;" />
    </td>
  </tr>
  <tr>
    <td style="padding:38px 34px 18px;">
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${colors.accent};">${escapeHtml(copy.kicker)} · ${escapeHtml(booking.confirmationCode)}</p>
      <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:42px;font-weight:400;color:${colors.ink};">${spanish ? "Te esperamos pronto" : "We’ll see you soon"}, ${escapeHtml(booking.customerName)}.</h1>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:${colors.muted};">${escapeHtml(copy.lead)}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 34px 26px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:${colors.peach};border-top:3px solid ${colors.accent};">
        <tr>
          <td style="padding:23px 24px;">
            <p style="margin:0 0 5px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${colors.accent};">${escapeHtml(copy.yourService)}</p>
            <p style="margin:0 0 19px;font-family:Georgia,'Times New Roman',serif;font-size:25px;line-height:31px;color:${colors.ink};">${escapeHtml(serviceName)}</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td valign="top" style="width:50%;padding-right:10px;">
                  <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:15px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${colors.muted};">${escapeHtml(copy.date)}</p>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;font-weight:700;color:${colors.ink};">${escapeHtml(date)}</p>
                </td>
                <td valign="top" style="width:50%;padding-left:10px;border-left:1px solid ${colors.line};">
                  <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:15px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${colors.muted};">${escapeHtml(copy.time)}</p>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;font-weight:700;color:${colors.ink};">${escapeHtml(time)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 34px 20px;">
      ${button(calendarButtonLabel, calendarInvitationUrl)}
      ${button(copy.directions, mapUrl, true)}
    </td>
  </tr>
  <tr>
    <td style="padding:0 34px 24px;">
      <p style="margin:0;padding:14px 16px;background:${colors.canvas};border-radius:6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:${colors.muted};">${escapeHtml(copy.googleInvitation)}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:4px 34px 28px;">
      <p style="margin:0 0 7px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:${colors.accent};">Katty Hair Studio</p>
      <p style="margin:0 0 5px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:${colors.ink};">${escapeHtml(booking.salonAddress)}</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${colors.muted};">${escapeHtml(copy.questionsBeforePhone)} <a href="${escapeHtml(phoneHref(booking.salonPhone))}" style="color:${colors.wine};font-weight:700;">${escapeHtml(formatPhone(booking.salonPhone, locale))}</a> ${escapeHtml(copy.questionsAfterPhone)}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 34px 30px;border-top:1px solid ${colors.line};">
      <p style="margin:0 0 7px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:${colors.muted};">${escapeHtml(copy.changePlans)}</p>
      <a href="${escapeHtml(cancelUrl)}" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;font-weight:700;color:${colors.wine};">${escapeHtml(copy.cancel)}</a>
    </td>
  </tr>`;

  return {
    html: shell({
      body,
      label: copy.reservationConfirmed,
      locale,
      preheader: spanish
        ? `Tu cita de ${serviceName} está confirmada para el ${date}, de ${time}.`
        : `${serviceName} is confirmed for ${date} at ${time}.`,
    }),
    subject: spanish
      ? `Tu cita en Katty Hair Studio está confirmada — ${date}`
      : `You’re confirmed at Katty Hair Studio — ${date}`,
    text: [
      spanish
        ? `TE ESPERAMOS PRONTO, ${booking.customerName.toUpperCase()}.`
        : `WE'LL SEE YOU SOON, ${booking.customerName.toUpperCase()}.`,
      "",
      spanish
        ? `Tu cita en ${booking.salonName} está confirmada.`
        : `Your appointment at ${booking.salonName} is confirmed.`,
      "",
      `${copy.service}: ${serviceName}`,
      `${copy.date}: ${date}`,
      `${copy.time}: ${time}`,
      `${copy.confirmation}: ${booking.confirmationCode}`,
      "",
      booking.salonAddress,
      `${copy.phone}: ${formatPhone(booking.salonPhone, locale)}`,
      "",
      `${spanish ? "Invitación del calendario" : "Calendar invitation"}: ${calendarInvitationUrl}`,
      `${spanish ? "Cómo llegar" : "Directions"}: ${mapUrl}`,
      `${spanish ? "Cancelar" : "Cancel"}: ${cancelUrl}`,
    ].join("\n"),
  };
}
