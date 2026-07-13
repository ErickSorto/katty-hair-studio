import { formatInTimeZone } from "date-fns-tz";
import { logNotificationDelivery } from "@/lib/booking/repository";

type BookingNotification = {
  bookingId: string;
  cancellationToken: string;
  confirmationCode: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  serviceName: string;
  smsConsent: boolean;
  startsAt: string;
  timezone: string;
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

function getCancellationUrl(booking: BookingNotification) {
  const siteUrl = process.env.SITE_URL?.trim();
  return siteUrl
    ? `${siteUrl.replace(/\/$/, "")}/booking/cancel?code=${encodeURIComponent(booking.confirmationCode)}&token=${encodeURIComponent(booking.cancellationToken)}`
    : undefined;
}

function appointmentWhen(booking: BookingNotification) {
  return formatInTimeZone(
    new Date(booking.startsAt),
    booking.timezone,
    "EEEE, MMMM d 'at' h:mm a zzz",
  );
}

async function sendConfirmationEmail(booking: BookingNotification) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.BOOKING_EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    return;
  }

  const when = appointmentWhen(booking);
  const cancellationUrl = getCancellationUrl(booking);
  const customerName = escapeHtml(booking.customerName);
  const serviceName = escapeHtml(booking.serviceName);
  const safeWhen = escapeHtml(when);
  const safeCode = escapeHtml(booking.confirmationCode);
  const safeCancellationUrl = cancellationUrl ? escapeHtml(cancellationUrl) : undefined;
  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from,
      html: `<h1>Your appointment is confirmed</h1>
<p>Hi ${customerName},</p>
<p>${serviceName} at Katty Hair Studio<br />${safeWhen}</p>
<p>Confirmation: <strong>${safeCode}</strong></p>
${safeCancellationUrl ? `<p><a href="${safeCancellationUrl}">Cancel this appointment</a></p>` : ""}`,
      subject: `Appointment confirmed — ${booking.confirmationCode}`,
      text: `Your ${booking.serviceName} appointment at Katty Hair Studio is confirmed for ${when}. Confirmation: ${booking.confirmationCode}.${cancellationUrl ? ` Cancel: ${cancellationUrl}` : ""}`,
      to: [booking.customerEmail],
    }),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `${booking.bookingId}-confirmation-email`,
    },
    method: "POST",
  });
  const result = (await response.json()) as { id?: string; message?: string };

  await logNotificationDelivery({
    bookingId: booking.bookingId,
    channel: "email",
    errorMessage: response.ok ? undefined : result.message || "Resend rejected the email.",
    providerMessageId: result.id,
    recipient: booking.customerEmail,
    status: response.ok ? "sent" : "failed",
    templateKey: "booking-confirmation",
  });
}

async function sendConfirmationSms(booking: BookingNotification) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();

  if (!booking.smsConsent || !booking.customerPhone || !accountSid || !authToken || !messagingServiceSid) {
    return;
  }

  const cancellationUrl = getCancellationUrl(booking);
  const form = new URLSearchParams({
    Body: `Katty Hair Studio: ${booking.serviceName}, ${appointmentWhen(booking)}. Confirmation ${booking.confirmationCode}.${cancellationUrl ? ` Cancel: ${cancellationUrl}` : ""} Reply STOP to opt out.`,
    MessagingServiceSid: messagingServiceSid,
    To: booking.customerPhone,
  });
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`,
    {
      body: form,
      cache: "no-store",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    },
  );
  const result = (await response.json()) as { message?: string; sid?: string };

  await logNotificationDelivery({
    bookingId: booking.bookingId,
    channel: "sms",
    errorMessage: response.ok ? undefined : result.message || "Twilio rejected the SMS.",
    providerMessageId: result.sid,
    recipient: booking.customerPhone,
    status: response.ok ? "sent" : "failed",
    templateKey: "booking-confirmation",
  });
}

export async function sendBookingConfirmation(booking: BookingNotification) {
  const results = await Promise.allSettled([
    sendConfirmationEmail(booking),
    sendConfirmationSms(booking),
  ]);

  return results.map((result) =>
    result.status === "fulfilled" ? { ok: true } : { error: String(result.reason), ok: false },
  );
}
