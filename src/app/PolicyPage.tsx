import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Mail, Phone, Scale, ShieldCheck } from "lucide-react";
import EditorialPageFrame from "./EditorialPageFrame";
import { localizePath, type Locale } from "./i18n/config";

export type PolicySection = {
  bullets?: readonly string[];
  id: string;
  paragraphs: readonly string[];
  title: string;
};

export default function PolicyPage({
  description,
  eyebrow,
  locale = "en",
  sections,
  title,
}: {
  description: string;
  eyebrow: string;
  locale?: Locale;
  sections: readonly PolicySection[];
  title: string;
}) {
  const copy = locale === "es"
    ? {
        alt: "El acogedor interior de Katty Hair Studio",
        breadcrumb: "Inicio",
        contactBody: "Te ayudaremos con solicitudes de privacidad, preguntas sobre reservas, cancelaciones o preferencias de comunicación.",
        contactEyebrow: "Preguntas o solicitudes",
        contactTitle: "Habla con el salón.",
        effective: "Vigente desde el 13 de julio de 2026",
        email: "Enviar un correo al salón",
        index: "En esta página",
        note: "¿Tienes preguntas sobre esta información? Comunícate directamente con el salón.",
        phone: "Llamar al (240) 582-6622",
        request: "Solicitar una cita",
        sections: `Secciones de ${title}`,
      }
    : {
        alt: "The welcoming interior of Katty Hair Studio",
        breadcrumb: "Home",
        contactBody: "We will help with privacy requests, booking questions, cancellations, or communication preferences.",
        contactEyebrow: "Questions or requests",
        contactTitle: "Talk with the studio.",
        effective: "Effective July 13, 2026",
        email: "Email the studio",
        index: "On this page",
        note: "Questions about this information? Contact the studio directly.",
        phone: "Call (240) 582-6622",
        request: "Request an appointment",
        sections: `${title} sections`,
      };

  return (
    <EditorialPageFrame className="policy-page" locale={locale}>
      <section className="policy-hero">
        <Image
          alt={copy.alt}
          className="policy-hero-image"
          fill
          loading="eager"
          sizes="100vw"
          src="/hero/katty-salon-interior-hero-clear-pink-v4.webp"
        />
        <div className="policy-hero-shade" />
        <div className="policy-hero-content">
          <nav aria-label={locale === "es" ? "Ruta de navegación" : "Breadcrumb"} className="editorial-page-breadcrumb">
            <Link href={localizePath("/", locale)}>{copy.breadcrumb}</Link>
            <ChevronRight aria-hidden="true" />
            <span aria-current="page">{title}</span>
          </nav>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
          <span><ShieldCheck aria-hidden="true" />{copy.effective}</span>
        </div>
      </section>

      <section className="policy-layout">
        <aside className="policy-index" data-reveal>
          <div>
            <p className="eyebrow">{copy.index}</p>
            <nav aria-label={copy.sections}>
              {sections.map((section, index) => (
                <a href={`#${section.id}`} key={section.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </a>
              ))}
            </nav>
            <p className="policy-index-note">
              <Scale aria-hidden="true" /> {copy.note}
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
          <p className="eyebrow">{copy.contactEyebrow}</p>
          <h2>{copy.contactTitle}</h2>
          <p>{copy.contactBody}</p>
        </div>
        <div className="policy-contact-actions">
          <a href="mailto:kattyhairstudio@gmail.com"><Mail aria-hidden="true" />{copy.email}</a>
          <a href="tel:+12405826622"><Phone aria-hidden="true" />{copy.phone}</a>
          <Link href={localizePath("/booking", locale)}>{copy.request}<ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </EditorialPageFrame>
  );
}
