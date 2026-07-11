import type { Metadata } from "next";
import ServicePageTemplate from "../ServicePageTemplate";
import { extensionCategory } from "../service-data";

export const metadata: Metadata = {
  title: "Hair Extension Technician in Brentwood, MD | Katty",
  description:
    "Explore extension consultations, installation, blending, maintenance, and removal at Katty Hair Studio in Brentwood, MD.",
  alternates: { canonical: extensionCategory.canonical },
  openGraph: {
    title: "Hair Extension Technician in Brentwood, MD | Katty",
    description:
      "Explore personalized hair extension services at Katty Hair Studio in Brentwood, Maryland.",
    url: extensionCategory.canonical,
    images: ["/social/katty-share-preview.webp"],
  },
};

export default function HairExtensionTechnicianPage() {
  return <ServicePageTemplate data={extensionCategory} />;
}
