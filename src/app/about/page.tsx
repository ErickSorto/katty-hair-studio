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
    "Meet Katty, founder of a Dominican-owned and all-welcome hair studio in Brentwood, Maryland, serving every texture, background, and style goal.",
  alternates: { canonical: "https://www.kattyhairstudio.com/about" },
};

const principles = [
  {
    title: "Listen before styling",
    detail: "Your reference, history, routine, and desired upkeep shape the recommendation before tools come out.",
  },
  {
    title: "Everyone is welcome",
    detail: "Every background, texture, gender, and style goal belongs here. Dominican-owned describes Katty's roots—not a limit on who can sit in the chair.",
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
        description="Dominican-owned and open to everyone, Katty's Brentwood studio welcomes every texture, background, and style goal with personal care."
        eyebrow="Dominican-owned · Everyone welcome"
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
          <h2>Dominican roots, with a chair for everyone.</h2>
          <p>
            Katty’s Dominican heritage is part of the studio’s story and the experience she brings to the chair. It reflects her roots, not a requirement for the clients she serves.
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
