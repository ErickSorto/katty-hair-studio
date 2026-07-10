import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kattyhairstudio.com"),
  title: "Katty Hair Studio | Dominican Hair Studio in Brentwood",
  description:
    "Warm Dominican hair studio and beauty supply in Brentwood, MD for blowouts, color, extensions, wigs, braids, cuts, and polished finishes.",
  openGraph: {
    title: "Katty Hair Studio",
    description:
      "Rose-toned Brentwood hair studio for Dominican blowouts, color, extensions, wigs, braids, cuts, and beauty supply.",
    images: [
      {
        url: "/social/share-preview-salon.webp",
        width: 1200,
        height: 630,
        alt: "Katty Hair Studio warm salon interior",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Katty Hair Studio",
    description: "Dominican Brentwood hair studio for blowouts, color, extensions, wigs, braids, and cuts.",
    images: ["/social/share-preview-salon.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
