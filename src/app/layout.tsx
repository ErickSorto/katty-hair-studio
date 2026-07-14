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
  applicationName: "Katty Hair Studio",
  title: "Katty Hair Studio",
  description:
    "Reserve color, cuts, blowouts, braids, extensions, treatments, and styling at our full-service, Dominican-owned hair studio in Brentwood, MD.",
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
      "A full-service, Dominican-owned studio offering color, cuts, blowouts, braids, extensions, treatments, and styling for every texture.",
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
    description: "Full-service and Dominican-owned, with a wide range of hair services for every texture.",
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
