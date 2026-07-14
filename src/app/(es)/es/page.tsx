import type { Metadata } from "next";
import { HomePage } from "@/app/(en)/page";
import { localizedAlternates } from "@/app/i18n/config";

export const metadata: Metadata = {
  title: "Katty Hair Studio | Salón de belleza en Brentwood, MD",
  description:
    "Reserva color, cortes, blowouts dominicanos, trenzas, extensiones, tratamientos y peinados en nuestro salón dominicano de servicio completo en Brentwood, MD.",
  alternates: localizedAlternates("/", "es"),
  openGraph: {
    title: "Katty Hair Studio | Salón de belleza en Brentwood, MD",
    description:
      "Salón dominicano de servicio completo con color, cortes, blowouts, trenzas, extensiones, tratamientos y peinados para cada textura.",
    url: "https://www.kattyhairstudio.com/es",
    locale: "es_US",
    alternateLocale: ["en_US"],
  },
};

export default function SpanishHomePage() {
  return <HomePage locale="es" />;
}

