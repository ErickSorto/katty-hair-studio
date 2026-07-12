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
import {
  extensionServiceSlugs,
  getRelatedServices,
  getServiceImage,
  type ServicePageData,
} from "./service-data";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";

function JsonLd({ data }: { data: ServicePageData }) {
  const isCategory = data.pageType === "Category Page";
  const hasCategoryParent = !isCategory && extensionServiceSlugs.has(data.slug);
  const parentUrl = "https://www.kattyhairstudio.com/hair-extension-technician";
  const parentName = "Hair extension technician";
  const graph: Record<string, unknown>[] = [
    {
      "@type": isCategory ? "CollectionPage" : "WebPage",
      "@id": `${data.canonical}#webpage`,
      url: data.canonical,
      name: data.h1,
      isPartOf: { "@id": "https://www.kattyhairstudio.com/#website" },
      about: { "@id": "https://www.kattyhairstudio.com/#business" },
      breadcrumb: { "@id": `${data.canonical}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${data.canonical}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Hair salon",
          item: "https://www.kattyhairstudio.com/",
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
          item: data.canonical,
        },
      ],
    },
  ];

  if (!isCategory) {
    graph.push({
      "@type": "Service",
      "@id": `${data.canonical}#service`,
      name: data.name,
      serviceType: data.name,
      url: data.canonical,
      provider: { "@id": "https://www.kattyhairstudio.com/#business" },
      areaServed: { "@type": "City", name: "Brentwood, Maryland" },
    });
  } else {
    graph.push({
      "@type": "ItemList",
      "@id": `${data.canonical}#services`,
      name: `${data.name} services in Brentwood, Maryland`,
      itemListElement: data.sections.map((section, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: section.heading,
        url: `https://www.kattyhairstudio.com/services/${section.heading
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`,
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

export default function ServicePageTemplate({ data }: { data: ServicePageData }) {
  const isCategory = data.pageType === "Category Page";
  const related = isCategory
    ? data.sections.map((section) => ({
        name: section.heading,
        url: `/services/${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      }))
    : getRelatedServices(data).map((page) => ({ name: page.name, url: page.url }));
  const parentHref =
    !isCategory && extensionServiceSlugs.has(data.slug) ? "/hair-extension-technician" : "/";
  const parentLabel = parentHref === "/" ? "Hair salon" : "Hair extension technician";

  return (
    <main className={`site-shell service-page-shell service-${data.slug}`}>
      <ViewportReveal />
      <JsonLd data={data} />
      <SiteHeader />

      <section className="hero service-hero" id="top">
        <Image
          alt={`${data.name} styled at Katty Hair Studio`}
          className="hero-image service-hero-image"
          fill
          priority
          sizes="100vw"
          src={getServiceImage(data.slug)}
        />
        <div className="hero-shade" />
        <div className="hero-content service-hero-content">
          <nav aria-label="Breadcrumb" className="service-breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight aria-hidden="true" />
            {!isCategory && extensionServiceSlugs.has(data.slug) && (
              <>
                <Link href={parentHref}>{parentLabel}</Link>
                <ChevronRight aria-hidden="true" />
              </>
            )}
            <span aria-current="page">{data.name}</span>
          </nav>
          <p className="eyebrow">Personalized hair care · Bladensburg Rd</p>
          <h1>{data.h1}</h1>
          <p className="hero-copy">
            Bring your reference, hair history, and goal. You will leave the consultation
            knowing the plan, upkeep, and quote before your service begins.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" href="/#booking">
              Request appointment <ArrowRight aria-hidden="true" />
            </Link>
            <a className="secondary-link" href={`tel:${phoneNumber}`}>
              <Phone aria-hidden="true" /> Call the studio
            </a>
          </div>
          <p className="hero-trust-line">Every texture welcome · Quote confirmed before the chair.</p>
        </div>
      </section>

      <section aria-label="Studio proof points" className="proof-band service-proof-band">
        <div className="proof-card"><Star aria-hidden="true" className="proof-icon"/><strong>4.8</strong><p>156 Google reviews</p></div>
        <div className="proof-card"><Sparkles aria-hidden="true" className="proof-icon"/><strong>Personal plan</strong><p>Built around your hair</p></div>
        <div className="proof-card"><ClipboardCheck aria-hidden="true" className="proof-icon"/><strong>Upfront quote</strong><p>Before service</p></div>
      </section>

      <section className="service-intro" data-reveal>
        <p className="eyebrow">Your service, made clear</p>
        <h2>{isCategory ? "Explore extension services built around your natural hair." : `What to know about ${data.name.toLowerCase()}.`}</h2>
        <p>
          Your texture, routine, and desired finish shape every recommendation. The details
          below help you understand the process before you reserve your chair.
        </p>
      </section>

      <div className="service-editorial-sections">
        {data.sections.map((section, index) => (
          <section className={`service-editorial ${index % 2 ? "service-editorial-reverse" : ""}`} data-reveal key={section.heading}>
            <div className="service-editorial-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
            <div className="service-editorial-copy">
              <p className="eyebrow">{isCategory ? "Extension service" : index === 0 ? "Your visit" : index === 1 ? "The process" : index === 2 ? "When it helps" : "Why Katty"}</p>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {isCategory && related[index] && (
                <Link className="service-text-link" href={related[index].url}>
                  Explore {related[index].name.toLowerCase()} <ArrowRight aria-hidden="true" />
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>

      {!isCategory && (
        <section className="service-related" data-reveal>
          <div>
            <p className="eyebrow">Continue exploring</p>
            <h2>Related services, one clear plan.</h2>
          </div>
          <div className="service-related-links">
            {related.map((item) => (
              <Link href={item.url} key={item.url}>
                <Scissors aria-hidden="true" />
                <span>{item.name}<small>View service</small></span>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <LocationSection />
      <BookingSection phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />

      <section className="service-faq" data-reveal>
        <div className="service-faq-heading">
          <p className="eyebrow">Before you book</p>
          <h2>Frequently asked questions about {data.name} in Brentwood, MD</h2>
          <p>Clear answers now make your consultation easier later.</p>
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

      <SiteFinalBanner />
      <SiteFooter />
      <MobileActionBar />
    </main>
  );
}
