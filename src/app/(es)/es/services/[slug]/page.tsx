import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageTemplate from "@/app/ServicePageTemplate";
import {
  absoluteLocalizedUrl,
  localizedAlternates,
} from "@/app/i18n/config";
import {
  brentwoodServices,
  getRelatedServices,
  getServicePage,
} from "@/app/service-data.es";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return brentwoodServices.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getServicePage((await params).slug);
  if (!page) return {};

  const canonical = absoluteLocalizedUrl(page.url, "es");
  const socialImage = page.socialImage ?? "/social/katty-share-preview.webp";

  return {
    title: page.title,
    description: page.description,
    alternates: localizedAlternates(page.url, "es"),
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      type: "website",
      siteName: "Katty Hair Studio",
      locale: "es_US",
      alternateLocale: ["en_US"],
      images: [{
        url: socialImage,
        alt: page.heroImageAlt ?? `${page.name} en Katty Hair Studio`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [socialImage],
    },
  };
}

export default async function SpanishServicePage({ params }: Props) {
  const page = getServicePage((await params).slug);
  if (!page) notFound();

  return (
    <ServicePageTemplate
      data={page}
      locale="es"
      relatedServices={getRelatedServices(page)}
    />
  );
}
