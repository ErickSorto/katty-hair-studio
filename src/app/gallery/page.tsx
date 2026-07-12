import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import BookingSection from "../BookingSection";
import EditorialPageFrame from "../EditorialPageFrame";
import EditorialPageHero from "../EditorialPageHero";
import LocationSection from "../LocationSection";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const instagramUrl = "https://www.instagram.com/kattyhairstudio_/";

export const metadata: Metadata = {
  title: "Hair Gallery | Katty Hair Studio Brentwood, MD",
  description:
    "Explore blowouts, extensions, highlights, braids, curls, cuts, and polished hair finishes from Katty Hair Studio in Brentwood, Maryland.",
  alternates: { canonical: "https://www.kattyhairstudio.com/gallery" },
};

const galleryItems = [
  { image: "/gallery/katty-glossy-body-waves-themed.webp", title: "Glossy body waves", alt: "Long glossy black body waves", position: "58% center" },
  { image: "/gallery/katty-golden-dimension-themed.webp", title: "Golden dimension", alt: "Voluminous curls with golden dimension", position: "50% center" },
  { image: "/gallery/katty-silky-side-waves-themed-v2.webp", title: "Silky side waves", alt: "Long black side-parted waves", position: "50% 42%" },
  { image: "/gallery/katty-copper-waves-themed.webp", title: "Copper waves", alt: "Long polished copper waves", position: "50% center" },
  { image: "/gallery/katty-sculpted-curls-themed.webp", title: "Sculpted curls", alt: "Long glossy sculpted curls", position: "50% center" },
  { image: "/gallery/katty-vintage-curl-set-themed-v2.webp", title: "Vintage curl set", alt: "Glossy vintage curl set", position: "50% 40%" },
  { image: "/services/generated/quick-weave-v2.webp", title: "Quick-weave bob", alt: "Sleek shoulder-length quick-weave bob", position: "50% 42%" },
  { image: "/services/generated/hair-highlighting-v2.webp", title: "Dimensional highlights", alt: "Warm honey brunette highlights", position: "50% 42%" },
  { image: "/services/generated/twist-braids-v2.webp", title: "Rope twists", alt: "Long polished two-strand rope twists", position: "50% 38%" },
  { image: "/services/generated/womens-haircuts-v2.webp", title: "Layered shape", alt: "Fresh collarbone-length layered haircut", position: "50% 42%" },
  { image: "/services/generated/brazilian-knots-hair-extensions-v2.webp", title: "Textured length", alt: "Long voluminous textured extensions", position: "50% 40%" },
  { image: "/services/generated/mens-haircuts-v2.webp", title: "Braided grooming", alt: "Men's braided style with sharp line-up and beard", position: "50% 38%" },
] as const;

export default function GalleryPage() {
  return (
    <EditorialPageFrame className="editorial-gallery-page">
      <EditorialPageHero
        description="Explore polished finishes, dimensional color, protective styles, extension work, and shapes worth saving for your consultation."
        eyebrow="The finish gallery"
        image="/gallery/katty-golden-dimension-themed.webp"
        imageAlt="Katty Hair Studio client with voluminous curls and golden dimension"
        imagePosition="50% 40%"
        pageLabel="Gallery"
        primaryHref="#full-gallery"
        primaryLabel="Explore the gallery"
        title="Find the finish you want to bring in."
      />

      <section className="full-gallery-section" id="full-gallery">
        <div className="editorial-section-heading" data-reveal>
          <p className="eyebrow">Save your reference</p>
          <h2>Texture, movement, color, and shape.</h2>
          <p>Use these images as a starting point. Your service is adjusted to your hair history, density, length, and upkeep.</p>
          <a href={instagramUrl} rel="noreferrer" target="_blank">
            <ExternalLink aria-hidden="true" /> Follow the latest work on Instagram
          </a>
        </div>
        <div className="editorial-gallery-grid" data-reveal>
          {galleryItems.map((item) => (
            <figure key={item.title}>
              <Image
                alt={item.alt}
                fill
                sizes="(max-width: 740px) 100vw, (max-width: 1100px) 50vw, 25vw"
                src={item.image}
                style={{ objectPosition: item.position }}
              />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <LocationSection />
      <BookingSection phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />
    </EditorialPageFrame>
  );
}
