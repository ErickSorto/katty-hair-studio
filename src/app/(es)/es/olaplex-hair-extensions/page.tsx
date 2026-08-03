import type { Metadata } from "next";
import RetailSupplyPage from "@/app/RetailSupplyPage";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const title = "Olaplex No. 7 y extensiones de cabello en Brentwood, MD | Katty";
const description = "Encuentra Olaplex No. 7 Bonding Oil y pregunta por extensiones de cabello hispano e indio a precios accesibles en Katty Hair Studio en Brentwood, Maryland.";
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
    images: [{ url: "/social/katty-share-preview.webp", width: 1200, height: 630, alt: "Olaplex No. 7 y opciones de extensiones de cabello en Katty Hair Studio" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/social/katty-share-preview.webp"] },
};

export default function SpanishOlaplexHairExtensionsPage() {
  return <RetailSupplyPage locale="es" />;
}
