import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Quote, Sparkles } from "lucide-react";
import BookingSection from "@/app/BookingSection";
import EditorialPageFrame from "@/app/EditorialPageFrame";
import EditorialPageHero from "@/app/EditorialPageHero";
import LocationSection from "@/app/LocationSection";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const title = "Conoce a Katty | Katty Hair Studio en Brentwood, MD";
const description =
  "Conoce a Katty, fundadora de un salón dominicano de servicio completo en Brentwood que ofrece color, cortes, blowouts, trenzas, extensiones, tratamientos y peinados.";
const canonical = absoluteLocalizedUrl("/about", "es");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/about", "es"),
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
        alt: "Kathy De la Paz, fundadora de Katty Hair Studio",
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

const principles = [
  {
    title: "Escuchar antes de peinar",
    detail:
      "Tu referencia, el historial de tu cabello, tu rutina y el mantenimiento que deseas orientan la recomendación antes de sacar las herramientas.",
  },
  {
    title: "Todos son bienvenidos",
    detail:
      "Aquí hay un lugar para cada cultura, textura, género y meta de estilo. El salón es de propiedad dominicana y ofrece una amplia variedad de servicios de cabello para todos.",
  },
  {
    title: "Explicar el plan",
    detail:
      "Antes de comenzar la cita, debes entender el servicio, el mantenimiento, el resultado realista y el precio.",
  },
] as const;

export default function AboutPage() {
  return (
    <EditorialPageFrame className="editorial-about-page" locale="es">
      <EditorialPageHero
        align="right"
        description="De servicio completo y abierto a todos, el salón dominicano de Katty en Brentwood ofrece color, cortes, blowouts, trenzas, extensiones, tratamientos y peinados."
        eyebrow="Servicio completo · Propiedad dominicana · Todos son bienvenidos"
        image="/founder/katty-founder-white-suit-editorial.webp"
        imageAlt="Katty, fundadora de Katty Hair Studio, de pie en su salón rosado de Brentwood"
        imagePosition="42% 18%"
        locale="es"
        pageLabel="Conoce a Katty"
        primaryHref="#katty-story"
        primaryLabel="Conoce la historia de Katty"
        title="El cuidado del cabello comienza por escuchar."
      />

      <section className="about-story-section" id="katty-story">
        <div className="about-story-image" data-reveal>
          <Image
            alt="Katty sonriendo dentro de su salón de belleza"
            fill
            sizes="(max-width: 900px) 100vw, 42vw"
            src="/founder/katty-founder-original-portrait-v5.webp"
          />
        </div>
        <div className="about-story-copy" data-reveal>
          <p className="eyebrow">Conoce a Katty</p>
          <h2>Un solo salón, una gama completa de servicios.</h2>
          <p>
            Katty Hair Studio es un salón de propiedad dominicana, de servicio completo y abierto a todos. La identidad del salón refleja quién lo dirige; nunca limita a los clientes, las texturas ni las metas de estilo que recibimos aquí.
          </p>
          <p>
            Son bienvenidas personas de toda raza, cultura, textura y género. Desde blowouts y color hasta extensiones, trenzas, cortes, pelucas y peinados, cada cita comienza con tu referencia, el historial de tu cabello y el resultado que buscas, no con suposiciones sobre quién eres.
          </p>
          <div className="about-quote">
            <Quote aria-hidden="true" />
            <p>No necesitas tener cierto origen ni cierta textura de cabello para sentirte parte de este salón. Trae el look que deseas y adaptaremos el servicio a ti.</p>
          </div>
        </div>
      </section>

      <section className="about-principles-section" data-reveal>
        <div className="editorial-section-heading">
          <p className="eyebrow">El enfoque del salón</p>
          <h2>Un salón acogedor desde la consulta hasta el acabado.</h2>
        </div>
        <div className="about-principle-list">
          {principles.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {index === 1 ? <Heart aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <LocationSection locale="es" />
      <BookingSection locale="es" phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />
    </EditorialPageFrame>
  );
}
