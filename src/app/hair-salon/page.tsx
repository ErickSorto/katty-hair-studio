import type { Metadata } from "next";
import ServicePageTemplate from "../ServicePageTemplate";
import { hairSalonCategory } from "../service-data";

export const metadata: Metadata = {
  title: hairSalonCategory.title,
  description: hairSalonCategory.description,
  alternates: { canonical: hairSalonCategory.canonical },
  openGraph: {
    title: hairSalonCategory.title,
    description: hairSalonCategory.description,
    url: hairSalonCategory.canonical,
    images: ["/social/katty-share-preview.webp"],
  },
};

export default function HairSalonPage() {
  return <ServicePageTemplate data={hairSalonCategory} />;
}
