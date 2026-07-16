import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  ClipboardCheck,
  Phone,
  Scissors,
  Sparkles,
  Star,
} from "lucide-react";
import { MobileActionBar, SiteFinalBanner, SiteFooter, SiteHeader } from "./SiteChrome";
import BookingSection from "./BookingSection";
import LocationSection from "./LocationSection";
import ViewportReveal from "./ViewportReveal";
import { absoluteLocalizedUrl, localizePath, type Locale } from "./i18n/config";
import { localServiceAreaSchema } from "./local-market";
import {
  extensionServiceSlugs,
  getRelatedServices,
  getServiceImage,
  type ServicePageData,
} from "./service-data";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";

const categoryServiceSlugs: Record<string, readonly string[]> = {
  "hair-salon": [
    "hair-coloring",
    "hairstyling",
    "balayage",
    "braids",
    "blowouts",
    "silk-press",
    "hair-highlighting",
  ],
  "hair-extension-technician": [
    "hair-extension-consultation",
    "hair-extension-installation",
    "hair-extension-maintenance",
    "hair-extension-removal",
    "hair-extension-blending-and-styling",
    "tape-in-hair-extensions",
    "sew-in-hair-extensions",
    "microlink-hair-extensions",
    "k-tip-hair-extensions",
    "quick-weave",
    "quick-weave-with-closure",
    "brazilian-knots-hair-extensions",
  ],
};

const servicePageCopy = {
  en: {
    breadcrumb: "Breadcrumb",
    home: "Home",
    hairSalon: "Hair salon",
    extensions: "Hair extensions",
    browAlt: "Professional eyebrow waxing at Katty Hair Studio",
    styledAlt: (name: string) => `${name} styled at Katty Hair Studio`,
    browKicker: "Precision brow shaping · Bladensburg Rd",
    hairKicker: "Personalized hair care · Bladensburg Rd",
    browHero: "Choose a soft cleanup or a more defined brow. We agree on the shape, review skin sensitivity, and confirm the quote before wax is applied.",
    hairHero: "Bring your reference, hair history, and goal. You will leave the consultation knowing the plan, upkeep, and quote before your service begins.",
    request: "Request appointment",
    call: "Call the studio",
    browTrust: "Shape agreed first · Skin sensitivity discussed before waxing.",
    hairTrust: "Every texture welcome · Quote confirmed before the chair.",
    proof: "Studio proof points",
    reviews: "156 Google reviews",
    personalPlan: "Personal plan",
    browPlan: "Built around your brow",
    hairPlan: "Built around your hair",
    upfront: "Upfront quote",
    beforeService: "Before service",
    intro: "Your service, made clear",
    hairSalonCategoryTitle: "Explore salon services built around your hair.",
    extensionCategoryTitle: "Explore extension services built around your natural hair.",
    detailTitle: (name: string) => `What to know about ${name.toLowerCase()}.`,
    browIntro: "Your natural growth, preferred fullness, and skin condition shape the service. The details below explain preparation, the waxing process, realistic results, and aftercare.",
    hairIntro: "Your texture, routine, and desired finish shape every recommendation. The details below help you understand the process before you reserve your chair.",
    salonService: "Hair salon service",
    extensionService: "Extension service",
    visit: "Your visit",
    process: "The process",
    helps: "When it helps",
    why: "Why Katty",
    explore: (name: string) => `Explore ${name.toLowerCase()}`,
    continue: "Continue exploring",
    relatedTitle: "Related services, one clear plan.",
    view: "View service",
    faqKicker: "Before you book",
    faqTitle: (name: string) => `Frequently asked questions about ${name} in Brentwood, MD`,
    faqIntro: "Clear answers now make your consultation easier later.",
    categoryList: (name: string) => `${name} services in Brentwood, Maryland`,
  },
  es: {
    breadcrumb: "Ruta de navegación",
    home: "Inicio",
    hairSalon: "Salón de belleza",
    extensions: "Extensiones de cabello",
    browAlt: "Depilación profesional de cejas con cera en Katty Hair Studio",
    styledAlt: (name: string) => `${name} realizado en Katty Hair Studio`,
    browKicker: "Diseño preciso de cejas · Bladensburg Rd",
    hairKicker: "Cuidado capilar personalizado · Bladensburg Rd",
    browHero: "Elige una limpieza sutil o una ceja más definida. Acordamos la forma, revisamos la sensibilidad de tu piel y confirmamos el precio antes de aplicar la cera.",
    hairHero: "Trae tu referencia, el historial de tu cabello y tu objetivo. Saldrás de la consulta con un plan claro, las indicaciones de mantenimiento y el precio antes de comenzar el servicio.",
    request: "Solicitar cita",
    call: "Llamar al salón",
    browTrust: "Primero acordamos la forma · Hablamos de la sensibilidad antes de depilar.",
    hairTrust: "Todas las texturas son bienvenidas · Confirmamos el precio antes de sentarte.",
    proof: "Razones para confiar en el salón",
    reviews: "156 reseñas en Google",
    personalPlan: "Plan personalizado",
    browPlan: "Creado para tus cejas",
    hairPlan: "Creado para tu cabello",
    upfront: "Precio confirmado",
    beforeService: "Antes del servicio",
    intro: "Tu servicio, explicado con claridad",
    hairSalonCategoryTitle: "Descubre servicios de salón pensados para tu cabello.",
    extensionCategoryTitle: "Descubre extensiones pensadas para proteger tu cabello natural.",
    detailTitle: (name: string) => `Lo que debes saber sobre ${name.toLowerCase()}.`,
    browIntro: "El crecimiento natural, el volumen que prefieres y el estado de tu piel definen el servicio. A continuación explicamos la preparación, el proceso de depilación, los resultados realistas y los cuidados posteriores.",
    hairIntro: "Tu textura, rutina y acabado deseado orientan cada recomendación. La información que sigue te ayudará a entender el proceso antes de solicitar tu cita.",
    salonService: "Servicio de salón",
    extensionService: "Servicio de extensiones",
    visit: "Tu visita",
    process: "El proceso",
    helps: "Cuándo conviene",
    why: "Por qué elegir Katty",
    explore: (name: string) => `Descubre ${name.toLowerCase()}`,
    continue: "Sigue descubriendo",
    relatedTitle: "Servicios relacionados, un plan claro.",
    view: "Ver servicio",
    faqKicker: "Antes de reservar",
    faqTitle: (name: string) => `Preguntas frecuentes sobre ${name} en Brentwood, MD`,
    faqIntro: "Tener respuestas claras ahora hará que tu consulta sea más sencilla.",
    categoryList: (name: string) => `Servicios de ${name} en Brentwood, Maryland`,
  },
} as const;

function JsonLd({ data, locale }: { data: ServicePageData; locale: Locale }) {
  const copy = servicePageCopy[locale];
  const isCategory = data.pageType === "Category Page";
  const hasCategoryParent = !isCategory && extensionServiceSlugs.has(data.slug);
  const canonical = absoluteLocalizedUrl(data.url, locale);
  const parentUrl = absoluteLocalizedUrl("/hair-extension-technician", locale);
  const parentName = copy.extensions;
  const slugs = categoryServiceSlugs[data.slug] ?? [];
  const graph: Record<string, unknown>[] = [
    {
      "@type": isCategory ? "CollectionPage" : "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: data.h1,
      description: data.description,
      inLanguage: locale,
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `https://www.kattyhairstudio.com${getServiceImage(data.slug)}`,
      },
      isPartOf: { "@id": "https://www.kattyhairstudio.com/#website" },
      about: { "@id": "https://www.kattyhairstudio.com/#business" },
      breadcrumb: { "@id": `${canonical}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: copy.hairSalon,
          item: absoluteLocalizedUrl("/", locale),
        },
        ...(!hasCategoryParent
          ? []
          : [
              {
                "@type": "ListItem",
                position: 2,
                name: parentName,
                item: parentUrl,
              },
            ]),
        {
          "@type": "ListItem",
          position: hasCategoryParent ? 3 : 2,
          name: data.name,
          item: canonical,
        },
      ],
    },
  ];

  if (!isCategory) {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: data.name,
      serviceType: data.name,
      description: data.description,
      url: canonical,
      inLanguage: locale,
      provider: { "@id": "https://www.kattyhairstudio.com/#business" },
      areaServed: data.serviceAreas
        ? data.serviceAreas.map((name) => ({ "@type": "Place", name }))
        : localServiceAreaSchema(),
    });
  } else {
    graph.push({
      "@type": "ItemList",
      "@id": `${canonical}#services`,
      name: copy.categoryList(data.name),
      inLanguage: locale,
      itemListElement: data.sections.map((section, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: section.heading,
        url: absoluteLocalizedUrl(`/services/${slugs[index]}`, locale),
      })),
    });
  }

  if (!isCategory && data.faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      mainEntity: data.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
          /</g,
          "\\u003c",
        ),
      }}
      type="application/ld+json"
    />
  );
}

export default function ServicePageTemplate({
  data,
  locale = "en",
  relatedServices,
}: {
  data: ServicePageData;
  locale?: Locale;
  relatedServices?: ServicePageData[];
}) {
  const copy = servicePageCopy[locale];
  const isCategory = data.pageType === "Category Page";
  const isBrowWaxing = data.slug === "eyebrow-waxing";
  const slugs = categoryServiceSlugs[data.slug] ?? [];
  const categoryServiceLabel = data.slug === "hair-salon" ? copy.salonService : copy.extensionService;
  const related = isCategory
    ? data.sections.map((section, index) => ({
        name: section.heading,
        url: localizePath(`/services/${slugs[index]}`, locale),
      }))
    : (relatedServices ?? getRelatedServices(data)).map((page) => ({
        name: page.name,
        url: localizePath(page.url, locale),
      }));
  const parentHref = localizePath(
    extensionServiceSlugs.has(data.slug) ? "/hair-extension-technician" : "/hair-salon",
    locale,
  );
  const parentLabel = extensionServiceSlugs.has(data.slug) ? copy.extensions : copy.hairSalon;

  return (
    <main className={`site-shell service-page-shell service-${data.slug} ${isCategory ? "service-category-page" : "service-detail-page"}`}>
      <ViewportReveal />
      <JsonLd data={data} locale={locale} />
      <SiteHeader locale={locale} />

      <section className="hero service-hero" id="top">
        <Image
          alt={data.heroImageAlt ?? (isBrowWaxing ? copy.browAlt : copy.styledAlt(data.name))}
          className="hero-image service-hero-image"
          fill
          priority
          sizes="100vw"
          src={getServiceImage(data.slug)}
        />
        <div className="hero-shade" />
        <div className="hero-content service-hero-content">
          <nav aria-label={copy.breadcrumb} className="service-breadcrumb">
            <Link href={localizePath("/", locale)}>{copy.home}</Link>
            <ChevronRight aria-hidden="true" />
            {!isCategory && (
              <>
                <Link href={parentHref}>{parentLabel}</Link>
                <ChevronRight aria-hidden="true" className="service-breadcrumb-current-divider" />
              </>
            )}
            <span aria-current="page" className="service-breadcrumb-current">{data.name}</span>
          </nav>
          <p className="eyebrow">{isBrowWaxing ? copy.browKicker : copy.hairKicker}</p>
          <h1>{data.h1}</h1>
          <p className="hero-copy">
            {data.heroDescription ?? (isBrowWaxing ? copy.browHero : copy.hairHero)}
          </p>
          <div className="hero-actions">
            <Link className="primary-link" href={localizePath("/#booking", locale)}>
              {copy.request} <ArrowRight aria-hidden="true" />
            </Link>
            <a className="secondary-link" href={`tel:${phoneNumber}`}>
              <Phone aria-hidden="true" /> {copy.call}
            </a>
          </div>
          <p className="hero-trust-line">
            {data.heroTrust ?? (isBrowWaxing ? copy.browTrust : copy.hairTrust)}
          </p>
        </div>
      </section>

      <section aria-label={copy.proof} className="proof-band service-proof-band">
        <div className="proof-card"><Star aria-hidden="true" className="proof-icon"/><strong>4.8</strong><p>{copy.reviews}</p></div>
        <div className="proof-card"><Sparkles aria-hidden="true" className="proof-icon"/><strong>{copy.personalPlan}</strong><p>{isBrowWaxing ? copy.browPlan : copy.hairPlan}</p></div>
        <div className="proof-card"><ClipboardCheck aria-hidden="true" className="proof-icon"/><strong>{copy.upfront}</strong><p>{copy.beforeService}</p></div>
      </section>

      <section className="service-intro" data-reveal>
        <p className="eyebrow">{copy.intro}</p>
        <h2>{isCategory
          ? data.slug === "hair-salon" ? copy.hairSalonCategoryTitle : copy.extensionCategoryTitle
          : copy.detailTitle(data.name)}
        </h2>
        <p>{data.intro ?? (isBrowWaxing ? copy.browIntro : copy.hairIntro)}</p>
      </section>

      <div className="service-editorial-sections">
        {data.sections.map((section, index) => (
          <section
            className={`service-editorial ${index % 2 ? "service-editorial-reverse" : ""} ${section.media ? "service-editorial-has-media" : ""}`}
            data-reveal
            key={section.heading}
          >
            <div className="service-editorial-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
            <div className="service-editorial-copy">
              <p className="eyebrow">{isCategory ? categoryServiceLabel : index === 0 ? copy.visit : index === 1 ? copy.process : index === 2 ? copy.helps : copy.why}</p>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {isCategory && related[index] && (
                <Link className="service-text-link" href={related[index].url}>
                  {copy.explore(related[index].name)} <ArrowRight aria-hidden="true" />
                </Link>
              )}
            </div>
            {section.media && (
              <figure className="service-editorial-art">
                <Image
                  alt={section.media.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                  src={section.media.src}
                  style={{ objectPosition: section.media.position ?? "center" }}
                  title={section.media.title}
                />
                {section.media.caption && <figcaption>{section.media.caption}</figcaption>}
              </figure>
            )}
          </section>
        ))}
      </div>

      {!isCategory && (
        <section className="service-related" data-reveal>
          <div>
            <p className="eyebrow">{copy.continue}</p>
            <h2>{copy.relatedTitle}</h2>
          </div>
          <div className="service-related-links">
            {related.map((item) => (
              <Link href={item.url} key={item.url}>
                <Scissors aria-hidden="true" />
                <span>{item.name}<small>{copy.view}</small></span>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <LocationSection locale={locale} />
      <BookingSection locale={locale} phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />

      <section aria-labelledby="service-faq-heading" className="service-faq" data-reveal id="faq">
        <div className="service-faq-heading">
          <p className="eyebrow">{copy.faqKicker}</p>
          <h2 id="service-faq-heading">{copy.faqTitle(data.name)}</h2>
          <p>{copy.faqIntro}</p>
        </div>
        <div className="service-faq-list">
          {data.faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>{faq.question}<span aria-hidden="true">+</span></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <SiteFinalBanner locale={locale} />
      <SiteFooter locale={locale} />
      <MobileActionBar locale={locale} />
    </main>
  );
}
