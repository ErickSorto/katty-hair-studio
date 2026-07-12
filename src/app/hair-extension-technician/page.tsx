import type { Metadata } from "next";
import ServicePageTemplate from "../ServicePageTemplate";
import { extensionCategory } from "../service-data";

export const metadata: Metadata = {
  title: "Hair Extension Technician in Brentwood, MD | Katty",
  description:
    "Compare tape-in, sew-in, microlink, K-tip, quick weave, closure, Brazilian knot, maintenance, and removal services in Brentwood, MD.",
  alternates: { canonical: extensionCategory.canonical },
  openGraph: {
    title: "Hair Extension Technician in Brentwood, MD | Katty",
    description:
      "Explore tape-in, sew-in, microlink, K-tip, quick weave, closure, and Brazilian knot services at Katty Hair Studio in Brentwood, Maryland.",
    url: extensionCategory.canonical,
    images: ["/social/katty-share-preview.webp"],
  },
};

export default function HairExtensionTechnicianPage() {
  return <ServicePageTemplate data={extensionCategory} />;
}
