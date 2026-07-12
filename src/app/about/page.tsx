import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Quote, Sparkles } from "lucide-react";
import BookingSection from "../BookingSection";
import EditorialPageFrame from "../EditorialPageFrame";
import EditorialPageHero from "../EditorialPageHero";
import LocationSection from "../LocationSection";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";

export const metadata: Metadata = {
  title: "Meet Katty | Katty Hair Studio Brentwood, MD",
  description:
    "Meet Katty, founder and stylist of Dominican Katty Hair Studio in Brentwood, Maryland, and learn about her personal, texture-aware approach to hair care.",
  alternates: { canonical: "https://www.kattyhairstudio.com/about" },
};

const principles = [
  {
    title: "Listen before styling",
    detail: "Your reference, history, routine, and desired upkeep shape the recommendation before tools come out.",
  },
  {
    title: "Welcome every texture",
    detail: "The service changes for your density, curl pattern, length, condition, and the way you want to wear the result.",
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
        description="Katty built her Brentwood studio around personal consultations, clear expectations, and polished hair that still feels like you."
        eyebrow="Founder + stylist"
        image="/founder/katty-founder-white-suit-editorial.webp"
        imageAlt="Katty, founder of Katty Hair Studio, standing in her pink Brentwood salon"
        imagePosition="42% center"
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
          <h2>A personal studio with a Dominican point of view.</h2>
          <p>
            Katty Hair Studio was shaped around the kind of appointment where clients can show a reference, explain what has happened to their hair, and receive an honest plan for what comes next.
          </p>
          <p>
            From blowouts and color to extensions, braids, cuts, wigs, and styling, the goal is not to force every client into the same finish. It is to understand the look, protect the hair underneath, and make the upkeep clear.
          </p>
          <div className="about-quote">
            <Quote aria-hidden="true" />
            <p>Bring the look you want. We will shape the service around your hair and the way you want to leave.</p>
          </div>
        </div>
      </section>

      <section className="about-principles-section" data-reveal>
        <div className="editorial-section-heading">
          <p className="eyebrow">The studio approach</p>
          <h2>Clear care from consultation to finish.</h2>
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
