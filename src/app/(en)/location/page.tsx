import type { Metadata } from "next";
import { Car, Clock, MapPin } from "lucide-react";
import BookingSection from "@/app/BookingSection";
import EditorialPageFrame from "@/app/EditorialPageFrame";
import EditorialPageHero from "@/app/EditorialPageHero";
import LocationSection from "@/app/LocationSection";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const title = "Katty Hair Studio Location in Brentwood, MD";
const description =
  "Find Katty Hair Studio at 3816 Bladensburg Rd in Brentwood, Maryland. View salon hours, directions, arrival notes, and appointment options.";
const canonical = absoluteLocalizedUrl("/location", "en");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/location", "en"),
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "en_US",
    alternateLocale: ["es_US"],
    images: [{ url: "/social/katty-share-preview.webp", width: 1200, height: 630, alt: "Katty Hair Studio in Brentwood, Maryland" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/social/katty-share-preview.webp"] },
};

const visitNotes = [
  {
    icon: MapPin,
    title: "Bladensburg Road",
    detail: "3816 Bladensburg Rd, Brentwood, MD 20722, close to Mount Rainier and North Brentwood.",
  },
  {
    icon: Car,
    title: "Plan your arrival",
    detail: "Open directions before leaving and allow a few extra minutes for local traffic and parking.",
  },
  {
    icon: Clock,
    title: "Bring your reference",
    detail: "Arrive ready to discuss your hair history, desired finish, maintenance, and timing before service begins.",
  },
] as const;

export default function LocationPage() {
  return (
    <EditorialPageFrame className="editorial-location-page">
      <EditorialPageHero
        description="Hours, directions, parking context, and the details you need before visiting our Brentwood studio."
        eyebrow="Visit Katty Hair Studio"
        image="/hero/katty-salon-interior-hero-clear-pink-v4.webp"
        imageAlt="Pink and burgundy interior of Katty Hair Studio in Brentwood, Maryland"
        imagePosition="center 48%"
        pageLabel="Location"
        primaryHref="#location"
        primaryLabel="View map and hours"
        title="Your salon in Brentwood, Maryland."
      />

      <section className="visit-details-section" data-reveal>
        <div className="editorial-section-heading">
          <p className="eyebrow">Before you leave home</p>
          <h2>A simple visit starts with a clear plan.</h2>
          <p>Use the studio address—not a nearby business name—when opening navigation.</p>
        </div>
        <div className="visit-detail-list">
          {visitNotes.map((item) => (
            <article key={item.title}>
              <item.icon aria-hidden="true" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <LocationSection />
      <BookingSection phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />
    </EditorialPageFrame>
  );
}
