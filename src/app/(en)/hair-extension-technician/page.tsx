import type { Metadata } from "next";
import ServicePageTemplate from "@/app/ServicePageTemplate";
import { localizedAlternates } from "@/app/i18n/config";
import { extensionCategory } from "@/app/service-data";

export const metadata: Metadata = {
  title: "Hair Extension Technician in Brentwood, MD | Katty",
  description:
    "Compare tape-in, sew-in, microlink, K-tip, quick weave, closure, Brazilian knot, maintenance, and removal services in Brentwood, MD.",
  alternates: localizedAlternates(extensionCategory.url, "en"),
  openGraph: {
    title: "Hair Extension Technician in Brentwood, MD | Katty",
    description:
      "Explore tape-in, sew-in, microlink, K-tip, quick weave, closure, and Brazilian knot services at Katty Hair Studio in Brentwood, Maryland.",
    url: extensionCategory.canonical,
    locale: "en_US",
    alternateLocale: ["es_US"],
    images: ["/social/katty-share-preview.webp"],
  },
};

export default function HairExtensionTechnicianPage() {
  return <ServicePageTemplate data={extensionCategory} locale="en" />;
}
