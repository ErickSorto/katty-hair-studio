import type { Metadata } from "next";
import BookingSection from "@/app/BookingSection";
import EditorialPageFrame from "@/app/EditorialPageFrame";
import { localizedAlternates } from "@/app/i18n/config";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";

export const metadata: Metadata = {
  title: "Book a Hair Appointment in Brentwood, MD | Katty",
  description:
    "Choose a Katty Hair Studio service, see live salon availability, and reserve your appointment in Brentwood, Maryland.",
  alternates: localizedAlternates("/booking", "en"),
};

export default function BookingPage() {
  return (
    <EditorialPageFrame
      className="editorial-booking-page booking-page-focused"
      showMobileActionBar={false}
    >
      <BookingSection mode="page" phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />
    </EditorialPageFrame>
  );
}
