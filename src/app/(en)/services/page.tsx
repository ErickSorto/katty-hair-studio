import type { Metadata } from "next";
import ServicesHubPage from "@/app/ServicesHubPage";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const title = "Hair Salon Services in Brentwood, MD | Katty Hair Studio";
const description =
  "Explore silk presses, Dominican blowouts, color, cuts, braids, wigs and hair extensions at Katty Hair Studio in Brentwood, MD.";

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/services", "en"),
  openGraph: {
    title,
    description,
    url: absoluteLocalizedUrl("/services", "en"),
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "en_US",
    alternateLocale: ["es_US"],
    images: [{
      url: "/social/katty-share-preview.webp",
      width: 1200,
      height: 630,
      alt: "Hair salon and hair extension services at Katty Hair Studio in Brentwood, Maryland",
    }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/social/katty-share-preview.webp"] },
};

export default function ServicesPage() {
  return <ServicesHubPage locale="en" />;
}
