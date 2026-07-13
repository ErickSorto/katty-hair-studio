import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "Katty Hair Studio | Dominican-Owned Hair Studio in Brentwood",
  description:
    "Warm, Dominican-owned hair studio and beauty supply in Brentwood, MD welcoming every texture for blowouts, color, extensions, wigs, braids, cuts, and polished finishes.",
  alternates: {
    canonical: "https://www.kattyhairstudio.com/",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Katty Hair Studio",
    description:
      "Your texture. Your plan. Your finish. A Dominican-owned studio welcoming every texture in Brentwood, Maryland.",
    type: "website",
    siteName: "Katty Hair Studio",
    images: [
      {
        url: "/social/katty-share-preview.webp",
        width: 1200,
        height: 630,
        alt: "Katty Hair Studio founder Kathy De la Paz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Katty Hair Studio",
    description: "Dominican-owned and welcoming every texture in Brentwood, Maryland.",
    images: ["/social/katty-share-preview.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${inter.variable} ${playfair.variable} antialiased`}
      data-scroll-behavior="smooth"
      lang="en"
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
