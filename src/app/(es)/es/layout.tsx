import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import LanguageSuggestion from "@/app/i18n/LanguageSuggestion";
import LocaleDocument from "@/app/i18n/LocaleDocument";
import { localizedAlternates } from "@/app/i18n/config";
import "@/app/globals.css";

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
  metadataBase: new URL("https://www.kattyhairstudio.com"),
  applicationName: "Katty Hair Studio",
  title: "Katty Hair Studio | Salón de belleza en Brentwood, MD",
  description:
    "Reserva color, cortes, blowouts dominicanos, trenzas, extensiones, tratamientos y peinados en nuestro salón dominicano de servicio completo en Brentwood, MD.",
  alternates: localizedAlternates("/", "es"),
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Katty Hair Studio | Salón de belleza en Brentwood, MD",
    description:
      "Un salón dominicano de servicio completo con color, cortes, blowouts, trenzas, extensiones, tratamientos y peinados para cada textura.",
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "es_US",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/social/katty-share-preview.webp",
        width: 1200,
        height: 630,
        alt: "Kathy De la Paz, fundadora de Katty Hair Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Katty Hair Studio | Salón de belleza en Brentwood, MD",
    description:
      "Salón dominicano de servicio completo para cada textura y estilo en Brentwood, Maryland.",
    images: ["/social/katty-share-preview.webp"],
  },
};

export default function SpanishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${inter.variable} ${playfair.variable} antialiased`}
      data-locale="es"
      data-scroll-behavior="smooth"
      lang="es"
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

