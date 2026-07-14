import type { Metadata } from "next";
import PolicyPage, { type PolicySection } from "@/app/PolicyPage";
import { absoluteLocalizedUrl, localizedAlternates } from "@/app/i18n/config";

const title = "Política de privacidad | Katty Hair Studio";
const description =
  "Cómo Katty Hair Studio recopila, usa, protege y comparte información para citas, comunicaciones y programación mediante Google Calendar.";
const canonical = absoluteLocalizedUrl("/privacy", "es");

export const metadata: Metadata = {
  title,
  description,
  alternates: localizedAlternates("/privacy", "es"),
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
        alt: "Política de privacidad de Katty Hair Studio",
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
    id: "information-we-collect",
    title: "Información que recopilamos",
    paragraphs: [
      "Cuando solicitas o administras una cita, podemos recopilar tu nombre, dirección de correo electrónico, número de teléfono, servicio solicitado, horario de la cita, notas, elección de consentimiento para mensajes SMS e historial de reservas.",
      "Nuestro sitio web y nuestros proveedores de alojamiento también pueden procesar información técnica básica, como la dirección IP, el tipo de navegador, el tipo de dispositivo, las páginas visitadas y los registros de errores o seguridad.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "Cómo usamos la información",
    paragraphs: [
      "Usamos la información únicamente para operar el salón y ofrecer la experiencia que solicitas.",
    ],
    bullets: [
      "Consultar la disponibilidad, reservar citas y evitar reservas duplicadas.",
      "Enviar confirmaciones, actualizaciones, recordatorios e información sobre cancelaciones.",
      "Responder preguntas y prepararnos para los servicios solicitados.",
      "Proteger el sitio web, investigar errores y mantener los registros de reservas.",
      "Cumplir obligaciones legales, contables, de seguridad y de conformidad normativa.",
    ],
  },
  {
    id: "google-calendar-data",
    title: "Datos de Google Calendar",
    paragraphs: [
      "Reservas de Katty Hair Studio se conecta a una cuenta de Google autorizada por la propietaria del salón. La conexión puede leer los metadatos de la lista de calendarios, crear un calendario dedicado a las reservas del salón y ver, crear, modificar o eliminar eventos únicamente en los calendarios creados por esta aplicación.",
      "Los datos de Google Calendar se usan únicamente para identificar el calendario de reservas creado por la aplicación, contar la disponibilidad de citas, crear o cancelar eventos de citas y evitar el exceso de reservas. La aplicación no lee los detalles de eventos de calendarios no relacionados ni usa los datos de usuarios de Google para publicidad, elaboración de perfiles o venta.",
      "El token de actualización de Google se cifra antes de almacenarlo. El acceso puede revocarse en cualquier momento desde la configuración de acceso de terceros de la Cuenta de Google conectada o comunicándote con el salón.",
    ],
  },
  {
    id: "email-and-text-messages",
    title: "Correos electrónicos y mensajes de texto",
    paragraphs: [
      "Los correos electrónicos de reserva pueden enviarse a la dirección que proporciones. Si marcas por separado la casilla de consentimiento para SMS, Katty Hair Studio puede enviarte mensajes de texto transaccionales sobre tus citas y las actualizaciones solicitadas. El consentimiento para recibir mensajes de texto es opcional y no es una condición para comprar un servicio.",
      "La frecuencia de los mensajes varía según tus citas. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para dejar de recibir mensajes o HELP para obtener ayuda. La información móvil y el consentimiento para recibir SMS no se venden, alquilan ni comparten con terceros para sus propios fines de mercadeo o promoción.",
    ],
  },
  {
    id: "service-providers",
    title: "Proveedores de servicios",
    paragraphs: [
      "Para operar este servicio, usamos proveedores que procesan información en nuestro nombre. Entre ellos pueden estar Vercel para el alojamiento del sitio web, Supabase para la base de datos de reservas, Google Calendar para la programación, Resend para los correos electrónicos transaccionales y Twilio para los SMS transaccionales. Cada proveedor procesa la información conforme a sus propios términos y prácticas de privacidad.",
      "También podemos divulgar información cuando lo exija la ley, para proteger a las personas o al servicio, o como parte de una transferencia del negocio. No vendemos información personal.",
    ],
  },
  {
    id: "retention-and-security",
    title: "Retención y seguridad",
    paragraphs: [
      "Conservamos los registros de reservas y comunicaciones solo durante el tiempo razonablemente necesario para las operaciones del salón, el servicio al cliente, la resolución de disputas, las obligaciones legales y la seguridad. Los periodos de retención pueden variar según el tipo de registro.",
      "Usamos medidas administrativas y técnicas razonables, incluido el acceso restringido a la base de datos desde el servidor y el cifrado de las credenciales de autorización de Google almacenadas. Ningún servicio de internet puede garantizar una seguridad absoluta.",
    ],
  },
  {
    id: "your-choices",
    title: "Tus opciones",
    paragraphs: [
      "Puedes solicitar acceso, corrección o eliminación de la información asociada con tu reserva, salvo los registros que debamos conservar por motivos comerciales legítimos o legales. También puedes revocar el acceso de Google, cancelar la suscripción a los mensajes SMS opcionales o pedirnos que dejemos de enviar comunicaciones por correo electrónico que no sean esenciales.",
      "Para presentar una solicitud, escribe a kattyhairstudio@gmail.com o llama al (240) 582-6622. Es posible que debamos verificar tu identidad antes de completar la solicitud.",
    ],
  },
  {
    id: "children-and-changes",
    title: "Menores y cambios en la política",
    paragraphs: [
      "Este servicio de reservas en línea no está dirigido a menores de 13 años. Un padre, una madre o un tutor legal debe concertar las citas y proporcionar la información de un menor.",
      "Podemos actualizar esta política cuando cambien el servicio de reservas o los requisitos legales. La fecha de vigencia que aparece al principio indicará cuándo entró en vigor la versión actual.",
    ],
  },
  {
    id: "contact-us",
    title: "Contáctanos",
    paragraphs: [
      "Katty Hair Studio, 3816 Bladensburg Road, Brentwood, Maryland 20722. Escribe a kattyhairstudio@gmail.com o llama al (240) 582-6622 si tienes preguntas o solicitudes relacionadas con la privacidad.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <PolicyPage
      description="Una explicación clara de la información que recopila la experiencia de reserva, por qué es necesaria y las opciones que conservas."
      eyebrow="Tu información, tratada con cuidado"
      locale="es"
      sections={sections}
      title="Política de privacidad"
    />
  );
}
