import type { Metadata } from "next";
import RetailSupplyPage from "@/app/RetailSupplyPage";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const title = "Olaplex Products + Extension Hair in Brentwood, MD | Katty";
const description = "Explore Olaplex No. 0, 3, 4, 4P, 5, and 7 plus Indian, Brazilian, Cambodian, and Malaysian extension hair at Katty Hair Studio in Brentwood, Maryland.";
const canonical = absoluteLocalizedUrl("/olaplex-hair-extensions", "en");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/olaplex-hair-extensions", "en"),
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "en_US",
    alternateLocale: ["es_US"],
    images: [{ url: "/social/katty-share-preview.webp", width: 1200, height: 630, alt: "Full Olaplex product range and extension-hair options at Katty Hair Studio" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/social/katty-share-preview.webp"] },
};

export default function OlaplexHairExtensionsPage() {
  return <RetailSupplyPage />;
}
