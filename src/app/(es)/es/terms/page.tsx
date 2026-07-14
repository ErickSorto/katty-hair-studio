import type { Metadata } from "next";
import PolicyPage, { type PolicySection } from "@/app/PolicyPage";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const title = "Términos de servicio | Katty Hair Studio";
const description =
  "Términos para usar el sitio web de Katty Hair Studio, la experiencia de reserva en línea, las comunicaciones sobre citas y los servicios del salón.";
const canonical = absoluteLocalizedUrl("/terms", "es");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/terms", "es"),
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
    siteName: "Katty Hair Studio",
    locale: "es_US",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/social/katty-share-preview.webp",
        width: 1200,
        height: 630,
        alt: "Términos de servicio de Katty Hair Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/social/katty-share-preview.webp"],
  },
};

const sections: readonly PolicySection[] = [
  {
    id: "agreement",
    title: "Aceptación de estos términos",
    paragraphs: [
      "Estos Términos de servicio rigen el uso de kattyhairstudio.com y sus funciones para solicitar citas en línea. Al usar el sitio web o enviar una solicitud de cita, aceptas estos términos y nuestra Política de privacidad.",
      "Si no estás de acuerdo, no envíes información mediante la experiencia de reserva. En su lugar, puedes comunicarte con el salón por teléfono.",
    ],
  },
  {
    id: "appointments",
    title: "Solicitudes y confirmación de citas",
    paragraphs: [
      "Una cita queda reservada únicamente después de que el sistema de reservas muestre una confirmación o de que el salón la confirme directamente. La disponibilidad puede cambiar mientras se envía una solicitud.",
      "Los clientes seleccionan un servicio y un horario de cita, no un integrante específico del equipo. Katty Hair Studio coordina internamente al integrante disponible, por lo que una reserva en línea no garantiza a un estilista en particular.",
    ],
  },
  {
    id: "services-and-pricing",
    title: "Servicios, duración y precios",
    paragraphs: [
      "Las descripciones de servicios, las duraciones y los precios iniciales son estimados. La duración y el precio finales pueden depender del largo, la densidad y la condición del cabello, los productos necesarios, el resultado solicitado y la consulta. El salón comunicará un plan o presupuesto final cuando corresponda.",
      "Las promociones, incluida la oferta de $10 de descuento los lunes, pueden estar sujetas a requisitos de elegibilidad, disponibilidad del servicio, programación y condiciones publicadas. Los descuentos los aplica el salón y no pueden canjearse por dinero en efectivo.",
    ],
  },
  {
    id: "client-responsibilities",
    title: "Responsabilidades del cliente",
    paragraphs: [
      "Aceptas proporcionar información precisa de contacto, servicio y programación, así como revelar la información razonablemente necesaria para realizar el servicio solicitado de forma segura.",
    ],
    bullets: [
      "Llegar a la hora acordada y seguir las instrucciones de preparación proporcionadas por el salón.",
      "Comunicarte de inmediato con el salón si vas a llegar tarde o no puedes asistir.",
      "No usar indebidamente el sitio web, intentar realizar reservas fraudulentas, interferir con la disponibilidad ni acceder a la reserva de otra persona.",
    ],
  },
  {
    id: "changes-and-cancellations",
    title: "Cambios, cancelaciones y citas perdidas",
    paragraphs: [
      "Usa el enlace de cancelación incluido en tu confirmación, llama al salón o comunícate con nosotros lo antes posible si cambian tus planes. El salón puede comunicarse contigo para ajustar una cita cuando un servicio requiera una consulta, una duración diferente u otro integrante del equipo.",
      "Cualquier política de depósito, cancelación tardía, llegada tarde o inasistencia será informada por el salón antes de que se cobre o aplique. El salón puede rechazar o cancelar actividades de reserva fraudulentas, abusivas o problemáticas que se repitan.",
    ],
  },
  {
    id: "communications",
    title: "Comunicaciones por correo electrónico y SMS",
    paragraphs: [
      "Al enviar una reserva, aceptas recibir los correos electrónicos necesarios para el servicio, como confirmaciones, actualizaciones e información sobre cancelaciones. Si por separado aceptas recibir SMS, autorizas a Katty Hair Studio a enviarte mensajes de texto transaccionales sobre la cita al número proporcionado.",
      "La frecuencia de los SMS varía según tus citas. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para dejar de recibir mensajes o HELP para obtener ayuda. El consentimiento para SMS es opcional, no es una condición de compra y se aplica únicamente a las comunicaciones sobre citas descritas en el momento de dar el consentimiento. Las compañías de telefonía no son responsables por mensajes retrasados o no entregados.",
    ],
  },
  {
    id: "payments",
    title: "Pagos",
    paragraphs: [
      "La experiencia actual de reserva en línea no cobra pagos. A menos que el salón te indique lo contrario, el pago debe hacerse directamente a Katty Hair Studio en el momento del servicio mediante un método de pago aceptado por el salón.",
    ],
  },
  {
    id: "website-content",
    title: "Contenido y disponibilidad del sitio web",
    paragraphs: [
      "Las fotografías, la marca, los textos y demás contenido del sitio web pertenecen a Katty Hair Studio o se usan con autorización. No pueden copiarse ni reutilizarse comercialmente sin permiso.",
      "Trabajamos para mantener el sitio web preciso y disponible, pero no garantizamos el acceso ininterrumpido ni que todas las descripciones, precios, horas o imágenes estén siempre actualizados. Podemos actualizar o descontinuar funciones sin previo aviso.",
    ],
  },
  {
    id: "disclaimers",
    title: "Descargos de responsabilidad y limitación de responsabilidad",
    paragraphs: [
      "El sitio web y las herramientas de reserva se proporcionan según disponibilidad y en la medida permitida por la ley. La información en línea es de carácter general y no sustituye una consulta en persona ni una evaluación profesional para determinar si un servicio es adecuado.",
      "En la medida permitida por la ley, Katty Hair Studio no es responsable por pérdidas indirectas, incidentales, especiales o consecuentes que surjan únicamente del uso del sitio web o de una función de reserva que no esté disponible. Nada en estos términos excluye derechos o responsabilidades que legalmente no puedan excluirse.",
    ],
  },
  {
    id: "governing-law",
    title: "Ley aplicable y cambios",
    paragraphs: [
      "Estos términos se rigen por las leyes aplicables en Maryland, sin tener en cuenta los principios sobre conflicto de leyes. Podemos actualizar estos términos cuando cambien el servicio de reservas o las políticas del salón. La fecha de vigencia que aparece al principio identifica la versión actual.",
    ],
  },
  {
    id: "contact-us",
    title: "Contáctanos",
    paragraphs: [
      "Katty Hair Studio, 3816 Bladensburg Road, Brentwood, Maryland 20722. Escribe a kattyhairstudio@gmail.com o llama al (240) 582-6622 si tienes preguntas sobre estos términos, las citas o las preferencias de comunicación.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <PolicyPage
      description="Los términos prácticos que rigen las solicitudes de citas, las comunicaciones del salón, los precios y el uso de este sitio web."
      eyebrow="Expectativas claras desde la solicitud hasta el sillón"
      locale="es"
      sections={sections}
      title="Términos de servicio"
    />
  );
}
