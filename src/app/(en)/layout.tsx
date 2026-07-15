import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import LanguageSuggestion from "@/app/i18n/LanguageSuggestion";
import LocaleDocument from "@/app/i18n/LocaleDocument";
import { localizedAlternates } from "@/app/i18n/config";
import "@/app/globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kattyhairstudio.com"),
  applicationName: "Katty Hair Studio",
  title: "Katty Hair Studio | Hair Salon in Brentwood, MD",
  description:
    "Katty Hair Studio is a full-service hair salon at 3816 Bladensburg Rd, Brentwood, MD, offering haircuts, color, Dominican blowouts, braids and extensions.",
  alternates: localizedAlternates("/", "en"),
  openGraph: {
    title: "Katty Hair Studio | Hair Salon in Brentwood, MD",
    description:
      "Visit our full-service Brentwood hair salon for haircuts, color, Dominican blowouts, braids, extensions, treatments and styling for every texture.",
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
    title: "Katty Hair Studio | Hair Salon in Brentwood, MD",
    description:
      "Full-service Brentwood hair salon offering haircuts, color, Dominican blowouts, braids, extensions and styling for every texture.",
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
      className={`${playfair.variable} antialiased`}
      data-scroll-behavior="smooth"
      lang="en"
    >
      <body>
        <LocaleDocument />
        {children}
        <LanguageSuggestion />
        <Analytics />
      </body>
    </html>
  );
}
