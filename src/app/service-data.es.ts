import content from "./service-content.es.generated.json";
import {
  addedExtensionCategorySections,
  addedExtensionServices,
} from "./extension-services.es";
import { extensionServiceSlugs, getServiceImage } from "./service-data";
import type { ServicePageData } from "./service-data";

export type { ServiceFaq, ServicePageData, ServiceSection } from "./service-data";
export { extensionServiceSlugs, getServiceImage };

const generatedServicePages = content as ServicePageData[];

export const servicePages: ServicePageData[] = [
  ...generatedServicePages,
  ...addedExtensionServices,
];

const generatedExtensionCategory = generatedServicePages.find(
  (page) => page.url === "/es/hair-extension-technician",
)!;

export const extensionCategory: ServicePageData = {
  ...generatedExtensionCategory,
  sections: [
    ...generatedExtensionCategory.sections,
    ...addedExtensionCategorySections,
  ],
};

export const hairSalonCategory: ServicePageData = {
  "slug": "hair-salon",
  "url": "/es/hair-salon",
  "pageType": "Category Page",
  "h1": "Salón de belleza en Brentwood, MD",
  "name": "Salón de belleza",
  "title": "Salón de belleza en Brentwood, MD | Katty Hair Studio",
  "description": "Explora coloración, mechas, balayage, blowouts, trenzas, cortes, tratamientos y peinados personalizados en Katty Hair Studio en Brentwood, MD.",
  "canonical": "https://www.kattyhairstudio.com/es/hair-salon",
  "sections": [
    {
      "heading": "Coloración del cabello",
      "paragraphs": [
        "Tu plan de color comienza con tu tono actual, el historial reciente de color, la fuerza de tu cabello y el acabado deseado. Te explicamos lo que tu cabello puede soportar antes de elegir una fórmula o comenzar el servicio.",
        "Desde un color rico en todo el cabello hasta cambios dimensionales, el objetivo es un resultado pulido con orientación práctica para proteger la humedad y mantener el tono entre visitas."
      ]
    },
    {
      "heading": "Peinado",
      "paragraphs": [
        "Trae tu referencia y hablemos sobre la forma, el movimiento, la fijación y el mantenimiento que deseas. Tu cita de peinado se adapta a tu textura y a la forma en que planeas llevar el look terminado.",
        "Saldrás con un plan claro de acabado y notas sencillas de cuidado para mantener el estilo manejable después de salir del salón."
      ]
    },
    {
      "heading": "Balayage",
      "paragraphs": [
        "El balayage utiliza una colocación cuidadosa para crear dimensión que funcione con tu base natural. Tu consulta cubre el tono, el contraste, el mantenimiento y la condición de tu cabello antes de aplicar el decolorante.",
        "El color terminado se tonifica y se peina para que puedas ver la mezcla completa, el movimiento y el brillo desde la raíz hasta las puntas."
      ]
    },
    {
      "heading": "Trenzas",
      "paragraphs": [
        "El trenzado comienza con una conversación sobre el patrón, el tamaño, la longitud, la tensión y la rutina diaria que necesitas que el estilo soporte. Una preparación limpia y un seccionado cómodo guían el servicio.",
        "Nos enfocamos en un acabado prolijo y un mantenimiento práctico para que tus trenzas se sientan intencionales, seguras y manejables."
      ]
    },
    {
      "heading": "Blowouts",
      "paragraphs": [
        "Tu blowout se ajusta a tu densidad, textura, longitud y la cantidad de volumen deseada. Una preparación controlada y un calor equilibrado ayudan a crear raíces suaves, movimiento y brillo.",
        "Antes de sentarte en la silla, puedes discutir el acabado que prefieres y confirmar el tiempo y la cotización para tu cabello."
      ]
    },
    {
      "heading": "Mechas",
      "paragraphs": [
        "La colocación de mechas se planifica en función de tu color actual, el marco de tu rostro, el brillo preferido y el mantenimiento futuro. Tu historial capilar ayuda a determinar una dirección realista y saludable.",
        "Después de la decoloración, la tonificación y el peinado unen la dimensión final para que el resultado se sienta equilibrado en lugar de desconectado de tu color base."
      ]
    }
  ],
  "faqs": [
    {
      "question": "¿Qué servicios de salón de belleza puedo explorar desde esta página de categoría?",
      "answer": "Puedes explorar color, mechas, balayage, blowouts, trenzas, cortes, tratamientos alisadores, tratamientos suavizantes, pelucas y peinados disponibles a través de Katty Hair Studio en Brentwood."
    },
    {
      "question": "¿Cómo elijo el servicio de salón de belleza adecuado para mi objetivo?",
      "answer": "Trae una referencia y comparte tu historial capilar, la condición actual, la rutina diaria y el mantenimiento deseado. La consulta ayuda a reducir las opciones a un plan realista para tu cabello."
    },
    {
      "question": "¿Puedo confirmar los precios antes de que comience mi servicio?",
      "answer": "Sí. Tu textura, longitud, densidad, historial y acabado deseado moldean el tiempo y la cotización, que se discuten antes de que comience el servicio."
    },
    {
      "question": "¿Dónde se encuentra Katty Hair Studio?",
      "answer": "Katty Hair Studio está ubicado en 3816 Bladensburg Rd en Brentwood, Maryland. Puedes solicitar una cita en línea o llamar al salón antes de visitar."
    }
  ]
};

export const brentwoodServices = servicePages.filter(
  (page) => page.pageType === "Service Page",
);

export function getServicePage(slug: string) {
  return brentwoodServices.find((page) => page.slug === slug);
}

export function getRelatedServices(page: ServicePageData) {
  const pool = extensionServiceSlugs.has(page.slug)
    ? brentwoodServices.filter((item) => extensionServiceSlugs.has(item.slug))
    : brentwoodServices.filter((item) => !extensionServiceSlugs.has(item.slug));
  const index = pool.findIndex((item) => item.slug === page.slug);
  return [1, 2, 3].map((offset) => pool[(index + offset) % pool.length]);
}
