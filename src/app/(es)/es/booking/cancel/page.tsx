import type { Metadata } from "next";
import BookingCancellationPage from "@/app/BookingCancellationPage";
import EditorialPageFrame from "@/app/EditorialPageFrame";
import {
  absoluteLocalizedUrl,
  localizedAlternates,
} from "@/app/i18n/config";

const title = "Cancelar tu cita | Katty Hair Studio";
const description =
  "Usa tu enlace privado de confirmación de Katty Hair Studio para cancelar una cita en línea.";
const canonical = absoluteLocalizedUrl("/booking/cancel", "es");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/booking/cancel", "es"),
  robots: { follow: false, index: false },
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "es_US",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function SpanishBookingCancellationPage() {
  return (
    <EditorialPageFrame
      className="editorial-booking-page booking-cancel-page"
      locale="es"
      showMobileActionBar={false}
    >
      <BookingCancellationPage locale="es" />
    </EditorialPageFrame>
  );
}
