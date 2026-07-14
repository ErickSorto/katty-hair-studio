import { formatInTimeZone } from "date-fns-tz";

export type BookingEmailDetails = {
  bookingId: string;
  cancellationToken: string;
  confirmationCode: string;
  customerEmail: string;
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
  return `${siteUrl()}/booking/cancel?code=${encodeURIComponent(booking.confirmationCode)}&token=${encodeURIComponent(booking.cancellationToken)}`;
}

function calendarUrl(booking: BookingEmailDetails) {
  const toCalendarDate = (value: string) =>
    new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    dates: `${toCalendarDate(booking.startsAt)}/${toCalendarDate(booking.endsAt)}`,
    details: `${booking.serviceName} at ${booking.salonName}. Confirmation ${booking.confirmationCode}.`,
    location: booking.salonAddress,
    text: `${booking.serviceName} — ${booking.salonName}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function directionsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function formatPhone(phone?: string) {
  if (!phone) return "Not provided";

  const digits = phone.replace(/\D/g, "");
  const localDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (localDigits.length === 10) {
    return `(${localDigits.slice(0, 3)}) ${localDigits.slice(3, 6)}-${localDigits.slice(6)}`;
  }

  return phone;
}

function appointmentParts(booking: BookingEmailDetails) {
  return {
    date: formatInTimeZone(
      new Date(booking.startsAt),
      booking.timezone,
      "EEEE, MMMM d, yyyy",
    ),
    time: `${formatInTimeZone(new Date(booking.startsAt), booking.timezone, "h:mm a")}–${formatInTimeZone(new Date(booking.endsAt), booking.timezone, "h:mm a zzz")}`,
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

function shell({ preheader, body, label }: { preheader: string; body: string; label: string }) {
  return `<!doctype html>
<html lang="en">
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
                This is a transactional message about an appointment made at kattyhairstudio.com.
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
  const { date, time } = appointmentParts(booking);
  const displayPhone = formatPhone(booking.customerPhone);
  const notes = booking.customerNotes?.trim() || "No notes were added.";
  const eventUrl = booking.googleEventLink || calendarUrl(booking);
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
  const { date, time } = appointmentParts(booking);
  const heroUrl = `${siteUrl()}/email/katty-salon-booking-hero.jpg`;
  const cancelUrl = cancellationUrl(booking);
  const calendarInvitationUrl = booking.googleEventLink || calendarUrl(booking);
  const calendarButtonLabel = booking.googleEventLink
    ? "View calendar invitation"
    : "Add to calendar";
  const mapUrl = directionsUrl(booking.salonAddress);
  const body = `<tr>
    <td>
      <img src="${escapeHtml(heroUrl)}" width="640" alt="The warm pink interior of Katty Hair Studio" style="display:block;width:100%;max-width:640px;height:auto;border:0;" />
    </td>
  </tr>
  <tr>
    <td style="padding:38px 34px 18px;">
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${colors.accent};">Appointment confirmed · ${escapeHtml(booking.confirmationCode)}</p>
      <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:42px;font-weight:400;color:${colors.ink};">We’ll see you soon, ${escapeHtml(booking.customerName)}.</h1>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:${colors.muted};">Your time is reserved. Come ready to relax—we’ll take care of the rest.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 34px 26px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:${colors.peach};border-top:3px solid ${colors.accent};">
        <tr>
          <td style="padding:23px 24px;">
            <p style="margin:0 0 5px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${colors.accent};">Your service</p>
            <p style="margin:0 0 19px;font-family:Georgia,'Times New Roman',serif;font-size:25px;line-height:31px;color:${colors.ink};">${escapeHtml(booking.serviceName)}</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td valign="top" style="width:50%;padding-right:10px;">
                  <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:15px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${colors.muted};">Date</p>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;font-weight:700;color:${colors.ink};">${escapeHtml(date)}</p>
                </td>
                <td valign="top" style="width:50%;padding-left:10px;border-left:1px solid ${colors.line};">
                  <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:15px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${colors.muted};">Time</p>
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
      ${button("Get directions", mapUrl, true)}
    </td>
  </tr>
  <tr>
    <td style="padding:0 34px 24px;">
      <p style="margin:0;padding:14px 16px;background:${colors.canvas};border-radius:6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:${colors.muted};">Google will also send a separate calendar invitation. First-time guests may be asked to confirm Katty Hair Studio as the sender.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:4px 34px 28px;">
      <p style="margin:0 0 7px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:${colors.accent};">Katty Hair Studio</p>
      <p style="margin:0 0 5px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:${colors.ink};">${escapeHtml(booking.salonAddress)}</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${colors.muted};">Questions? Call <a href="${escapeHtml(phoneHref(booking.salonPhone))}" style="color:${colors.wine};font-weight:700;">${escapeHtml(formatPhone(booking.salonPhone))}</a> or reply to this email.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 34px 30px;border-top:1px solid ${colors.line};">
      <p style="margin:0 0 7px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:${colors.muted};">Need to change your plans?</p>
      <a href="${escapeHtml(cancelUrl)}" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;font-weight:700;color:${colors.wine};">Cancel this appointment online</a>
    </td>
  </tr>`;

  return {
    html: shell({
      body,
      label: "Reservation confirmed",
      preheader: `${booking.serviceName} is confirmed for ${date} at ${time}.`,
    }),
    subject: `You’re confirmed at Katty Hair Studio — ${date}`,
    text: [
      `WE'LL SEE YOU SOON, ${booking.customerName.toUpperCase()}.`,
      "",
      `Your appointment at ${booking.salonName} is confirmed.`,
      "",
      `Service: ${booking.serviceName}`,
      `Date: ${date}`,
      `Time: ${time}`,
      `Confirmation: ${booking.confirmationCode}`,
      "",
      booking.salonAddress,
      `Phone: ${formatPhone(booking.salonPhone)}`,
      "",
      `Calendar invitation: ${calendarInvitationUrl}`,
      `Directions: ${mapUrl}`,
      `Cancel: ${cancelUrl}`,
    ].join("\n"),
  };
}
