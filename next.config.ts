import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [60, 75],
  },
  async redirects() {
    return [
      {
        destination: "/services/eyebrow-waxing",
        permanent: true,
        source: "/services/eyebrow-threading",
      },
      {
        destination: "/es/services/eyebrow-waxing",
        permanent: true,
        source: "/es/services/eyebrow-threading",
      },
      {
        destination: "/services/braids",
        permanent: true,
        source: "/services/hair-braiding-services",
      },
      {
        destination: "/es/services/braids",
        permanent: true,
        source: "/es/services/hair-braiding-services",
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
