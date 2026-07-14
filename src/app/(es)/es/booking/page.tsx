import type { Metadata } from "next";
import BookingSection from "@/app/BookingSection";
import EditorialPageFrame from "@/app/EditorialPageFrame";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const title = "Reserva una cita de cabello en Brentwood, MD | Katty";
const description =
  "Elige un servicio de Katty Hair Studio, consulta la disponibilidad del salón en tiempo real y reserva tu cita en Brentwood, Maryland.";
const canonical = absoluteLocalizedUrl("/booking", "es");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/booking", "es"),
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "es_US",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/social/katty-share-preview.webp",
        width: 1200,
        height: 630,
        alt: "Reserva una cita en Katty Hair Studio en Brentwood, Maryland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/social/katty-share-preview.webp"],
  },
};

export default function BookingPage() {
  return (
    <EditorialPageFrame
      className="editorial-booking-page booking-page-focused"
      locale="es"
      showMobileActionBar={false}
    >
      <BookingSection locale="es" mode="page" phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />
    </EditorialPageFrame>
  );
}
