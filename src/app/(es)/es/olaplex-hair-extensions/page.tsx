import type { Metadata } from "next";
import RetailSupplyPage from "@/app/RetailSupplyPage";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const title = "Productos Olaplex y cabello para extensiones en Brentwood, MD | Katty";
const description = "Explora Olaplex No. 0, 3, 4, 4P, 5 y 7, además de cabello indio, brasileño, camboyano y malasio para extensiones en Katty Hair Studio en Brentwood, Maryland.";
const canonical = absoluteLocalizedUrl("/olaplex-hair-extensions", "es");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/olaplex-hair-extensions", "es"),
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "es_US",
    alternateLocale: ["en_US"],
    images: [{ url: "/social/katty-share-preview.webp", width: 1200, height: 630, alt: "Línea completa Olaplex y opciones de cabello para extensiones en Katty Hair Studio" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/social/katty-share-preview.webp"] },
};

export default function SpanishOlaplexHairExtensionsPage() {
  return <RetailSupplyPage locale="es" />;
}
