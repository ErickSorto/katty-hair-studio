import type { Metadata } from "next";
import ServicesHubPage from "@/app/ServicesHubPage";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const title = "Servicios de Salón en Brentwood, MD | Katty Hair Studio";
const description =
  "Explora silk press, blowouts dominicanos, color, cortes, trenzas, pelucas y extensiones en Katty Hair Studio en Brentwood, MD.";

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/services", "es"),
  openGraph: {
    title,
    description,
    url: absoluteLocalizedUrl("/services", "es"),
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "es_US",
    alternateLocale: ["en_US"],
    images: [{
      url: "/social/katty-share-preview.webp",
      width: 1200,
      height: 630,
      alt: "Servicios de salón de belleza y extensiones en Katty Hair Studio en Brentwood, Maryland",
    }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/social/katty-share-preview.webp"] },
};

export default function SpanishServicesPage() {
  return <ServicesHubPage locale="es" />;
}
