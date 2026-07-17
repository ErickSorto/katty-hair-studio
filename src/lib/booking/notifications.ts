import { logNotificationDelivery } from "@/lib/booking/repository";
import {
  formatBookingAppointmentWhen,
  getLocalizedBookingServiceName,
} from "@/lib/booking/localization";
import {
  renderClientBookingEmail,
  renderOwnerBookingEmail,
  type BookingEmailDetails,
} from "@/lib/booking/email-templates";

export type BookingNotification = BookingEmailDetails;

function getCancellationUrl(booking: BookingNotification) {
  const siteUrl =
    process.env.SITE_URL?.trim() || "https://www.kattyhairstudio.com";
  const pathname =
    booking.customerLocale === "es" ? "/es/booking/cancel" : "/booking/cancel";
  return `${siteUrl.replace(/\/$/, "")}${pathname}?code=${encodeURIComponent(booking.confirmationCode)}&token=${encodeURIComponent(booking.cancellationToken)}`;
}

function appointmentWhen(booking: BookingNotification) {
  return formatBookingAppointmentWhen(
    booking.startsAt,
    booking.timezone,
    booking.customerLocale,
  );
}

export function renderBookingConfirmationSmsBody(booking: BookingNotification) {
  const cancellationUrl = getCancellationUrl(booking);
  const serviceName = getLocalizedBookingServiceName(
    booking.serviceSlug,
    booking.serviceName,
    booking.customerLocale,
  );

  return booking.customerLocale === "es"
    ? `Katty Hair Studio: ${serviceName}, ${appointmentWhen(booking)}. Confirmación ${booking.confirmationCode}.${cancellationUrl ? ` Cancelar: ${cancellationUrl}` : ""} Responde STOP para dejar de recibir mensajes.`
    : `Katty Hair Studio: ${serviceName}, ${appointmentWhen(booking)}. Confirmation ${booking.confirmationCode}.${cancellationUrl ? ` Cancel: ${cancellationUrl}` : ""} Reply STOP to opt out.`;
}

export function renderOwnerBookingSmsBody(booking: BookingNotification) {
  const when = formatBookingAppointmentWhen(
    booking.startsAt,
    booking.timezone,
    "en",
  );
  const phone = booking.customerPhone || "No phone provided";

  return `New Katty Hair Studio booking: ${booking.customerName} — ${booking.serviceName}, ${when}. Client: ${phone}. Confirmation ${booking.confirmationCode}. Check Google Calendar for details.`;
}

async function sendResendEmail({
  booking,
  recipient,
  replyTo,
  templateKey,
  email,
}: {
  booking: BookingNotification;
  recipient: string;
  replyTo: string;
  templateKey: string;
  email: { html: string; subject: string; text: string };
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.BOOKING_EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from,
      html: email.html,
      reply_to: replyTo,
      subject: email.subject,
      text: email.text,
      to: [recipient],
    }),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `${templateKey}/${booking.bookingId}`,
      "User-Agent": "katty-hair-studio-booking/1.0",
    },
    method: "POST",
  });
  const result = (await response.json()) as { id?: string; message?: string };

  await logNotificationDelivery({
    bookingId: booking.bookingId,
    channel: "email",
    errorMessage: response.ok ? undefined : result.message || "Resend rejected the email.",
    providerMessageId: result.id,
    recipient,
    status: response.ok ? "sent" : "failed",
    templateKey,
  });

  if (!response.ok) {
    throw new Error(result.message || `Resend rejected ${templateKey}.`);
  }
}

async function sendClientConfirmationEmail(booking: BookingNotification) {
  await sendResendEmail({
    booking,
    email: renderClientBookingEmail(booking),
    recipient: booking.customerEmail,
    replyTo: booking.salonEmail,
    templateKey: "booking-client-confirmation",
  });
}

async function sendOwnerNotificationEmail(booking: BookingNotification) {
  const ownerEmail = process.env.BOOKING_OWNER_EMAIL?.trim() || booking.salonEmail;

  await sendResendEmail({
    booking,
    email: renderOwnerBookingEmail(booking),
    recipient: ownerEmail,
    replyTo: booking.customerEmail,
    templateKey: "booking-owner-notification",
  });
}

async function sendTwilioSms({
  booking,
  body,
  recipient,
  templateKey,
}: {
  booking: BookingNotification;
  body: string;
  recipient: string;
  templateKey: string;
}) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER?.trim();

  if (
    !accountSid ||
    !authToken ||
    (!messagingServiceSid && !phoneNumber)
  ) {
    return;
  }

  const form = new URLSearchParams({
    Body: body,
    To: recipient,
  });

  if (messagingServiceSid) {
    form.set("MessagingServiceSid", messagingServiceSid);
  } else if (phoneNumber) {
    form.set("From", phoneNumber);
  }

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
    recipient,
    status: response.ok ? "sent" : "failed",
    templateKey,
  });

  if (!response.ok) {
    throw new Error(result.message || "Twilio rejected the booking confirmation SMS.");
  }
}

async function sendClientConfirmationSms(booking: BookingNotification) {
  if (!booking.smsConsent || !booking.customerPhone) {
    return;
  }

  await sendTwilioSms({
    booking,
    body: renderBookingConfirmationSmsBody(booking),
    recipient: booking.customerPhone,
    templateKey: "booking-client-confirmation",
  });
}

async function sendOwnerNotificationSms(booking: BookingNotification) {
  const ownerPhone = process.env.BOOKING_OWNER_PHONE?.trim();

  if (!ownerPhone) {
    return;
  }

  await sendTwilioSms({
    booking,
    body: renderOwnerBookingSmsBody(booking),
    recipient: ownerPhone,
    templateKey: "booking-owner-notification",
  });
}

export async function sendBookingConfirmation(booking: BookingNotification) {
  const results = await Promise.allSettled([
    sendClientConfirmationEmail(booking),
    sendOwnerNotificationEmail(booking),
    sendClientConfirmationSms(booking),
    sendOwnerNotificationSms(booking),
  ]);

  return results.map((result) =>
    result.status === "fulfilled" ? { ok: true } : { error: String(result.reason), ok: false },
  );
}
