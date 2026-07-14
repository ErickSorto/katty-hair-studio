import type { Metadata } from "next";
import ServicePageTemplate from "@/app/ServicePageTemplate";
import { localizedAlternates } from "@/app/i18n/config";
import { hairSalonCategory } from "@/app/service-data";

export const metadata: Metadata = {
  title: hairSalonCategory.title,
  description: hairSalonCategory.description,
  alternates: localizedAlternates(hairSalonCategory.url, "en"),
  openGraph: {
    title: hairSalonCategory.title,
    description: hairSalonCategory.description,
    url: hairSalonCategory.canonical,
    locale: "en_US",
    alternateLocale: ["es_US"],
    images: ["/social/katty-share-preview.webp"],
  },
};

export default function HairSalonPage() {
  return <ServicePageTemplate data={hairSalonCategory} locale="en" />;
}
