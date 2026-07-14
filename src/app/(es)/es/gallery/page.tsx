import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import BookingSection from "@/app/BookingSection";
import EditorialPageFrame from "@/app/EditorialPageFrame";
import EditorialPageHero from "@/app/EditorialPageHero";
import LocationSection from "@/app/LocationSection";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const instagramUrl = "https://www.instagram.com/kattyhairstudio_/";
const title = "Galería de cabello | Katty Hair Studio en Brentwood, MD";
const description =
  "Explora blowouts, extensiones, highlights, trenzas, rizos, cortes y acabados pulidos de Katty Hair Studio en Brentwood, Maryland.";
const canonical = absoluteLocalizedUrl("/gallery", "es");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/gallery", "es"),
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
        alt: "Acabados de cabello de Katty Hair Studio en Brentwood, Maryland",
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

const galleryItems = [
  { image: "/gallery/katty-glossy-body-waves-themed.webp", title: "Ondas con brillo", alt: "Cabello negro largo con ondas brillantes y abundantes", position: "58% center" },
  { image: "/gallery/katty-golden-dimension-themed.webp", title: "Dimensión dorada", alt: "Rizos con volumen y dimensión dorada", position: "50% center" },
  { image: "/gallery/katty-silky-side-waves-themed-v2.webp", title: "Ondas sedosas de lado", alt: "Cabello negro largo y sedoso con raya lateral y ondas", position: "50% 42%" },
  { image: "/gallery/katty-copper-waves-themed.webp", title: "Ondas cobrizas", alt: "Cabello cobrizo largo con ondas pulidas", position: "50% center" },
  { image: "/gallery/katty-sculpted-curls-themed.webp", title: "Rizos esculpidos", alt: "Cabello largo con rizos brillantes y esculpidos", position: "50% center" },
  { image: "/gallery/katty-vintage-curl-set-themed-v2.webp", title: "Peinado de rizos vintage", alt: "Peinado brillante con rizos de estilo vintage", position: "50% 40%" },
  { image: "/services/generated/quick-weave-v2.webp", title: "Bob con quick weave", alt: "Bob liso a la altura de los hombros realizado con quick weave", position: "50% 42%" },
  { image: "/services/generated/hair-highlighting-v2.webp", title: "Highlights dimensionales", alt: "Highlights cálidos en tonos miel sobre cabello castaño", position: "50% 42%" },
  { image: "/services/generated/twist-braids-v2.webp", title: "Twists de cuerda", alt: "Twists largos y pulidos de dos mechones", position: "50% 38%" },
  { image: "/services/generated/womens-haircuts-v2.webp", title: "Corte en capas", alt: "Corte fresco en capas a la altura de la clavícula", position: "50% 42%" },
  { image: "/services/generated/brazilian-knots-hair-extensions-v2.webp", title: "Largo con textura", alt: "Extensiones largas con textura y mucho volumen", position: "50% 40%" },
  { image: "/services/generated/mens-haircuts-v2.webp", title: "Trenzado masculino", alt: "Peinado masculino con trenzas, línea definida y barba", position: "50% 38%" },
] as const;

export default function GalleryPage() {
  return (
    <EditorialPageFrame className="editorial-gallery-page" locale="es">
      <EditorialPageHero
        description="Explora acabados pulidos, color dimensional, estilos protectores, trabajos de extensiones y formas que vale la pena guardar para tu consulta."
        eyebrow="La galería de acabados"
        image="/gallery/katty-golden-dimension-themed.webp"
        imageAlt="Clienta de Katty Hair Studio con rizos de gran volumen y dimensión dorada"
        imagePosition="50% 40%"
        locale="es"
        pageLabel="Galería"
        primaryHref="#full-gallery"
        primaryLabel="Explorar la galería"
        title="Encuentra el acabado que quieres traer como referencia."
      />

      <section className="full-gallery-section" id="full-gallery">
        <div className="editorial-section-heading" data-reveal>
          <p className="eyebrow">Guarda tu referencia</p>
          <h2>Textura, movimiento, color y forma.</h2>
          <p>Usa estas imágenes como punto de partida. Adaptamos tu servicio al historial, la densidad, el largo y el mantenimiento de tu cabello.</p>
          <a href={instagramUrl} rel="noreferrer" target="_blank">
            <ExternalLink aria-hidden="true" /> Mira nuestros trabajos más recientes en Instagram
          </a>
        </div>
        <div className="editorial-gallery-grid" data-reveal>
          {galleryItems.map((item) => (
            <figure key={item.title}>
              <Image
                alt={item.alt}
                fill
                sizes="(max-width: 740px) 100vw, (max-width: 1100px) 50vw, 25vw"
                src={item.image}
                style={{ objectPosition: item.position }}
              />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <LocationSection locale="es" />
      <BookingSection locale="es" phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />
    </EditorialPageFrame>
  );
}
