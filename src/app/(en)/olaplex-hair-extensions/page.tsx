import type { Metadata } from "next";
import RetailSupplyPage from "@/app/RetailSupplyPage";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const title = "Olaplex No. 7 + Hair Extensions in Brentwood, MD | Katty";
const description = "Shop Olaplex No. 7 Bonding Oil and ask about low-priced Hispanic and Indian hair extensions at Katty Hair Studio in Brentwood, Maryland.";
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
    images: [{ url: "/social/katty-share-preview.webp", width: 1200, height: 630, alt: "Olaplex No. 7 and hair extension options at Katty Hair Studio" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/social/katty-share-preview.webp"] },
};

export default function OlaplexHairExtensionsPage() {
  return <RetailSupplyPage />;
}
