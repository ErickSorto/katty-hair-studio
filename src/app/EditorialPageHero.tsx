import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, Phone } from "lucide-react";
import { localizePath, type Locale } from "./i18n/config";

const phoneNumber = "+12405826622";

export default function EditorialPageHero({
  align = "left",
  description,
  eyebrow,
  image,
  imageAlt,
  imagePosition = "center",
  locale = "en",
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
  locale?: Locale;
  pageLabel: string;
  primaryHref: string;
  primaryLabel: string;
  title: string;
}) {
  const shared = locale === "es"
    ? { breadcrumb: "Inicio", call: "Llamar al salón", trust: "Todas las texturas son bienvenidas · Confirmamos el precio antes de comenzar." }
    : { breadcrumb: "Home", call: "Call the studio", trust: "Every texture welcome · Quote confirmed before the chair." };

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
        <nav aria-label={locale === "es" ? "Ruta de navegación" : "Breadcrumb"} className="editorial-page-breadcrumb">
          <Link href={localizePath("/", locale)}>{shared.breadcrumb}</Link>
          <ChevronRight aria-hidden="true" />
          <span aria-current="page">{pageLabel}</span>
        </nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="editorial-page-hero-copy">{description}</p>
        <div className="editorial-page-hero-actions">
          <Link className="primary-link" href={localizePath(primaryHref, locale)}>
            <CalendarDays aria-hidden="true" />
            {primaryLabel}
            <ArrowRight aria-hidden="true" />
          </Link>
          <a className="editorial-page-hero-call" href={`tel:${phoneNumber}`}>
            <Phone aria-hidden="true" />
            {shared.call}
          </a>
        </div>
        <p className="editorial-page-trust">{shared.trust}</p>
      </div>
    </section>
  );
}
