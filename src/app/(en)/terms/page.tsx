import type { Metadata } from "next";
import PolicyPage, { type PolicySection } from "@/app/PolicyPage";
import { localizedAlternates } from "@/app/i18n/config";

export const metadata: Metadata = {
  title: "Terms of Service | Katty Hair Studio",
  description: "Terms for using Katty Hair Studio's website, online booking experience, appointment communications, and salon services.",
  alternates: localizedAlternates("/terms", "en"),
};

const sections: readonly PolicySection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    paragraphs: [
      "These Terms of Service govern your use of kattyhairstudio.com and its online appointment features. By using the website or submitting an appointment request, you agree to these terms and our Privacy Policy.",
      "If you do not agree, do not submit information through the booking experience. You may contact the studio by phone instead.",
    ],
  },
  {
    id: "appointments",
    title: "Appointment requests and confirmation",
    paragraphs: [
      "An appointment is reserved only after the booking system displays a confirmation or the studio confirms it directly. Availability may change while a request is being submitted.",
      "Clients select a service and appointment time rather than a specific team member. Katty Hair Studio coordinates the available team member internally, so an online booking does not guarantee a named stylist.",
    ],
  },
  {
    id: "services-and-pricing",
    title: "Services, timing, and pricing",
    paragraphs: [
      "Service descriptions, durations, and starting prices are estimates. Final timing and price may depend on hair length, density, condition, product needs, requested result, and consultation. The studio will communicate a final plan or quote when appropriate.",
      "Promotions, including the Monday $10-off offer, may be subject to eligibility, service availability, scheduling, and posted conditions. Discounts are applied by the salon and cannot be exchanged for cash.",
    ],
  },
  {
    id: "client-responsibilities",
    title: "Client responsibilities",
    paragraphs: ["You agree to provide accurate contact, service, and scheduling information and to disclose information reasonably needed to perform the requested service safely."],
    bullets: [
      "Arrive at the agreed time and follow preparation instructions provided by the studio.",
      "Contact the studio promptly if you are running late or cannot attend.",
      "Do not misuse the website, attempt fraudulent bookings, interfere with availability, or access another person's reservation.",
    ],
  },
  {
    id: "changes-and-cancellations",
    title: "Changes, cancellations, and missed appointments",
    paragraphs: [
      "Use the cancellation link in your confirmation, call the studio, or contact the studio as soon as possible if plans change. The studio may contact you to adjust an appointment when a service requires a consultation, a different duration, or another team member.",
      "Any deposit, late-cancellation, late-arrival, or no-show policy will be disclosed by the studio before it is charged or applied. The studio may decline or cancel repeated fraudulent, abusive, or disruptive booking activity.",
    ],
  },
  {
    id: "communications",
    title: "Email and SMS communications",
    paragraphs: [
      "By submitting a booking, you agree to receive necessary service emails such as confirmations, updates, and cancellation information. If you separately opt in to SMS, you agree to receive transactional appointment texts from Katty Hair Studio at the number provided.",
      "SMS frequency varies with your appointments. Message and data rates may apply. Reply STOP to opt out or HELP for assistance. SMS consent is optional, is not a condition of purchase, and applies only to the appointment communications described at the point of consent. Carriers are not liable for delayed or undelivered messages.",
    ],
  },
  {
    id: "payments",
    title: "Payments",
    paragraphs: [
      "The current online booking experience does not collect payment. Unless the studio tells you otherwise, payment is due directly to Katty Hair Studio at the time of service using a payment method accepted by the studio.",
    ],
  },
  {
    id: "website-content",
    title: "Website content and availability",
    paragraphs: [
      "Website photographs, branding, copy, and other content belong to Katty Hair Studio or are used with permission. They may not be copied or commercially reused without authorization.",
      "We work to keep the website accurate and available, but do not guarantee uninterrupted access or that every description, price, time, or image will always be current. We may update or discontinue features without notice.",
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers and limitation of liability",
    paragraphs: [
      "The website and booking tools are provided on an as-available basis to the extent permitted by law. Online information is general and does not replace an in-person consultation or professional assessment of whether a service is appropriate.",
      "To the extent permitted by law, Katty Hair Studio is not liable for indirect, incidental, special, or consequential losses arising solely from use of the website or an unavailable booking feature. Nothing in these terms excludes rights or responsibilities that cannot legally be excluded.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing law and changes",
    paragraphs: [
      "These terms are governed by the laws applicable in Maryland, without regard to conflict-of-law principles. We may update these terms when the booking service or studio policies change. The effective date at the top identifies the current version.",
    ],
  },
  {
    id: "contact-us",
    title: "Contact us",
    paragraphs: [
      "Katty Hair Studio, 3816 Bladensburg Road, Brentwood, Maryland 20722. Email kattyhairstudio@gmail.com or call (240) 582-6622 with questions about these terms, appointments, or communication preferences.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <PolicyPage
      description="The practical terms behind appointment requests, salon communications, pricing, and use of this website."
      eyebrow="Clear expectations from request to chair"
      sections={sections}
      title="Terms of Service"
    />
  );
}
