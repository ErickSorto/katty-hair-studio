import type { Metadata } from "next";
import { CalendarCheck, ClipboardCheck, Image as ImageIcon } from "lucide-react";
import BookingSection from "../BookingSection";
import EditorialPageFrame from "../EditorialPageFrame";
import EditorialPageHero from "../EditorialPageHero";
import LocationSection from "../LocationSection";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";

export const metadata: Metadata = {
  title: "Reserve a Hair Appointment in Brentwood, MD | Katty",
  description:
    "Request a Katty Hair Studio appointment in Brentwood, MD. Choose your service, stylist, date, and available time, then receive confirmation details.",
  alternates: { canonical: "https://www.kattyhairstudio.com/booking" },
};

const bookingSteps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Choose the closest service",
    detail: "Select the service that best matches your goal. Final timing and pricing are confirmed from your hair and reference.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Choose an available time",
    detail: "The form checks configured availability before an appointment can be confirmed.",
  },
  {
    icon: ImageIcon,
    step: "03",
    title: "Bring the full picture",
    detail: "Share your reference, current hair condition, recent color or extension history, and desired maintenance level.",
  },
] as const;

export default function BookingPage() {
  return (
    <EditorialPageFrame className="editorial-booking-page">
      <EditorialPageHero
        description="Choose your service, stylist, and available time. Your plan and quote are confirmed with your actual hair goals in mind."
        eyebrow="Reservations"
        image="/editorial/katty-client-plan-result-v2.webp"
        imageAlt="Katty Hair Studio client with long polished waves ready to plan an appointment"
        imagePosition="58% 42%"
        pageLabel="Booking"
        primaryHref="#booking"
        primaryLabel="Start reservation"
        title="Reserve time for your next look."
      />

      <BookingSection phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />

      <section className="booking-guide-section" data-reveal>
        <div className="editorial-section-heading editorial-section-heading-light">
          <p className="eyebrow">How to prepare</p>
          <h2>Three details make the request more useful.</h2>
        </div>
        <div className="booking-guide-list">
          {bookingSteps.map((item) => (
            <article key={item.step}>
              <span>{item.step}</span>
              <item.icon aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <LocationSection />
    </EditorialPageFrame>
  );
}
