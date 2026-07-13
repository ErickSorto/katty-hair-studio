import type { MetadataRoute } from "next";
import { hairSalonCategory, servicePages } from "./service-data";

const origin = "https://www.kattyhairstudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${origin}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${origin}/booking`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${origin}/gallery`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${origin}/location`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${origin}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${origin}/terms`, changeFrequency: "yearly", priority: 0.3 },
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
