import { formatInTimeZone } from "date-fns-tz";
import { logNotificationDelivery } from "@/lib/booking/repository";
import {
  renderClientBookingEmail,
  renderOwnerBookingEmail,
  type BookingEmailDetails,
} from "@/lib/booking/email-templates";

type BookingNotification = BookingEmailDetails;

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
    sendClientConfirmationEmail(booking),
    sendOwnerNotificationEmail(booking),
    sendConfirmationSms(booking),
  ]);

  return results.map((result) =>
    result.status === "fulfilled" ? { ok: true } : { error: String(result.reason), ok: false },
  );
}
