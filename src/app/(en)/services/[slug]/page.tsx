import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageTemplate from "@/app/ServicePageTemplate";
import { localizedAlternates } from "@/app/i18n/config";
import { brentwoodServices, getServicePage } from "@/app/service-data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return brentwoodServices.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getServicePage((await params).slug);
  if (!page) return {};
  const socialImage = page.socialImage ?? "/social/katty-share-preview.webp";

  return {
    title: page.title,
    description: page.description,
    alternates: localizedAlternates(page.url, "en"),
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.canonical,
      type: "website",
      siteName: "Katty Hair Studio",
      locale: "en_US",
      alternateLocale: ["es_US"],
      images: [{ url: socialImage, alt: page.heroImageAlt ?? `${page.name} at Katty Hair Studio` }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [socialImage],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const page = getServicePage((await params).slug);
  if (!page) notFound();
  return <ServicePageTemplate data={page} locale="en" />;
}
