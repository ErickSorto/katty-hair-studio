import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Quote, Sparkles } from "lucide-react";
import BookingSection from "@/app/BookingSection";
import EditorialPageFrame from "@/app/EditorialPageFrame";
import EditorialPageHero from "@/app/EditorialPageHero";
import LocationSection from "@/app/LocationSection";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const title = "Meet Katty | Katty Hair Studio Brentwood, MD";
const description =
  "Meet Katty, founder of a full-service, Dominican-owned hair studio in Brentwood offering color, cuts, blowouts, braids, extensions, treatments, and styling.";
const canonical = absoluteLocalizedUrl("/about", "en");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/about", "en"),
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "en_US",
    alternateLocale: ["es_US"],
    images: [{ url: "/social/katty-share-preview.webp", width: 1200, height: 630, alt: "Kathy De la Paz, founder of Katty Hair Studio" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/social/katty-share-preview.webp"] },
};

const principles = [
  {
    title: "Listen before styling",
    detail: "Your reference, history, routine, and desired upkeep shape the recommendation before tools come out.",
  },
  {
    title: "Everyone is welcome",
    detail: "Every background, texture, gender, and style goal belongs here. The studio is Dominican-owned and offers a wide range of hair services for everyone.",
  },
  {
    title: "Explain the plan",
    detail: "You should understand the service, maintenance, realistic outcome, and quote before the appointment begins.",
  },
] as const;

export default function AboutPage() {
  return (
    <EditorialPageFrame className="editorial-about-page">
      <EditorialPageHero
        align="right"
        description="Full-service and open to everyone, Katty's Dominican-owned Brentwood studio offers color, cuts, blowouts, braids, extensions, treatments, and styling."
        eyebrow="Full-service · Dominican-owned · Everyone welcome"
        image="/founder/katty-founder-white-suit-editorial.webp"
        imageAlt="Katty, founder of Katty Hair Studio, standing in her pink Brentwood salon"
        imagePosition="42% 18%"
        pageLabel="About Katty"
        primaryHref="#katty-story"
        primaryLabel="Read Katty's story"
        title="Hair care starts by listening."
      />

      <section className="about-story-section" id="katty-story">
        <div className="about-story-image" data-reveal>
          <Image
            alt="Katty smiling inside her hair studio"
            fill
            sizes="(max-width: 900px) 100vw, 42vw"
            src="/founder/katty-founder-original-portrait-v5.webp"
          />
        </div>
        <div className="about-story-copy" data-reveal>
          <p className="eyebrow">Meet Katty</p>
          <h2>One studio, a full range of services.</h2>
          <p>
            Katty Hair Studio is Dominican-owned, full-service, and open to everyone. The studio’s identity reflects its ownership, never a limit on the clients, textures, or style goals welcomed here.
          </p>
          <p>
            Clients of every race, culture, texture, and gender are welcome. From blowouts and color to extensions, braids, cuts, wigs, and styling, each appointment starts with your reference, your hair history, and the result you want—not assumptions about who you are.
          </p>
          <div className="about-quote">
            <Quote aria-hidden="true" />
            <p>You do not need a certain background or hair texture to belong here. Bring the look you want, and we will shape the service around you.</p>
          </div>
        </div>
      </section>

      <section className="about-principles-section" data-reveal>
        <div className="editorial-section-heading">
          <p className="eyebrow">The studio approach</p>
          <h2>A welcoming studio from consultation to finish.</h2>
        </div>
        <div className="about-principle-list">
          {principles.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {index === 1 ? <Heart aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <LocationSection />
      <BookingSection phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />
    </EditorialPageFrame>
  );
}
