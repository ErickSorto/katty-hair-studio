import type { Metadata } from "next";
import PolicyPage, { type PolicySection } from "../PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Katty Hair Studio",
  description: "How Katty Hair Studio collects, uses, protects, and shares information for appointments, communications, and Google Calendar scheduling.",
  alternates: { canonical: "https://www.kattyhairstudio.com/privacy" },
};

const sections: readonly PolicySection[] = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: [
      "When you request or manage an appointment, we may collect your name, email address, phone number, requested service, appointment time, notes, SMS consent choice, and booking history.",
      "Our website and hosting providers may also process basic technical information such as IP address, browser type, device type, pages visited, and error or security logs.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "How we use information",
    paragraphs: ["We use information only to operate the studio and provide the experience you request."],
    bullets: [
      "Check availability, reserve appointments, and prevent double-booking.",
      "Send confirmations, updates, reminders, and cancellation information.",
      "Respond to questions and prepare for requested services.",
      "Protect the website, investigate errors, and maintain booking records.",
      "Meet legal, accounting, security, and compliance obligations.",
    ],
  },
  {
    id: "google-calendar-data",
    title: "Google Calendar data",
    paragraphs: [
      "Katty Hair Studio Booking connects to a Google account authorized by the salon owner. The connection may read calendar-list metadata, create one dedicated salon booking calendar, and see, create, change, or delete events only on calendars created by this application.",
      "Google Calendar data is used only to identify the application-created booking calendar, count appointment availability, create or cancel appointment events, and prevent overbooking. The application does not read event details from unrelated calendars or use Google user data for advertising, profiling, or sale.",
      "The Google refresh token is encrypted before storage. Access can be revoked at any time from the connected Google Account's third-party access settings or by contacting the studio.",
    ],
  },
  {
    id: "email-and-text-messages",
    title: "Email and text messages",
    paragraphs: [
      "Booking emails may be sent to the address you provide. If you separately check the SMS consent box, Katty Hair Studio may send transactional texts about your appointments and requested updates. Consent to texts is optional and is not a condition of purchasing a service.",
      "Message frequency varies with your appointments. Message and data rates may apply. Reply STOP to opt out or HELP for assistance. Mobile information and SMS opt-in consent are not sold, rented, or shared with third parties for their own marketing or promotional purposes.",
    ],
  },
  {
    id: "service-providers",
    title: "Service providers",
    paragraphs: [
      "We use vendors that process information on our behalf to operate this service. These may include Vercel for website hosting, Supabase for the booking database, Google Calendar for scheduling, Resend for transactional email, and Twilio for transactional SMS. Each provider processes information under its own terms and privacy practices.",
      "We may also disclose information when required by law, to protect people or the service, or as part of a business transfer. We do not sell personal information.",
    ],
  },
  {
    id: "retention-and-security",
    title: "Retention and security",
    paragraphs: [
      "We keep booking and communication records only as long as reasonably needed for studio operations, customer service, dispute resolution, legal obligations, and security. Retention periods may vary by record type.",
      "We use reasonable administrative and technical safeguards, including restricted server-side database access and encryption for stored Google authorization credentials. No internet service can guarantee absolute security.",
    ],
  },
  {
    id: "your-choices",
    title: "Your choices",
    paragraphs: [
      "You may ask to access, correct, or delete information associated with your booking, subject to records we must retain for legitimate business or legal reasons. You may also revoke Google access, unsubscribe from optional SMS messages, or ask us to stop nonessential email communications.",
      "To make a request, email kattyhairstudio@gmail.com or call (240) 582-6622. We may need to verify your identity before completing a request.",
    ],
  },
  {
    id: "children-and-changes",
    title: "Children and policy changes",
    paragraphs: [
      "This online booking service is not directed to children under 13. A parent or legal guardian should arrange appointments and provide information for a child.",
      "We may update this policy as the booking service or legal requirements change. The effective date at the top will show when the current version took effect.",
    ],
  },
  {
    id: "contact-us",
    title: "Contact us",
    paragraphs: [
      "Katty Hair Studio, 3816 Bladensburg Road, Brentwood, Maryland 20722. Email kattyhairstudio@gmail.com or call (240) 582-6622 with privacy questions or requests.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <PolicyPage
      description="A clear account of what the booking experience collects, why it is needed, and the choices you keep."
      eyebrow="Your information, handled with care"
      sections={sections}
      title="Privacy Policy"
    />
  );
}
