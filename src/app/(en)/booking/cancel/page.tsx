import type { Metadata } from "next";
import BookingCancellationPage from "@/app/BookingCancellationPage";
import EditorialPageFrame from "@/app/EditorialPageFrame";
import {
  absoluteLocalizedUrl,
  localizedAlternates,
} from "@/app/i18n/config";

const title = "Cancel your appointment | Katty Hair Studio";
const description =
  "Use your private Katty Hair Studio confirmation link to cancel an appointment online.";
const canonical = absoluteLocalizedUrl("/booking/cancel", "en");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/booking/cancel", "en"),
  robots: { follow: false, index: false },
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "en_US",
    alternateLocale: ["es_US"],
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function EnglishBookingCancellationPage() {
  return (
    <EditorialPageFrame
      className="editorial-booking-page booking-cancel-page"
      locale="en"
      showMobileActionBar={false}
    >
      <BookingCancellationPage locale="en" />
    </EditorialPageFrame>
  );
}
