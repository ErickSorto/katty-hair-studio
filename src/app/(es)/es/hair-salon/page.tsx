import type { Metadata } from "next";
import ServicePageTemplate from "@/app/ServicePageTemplate";
import {
  absoluteLocalizedUrl,
  localizedAlternates,
} from "@/app/i18n/config";
import { hairSalonCategory } from "@/app/service-data.es";

const canonical = absoluteLocalizedUrl(hairSalonCategory.url, "es");

export const metadata: Metadata = {
  title: hairSalonCategory.title,
  description: hairSalonCategory.description,
  alternates: localizedAlternates(hairSalonCategory.url, "es"),
  openGraph: {
    title: hairSalonCategory.title,
    description: hairSalonCategory.description,
    url: canonical,
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "es_US",
    alternateLocale: ["en_US"],
    images: [{
      url: "/social/katty-share-preview.webp",
      width: 1200,
      height: 630,
      alt: "Salón de belleza Katty Hair Studio en Brentwood, Maryland",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: hairSalonCategory.title,
    description: hairSalonCategory.description,
    images: ["/social/katty-share-preview.webp"],
  },
};

export default function SpanishHairSalonPage() {
  return <ServicePageTemplate data={hairSalonCategory} locale="es" />;
}
