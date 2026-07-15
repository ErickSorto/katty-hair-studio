import type { Metadata } from "next";
import BookingSection from "@/app/BookingSection";
import EditorialPageFrame from "@/app/EditorialPageFrame";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const title = "Book a Hair Appointment in Brentwood, MD | Katty Hair Studio";
const description =
  "Choose a Katty Hair Studio service, see live salon availability, and reserve your appointment in Brentwood, Maryland.";
const canonical = absoluteLocalizedUrl("/booking", "en");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/booking", "en"),
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "en_US",
    alternateLocale: ["es_US"],
    images: [{ url: "/social/katty-share-preview.webp", width: 1200, height: 630, alt: "Book an appointment at Katty Hair Studio" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/social/katty-share-preview.webp"] },
};

export default function BookingPage() {
  return (
    <EditorialPageFrame
      className="editorial-booking-page booking-page-focused"
      showMobileActionBar={false}
    >
      <BookingSection
        mode="page"
        pageHeading="Book a Hair Appointment in Brentwood, MD"
        phoneDisplay={phoneDisplay}
        phoneNumber={phoneNumber}
      />
    </EditorialPageFrame>
  );
}
