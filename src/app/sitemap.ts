import type { MetadataRoute } from "next";
import { absoluteLocalizedUrl, type Locale } from "./i18n/config";
import { hairSalonCategory, servicePages } from "./service-data";

type SitemapEntry = MetadataRoute.Sitemap[number];
type RouteSpec = {
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>;
  path: string;
  priority: number;
};

const sitemapLocales: readonly Locale[] = ["en", "es"];

const staticRoutes: readonly RouteSpec[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/booking", changeFrequency: "weekly", priority: 0.9 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.8 },
  { path: "/location", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "weekly", priority: 0.95 },
  {
    path: hairSalonCategory.url,
    changeFrequency: "monthly",
    priority: 0.9,
  },
];

function localizedEntries({ changeFrequency, path, priority }: RouteSpec): MetadataRoute.Sitemap {
  const english = absoluteLocalizedUrl(path, "en");
  const spanish = absoluteLocalizedUrl(path, "es");
  const languages = {
    en: english,
    es: spanish,
    "x-default": english,
  };

  return sitemapLocales.map((locale) => ({
    url: locale === "es" ? spanish : english,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const serviceRoutes: RouteSpec[] = servicePages.map((page) => ({
    path: page.url,
    changeFrequency: "monthly",
    priority: page.slug === "silk-press" || page.pageType === "Category Page" ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes].flatMap(localizedEntries);
}
