import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageTemplate from "../../ServicePageTemplate";
import { brentwoodServices, getServicePage } from "../../service-data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return brentwoodServices.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getServicePage((await params).slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.canonical,
      images: ["/social/katty-share-preview.webp"],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const page = getServicePage((await params).slug);
  if (!page) notFound();
  return <ServicePageTemplate data={page} />;
}
