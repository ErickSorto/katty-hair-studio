import type { Metadata } from "next";
import ServicePageTemplate from "@/app/ServicePageTemplate";
import {
  absoluteLocalizedUrl,
  localizedAlternates,
} from "@/app/i18n/config";
import { extensionCategory } from "@/app/service-data.es";

const canonical = absoluteLocalizedUrl(extensionCategory.url, "es");

export const metadata: Metadata = {
  title: extensionCategory.title,
  description: extensionCategory.description,
  alternates: localizedAlternates(extensionCategory.url, "es"),
  openGraph: {
    title: extensionCategory.title,
    description: extensionCategory.description,
    url: canonical,
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "es_US",
    alternateLocale: ["en_US"],
    images: [{
      url: "/social/katty-share-preview.webp",
      width: 1200,
      height: 630,
      alt: "Extensiones de cabello en Katty Hair Studio",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: extensionCategory.title,
    description: extensionCategory.description,
    images: ["/social/katty-share-preview.webp"],
  },
};

export default function SpanishHairExtensionTechnicianPage() {
  return <ServicePageTemplate data={extensionCategory} locale="es" />;
}
