import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Mail, Phone, Scale, ShieldCheck } from "lucide-react";
import EditorialPageFrame from "./EditorialPageFrame";

export type PolicySection = {
  bullets?: readonly string[];
  id: string;
  paragraphs: readonly string[];
  title: string;
};

export default function PolicyPage({
  description,
  eyebrow,
  sections,
  title,
}: {
  description: string;
  eyebrow: string;
  sections: readonly PolicySection[];
  title: string;
}) {
  return (
    <EditorialPageFrame className="policy-page">
      <section className="policy-hero">
        <Image
          alt="The welcoming interior of Katty Hair Studio"
          className="policy-hero-image"
          fill
          loading="eager"
          sizes="100vw"
          src="/hero/katty-salon-interior-hero-clear-pink-v4.webp"
        />
        <div className="policy-hero-shade" />
        <div className="policy-hero-content">
          <nav aria-label="Breadcrumb" className="editorial-page-breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight aria-hidden="true" />
            <span aria-current="page">{title}</span>
          </nav>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
          <span><ShieldCheck aria-hidden="true" />Effective July 13, 2026</span>
        </div>
      </section>

      <section className="policy-layout">
        <aside className="policy-index" data-reveal>
          <div>
            <p className="eyebrow">On this page</p>
            <nav aria-label={`${title} sections`}>
              {sections.map((section, index) => (
                <a href={`#${section.id}`} key={section.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </a>
              ))}
            </nav>
            <p className="policy-index-note">
              <Scale aria-hidden="true" /> Questions about these terms? Contact the studio directly.
            </p>
          </div>
        </aside>

        <article className="policy-copy">
          {sections.map((section, index) => (
            <section data-reveal id={section.id} key={section.id}>
              <p className="policy-section-number">{String(index + 1).padStart(2, "0")}</p>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </section>

      <section className="policy-contact" data-reveal>
        <div>
          <p className="eyebrow">Questions or requests</p>
          <h2>Talk with the studio.</h2>
          <p>We will help with privacy requests, booking questions, cancellations, or communication preferences.</p>
        </div>
        <div className="policy-contact-actions">
          <a href="mailto:kattyhairstudio@gmail.com"><Mail aria-hidden="true" />Email the studio</a>
          <a href="tel:+12405826622"><Phone aria-hidden="true" />Call (240) 582-6622</a>
          <Link href="/booking">Request an appointment<ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </EditorialPageFrame>
  );
}
