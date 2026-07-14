import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
