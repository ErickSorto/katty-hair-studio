import content from "./service-content.generated.json";
import { addedExtensionCategorySections, addedExtensionServices } from "./extension-services";
import { braidsService } from "./braids-service";
import { silkPressService } from "./silk-press-service";

export type ServiceSectionMedia = {
  src: string;
  alt: string;
  title: string;
  caption?: string;
  position?: string;
};

export type ServiceSection = {
  heading: string;
  paragraphs: string[];
  media?: ServiceSectionMedia;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServicePageData = {
  slug: string;
  url: string;
  pageType: "Service Page" | "Category Page";
  h1: string;
  name: string;
  title: string;
  description: string;
  canonical: string;
  heroDescription?: string;
  heroImageAlt?: string;
  heroTrust?: string;
  intro?: string;
  relatedSlugs?: string[];
  serviceAreas?: string[];
  socialImage?: string;
  sections: ServiceSection[];
  faqs: ServiceFaq[];
};

const generatedServicePages = (content as ServicePageData[])
  .filter((page) => !["braids", "hair-braiding-services"].includes(page.slug))
  .map((page) => {
    if (page.slug === "blowouts") {
      return {
        ...page,
        relatedSlugs: ["silk-press", "hair-blowouts", "hair-straightening"],
      };
    }
    if (page.slug === "hair-straightening") {
      return {
        ...page,
        relatedSlugs: ["silk-press", "blowouts", "smoothing-hair-treatment"],
      };
    }
    if (page.slug === "curly-hair") {
      return { ...page, relatedSlugs: ["silk-press", "hairstyling", "blowouts"] };
    }
    return page;
  });

export const servicePages: ServicePageData[] = [
  ...generatedServicePages,
  ...addedExtensionServices,
  braidsService,
  silkPressService,
];

const generatedExtensionCategory = generatedServicePages.find(
  (page) => page.url === "/hair-extension-technician",
)!;

export const extensionCategory: ServicePageData = {
  ...generatedExtensionCategory,
  description:
    "Compare tape-in, sew-in, microlink, K-tip, quick weave, closure, Brazilian knot, installation, maintenance, and removal services in Brentwood, MD.",
  sections: [
    ...generatedExtensionCategory.sections,
    ...addedExtensionCategorySections,
  ],
};

export const hairSalonCategory: ServicePageData = {
  slug: "hair-salon",
  url: "/hair-salon",
  pageType: "Category Page",
  h1: "Hair salon in Brentwood, MD",
  name: "Hair salon",
  title: "Hair Salon in Brentwood, MD | Katty Hair Studio",
  description:
    "Explore silk presses, blowouts, color, highlights, braids, cuts, styling, and personalized hair care at Katty Hair Studio in Brentwood, MD.",
  canonical: "https://www.kattyhairstudio.com/hair-salon",
  sections: [
    {
      heading: "Hair coloring",
      paragraphs: [
        "Your color plan begins with your current shade, recent color history, hair strength, and desired finish. We explain what your hair can support before choosing a formula or beginning the service.",
        "From rich all-over color to dimensional changes, the goal is a polished result with practical guidance for protecting moisture and maintaining tone between visits.",
      ],
    },
    {
      heading: "Hairstyling",
      paragraphs: [
        "Bring your reference and talk through the shape, movement, hold, and upkeep you want. Your styling appointment is adapted to your texture and the way you plan to wear the finished look.",
        "You will leave with a clear finish plan and straightforward care notes for keeping the style manageable after you leave the studio.",
      ],
    },
    {
      heading: "Balayage",
      paragraphs: [
        "Balayage uses thoughtful placement to create dimension that works with your natural base. Your consultation covers tone, contrast, maintenance, and the condition of your hair before lightener is applied.",
        "The finished color is toned and styled so you can see the complete blend, movement, and brightness from root to end.",
      ],
    },
    {
      heading: "Hair Braiding Services",
      paragraphs: [
        "Braiding starts with a conversation about the pattern, size, length, tension, and daily routine you need the style to support. Clean preparation and comfortable sectioning guide the service.",
        "We focus on a neat finish and practical upkeep so your braids feel intentional, secure, and manageable.",
      ],
    },
    {
      heading: "Blowouts",
      paragraphs: [
        "Your blowout is adjusted for your density, texture, length, and desired amount of body. Controlled preparation and balanced heat help create smooth roots, movement, and shine.",
        "Before the chair, you can discuss the finish you prefer and confirm the timing and quote for your hair.",
      ],
    },
    {
      heading: "Silk press",
      paragraphs: [
        "A silk press creates a temporary smooth finish for natural and textured hair without using a chemical straightener. Your consultation covers density, heat history, current condition, desired movement, and the amount of maintenance that fits your routine.",
        "Explore the dedicated silk press page to compare the process with a Dominican blowout, understand what to confirm about conditioning and trims, and plan for DC and Maryland humidity before requesting your appointment.",
      ],
    },
    {
      heading: "Hair highlighting",
      paragraphs: [
        "Highlight placement is planned around your current color, face framing, preferred brightness, and future maintenance. Your hair history helps determine a realistic and healthy direction.",
        "After lifting, toning and styling bring the final dimension together so the result feels balanced rather than disconnected from your base color.",
      ],
    },
  ],
  faqs: [
    {
      question: "Which hair salon services can I explore from this category page?",
      answer:
        "You can explore silk presses, color, highlights, balayage, blowouts, braids, cuts, straightening, smoothing treatments, wigs, and hairstyling available through Katty Hair Studio in Brentwood.",
    },
    {
      question: "How do I choose the right hair salon service for my goal?",
      answer:
        "Bring a reference and share your hair history, current condition, daily routine, and desired upkeep. The consultation helps narrow the options to a realistic plan for your hair.",
    },
    {
      question: "Can I confirm pricing before my service starts?",
      answer:
        "Yes. Your texture, length, density, history, and desired finish shape the timing and quote, which are discussed before the service begins.",
    },
    {
      question: "Where is Katty Hair Studio located?",
      answer:
        "Katty Hair Studio is located at 3816 Bladensburg Rd in Brentwood, Maryland. You can request an appointment online or call the studio before visiting.",
    },
  ],
};

export const brentwoodServices = servicePages.filter(
  (page) => page.pageType === "Service Page",
);

export const extensionServiceSlugs = new Set([
  "hair-extension-blending-and-styling",
  "hair-extension-consultation",
  "hair-extension-installation",
  "hair-extension-maintenance",
  "hair-extension-removal",
  "tape-in-hair-extensions",
  "sew-in-hair-extensions",
  "microlink-hair-extensions",
  "k-tip-hair-extensions",
  "quick-weave",
  "quick-weave-with-closure",
  "brazilian-knots-hair-extensions",
]);

export function getServicePage(slug: string) {
  return brentwoodServices.find((page) => page.slug === slug);
}

const serviceImages: Record<string, string> = {
  "hair-salon": "/hero/katty-salon-interior-hero-clear-pink-v4.webp",
  "hair-extension-technician": "/services/generated/hair-extension-technician-v2.webp",
  balayage: "/services/generated/balayage.webp",
  "bang-trim": "/services/generated/bang-trim.webp",
  blowouts: "/services/generated/blowouts.webp",
  braids: "/services/generated/braids.webp",
  "curly-hair": "/services/generated/curly-hair.webp",
  "eyebrow-waxing": "/services/generated/eyebrow-waxing-v4.webp",
  "hair-blowouts": "/services/generated/hair-blowouts.webp",
  "hair-braiding-services": "/services/generated/hair-braiding-services.webp",
  "hair-coloring": "/services/generated/hair-coloring.webp",
  "hair-extension-blending-and-styling": "/services/generated/hair-extension-blending-and-styling-v2.webp",
  "hair-extension-consultation": "/editorial/katty-client-plan-result-v2.webp",
  "hair-extension-installation": "/gallery/katty-silky-side-waves-themed-v2.webp",
  "hair-extension-maintenance": "/services/generated/hair-extension-maintenance-v2.webp",
  "hair-extension-removal": "/services/generated/hair-extension-removal-v2.webp",
  "tape-in-hair-extensions": "/services/generated/tape-in-hair-extensions-v2.webp",
  "sew-in-hair-extensions": "/services/generated/sew-in-hair-extensions-v2.webp",
  "microlink-hair-extensions": "/services/generated/microlink-hair-extensions-v2.webp",
  "k-tip-hair-extensions": "/services/generated/k-tip-hair-extensions-v2.webp",
  "quick-weave": "/services/generated/quick-weave-v2.webp",
  "quick-weave-with-closure": "/services/generated/quick-weave-with-closure-v2.webp",
  "brazilian-knots-hair-extensions": "/services/generated/brazilian-knots-hair-extensions-v2.webp",
  "hair-highlighting": "/services/generated/hair-highlighting-v2.webp",
  "hair-straightening": "/services/generated/hair-straightening-v2.webp",
  "silk-press": "/services/generated/silk-press-hero-v1.webp",
  "hair-stylist": "/services/generated/hair-stylist-v2.webp",
  hairstyling: "/gallery/katty-vintage-curl-set-themed-v2.webp",
  "mens-haircuts": "/services/generated/mens-haircuts-v2.webp",
  "partial-hair-highlights": "/gallery/katty-golden-dimension-themed.webp",
  "smoothing-hair-treatment": "/editorial/katty-reference-chestnut-layers-v4.webp",
  "twist-braids": "/services/generated/twist-braids-v2.webp",
  wigs: "/editorial/katty-reference-burgundy-finish-v3.webp",
  "womens-haircuts": "/services/generated/womens-haircuts-v2.webp",
};

export function getServiceImage(slug: string) {
  return serviceImages[slug] ?? "/hero/katty-salon-interior-hero-clear-pink-v4.webp";
}

export function getRelatedServices(page: ServicePageData) {
  if (page.relatedSlugs?.length) {
    return page.relatedSlugs
      .map((slug) => brentwoodServices.find((item) => item.slug === slug))
      .filter((item): item is ServicePageData => Boolean(item));
  }

  const pool = extensionServiceSlugs.has(page.slug)
    ? brentwoodServices.filter((item) => extensionServiceSlugs.has(item.slug))
    : brentwoodServices.filter((item) => !extensionServiceSlugs.has(item.slug));
  const index = pool.findIndex((item) => item.slug === page.slug);
  return [1, 2, 3].map((offset) => pool[(index + offset) % pool.length]);
}
