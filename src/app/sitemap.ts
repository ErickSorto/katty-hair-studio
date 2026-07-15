import type { MetadataRoute } from "next";
import { absoluteLocalizedUrl, siteOrigin } from "./i18n/config";
import {
  extensionCategory,
  getServiceImage,
  hairSalonCategory,
  servicePages,
} from "./service-data";
import { priorityServiceSlugSet } from "./service-priority";

type SitemapEntry = MetadataRoute.Sitemap[number];
type RouteSpec = {
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>;
  images?: readonly string[];
  path: string;
  priority: number;
};

const staticRoutes: readonly RouteSpec[] = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1,
    images: [
      "/hero/katty-salon-interior-hero-clear-pink-v4.webp",
      "/gallery/katty-golden-dimension-themed.webp",
    ],
  },
  {
    path: "/services",
    changeFrequency: "weekly",
    priority: 0.95,
    images: [
      "/hero/katty-salon-interior-hero-clear-pink-v4.webp",
      "/services/generated/hair-extension-technician-v2.webp",
    ],
  },
  {
    path: "/location",
    changeFrequency: "monthly",
    priority: 0.9,
    images: ["/hero/katty-salon-interior-hero-clear-pink-v4.webp"],
  },
  {
    path: hairSalonCategory.url,
    changeFrequency: "monthly",
    priority: 0.9,
    images: [getServiceImage(hairSalonCategory.slug)],
  },
  {
    path: extensionCategory.url,
    changeFrequency: "monthly",
    priority: 0.9,
    images: [getServiceImage(extensionCategory.slug)],
  },
  {
    path: "/about",
    changeFrequency: "monthly",
    priority: 0.75,
    images: ["/founder/katty-founder-white-suit-editorial.webp"],
  },
];

function primaryEntry({
  changeFrequency,
  images,
  path,
  priority,
}: RouteSpec): SitemapEntry {
  const english = absoluteLocalizedUrl(path, "en");
  const spanish = absoluteLocalizedUrl(path, "es");
  const languages = {
    en: english,
    es: spanish,
    "x-default": english,
  };

  return {
    url: english,
    changeFrequency,
    images: images?.map((image) => `${siteOrigin}${image}`),
    priority,
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const serviceRoutes: RouteSpec[] = servicePages
    .filter(
      (page) => page.pageType === "Service Page" && priorityServiceSlugSet.has(page.slug),
    )
    .map((page) => ({
      path: page.url,
      changeFrequency: "monthly",
      priority: page.slug === "silk-press" || page.slug === "blowouts" ? 0.9 : 0.8,
      images: [getServiceImage(page.slug)],
    }));

  return [...staticRoutes, ...serviceRoutes].map(primaryEntry);
}
