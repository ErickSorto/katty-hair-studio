import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Phone, Sparkles } from "lucide-react";
import BookingSection from "./BookingSection";
import EditorialPageFrame from "./EditorialPageFrame";
import EditorialPageHero from "./EditorialPageHero";
import LocationSection from "./LocationSection";
import { absoluteLocalizedUrl, localizePath, type Locale } from "./i18n/config";
import { serviceNavigationCopy } from "./i18n/shared-copy";
import { localServiceAreaSchema } from "./local-market";
import { topPriorityServices } from "./service-priority";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";

const hubCopy = {
  en: {
    hero: {
      description:
        "Explore silk presses, Dominican blowouts, color, cuts, braids, wigs, treatments, and hair extensions—then request a personalized appointment in Brentwood.",
      eyebrow: "Full-service · Dominican-owned · Every texture welcome",
      imageAlt:
        "Katty Hair Studio interior in Brentwood, Maryland, where clients receive salon and hair extension services",
      pageLabel: "Services",
      primaryLabel: "Request appointment",
      title: "Hair salon services in Brentwood, MD",
    },
    categories: {
      body: "Start with the category that best matches your goal. Each category page explains the available services, what to expect, and the questions to bring to your consultation.",
      eyebrow: "Choose your path",
      links: ["Explore hair salon services", "Explore hair extension services"],
      title: "Two clear ways to find the right service.",
    },
    directory: {
      body: "Browse every service by goal. Each link opens a focused guide with the process, upkeep, related options, and a direct path to request your appointment.",
      eyebrow: "Complete service directory",
      groupDescriptions: [
        "Dimensional color, brightness, and tone planned around your current hair and maintenance goals.",
        "Smoothness, movement, curl care, and polished finishes for natural, relaxed, and textured hair.",
        "Shape, protective styling, finishing details, and practical upkeep for your everyday routine.",
        "Consultation-led length and volume options, including installation, blending, maintenance, and removal.",
      ],
      serviceLabel: "View service guide",
      title: "Find the service you have in mind.",
    },
    priority: {
      body: "These pages match the clearest local booking intent around Brentwood and the DMV. Start here, then compare related options in the full directory.",
      eyebrow: "Highest-intent service paths",
      linkLabel: "Explore service",
      title: "Start with the services clients actively look for.",
    },
    decision: {
      body: "Bring a reference photo and share your hair history, current condition, routine, and desired upkeep. Katty will help narrow the options and confirm the plan, timing, and quote before the service begins.",
      call: "Call the studio",
      eyebrow: "Not sure which service to choose?",
      request: "Request a consultation",
      title: "You do not have to decide alone.",
    },
    local: {
      body: "Katty Hair Studio is located at 3816 Bladensburg Rd in Brentwood, convenient to North Brentwood, Mount Rainier, Hyattsville, Bladensburg, and Colmar Manor.",
      label: "One Brentwood studio · Salon and extension services",
    },
    schemaName: "Hair salon and hair extension services in Brentwood, Maryland",
  },
  es: {
    hero: {
      description:
        "Explora silk press, blowouts dominicanos, color, cortes, trenzas, pelucas, tratamientos y extensiones; luego solicita una cita personalizada en Brentwood.",
      eyebrow: "Servicio completo · Propiedad dominicana · Todas las texturas",
      imageAlt:
        "Interior de Katty Hair Studio en Brentwood, Maryland, donde se ofrecen servicios de salón y extensiones de cabello",
      pageLabel: "Servicios",
      primaryLabel: "Solicitar cita",
      title: "Servicios de salón de belleza en Brentwood, MD",
    },
    categories: {
      body: "Comienza con la categoría que mejor corresponde a tu objetivo. Cada página explica los servicios disponibles, qué esperar y qué preguntas llevar a tu consulta.",
      eyebrow: "Elige tu camino",
      links: ["Explorar servicios de salón", "Explorar servicios de extensiones"],
      title: "Dos formas claras de encontrar el servicio ideal.",
    },
    directory: {
      body: "Explora todos los servicios según tu objetivo. Cada enlace abre una guía específica con el proceso, mantenimiento, opciones relacionadas y una ruta directa para solicitar tu cita.",
      eyebrow: "Directorio completo de servicios",
      groupDescriptions: [
        "Color con dimensión, luminosidad y tono planeado según tu cabello actual y el mantenimiento que deseas.",
        "Suavidad, movimiento, cuidado de rizos y acabados pulidos para cabello natural, relajado y texturizado.",
        "Forma, estilos protectores, detalles de acabado y mantenimiento práctico para tu rutina diaria.",
        "Opciones de largo y volumen guiadas por consulta, con instalación, integración, mantenimiento y retiro.",
      ],
      serviceLabel: "Ver guía del servicio",
      title: "Encuentra el servicio que tienes en mente.",
    },
    priority: {
      body: "Estas páginas corresponden a las búsquedas con intención de reserva más clara en Brentwood y el DMV. Empieza aquí y luego compara opciones relacionadas en el directorio completo.",
      eyebrow: "Servicios con mayor intención",
      linkLabel: "Explorar servicio",
      title: "Comienza con los servicios que las clientas buscan activamente.",
    },
    decision: {
      body: "Trae una foto de referencia y comparte el historial, estado actual, rutina y mantenimiento deseado para tu cabello. Katty te ayudará a reducir las opciones y confirmará el plan, el tiempo y el precio antes de comenzar.",
      call: "Llamar al salón",
      eyebrow: "¿No sabes qué servicio elegir?",
      request: "Solicitar una consulta",
      title: "No tienes que decidir sola.",
    },
    local: {
      body: "Katty Hair Studio está en 3816 Bladensburg Rd en Brentwood, cerca de North Brentwood, Mount Rainier, Hyattsville, Bladensburg y Colmar Manor.",
      label: "Un salón en Brentwood · Servicios de salón y extensiones",
    },
    schemaName: "Servicios de salón de belleza y extensiones en Brentwood, Maryland",
  },
} as const;

function ServicesHubJsonLd({ locale }: { locale: Locale }) {
  const copy = hubCopy[locale];
  const navigation = serviceNavigationCopy[locale];
  const canonical = absoluteLocalizedUrl("/services", locale);
  const allServiceItems = navigation.groups.flatMap((group) =>
    group.links.map(([name, href]) => ({ name, href })),
  );
  const priorityItems = topPriorityServices.map((service) => ({
    name: service.label[locale],
    href: service.href,
  }));
  const priorityHrefs = new Set<string>(priorityItems.map((item) => item.href));
  const itemList = [
    ...navigation.categoryGateways.map((item) => ({ name: item.label, href: item.href })),
    ...priorityItems,
    ...allServiceItems.filter((item) => !priorityHrefs.has(item.href)),
  ];
  const graph = [
    {
      "@type": "CollectionPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: copy.hero.title,
      description: copy.hero.description,
      inLanguage: locale === "es" ? "es-US" : "en-US",
      isPartOf: { "@id": "https://www.kattyhairstudio.com/#website" },
      about: { "@id": "https://www.kattyhairstudio.com/#business" },
      spatialCoverage: localServiceAreaSchema(),
      mainEntity: { "@id": `${canonical}#service-list` },
      breadcrumb: { "@id": `${canonical}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "es" ? "Inicio" : "Home",
          item: absoluteLocalizedUrl("/", locale),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: copy.hero.pageLabel,
          item: canonical,
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${canonical}#service-list`,
      name: copy.schemaName,
      numberOfItems: itemList.length,
      itemListElement: itemList.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteLocalizedUrl(item.href, locale),
      })),
    },
  ];

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

export default function ServicesHubPage({ locale = "en" }: { locale?: Locale }) {
  const copy = hubCopy[locale];
  const navigation = serviceNavigationCopy[locale];
  const categoryImages = [
    {
      alt: locale === "es"
        ? "Interior rosado de Katty Hair Studio para servicios de salón en Brentwood, Maryland"
        : "Pink Katty Hair Studio interior for hair salon services in Brentwood, Maryland",
      position: "center 54%",
      src: "/hero/katty-salon-interior-hero-clear-pink-v4.webp",
      title: locale === "es"
        ? "Servicios de salón de belleza en Brentwood MD — Katty Hair Studio"
        : "Hair salon services in Brentwood MD — Katty Hair Studio",
    },
    {
      alt: locale === "es"
        ? "Cabello largo con extensiones negras brillantes integradas y peinadas en Katty Hair Studio"
        : "Long glossy black hair extensions blended and styled at Katty Hair Studio",
      position: "center 34%",
      src: "/services/generated/hair-extension-technician-v2.webp",
      title: locale === "es"
        ? "Servicios de extensiones de cabello en Brentwood MD — Katty Hair Studio"
        : "Hair extension services in Brentwood MD — Katty Hair Studio",
    },
  ];

  return (
    <EditorialPageFrame className="services-hub-page" locale={locale}>
      <ServicesHubJsonLd locale={locale} />
      <EditorialPageHero
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        image="/hero/katty-salon-interior-hero-clear-pink-v4.webp"
        imageAlt={copy.hero.imageAlt}
        imagePosition="center 54%"
        locale={locale}
        pageLabel={copy.hero.pageLabel}
        primaryHref="/booking"
        primaryLabel={copy.hero.primaryLabel}
        title={copy.hero.title}
      />

      <section aria-labelledby="services-category-heading" className="services-hub-categories">
        <div className="services-hub-heading" data-reveal>
          <p className="eyebrow">{copy.categories.eyebrow}</p>
          <h2 id="services-category-heading">{copy.categories.title}</h2>
          <p>{copy.categories.body}</p>
        </div>
        <div className="services-hub-category-list">
          {navigation.categoryGateways.map((category, index) => (
            <article className="services-hub-category" data-reveal key={category.href}>
              <Link
                aria-label={copy.categories.links[index]}
                className="services-hub-category-media"
                href={localizePath(category.href, locale)}
              >
                <Image
                  alt={categoryImages[index].alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  src={categoryImages[index].src}
                  style={{ objectPosition: categoryImages[index].position }}
                  title={categoryImages[index].title}
                />
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </Link>
              <div className="services-hub-category-copy">
                <p>{category.eyebrow}</p>
                <h3>{category.label}</h3>
                <p>{category.description}</p>
                <Link href={localizePath(category.href, locale)}>
                  {copy.categories.links[index]} <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="priority-services-heading" className="services-hub-priority">
        <div className="services-hub-priority-heading" data-reveal>
          <p className="eyebrow">{copy.priority.eyebrow}</p>
          <h2 id="priority-services-heading">{copy.priority.title}</h2>
          <p>{copy.priority.body}</p>
        </div>
        <nav aria-label={copy.priority.title} className="services-hub-priority-links" data-reveal>
          {topPriorityServices.map((service, index) => (
            <Link href={localizePath(service.href, locale)} key={service.href}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <strong>{service.label[locale]}</strong>
              <small>{copy.priority.linkLabel}</small>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>

      <section aria-labelledby="service-directory-heading" className="services-hub-directory">
        <div className="services-hub-directory-intro" data-reveal>
          <div className="services-hub-heading">
            <p className="eyebrow">{copy.directory.eyebrow}</p>
            <h2 id="service-directory-heading">{copy.directory.title}</h2>
            <p>{copy.directory.body}</p>
          </div>
          <div className="services-hub-local-note">
            <MapPin aria-hidden="true" />
            <div>
              <strong>{copy.local.label}</strong>
              <p>{copy.local.body}</p>
            </div>
          </div>
        </div>
        <div className="services-hub-groups">
          {navigation.groups.map((group, groupIndex) => (
            <section data-reveal key={group.label}>
              <div className="services-hub-group-heading">
                <span aria-hidden="true">{String(groupIndex + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{group.label}</h3>
                  <p>{copy.directory.groupDescriptions[groupIndex]}</p>
                </div>
              </div>
              <nav aria-label={group.label}>
                {group.links.map(([label, href]) => (
                  <Link href={localizePath(href, locale)} key={href}>
                    <span>{label}<small>{copy.directory.serviceLabel}</small></span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                ))}
              </nav>
            </section>
          ))}
        </div>
      </section>

      <section className="services-hub-decision" data-reveal>
        <div>
          <p className="eyebrow"><Sparkles aria-hidden="true" />{copy.decision.eyebrow}</p>
          <h2>{copy.decision.title}</h2>
          <p>{copy.decision.body}</p>
        </div>
        <div className="services-hub-decision-actions">
          <Link className="primary-link" href={localizePath("/booking", locale)}>
            <CalendarDays aria-hidden="true" />
            {copy.decision.request}
            <ArrowRight aria-hidden="true" />
          </Link>
          <a href={`tel:${phoneNumber}`}>
            <Phone aria-hidden="true" />
            {copy.decision.call}
          </a>
        </div>
      </section>

      <LocationSection locale={locale} />
      <BookingSection locale={locale} phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />
    </EditorialPageFrame>
  );
}
