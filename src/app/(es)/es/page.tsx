import type { Metadata } from "next";
import { HomePage } from "@/app/(en)/page";
import { localizedAlternates } from "@/app/i18n/config";

export const metadata: Metadata = {
  title: "Katty Hair Studio | Salón de belleza en Brentwood, MD",
  description:
    "Reserva silk press, color, cortes, blowouts dominicanos, trenzas, extensiones, tratamientos y peinados en nuestro salón de servicio completo en Brentwood, MD.",
  alternates: localizedAlternates("/", "es"),
  openGraph: {
    title: "Katty Hair Studio | Salón de belleza en Brentwood, MD",
    description:
      "Salón dominicano de servicio completo con silk press, color, cortes, blowouts, trenzas, extensiones, tratamientos y peinados para cada textura.",
    url: "https://www.kattyhairstudio.com/es",
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "es_US",
    alternateLocale: ["en_US"],
    images: [{ url: "/social/katty-share-preview.webp", width: 1200, height: 630, alt: "Kathy De la Paz, fundadora de Katty Hair Studio" }],
  },
};

export default function SpanishHomePage() {
  return <HomePage locale="es" />;
}
