import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/booking/cancel", "/es/booking/cancel"],
    },
    sitemap: "https://www.kattyhairstudio.com/sitemap.xml",
  };
}
