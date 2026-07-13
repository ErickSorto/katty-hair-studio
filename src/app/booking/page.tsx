import type { Metadata } from "next";
import BookingSection from "../BookingSection";
import EditorialPageFrame from "../EditorialPageFrame";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";

export const metadata: Metadata = {
  title: "Book a Hair Appointment in Brentwood, MD | Katty",
  description:
    "Choose a Katty Hair Studio service, see live salon availability, and reserve your appointment in Brentwood, Maryland.",
  alternates: { canonical: "https://www.kattyhairstudio.com/booking" },
};

export default function BookingPage() {
  return (
    <EditorialPageFrame className="editorial-booking-page booking-page-focused">
      <BookingSection mode="page" phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />
    </EditorialPageFrame>
  );
}
