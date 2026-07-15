export const topPriorityServices = [
  {
    href: "/services/silk-press",
    label: { en: "Silk press", es: "Silk press" },
  },
  {
    href: "/services/blowouts",
    label: { en: "Dominican blowouts", es: "Blowouts dominicanos" },
  },
  {
    href: "/services/hair-coloring",
    label: { en: "Hair coloring", es: "Coloración del cabello" },
  },
  {
    href: "/services/braids",
    label: { en: "Hair braiding", es: "Trenzado de cabello" },
  },
  {
    href: "/services/hair-extension-consultation",
    label: { en: "Extension consultation", es: "Consulta de extensiones" },
  },
  {
    href: "/services/sew-in-hair-extensions",
    label: { en: "Sew-in extensions", es: "Extensiones cosidas" },
  },
  {
    href: "/services/microlink-hair-extensions",
    label: { en: "Microlink extensions", es: "Extensiones microlink" },
  },
] as const;

export const priorityServiceSlugs = [
  "silk-press",
  "blowouts",
  "hair-coloring",
  "hair-extension-consultation",
  "hair-extension-installation",
  "sew-in-hair-extensions",
  "microlink-hair-extensions",
  "tape-in-hair-extensions",
  "quick-weave",
  "hair-highlighting",
  "balayage",
  "braids",
  "wigs",
  "womens-haircuts",
  "hair-straightening",
] as const;

export const priorityServiceSlugSet = new Set<string>(priorityServiceSlugs);
