import assert from "node:assert/strict";
import {
  renderClientBookingEmail,
  renderOwnerBookingEmail,
  type BookingEmailDetails,
} from "../src/lib/booking/email-templates";
import { renderBookingConfirmationSmsBody } from "../src/lib/booking/notifications";

process.env.SITE_URL = "https://www.kattyhairstudio.com";

const booking: BookingEmailDetails = {
  bookingId: "11111111-1111-4111-8111-111111111111",
  cancellationToken: "test-cancellation-token-with-enough-characters",
  confirmationCode: "KHS-A1B2C3",
  customerEmail: "maria@example.com",
  customerLocale: "es",
  customerName: "María Rivera",
  customerNotes: "Quiero capas largas y conservar el volumen.",
  customerPhone: "+12405550123",
  endsAt: "2026-07-20T15:30:00-04:00",
  salonAddress: "3816 Bladensburg Rd, Brentwood, MD 20722",
  salonEmail: "kattyhairstudio@gmail.com",
  salonName: "Katty Hair Studio",
  salonPhone: "+12405826622",
  serviceName: "Color or highlights",
  serviceSlug: "color-highlights",
  smsConsent: true,
  startsAt: "2026-07-20T14:00:00-04:00",
  timezone: "America/New_York",
};

const customerEmail = renderClientBookingEmail(booking);
const ownerEmail = renderOwnerBookingEmail(booking);
const sms = renderBookingConfirmationSmsBody(booking);

assert.match(customerEmail.html, /<html lang="es">/);
assert.match(customerEmail.html, /Coloración o mechas/);
assert.match(customerEmail.html, /lunes, 20 de julio de 2026/);
assert.match(customerEmail.html, /Cancelar esta cita en línea/);
assert.match(customerEmail.text, /\/es\/booking\/cancel\?/);
assert.match(customerEmail.text, /Confirmación: KHS-A1B2C3/);
assert.match(customerEmail.subject, /^Tu cita en Katty Hair Studio está confirmada/);

assert.match(ownerEmail.html, /<html lang="en">/);
assert.match(ownerEmail.html, /Color or highlights/);
assert.doesNotMatch(ownerEmail.html, /Coloración o mechas/);
assert.match(ownerEmail.text, /Monday, July 20, 2026/);
assert.match(ownerEmail.text, /Quiero capas largas y conservar el volumen\./);
assert.match(ownerEmail.subject, /^New booking: María Rivera — Color or highlights$/);

assert.match(sms, /Coloración o mechas/);
assert.match(sms, /Confirmación KHS-A1B2C3/);
assert.match(sms, /\/es\/booking\/cancel\?/);
assert.match(sms, /Responde STOP para dejar de recibir mensajes\./);

const englishCustomerEmail = renderClientBookingEmail({
  ...booking,
  customerLocale: "en",
});

assert.match(englishCustomerEmail.html, /<html lang="en">/);
assert.match(englishCustomerEmail.text, /\/booking\/cancel\?/);
assert.doesNotMatch(englishCustomerEmail.text, /\/es\/booking\/cancel\?/);

console.log("Booking localization render checks passed.");
