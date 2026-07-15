import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  BadgePercent,
  CalendarDays,
  Check,
  ClipboardCheck,
  ExternalLink,
  Gem,
  Heart,
  MessageCircle,
  Palette,
  PlayCircle,
  Quote,
  Scissors,
  Sparkles,
  Star,
  Store,
  Timer,
  WandSparkles,
} from "lucide-react";
import BookingSection from "@/app/BookingSection";
import LocationSection from "@/app/LocationSection";
import { MobileActionBar, SiteFinalBanner, SiteFooter, SiteHeader } from "@/app/SiteChrome";
import ReviewPager from "@/app/ReviewPager";
import VideoStoryStack from "@/app/VideoStoryStack";
import ViewportReveal from "@/app/ViewportReveal";
import { localizePath, type Locale } from "@/app/i18n/config";
import { localizedAlternates } from "@/app/i18n/config";

export const metadata: Metadata = {
  title: "Katty Hair Studio | Hair Salon in Brentwood, MD",
  description:
    "Katty Hair Studio is a full-service hair salon at 3816 Bladensburg Rd, Brentwood, MD, offering silk presses, Dominican blowouts, haircuts, color, braids and extensions.",
  alternates: localizedAlternates("/", "en"),
  openGraph: {
    title: "Katty Hair Studio | Hair Salon in Brentwood, MD",
    description:
      "Visit our full-service Brentwood hair salon for silk presses, Dominican blowouts, haircuts, color, braids, extensions, treatments and styling for every texture.",
    url: "https://www.kattyhairstudio.com/",
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "en_US",
    alternateLocale: ["es_US"],
    images: [{ url: "/social/katty-share-preview.webp", width: 1200, height: 630, alt: "Katty Hair Studio founder Kathy De la Paz" }],
  },
};

type SiteIcon = LucideIcon;

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const instagramUrl = "https://www.instagram.com/kattyhairstudio_/";
const facebookUrl = "https://www.facebook.com/DominicanKattyHairStudio";
const youtubeUrl = "https://www.youtube.com/@DominicanKattyHairStudio";
const xUrl = "https://x.com/DominicanKatty";
const tiktokUrl = "https://www.tiktok.com/@dominicankattyhairstudio";
const googleReviewsUrl =
  "https://www.google.com/search?q=katty+hair+studio&oq=ka&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7Mg8IARAuGCcYrwEYxwEYjgUyBggCEEUYOzIGCAMQIxgnMgoIBBAuGLEDGIAEMgYIBRBFGDkyBggGEEUYPTIGCAcQRRg90gEIMjg4MWowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#";
const bestProsUrl =
  "https://www.bestprosintown.com/md/brentwood/dominican-katty-hair-studio-/";


const services = [
  {
    title: "Silk presses and Dominican blowouts",
    detail: "Compare the smooth finish, body, heat plan, and upkeep that fit your hair.",
    icon: Sparkles,
  },
  {
    title: "Color and highlights",
    detail: "Your history and hair health guide every gloss, highlight, and lift.",
    icon: Palette,
  },
  {
    title: "Extensions and wigs",
    detail: "Your install is prepped, blended, styled, and explained for easy upkeep.",
    icon: Gem,
  },
  {
    title: "Braids, cuts, and styling",
    detail: "You choose the shape, detail, or event finish that fits your look.",
    icon: Scissors,
  },
] as const;

const homeFaqs = [
  {
    question:
      "Which hair salon services can I discuss with Katty Hair Studio in Brentwood?",
    answer:
      "You can discuss professional hair care, styling, and haircut services with us in Brentwood, including silk presses, Dominican blowouts, color, extensions, braids, and cuts at our Bladensburg Rd studio.",
  },
  {
    question: "How can I decide which hair salon service fits my needs?",
    answer:
      "Your consultation is shaped around your hair history, texture, reference photo, upkeep, and styling goals. We will explain the options and confirm the plan before your service begins.",
  },
  {
    question: "What should I share when I contact the studio?",
    answer:
      "Share your current hair condition, recent color or extension history, desired finish, reference photos, and preferred timing. These details help us prepare for a useful consultation.",
  },
  {
    question: "How do I get started with a hair appointment?",
    answer:
      "Request an appointment online or call the studio at (240) 582-6622. We are located at 3816 Bladensburg Rd in Brentwood, and your price is confirmed before the chair.",
  },
] as const;

function HomeJsonLd({ faqs, locale }: { faqs: readonly { answer: string; question: string }[]; locale: Locale }) {
  const pageUrl = locale === "es" ? "https://www.kattyhairstudio.com/es" : "https://www.kattyhairstudio.com/";
  const graph = [
    {
      "@type": ["HairSalon", "LocalBusiness"],
      "@id": "https://www.kattyhairstudio.com/#business",
      name: "Katty Hair Studio",
      description:
        locale === "es"
          ? "Salón de belleza de servicio completo en Brentwood, Maryland, con cortes, coloración, blowouts dominicanos, trenzas, extensiones, tratamientos y peinados para cada textura."
          : "Full-service hair salon in Brentwood, Maryland offering silk presses, Dominican blowouts, haircuts, hair color, braids, extensions, treatments, and styling for every texture.",
      url: "https://www.kattyhairstudio.com/",
      telephone: phoneNumber,
      address: {
        "@type": "PostalAddress",
        streetAddress: "3816 Bladensburg Rd",
        addressLocality: "Brentwood",
        addressRegion: "MD",
        postalCode: "20722",
        addressCountry: "US",
      },
      image: "https://www.kattyhairstudio.com/social/katty-share-preview.webp",
      sameAs: [instagramUrl, facebookUrl, youtubeUrl, xUrl, tiktokUrl],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.kattyhairstudio.com/#website",
      url: "https://www.kattyhairstudio.com/",
      name: "Katty Hair Studio",
      publisher: { "@id": "https://www.kattyhairstudio.com/#business" },
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name:
        locale === "es"
          ? "Katty Hair Studio | Salón de belleza en Brentwood, MD"
          : "Katty Hair Studio | Hair Salon in Brentwood, MD",
      inLanguage: locale,
      isPartOf: { "@id": "https://www.kattyhairstudio.com/#website" },
      about: { "@id": "https://www.kattyhairstudio.com/#business" },
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      inLanguage: locale,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
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

const studioInfo = [
  {
    title: "Quote confirmed",
    detail: "You confirm your goal, timing, and quote before the chair.",
    icon: Award,
  },
  {
    title: "Signature technique",
    detail: "You get controlled heat, smooth roots, body, and shine.",
    icon: WandSparkles,
  },
  {
    title: "Supply support",
    detail: "You can ask about hair, products, and care in one stop.",
    icon: Store,
  },
  {
    title: "Reference ready",
    detail: "You bring the photo and leave with a realistic finish plan.",
    icon: ClipboardCheck,
  },
] as const;

const process = [
  {
    step: "01",
    title: "Show your goal",
    detail: "Bring your photo, texture history, and must-haves.",
    icon: MessageCircle,
    art: "/process/katty-step-1-show-goal.webp",
  },
  {
    step: "02",
    title: "See it take shape",
    detail: "Your service is built with clean sections, careful color, and balanced blending.",
    icon: Timer,
    art: "/process/katty-step-2-take-shape.webp",
  },
  {
    step: "03",
    title: "Leave ready",
    detail: "You leave with polished edges, movement, shine, and care notes.",
    icon: Check,
    art: "/process/katty-step-3-leave-ready.webp",
  },
] as const;

const videoStories = [
  {
    eyebrow: "Client story · 01",
    title: "The Katty difference",
    detail: "A real client shares the feeling behind her finished look.",
    poster: "/video-stories/client-story-best-v1.webp",
    src: "/video-stories/client-story-best-v1.mp4",
    alt: "Katty Hair Studio client with sleek, long dark hair speaking from her car",
  },
  {
    eyebrow: "Client result · 02",
    title: "Hair she loves more every day",
    detail: "Healthy-looking shine, movement, and a shape made for her.",
    poster: "/video-stories/client-story-shine-v1.webp",
    src: "/video-stories/client-story-shine-v1.mp4",
    alt: "Katty Hair Studio client showing her glossy shoulder-length blowout",
  },
  {
    eyebrow: "Inside the studio · 03",
    title: "A finish worth showing off",
    detail: "Sleek length and polish, captured right where it happened.",
    poster: "/video-stories/client-story-salon-v1.webp",
    src: "/video-stories/client-story-salon-v1.mp4",
    alt: "Katty Hair Studio client showing her long, sleek hair inside the salon",
  },
] as const;

const priceItems = [
  {
    name: "Blowouts and styling",
    type: "Finish services",
    price: "Quoted by length",
    note: "Your length, density, and finish determine the time and quote.",
  },
  {
    name: "Color, gloss, and highlights",
    type: "Color services",
    price: "Consult first",
    note: "Your color history, lift goal, and hair health shape the quote.",
  },
  {
    name: "Extensions, wigs, and installs",
    type: "Length services",
    price: "Custom quote",
    note: "Your method, hair source, blending, and install time shape the quote.",
  },
  {
    name: "Braids, cuts, and styling",
    type: "Shape services",
    price: "Ask stylist",
    note: "Your pattern, shape, and detail level are confirmed before you begin.",
  },
] as const;

const gallery = [
  {
    image: "/gallery/katty-glossy-body-waves-themed.webp",
    title: "Glossy body waves",
    alt: "Client with long glossy black body waves styled by Katty Hair Studio",
    position: "58% center",
  },
  {
    image: "/gallery/katty-golden-dimension-themed.webp",
    title: "Golden dimension",
    alt: "Client with voluminous black and golden blonde curls styled by Katty Hair Studio",
    position: "50% center",
  },
  {
    image: "/gallery/katty-silky-side-waves-themed-v2.webp",
    title: "Silky side waves",
    alt: "Client with long glossy black side-parted waves in a warm rose-toned salon",
    position: "50% 42%",
  },
  {
    image: "/gallery/katty-copper-waves-themed.webp",
    title: "Copper waves",
    alt: "Client with long polished copper waves styled by Katty Hair Studio",
    position: "50% center",
  },
  {
    image: "/gallery/katty-sculpted-curls-themed.webp",
    title: "Sculpted curls",
    alt: "Client with long glossy sculpted curls styled by Katty Hair Studio",
    position: "50% center",
  },
  {
    image: "/gallery/katty-vintage-curl-set-themed-v2.webp",
    title: "Vintage curl set",
    alt: "Client with a glossy sculpted vintage curl set in a warm rose-toned salon",
    position: "50% 40%",
  },
] as const;


const proofPoints = [
  {
    value: "4.8",
    label: "156 Google reviews",
    icon: Star,
    href: googleReviewsUrl,
    ariaLabel: "Read Katty Hair Studio Google reviews",
  },
  {
    value: "$10 off",
    label: "Mondays only",
    icon: BadgePercent,
  },
  {
    value: "Upfront quote",
    label: "Before service",
    icon: ClipboardCheck,
  },
] as const;

const featuredReviews = [
  {
    name: "Faben Henok",
    meta: "Local Guide · Google review",
    details: ["Edited 4 months ago", "$100-120", "Hair straightening"],
    image: "/reviews/faben-henok-client-photo.webp",
    imageBadge: "Healthy shine",
    alt: "Faben Henok smiling outdoors with long smooth hair after a Katty Hair Studio visit",
    quote: "I always leave feeling confident, refreshed, and taken care of.",
    highlights: [
      "A 10-year client who keeps coming back for healthy, beautiful hair.",
      "Honest advice, careful listening, and a wash that feels like a mini spa moment.",
      "A long-term stylist relationship built on trust, consistency, and care.",
    ],
  },
  {
    name: "Marimar Montero",
    meta: "1 review · 2 photos",
    details: ["9 months ago", "Cut and styling", "Personalized finish"],
    image: "/reviews/marimar-montero-client-photo.webp",
    imageBadge: "Precision finish",
    alt: "Marimar Montero seated in a salon with a short burgundy haircut after a Katty Hair Studio visit",
    quote: "I walked out feeling confident, refreshed, and truly cared for.",
    highlights: [
      "Katty listened first and made sure every detail felt right.",
      "A relaxing wash and scalp massage led into precise cut and styling work.",
      "The final look was shaped around her face and hair texture.",
    ],
  },
] as const;

const spanishHomeData = {
  services: [
    {
      title: "Silk press y blowouts dominicanos",
      detail: "Compara el acabado liso, el volumen, el plan de calor y el cuidado ideal para tu cabello.",
      icon: Sparkles,
    },
    {
      title: "Color y mechas",
      detail: "Tu historial y la salud de tu cabello guían cada baño de color, mecha y aclarado.",
      icon: Palette,
    },
    {
      title: "Extensiones y pelucas",
      detail: "Preparamos, integramos y peinamos tu instalación, y te explicamos cómo cuidarla en casa.",
      icon: Gem,
    },
    {
      title: "Trenzas, cortes y peinados",
      detail: "Elige la forma, el detalle o el acabado para un evento que mejor se adapte a tu estilo.",
      icon: Scissors,
    },
  ],
  homeFaqs: [
    {
      question: "¿Qué servicios de salón puedo consultar con Katty Hair Studio en Brentwood?",
      answer: "Puedes consultar servicios profesionales de cuidado, peinado y corte de cabello en nuestro salón de Bladensburg Rd en Brentwood, incluidos silk press, blowouts dominicanos, color, extensiones, trenzas y cortes.",
    },
    {
      question: "¿Cómo puedo decidir qué servicio es adecuado para mi cabello?",
      answer: "La consulta se adapta a tu historial capilar, textura, foto de referencia, mantenimiento y objetivos de estilo. Te explicaremos las opciones y confirmaremos el plan antes de comenzar.",
    },
    {
      question: "¿Qué debo compartir cuando me comunique con el salón?",
      answer: "Comparte el estado actual de tu cabello, tu historial reciente de color o extensiones, el acabado que deseas, fotos de referencia y tus horarios preferidos. Estos detalles nos ayudan a preparar una consulta útil.",
    },
    {
      question: "¿Cómo solicito una cita para el cabello?",
      answer: "Solicita una cita en línea o llama al salón al (240) 582-6622. Estamos en 3816 Bladensburg Rd, Brentwood, y confirmamos el precio antes de comenzar el servicio.",
    },
  ],
  studioInfo: [
    {
      title: "Precio confirmado",
      detail: "Confirmas tu objetivo, el tiempo y el precio antes de sentarte en la silla.",
      icon: Award,
    },
    {
      title: "Técnica distintiva",
      detail: "Recibes calor controlado, raíces lisas, volumen y brillo.",
      icon: WandSparkles,
    },
    {
      title: "Productos a tu alcance",
      detail: "Puedes consultar sobre cabello, productos y cuidados en un mismo lugar.",
      icon: Store,
    },
    {
      title: "Tu referencia cuenta",
      detail: "Trae la foto y sal con un plan realista para lograr el acabado.",
      icon: ClipboardCheck,
    },
  ],
  process: [
    {
      step: "01",
      title: "Muéstranos tu objetivo",
      detail: "Trae tu foto, el historial de tu cabello y lo que no puede faltar.",
      icon: MessageCircle,
      art: "/process/katty-step-1-show-goal.webp",
    },
    {
      step: "02",
      title: "Mira cómo toma forma",
      detail: "Realizamos el servicio con secciones limpias, color cuidadoso y una integración equilibrada.",
      icon: Timer,
      art: "/process/katty-step-2-take-shape.webp",
    },
    {
      step: "03",
      title: "Sal lista para lucirlo",
      detail: "Te vas con bordes pulidos, movimiento, brillo y recomendaciones de cuidado.",
      icon: Check,
      art: "/process/katty-step-3-leave-ready.webp",
    },
  ],
  videoStories: [
    {
      eyebrow: "Historia de cliente · 01",
      title: "La diferencia de Katty",
      detail: "Una clienta real comparte cómo se siente con su resultado final.",
      poster: "/video-stories/client-story-best-v1.webp",
      src: "/video-stories/client-story-best-v1.mp4",
      alt: "Clienta de Katty Hair Studio con cabello largo, oscuro y liso hablando desde su automóvil",
    },
    {
      eyebrow: "Resultado de cliente · 02",
      title: "Un cabello que le gusta más cada día",
      detail: "Brillo saludable, movimiento y una forma creada para ella.",
      poster: "/video-stories/client-story-shine-v1.webp",
      src: "/video-stories/client-story-shine-v1.mp4",
      alt: "Clienta de Katty Hair Studio mostrando su blowout brillante a la altura de los hombros",
    },
    {
      eyebrow: "Dentro del salón · 03",
      title: "Un acabado que merece lucirse",
      detail: "Largo liso y pulido, capturado justo donde sucedió.",
      poster: "/video-stories/client-story-salon-v1.webp",
      src: "/video-stories/client-story-salon-v1.mp4",
      alt: "Clienta de Katty Hair Studio mostrando su cabello largo y liso dentro del salón",
    },
  ],
  priceItems: [
    {
      name: "Blowouts y peinados",
      type: "Servicios de acabado",
      price: "Según el largo",
      note: "El largo, la densidad y el acabado determinan el tiempo y el precio.",
    },
    {
      name: "Color, baños de brillo y mechas",
      type: "Servicios de color",
      price: "Consulta primero",
      note: "Tu historial de color, el nivel de aclarado y la salud del cabello determinan el precio.",
    },
    {
      name: "Extensiones, pelucas e instalaciones",
      type: "Servicios de extensiones",
      price: "Precio personalizado",
      note: "El método, el cabello, la integración y el tiempo de instalación determinan el precio.",
    },
    {
      name: "Trenzas, cortes y peinados",
      type: "Servicios de forma",
      price: "Consulta a la estilista",
      note: "Confirmamos el patrón, la forma y el nivel de detalle antes de comenzar.",
    },
  ],
  gallery: [
    {
      image: "/gallery/katty-glossy-body-waves-themed.webp",
      title: "Ondas con brillo",
      alt: "Clienta con ondas largas y negras de alto brillo peinadas por Katty Hair Studio",
      position: "58% center",
    },
    {
      image: "/gallery/katty-golden-dimension-themed.webp",
      title: "Dimensión dorada",
      alt: "Clienta con rizos voluminosos negros y rubio dorado peinados por Katty Hair Studio",
      position: "50% center",
    },
    {
      image: "/gallery/katty-silky-side-waves-themed-v2.webp",
      title: "Ondas laterales sedosas",
      alt: "Clienta con ondas largas, negras y brillantes con raya lateral en un salón de tonos rosados",
      position: "50% 42%",
    },
    {
      image: "/gallery/katty-copper-waves-themed.webp",
      title: "Ondas color cobre",
      alt: "Clienta con ondas largas y pulidas en tono cobre peinadas por Katty Hair Studio",
      position: "50% center",
    },
    {
      image: "/gallery/katty-sculpted-curls-themed.webp",
      title: "Rizos esculpidos",
      alt: "Clienta con rizos largos, brillantes y esculpidos peinados por Katty Hair Studio",
      position: "50% center",
    },
    {
      image: "/gallery/katty-vintage-curl-set-themed-v2.webp",
      title: "Rizos de estilo clásico",
      alt: "Clienta con rizos clásicos, brillantes y definidos en un salón de tonos rosados",
      position: "50% 40%",
    },
  ],
  proofPoints: [
    {
      value: "4.8",
      label: "156 reseñas en Google",
      icon: Star,
      href: googleReviewsUrl,
      ariaLabel: "Leer las reseñas de Katty Hair Studio en Google",
    },
    {
      value: "$10 menos",
      label: "Solo los lunes",
      icon: BadgePercent,
    },
    {
      value: "Precio confirmado",
      label: "Antes del servicio",
      icon: ClipboardCheck,
    },
  ],
  featuredReviews: [
    {
      name: "Faben Henok",
      meta: "Guía local · Reseña de Google traducida",
      details: ["Editada hace 4 meses", "$100–120", "Alisado del cabello"],
      image: "/reviews/faben-henok-client-photo.webp",
      imageBadge: "Brillo saludable",
      alt: "Faben Henok sonriendo al aire libre con cabello largo y liso después de visitar Katty Hair Studio",
      quote: "Siempre salgo sintiéndome segura, renovada y bien atendida.",
      highlights: [
        "Una clienta desde hace 10 años que sigue regresando por un cabello saludable y hermoso.",
        "Consejos honestos, atención cuidadosa y un lavado que se siente como un pequeño momento de spa.",
        "Una relación duradera con su estilista, basada en confianza, constancia y cuidado.",
      ],
    },
    {
      name: "Marimar Montero",
      meta: "1 reseña · 2 fotos · Traducción al español",
      details: ["Hace 9 meses", "Corte y peinado", "Acabado personalizado"],
      image: "/reviews/marimar-montero-client-photo.webp",
      imageBadge: "Acabado preciso",
      alt: "Marimar Montero sentada en un salón con un corte corto color borgoña después de visitar Katty Hair Studio",
      quote: "Salí sintiéndome segura, renovada y verdaderamente cuidada.",
      highlights: [
        "Katty escuchó primero y se aseguró de que cada detalle quedara bien.",
        "Un lavado relajante y un masaje del cuero cabelludo dieron paso a un corte y peinado precisos.",
        "El resultado final se adaptó a la forma de su rostro y a la textura de su cabello.",
      ],
    },
  ],
} as const;

function Icon({ icon: IconComponent }: { icon: SiteIcon }) {
  return <IconComponent aria-hidden="true" className="site-icon" />;
}

function BestProsInTownBadge({ locale }: { locale: Locale }) {
  return (
    <>
      <link
        href="https://cdn6.localdatacdn.com/badges/bestprosintown/css/badge-v3.2.css?v=84924"
        rel="stylesheet"
      />
      <div
        className="bestpros-native-badge"
        id="circle_v3"
        style={{ height: "calc(227px * 1)", width: "calc(294px * 1)" }}
        tabIndex={0}
      >
        <div className="rb_flex rb_top">
          <div className="arc-heading">
            <svg
              height="160"
              viewBox="0 0 150 140"
              width="160"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <path d="M 30 80 a 50 50 0 1 1 110 0" id="heading-arc" />
              </defs>
              <text
                className="arc-heading__heading"
                fill="#000"
                textAnchor="middle"
              >
                <textPath href="#heading-arc" startOffset="50%">
                  {locale === "es" ? "Recomendado" : "Recommended"}
                </textPath>
              </text>
            </svg>
          </div>
          <div id="circletype_v3_brand_name">
            <a
              aria-label={locale === "es" ? "Ver Katty Hair Studio en BestProsInTown" : "View Katty Hair Studio on BestProsInTown"}
              className="ahref_emprty_area"
              href={bestProsUrl}
              rel="noreferrer"
              style={{ fontSize: "12.4px", fontWeight: 700 }}
              target="_blank"
            >
              <svg height="62" width="235" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <path d="M15,40 A110,31 0 0 1 220 40" id="bestpros-brand-path" />
                </defs>
                <text className="bestpros-brand-text" textAnchor="middle">
                  <textPath
                    href="#bestpros-brand-path"
                    lengthAdjust="spacingAndGlyphs"
                    startOffset="50%"
                    textLength="196"
                  >
                    Katty Hair Studio
                  </textPath>
                </text>
              </svg>
            </a>
          </div>
          <div className="arc-heading arc-heading__bottom">
            <svg
              height="160"
              viewBox="0 0 150 150"
              width="160"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <path d="M 12 60 a 55 55 0 0 0 140 0" id="subheading-arc" />
              </defs>
              <text
                className="arc-heading__subheading"
                fill="#000"
                textAnchor="middle"
              >
                <textPath href="#subheading-arc" startOffset="50%">
                  <a
                    href="https://www.bestprosintown.com"
                    rel="noreferrer"
                    target="_blank"
                  >
                    BestProsInTown
                  </a>
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

export function HomePage({ locale = "en" }: { locale?: Locale }) {
  const isSpanish = locale === "es";
  const localizedServices = isSpanish ? spanishHomeData.services : services;
  const localizedFaqs = isSpanish ? spanishHomeData.homeFaqs : homeFaqs;
  const localizedStudioInfo = isSpanish ? spanishHomeData.studioInfo : studioInfo;
  const localizedProcess = isSpanish ? spanishHomeData.process : process;
  const localizedStories = isSpanish ? spanishHomeData.videoStories : videoStories;
  const localizedPrices = isSpanish ? spanishHomeData.priceItems : priceItems;
  const localizedGallery = isSpanish ? spanishHomeData.gallery : gallery;
  const localizedProofPoints = isSpanish ? spanishHomeData.proofPoints : proofPoints;
  const localizedReviews = isSpanish ? spanishHomeData.featuredReviews : featuredReviews;
  const copy = isSpanish
    ? {
        hero: {
          alt: "Interior moderno y acogedor de Katty Hair Studio con pisos de mármol, sillas negras, detalles rosados y dorados",
          eyebrow: "Servicio completo · Propiedad dominicana · Salón y tienda de productos de belleza",
          body: "Trae tu textura y tu referencia. Adaptaremos el servicio a ti.",
          request: "Solicitar cita",
          services: "Explorar servicios",
          trust: "4.8 en 156 reseñas de Google · Confirmamos el precio antes de comenzar.",
          proof: "Datos destacados del salón",
        },
        reviews: {
          eyebrow: "Lo que dicen nuestras clientas",
          title: "Descubre lo que puedes esperar en cada visita.",
          body: "Las reseñas reales de Google repiten los mismos temas: atención cuidadosa, una experiencia relajante y un acabado que se siente como tú.",
          aria: "Aspectos destacados de las reseñas",
          chips: ["Reseña de 5 estrellas", "Clienta desde hace 10 años", "Corte y peinado"],
        },
        videos: {
          eyebrow: "Escúchalo desde la silla",
          title: "La mejor prueba está en cómo hablan de su cabello.",
          body: "Descubre tres momentos reales: por qué confían en Katty y el brillo, movimiento y seguridad con los que salen del salón.",
          aria: "Acerca de estos videos de clientas",
          reels: "Videos de clientas reales",
          results: "Resultados sin guion",
          booking: "Reserva tu visita",
          instagram: "Ver más en Instagram",
        },
        plan: {
          eyebrow: "Tu visita, paso a paso",
          title: "Conocerás el plan antes de comenzar el servicio.",
          body: "Muéstrale a Katty el estilo que deseas. Hablarán de tu historial capilar, el tiempo, el mantenimiento y el precio antes de sentarte en la silla.",
          aria: "Qué esperar antes de tu servicio",
          chips: ["Trae una referencia", "Confirma tu plan", "Llévate recomendaciones de cuidado"],
          artAria: "Vista editorial de un acabado ombré color borgoña",
          artAlt: "Vista posterior de cabello largo, brillante y castaño con capas y puntas suavemente rizadas en un salón de tonos rosados",
          ctaAria: "Comparte tu referencia y solicita una cita",
          ctaTitle: "¿Tienes un estilo en mente?",
          ctaBody: "Comparte tu referencia y confirma el tiempo y el precio.",
        },
        services: {
          imageAlt: "Clienta con rizos voluminosos negros y rubio dorado peinados por Katty Hair Studio",
          caption: "Tu historia de color",
          captionBody: "Tu historial guía cada decisión. La salud de tu cabello siempre es lo primero.",
          eyebrow: "Tu servicio",
          title: "Elige tu objetivo. Adaptamos el servicio a tu cabello.",
          body: "Trae tu referencia y termina la consulta sabiendo qué opción te conviene, cuánto tiempo requiere y qué puedes esperar.",
        },
        categories: {
          eyebrow: "Tus categorías",
          title: "Dos formas de encontrar el servicio ideal para tu cabello.",
          body: "Elige la categoría que corresponde a tu objetivo y explora los servicios y cuidados disponibles.",
          primaryAlt: "Interior rosado y cálido de Katty Hair Studio con sillas de estilismo y espejos",
          primaryLabel: "Categoría principal",
          primaryTitle: "Salón de belleza en Brentwood, MD",
          primaryBody: "Explora silk press, color personalizado, blowouts dominicanos, trenzas, cortes, tratamientos y peinados adaptados a tu textura, rutina y acabado deseado.",
          primaryLink: "Explorar servicios de salón",
          secondaryAlt: "Clienta de Katty Hair Studio con extensiones largas, negras y brillantes integradas con rizos suaves",
          secondaryLabel: "Categoría especializada",
          secondaryTitle: "Especialista en extensiones de cabello en Brentwood, MD",
          secondaryBody: "Compara consultas, instalaciones, integración, mantenimiento y retiro cuidadoso, siempre priorizando la salud de tu cabello natural.",
          secondaryLink: "Explorar servicios de extensiones",
          allServices: "Ver el directorio completo de servicios",
        },
        process: {
          eyebrow: "Tu cita",
          title: "Siempre sabrás qué sigue.",
          body: "Tú traes el objetivo. Tu servicio avanza en tres pasos claros, desde el plan hasta el acabado.",
          aria: "Los tres pasos de tu cita",
          step: "Paso",
        },
        prices: {
          eyebrow: "Tu precio",
          title: "Confirmarás el precio antes de sentarte en la silla.",
          body: "Tu textura, largo, historial y referencia determinan el precio. Lo confirmarás antes de que comience el servicio.",
          cta: "Envía una referencia para recibir tu precio",
          offer: "$10 menos",
          offerDetail: "Solo en servicios de los lunes",
        },
        gallery: {
          eyebrow: "Tu inspiración",
          title: "Guarda el acabado que deseas traer como referencia.",
          full: "Ver la galería completa",
        },
        info: {
          alt: "Katty, fundadora y estilista, de pie dentro de su salón",
          badge: "Katty · Fundadora y estilista",
          eyebrow: "Conoce a Katty",
          title: "Tu textura merece una estilista que escuche primero.",
          body: "Katty Hair Studio es un salón orgullosamente dominicano, de servicio completo y abierto a todas las personas. Explora color, cortes, blowouts, trenzas, extensiones, tratamientos y peinados para cada textura y objetivo.",
          quote: "Trae el estilo que deseas. Adaptamos tu cita al acabado con el que quieres salir.",
          local: "Recomendada localmente",
          profile: "Ver perfil",
        },
        faq: {
          eyebrow: "Antes de tu visita",
          title: "Preguntas frecuentes",
          body: "Respuestas claras para que llegues sabiendo qué traer y qué sucederá después.",
        },
      }
    : {
        hero: {
          alt: "Warm modern salon interior with marble floors, black styling chairs, blush accents, and gold details",
          eyebrow: "Full-service · Dominican-owned · Hair studio and beauty supply",
          body: "Bring your texture and reference. We’ll shape the service around you.",
          request: "Request appointment",
          services: "Explore services",
          trust: "4.8 from 156 Google reviews · Quote confirmed before the chair.",
          proof: "Studio proof points",
        },
        reviews: {
          eyebrow: "What clients say",
          title: "See what you can expect from every visit.",
          body: "You’ll see the same themes across real Google reviews: careful listening, relaxing care, and a finish that feels like you.",
          aria: "Review highlights",
          chips: ["5-star review", "10-year client", "Cut + styling"],
        },
        videos: {
          eyebrow: "Hear it from the chair",
          title: "The best proof is how they talk about their hair.",
          body: "Tap into three real client moments—from the reason they trust Katty to the shine, movement, and confidence they leave with.",
          aria: "About these client videos",
          reels: "Real client reels",
          results: "Unscripted results",
          booking: "Book your visit",
          instagram: "See more on Instagram",
        },
        plan: {
          eyebrow: "Your visit, made clear",
          title: "You’ll know the plan before your service begins.",
          body: "Show Katty the look you want. You’ll talk through your hair history, timing, upkeep, and quote before the chair.",
          aria: "What to expect before your service",
          chips: ["Bring a reference", "Confirm your plan", "Leave with care notes"],
          artAria: "Editorial preview of a burgundy ombré finish",
          artAlt: "Rear view of long glossy chestnut-brown layered hair finished with soft curled ends in a blush-toned salon",
          ctaAria: "Share your reference and request an appointment",
          ctaTitle: "Have a look in mind?",
          ctaBody: "Share your reference and confirm the timing and quote.",
        },
        services: {
          imageAlt: "Client with voluminous black and golden blonde curls styled by Katty Hair Studio",
          caption: "Your color story",
          captionBody: "Your history guides every choice. Your hair health stays first.",
          eyebrow: "Your service",
          title: "Choose your goal. Your service is shaped around your hair.",
          body: "Bring your reference and leave the consultation knowing what fits, how long it takes, and what to expect.",
        },
        categories: {
          eyebrow: "Your categories",
          title: "Two ways to find the right service for your hair.",
          body: "Choose the category that fits your goal, then explore the services and care built around it.",
          primaryAlt: "Warm baby-pink Katty Hair Studio interior with styling chairs and mirrors",
          primaryLabel: "Primary category",
          primaryTitle: "Hair salon in Brentwood, MD",
          primaryBody: "Explore silk presses, personalized color, Dominican blowouts, braids, cuts, treatments, and styling shaped around your texture, routine, and desired finish.",
          primaryLink: "Explore hair salon services",
          secondaryAlt: "Client with long glossy black extension blend and soft curls at Katty Hair Studio",
          secondaryLabel: "Specialist category",
          secondaryTitle: "Hair extension technician in Brentwood, MD",
          secondaryBody: "Compare consultations, installation, blending, maintenance, and careful removal with your natural-hair health guiding every recommendation.",
          secondaryLink: "Explore extension services",
          allServices: "View the complete service directory",
        },
        process: {
          eyebrow: "Your appointment",
          title: "You’ll always know what happens next.",
          body: "You bring the goal. Your service moves through three clear steps, from plan to polish.",
          aria: "Your three appointment steps",
          step: "Step",
        },
        prices: {
          eyebrow: "Your quote",
          title: "You’ll confirm your price before the chair.",
          body: "Your texture, length, history, and reference shape the quote. You’ll confirm it before your service begins.",
          cta: "Send a reference for your quote",
          offer: "$10 off",
          offerDetail: "Monday services only",
        },
        gallery: {
          eyebrow: "Your inspiration",
          title: "Save the finish you want to bring in.",
          full: "View full gallery",
        },
        info: {
          alt: "Katty, founder and stylist, standing inside her salon",
          badge: "Katty · Founder + stylist",
          eyebrow: "Meet Katty",
          title: "Your texture deserves a stylist who listens first.",
          body: "Katty Hair Studio is proudly Dominican-owned, full-service, and open to everyone. Explore color, cuts, blowouts, braids, extensions, treatments, and styling for every texture and style goal.",
          quote: "Bring the look you want. Your appointment is shaped around the finish you want to leave with.",
          local: "Recommended locally",
          profile: "View profile",
        },
        faq: {
          eyebrow: "Before your visit",
          title: "Frequently asked questions",
          body: "Clear answers help you arrive knowing what to bring and what happens next.",
        },
      };

  return (
    <main className="site-shell">
      <HomeJsonLd faqs={localizedFaqs} locale={locale} />
      <ViewportReveal />
      <SiteHeader locale={locale} />

      <section className="hero" id="home">
        <Image
          alt={copy.hero.alt}
          className="hero-image"
          fill
          priority
          sizes="100vw"
          src="/hero/katty-salon-interior-hero-clear-pink-v4.webp"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1>
            <span className="hero-title-desktop">Katty Hair Studio</span>
            <span className="hero-title-mobile">
              Katty
              <br />
              Hair
              <br />
              Studio
            </span>
          </h1>
          <p className="hero-copy">{copy.hero.body}</p>
          <div className="hero-actions">
            <a className="primary-link" href="#booking">
              <CalendarDays aria-hidden="true" />
              {copy.hero.request}
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="secondary-link" href="#services">
              <Scissors aria-hidden="true" />
              {copy.hero.services}
            </a>
          </div>
          <p className="hero-trust-line">{copy.hero.trust}</p>
        </div>
        <div className="hero-mobile-signals" aria-label={copy.hero.proof}>
          {localizedProofPoints.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <Icon aria-hidden="true" className="hero-signal-icon" />
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </>
            );

            return "href" in item ? (
              <a
                aria-label={item.ariaLabel}
                className="hero-mobile-signal"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                {content}
              </a>
            ) : (
              <div className="hero-mobile-signal" key={item.label}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="proof-band" aria-label={copy.hero.proof}>
        {localizedProofPoints.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <Icon aria-hidden="true" className="proof-icon" />
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </>
          );

          return "href" in item ? (
            <a
              aria-label={item.ariaLabel}
              className="proof-card"
              href={item.href}
              key={item.label}
              rel="noreferrer"
              target="_blank"
            >
              {content}
            </a>
          ) : (
            <div className="proof-card" key={item.label}>
              {content}
            </div>
          );
        })}
      </section>

      <section className="reviews-section" aria-labelledby="featured-review-heading" data-reveal>
        <div className="reviews-copy">
          <p className="eyebrow">{copy.reviews.eyebrow}</p>
          <h2 id="featured-review-heading">{copy.reviews.title}</h2>
          <p>{copy.reviews.body}</p>
          <div className="review-proof-row" aria-label={copy.reviews.aria}>
            <span>
              <Star aria-hidden="true" />
              {copy.reviews.chips[0]}
            </span>
            <span>
              <Heart aria-hidden="true" />
              {copy.reviews.chips[1]}
            </span>
            <span>
              <Scissors aria-hidden="true" />
              {copy.reviews.chips[2]}
            </span>
          </div>
        </div>

        <ReviewPager googleReviewsUrl={googleReviewsUrl} locale={locale} reviews={localizedReviews} />
      </section>

      <section
        className="video-stories-section"
        aria-labelledby="video-stories-heading"
        data-reveal
        id="client-stories"
      >
        <div className="video-stories-copy">
          <p className="eyebrow">{copy.videos.eyebrow}</p>
          <h2 id="video-stories-heading">{copy.videos.title}</h2>
          <p>{copy.videos.body}</p>
          <div className="video-stories-proof" aria-label={copy.videos.aria}>
            <span>
              <PlayCircle aria-hidden="true" />
              {copy.videos.reels}
            </span>
            <span>
              <Heart aria-hidden="true" />
              {copy.videos.results}
            </span>
          </div>
          <div className="video-stories-actions">
            <a className="primary-link" href="#booking">
              {copy.videos.booking}
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="video-instagram-link" href={instagramUrl} rel="noreferrer" target="_blank">
              {copy.videos.instagram}
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>

        <VideoStoryStack locale={locale} stories={localizedStories} />
      </section>

      <section className="intro-section section-grid" data-reveal id="visit-plan">
        <div className="section-copy">
          <p className="eyebrow">{copy.plan.eyebrow}</p>
          <h2>{copy.plan.title}</h2>
          <p>{copy.plan.body}</p>
          <div className="signal-chips" aria-label={copy.plan.aria}>
            <span>
              <MessageCircle aria-hidden="true" />
              {copy.plan.chips[0]}
            </span>
            <span>
              <ClipboardCheck aria-hidden="true" />
              {copy.plan.chips[1]}
            </span>
            <span>
              <Heart aria-hidden="true" />
              {copy.plan.chips[2]}
            </span>
          </div>
        </div>
        <div className="signal-art" aria-label={copy.plan.artAria}>
          <figure className="signal-photo signal-photo-large">
            <Image
              alt={copy.plan.artAlt}
              fill
              loading="eager"
              sizes="(max-width: 1100px) 100vw, 42vw"
              src="/editorial/katty-reference-chestnut-layers-v4.webp"
            />
          </figure>
          <a
            aria-label={copy.plan.ctaAria}
            className="finish-cta"
            href="#booking"
          >
            <MessageCircle aria-hidden="true" className="finish-cta-icon" />
            <span className="finish-cta-copy">
              <strong>{copy.plan.ctaTitle}</strong>
              <small>{copy.plan.ctaBody}</small>
            </span>
            <ArrowRight aria-hidden="true" className="finish-cta-arrow" />
          </a>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="services-media" data-reveal>
          <Image
            alt={copy.services.imageAlt}
            fill
            sizes="(max-width: 900px) 100vw, 42vw"
            src="/gallery/katty-golden-dimension-themed.webp"
          />
          <div className="media-caption">
            <span>{copy.services.caption}</span>
            <strong>{copy.services.captionBody}</strong>
          </div>
        </div>
        <div className="services-copy" data-reveal>
          <p className="eyebrow">{copy.services.eyebrow}</p>
          <h2>{copy.services.title}</h2>
          <p>{copy.services.body}</p>
          <div className="service-list">
            {localizedServices.map((service) => (
              <article className="service-item" key={service.title}>
                <span>
                  <Icon icon={service.icon} />
                </span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="category-architecture-heading"
        className="category-architecture-section"
        data-reveal
        id="service-categories"
      >
        <div className="category-hub-inner">
          <div className="category-hub-heading">
            <p className="eyebrow">{copy.categories.eyebrow}</p>
            <h2 id="category-architecture-heading">{copy.categories.title}</h2>
            <p>{copy.categories.body}</p>
            <Link className="category-hub-all-services" href={localizePath("/services", locale)}>
              {copy.categories.allServices}<ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="category-cards">
            <article className="category-card category-primary">
              <div className="category-card-media">
                <Image
                  alt={copy.categories.primaryAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  src="/hero/katty-salon-interior-hero-clear-pink-v4.webp"
                />
                <div className="category-card-image-shade" />
                <div className="category-card-meta">
                  <span>{copy.categories.primaryLabel}</span>
                  <strong>01</strong>
                </div>
              </div>
              <div className="category-card-copy">
                <h3>{copy.categories.primaryTitle}</h3>
                <p>{copy.categories.primaryBody}</p>
                <Link className="category-card-link" href={localizePath("/hair-salon", locale)}>
                  {copy.categories.primaryLink}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="category-card category-secondary">
              <div className="category-card-media">
                <Image
                  alt={copy.categories.secondaryAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  src="/services/generated/hair-extension-technician-v2.webp"
                />
                <div className="category-card-image-shade" />
                <div className="category-card-meta">
                  <span>{copy.categories.secondaryLabel}</span>
                  <strong>02</strong>
                </div>
              </div>
              <div className="category-card-copy">
                <h3>{copy.categories.secondaryTitle}</h3>
                <p>{copy.categories.secondaryBody}</p>
                <Link className="category-card-link" href={localizePath("/hair-extension-technician", locale)}>
                  {copy.categories.secondaryLink}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>

        </div>
      </section>

      <section className="process-section" id="process">
        <div className="process-heading centered" data-reveal>
          <p className="eyebrow">{copy.process.eyebrow}</p>
          <h2>{copy.process.title}</h2>
          <p>{copy.process.body}</p>
        </div>
        <div className="process-story" data-reveal aria-label={copy.process.aria}>
          <div className="process-days">
            <div className="process-connector process-connector-one" aria-hidden="true" />
            <div className="process-connector process-connector-two" aria-hidden="true" />
            {localizedProcess.map((item) => {
              const StepIcon = item.icon;

              return (
                <article className="process-day" data-process-step key={item.step}>
                  <div className="process-day-art">
                    <Image
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(max-width: 740px) 132px, 180px"
                      src={item.art}
                    />
                  </div>
                  <span className="process-day-label">
                    <StepIcon aria-hidden="true" />
                    {copy.process.step} {Number(item.step)}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="prices-section" id="prices">
        <div className="prices-layout">
          <div className="prices-copy" data-reveal>
            <p className="eyebrow">{copy.prices.eyebrow}</p>
            <h2>{copy.prices.title}</h2>
            <p>{copy.prices.body}</p>
            <div className="price-grid">
              {localizedPrices.map((item) => (
                <article className="price-row" key={item.name}>
                  <span>{item.type}</span>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.note}</p>
                  </div>
                  <strong>{item.price}</strong>
                </article>
              ))}
            </div>
            <a className="secondary-dark-link price-cta" href="#booking">
              <MessageCircle aria-hidden="true" />
              {copy.prices.cta}
            </a>
          </div>
          <div className="price-art" data-reveal>
            <Image
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 32vw"
              src="/editorial/katty-price-still-life.webp"
            />
            <div className="price-offer">
              <BadgePercent aria-hidden="true" />
              <strong>{copy.prices.offer}</strong>
              <span>{copy.prices.offerDetail}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="gallery-heading" data-reveal>
          <div>
            <p className="eyebrow">{copy.gallery.eyebrow}</p>
            <h2>{copy.gallery.title}</h2>
          </div>
          <div className="gallery-heading-actions">
            <Link className="secondary-dark-link" href={localizePath("/gallery", locale)}>
              {copy.gallery.full}
              <ArrowRight aria-hidden="true" />
            </Link>
            <a className="secondary-dark-link" href={instagramUrl} rel="noreferrer" target="_blank">
              <ExternalLink aria-hidden="true" />
              Instagram
            </a>
          </div>
        </div>
        <div className="gallery-grid" data-reveal>
          {localizedGallery.slice(0, 6).map((item) => (
            <article className="gallery-tile" key={item.title}>
              <Image
                alt={item.alt}
                fill
                sizes="(max-width: 740px) calc((100vw - 44px) / 2), (max-width: 1100px) 33vw, 17vw"
                src={item.image}
                style={{ objectPosition: item.position }}
              />
              <span>{item.title}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="info-section" id="info">
        <div className="info-portrait" data-reveal>
          <Image
            alt={copy.info.alt}
            fill
            sizes="(max-width: 900px) 100vw, 42vw"
            src="/founder/katty-founder-original-portrait-v5.webp"
          />
          <span>
            <Award aria-hidden="true" />
            {copy.info.badge}
          </span>
        </div>
        <div className="info-copy" data-reveal>
          <p className="eyebrow">{copy.info.eyebrow}</p>
          <h2>{copy.info.title}</h2>
          <p>{copy.info.body}</p>
          <div className="info-card-grid">
            {localizedStudioInfo.map((item) => (
              <article className="info-card" key={item.title}>
                <span>
                  <Icon icon={item.icon} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="info-quote">
            <Quote aria-hidden="true" />
            <p>{copy.info.quote}</p>
          </div>
          <div className="founder-proof">
            <div className="founder-proof-mark">
              <BestProsInTownBadge locale={locale} />
            </div>
            <span className="founder-proof-copy">
              <small>{copy.info.local}</small>
              <strong>BestProsInTown</strong>
              <a href={bestProsUrl} rel="noreferrer" target="_blank">
                {copy.info.profile} <ExternalLink aria-hidden="true" />
              </a>
            </span>
          </div>
        </div>
      </section>

      <LocationSection locale={locale} />

      <BookingSection locale={locale} phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />

      <section aria-labelledby="home-faq-heading" className="home-faq-section" data-reveal id="faq">
        <div className="home-faq-heading">
          <p className="eyebrow">{copy.faq.eyebrow}</p>
          <h2 id="home-faq-heading">{copy.faq.title}</h2>
          <p>{copy.faq.body}</p>
        </div>
        <div className="home-faq-list">
          {localizedFaqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>
                {faq.question}
                <span aria-hidden="true">+</span>
              </summary>
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

export default function Home() {
  return <HomePage />;
}
