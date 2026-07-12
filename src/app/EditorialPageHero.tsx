import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, Phone } from "lucide-react";

const phoneNumber = "+12405826622";

export default function EditorialPageHero({
  align = "left",
  description,
  eyebrow,
  image,
  imageAlt,
  imagePosition = "center",
  pageLabel,
  primaryHref,
  primaryLabel,
  title,
}: {
  align?: "left" | "right";
  description: string;
  eyebrow: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  pageLabel: string;
  primaryHref: string;
  primaryLabel: string;
  title: string;
}) {
  return (
    <section className={`editorial-page-hero editorial-page-hero-${align}`}>
      <Image
        alt={imageAlt}
        className="editorial-page-hero-image"
        fill
        loading="eager"
        sizes="100vw"
        src={image}
        style={{ objectPosition: imagePosition }}
      />
      <div className="editorial-page-hero-shade" />
      <div className="editorial-page-hero-content">
        <nav aria-label="Breadcrumb" className="editorial-page-breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight aria-hidden="true" />
          <span aria-current="page">{pageLabel}</span>
        </nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="editorial-page-hero-copy">{description}</p>
        <div className="editorial-page-hero-actions">
          <Link className="primary-link" href={primaryHref}>
            <CalendarDays aria-hidden="true" />
            {primaryLabel}
            <ArrowRight aria-hidden="true" />
          </Link>
          <a className="editorial-page-hero-call" href={`tel:${phoneNumber}`}>
            <Phone aria-hidden="true" />
            Call the studio
          </a>
        </div>
        <p className="editorial-page-trust">Every texture welcome · Quote confirmed before the chair.</p>
      </div>
    </section>
  );
}
