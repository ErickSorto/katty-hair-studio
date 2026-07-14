import type { Metadata } from "next";
import { Car, Clock, MapPin } from "lucide-react";
import BookingSection from "@/app/BookingSection";
import EditorialPageFrame from "@/app/EditorialPageFrame";
import EditorialPageHero from "@/app/EditorialPageHero";
import LocationSection from "@/app/LocationSection";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const title = "Ubicación de Katty Hair Studio en Brentwood, MD";
const description =
  "Encuentra Katty Hair Studio en 3816 Bladensburg Rd, Brentwood, Maryland. Consulta el horario, cómo llegar, recomendaciones para tu visita y opciones de citas.";
const canonical = absoluteLocalizedUrl("/location", "es");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/location", "es"),
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
        alt: "Katty Hair Studio en Brentwood, Maryland",
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

const visitNotes = [
  {
    icon: MapPin,
    title: "Bladensburg Road",
    detail: "3816 Bladensburg Rd, Brentwood, MD 20722, cerca de Mount Rainier y North Brentwood.",
  },
  {
    icon: Car,
    title: "Planifica tu llegada",
    detail: "Abre las indicaciones antes de salir y reserva unos minutos adicionales para el tráfico local y el estacionamiento.",
  },
  {
    icon: Clock,
    title: "Trae tu referencia",
    detail: "Llega con todo listo para hablar sobre el historial de tu cabello, el acabado que deseas, el mantenimiento y el tiempo necesario antes de comenzar el servicio.",
  },
] as const;

export default function LocationPage() {
  return (
    <EditorialPageFrame className="editorial-location-page" locale="es">
      <EditorialPageHero
        description="Consulta el horario, cómo llegar, información sobre estacionamiento y todo lo que necesitas antes de visitar nuestro salón en Brentwood."
        eyebrow="Visita Katty Hair Studio"
        image="/hero/katty-salon-interior-hero-clear-pink-v4.webp"
        imageAlt="Interior rosado y color borgoña de Katty Hair Studio en Brentwood, Maryland"
        imagePosition="center 48%"
        locale="es"
        pageLabel="Ubicación"
        primaryHref="#location"
        primaryLabel="Ver mapa y horario"
        title="Tu salón en Brentwood, Maryland."
      />

      <section className="visit-details-section" data-reveal>
        <div className="editorial-section-heading">
          <p className="eyebrow">Antes de salir de casa</p>
          <h2>Una visita sencilla comienza con un plan claro.</h2>
          <p>Al abrir la navegación, usa la dirección del salón y no el nombre de un negocio cercano.</p>
        </div>
        <div className="visit-detail-list">
          {visitNotes.map((item) => (
            <article key={item.title}>
              <item.icon aria-hidden="true" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <LocationSection locale="es" />
      <BookingSection locale="es" phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />
    </EditorialPageFrame>
  );
}
