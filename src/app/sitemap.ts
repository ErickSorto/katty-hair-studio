import type { MetadataRoute } from "next";
import { hairSalonCategory, servicePages } from "./service-data";

const origin = "https://www.kattyhairstudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${origin}/`, changeFrequency: "weekly", priority: 1 },
    {
      url: hairSalonCategory.canonical,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...servicePages.map((page) => ({
      url: `${origin}${page.url}`,
      changeFrequency: "monthly" as const,
      priority: page.pageType === "Category Page" ? 0.9 : 0.8,
    })),
  ];
}
