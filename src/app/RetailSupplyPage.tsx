import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle, Phone, Sparkles } from "lucide-react";
import EditorialPageFrame from "./EditorialPageFrame";
import EditorialPageHero from "./EditorialPageHero";
import LocationSection from "./LocationSection";
import { localizePath, type Locale } from "./i18n/config";

const phoneNumber = "+12405826622";

const pageCopy = {
  en: {
    eyebrow: "Salon retail · extensions",
    pageLabel: "Products + extensions",
    heroTitle: "Olaplex essentials + extension hair, all in one studio.",
    heroDescription: "Explore the Olaplex range from No. 0 through No. 7 at Katty Hair Studio in Brentwood, then ask about Indian, Brazilian, Cambodian, and Malaysian extension hair with help matching texture, length, and your install plan.",
    heroAction: "Ask about availability",
    heroAlt: "Full Olaplex product range with dark hair extension bundles at Katty Hair Studio",
    introEyebrow: "One studio, more ways to leave ready",
    introTitle: "The detail after the appointment matters.",
    introBody: "Whether you are adding shine at home or planning a new install, we keep the decision simple: tell us your goal, show us your reference, and we will help you find the right next step in the studio.",
    olaplexTitle: "The Olaplex range, not just one bottle.",
    olaplexEyebrow: "Professional take-home care",
    olaplexBody: "Build a take-home routine around the products you need. The current salon selection includes treatment, shampoo, toning, conditioner, and finishing care—ask us what is available before you visit.",
    olaplexProducts: [
      ["No. 0", "Intensive Bond Building Hair Treatment"],
      ["No. 3", "Hair Perfector"],
      ["No. 4", "Bond Maintenance Shampoo"],
      ["No. 4P", "Blonde Enhancer Toning Shampoo"],
      ["No. 5", "Bond Maintenance Conditioner"],
      ["No. 7", "Bonding Oil"],
    ],
    silkLink: "Explore silk presses",
    extensionsTitle: "Indian, Brazilian, Cambodian + Malaysian extension hair.",
    extensionsEyebrow: "Extension supply",
    extensionsBody: "Katty Hair Studio carries a more detailed extension-hair selection at low prices. Share your desired length, fullness, texture, and installation goal so we can help you compare the hair that makes sense for your look and budget.",
    extensionTypes: [
      ["Indian hair", "Discuss texture, length, and current bundle availability in the studio."],
      ["Brazilian hair", "Compare it alongside your desired finish and budget."],
      ["Cambodian hair", "Bring a reference so we can guide the closest fit for your goal."],
      ["Malaysian hair", "Ask about the options and quantities currently on hand."],
    ],
    extensionsLink: "Explore extension services",
    points: ["Ask about current in-studio availability", "Compare texture and length before you buy", "Bring a reference for an easier match"],
    planEyebrow: "Before you choose",
    planTitle: "A clear match, not a guess.",
    planBody: "Hair availability and the right choice can change with texture, color, length, and your desired method. Call or message the studio before visiting so we can help guide the conversation.",
    call: "Call (240) 582-6622",
    message: "Message on WhatsApp",
    faqEyebrow: "Product + extension questions",
    faqTitle: "What to ask before you come in.",
    faqs: [
      ["Which Olaplex products do you sell in Brentwood?", "Katty Hair Studio currently carries Olaplex No. 0, No. 3, No. 4, No. 4P, No. 5, and No. 7. Contact the salon to confirm current in-studio availability before you visit."],
      ["What types of hair extensions do you sell?", "The studio offers Indian, Brazilian, Cambodian, and Malaysian hair extension options. Let us know the texture, length, fullness, and intended install so we can help you find a suitable option."],
      ["How much do the hair extensions cost?", "We keep extension options low-priced and help you compare choices in the studio. Pricing can vary by length, texture, and amount of hair, so contact us for the current options."],
    ],
  },
  es: {
    eyebrow: "Productos del salón · extensiones",
    pageLabel: "Productos y extensiones",
    heroTitle: "Esenciales Olaplex + cabello para extensiones, en un solo salón.",
    heroDescription: "Explora la línea Olaplex del No. 0 al No. 7 en Katty Hair Studio en Brentwood y pregunta por cabello indio, brasileño, camboyano y malasio para extensiones, con ayuda para comparar textura, largo y tu plan de instalación.",
    heroAction: "Consultar disponibilidad",
    heroAlt: "Línea completa de Olaplex con paquetes de extensiones oscuras en Katty Hair Studio",
    introEyebrow: "Un salón, más formas de salir lista",
    introTitle: "El detalle después de la cita también importa.",
    introBody: "Ya sea que quieras agregar brillo en casa o planear una nueva instalación, simplificamos la decisión: cuéntanos tu objetivo, enséñanos tu referencia y te ayudaremos a encontrar el siguiente paso adecuado en el salón.",
    olaplexTitle: "La línea Olaplex, no solo una botella.",
    olaplexEyebrow: "Cuidado profesional para llevar",
    olaplexBody: "Crea una rutina para llevar a casa con los productos que necesitas. La selección actual del salón incluye tratamiento, champú, matizante, acondicionador y cuidado de acabado; consulta qué hay disponible antes de venir.",
    olaplexProducts: [
      ["No. 0", "Tratamiento intensivo para crear enlaces"],
      ["No. 3", "Hair Perfector"],
      ["No. 4", "Champú Bond Maintenance"],
      ["No. 4P", "Champú matizante Blonde Enhancer"],
      ["No. 5", "Acondicionador Bond Maintenance"],
      ["No. 7", "Bonding Oil"],
    ],
    silkLink: "Explora los silk press",
    extensionsTitle: "Cabello indio, brasileño, camboyano y malasio para extensiones.",
    extensionsEyebrow: "Cabello para extensiones",
    extensionsBody: "Katty Hair Studio ofrece una selección más detallada de cabello para extensiones a precios accesibles. Comparte el largo, volumen, textura y objetivo de instalación que deseas para ayudarte a comparar el cabello que tiene sentido para tu look y presupuesto.",
    extensionTypes: [
      ["Cabello indio", "Consulta la textura, el largo y la disponibilidad actual de paquetes en el salón."],
      ["Cabello brasileño", "Compáralo según el acabado que deseas y tu presupuesto."],
      ["Cabello camboyano", "Trae una referencia para orientarte hacia la opción más cercana a tu objetivo."],
      ["Cabello malasio", "Pregunta por las opciones y cantidades disponibles actualmente."],
    ],
    extensionsLink: "Explora los servicios de extensiones",
    points: ["Pregunta por la disponibilidad actual en el salón", "Compara textura y largo antes de comprar", "Trae una referencia para encontrar un mejor match"],
    planEyebrow: "Antes de elegir",
    planTitle: "Una combinación clara, no una adivinanza.",
    planBody: "La disponibilidad y la opción adecuada pueden variar según textura, color, largo y el método que deseas. Llama o envía un mensaje antes de venir para orientarte mejor.",
    call: "Llama al (240) 582-6622",
    message: "Enviar WhatsApp",
    faqEyebrow: "Preguntas sobre productos y extensiones",
    faqTitle: "Qué preguntar antes de venir.",
    faqs: [
      ["¿Qué productos Olaplex venden en Brentwood?", "Katty Hair Studio actualmente ofrece Olaplex No. 0, No. 3, No. 4, No. 4P, No. 5 y No. 7. Comunícate con el salón para confirmar la disponibilidad actual antes de tu visita."],
      ["¿Qué tipos de extensiones de cabello venden?", "El salón ofrece opciones de cabello indio, brasileño, camboyano y malasio para extensiones. Cuéntanos la textura, el largo, el volumen y la instalación que deseas para ayudarte a encontrar una opción adecuada."],
      ["¿Cuánto cuestan las extensiones de cabello?", "Mantenemos opciones de extensiones a precios accesibles y te ayudamos a compararlas en el salón. El precio puede variar según el largo, la textura y la cantidad de cabello; comunícate con nosotros para conocer las opciones actuales."],
    ],
  },
} as const;

export default function RetailSupplyPage({ locale = "en" }: { locale?: Locale }) {
  const copy = pageCopy[locale];
  const whatsapp = "https://wa.me/12404784065";
  const pageUrl = locale === "es" ? "https://www.kattyhairstudio.com/es/olaplex-hair-extensions" : "https://www.kattyhairstudio.com/olaplex-hair-extensions";

  return (
    <EditorialPageFrame className="retail-page-shell" locale={locale}>
      <EditorialPageHero
        description={copy.heroDescription}
        eyebrow={copy.eyebrow}
        image="/editorial/katty-olaplex-range-extension-hair-v1.webp"
        imageAlt={copy.heroAlt}
        imagePosition="42% center"
        locale={locale}
        pageLabel={copy.pageLabel}
        primaryHref="#ask-the-studio"
        primaryLabel={copy.heroAction}
        title={copy.heroTitle}
      />

      <section className="retail-intro-section" id="products">
        <div className="retail-intro-copy" data-reveal>
          <p className="eyebrow">{copy.introEyebrow}</p>
          <h2>{copy.introTitle}</h2>
          <p>{copy.introBody}</p>
        </div>
        <div className="retail-intro-list" data-reveal>
          {copy.points.map((point, index) => (
            <div key={point}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Check aria-hidden="true" />
              <p>{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="retail-product-section">
        <div className="retail-product-image" data-reveal>
          <Image
            alt={copy.heroAlt}
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            src="/editorial/katty-olaplex-range-extension-hair-v1.webp"
          />
          <span>01 · Olaplex</span>
        </div>
        <div className="retail-product-copy" data-reveal>
          <p className="eyebrow">{copy.olaplexEyebrow}</p>
          <h2>{copy.olaplexTitle}</h2>
          <p>{copy.olaplexBody}</p>
          <div className="olaplex-range-grid" aria-label={locale === "es" ? "Productos Olaplex disponibles" : "Available Olaplex products"}>
            {copy.olaplexProducts.map(([number, name]) => (
              <div key={number}>
                <strong>{number}</strong>
                <span>{name}</span>
              </div>
            ))}
          </div>
          <Link href={localizePath("/services/silk-press", locale)}>
            {copy.silkLink}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="retail-extension-section">
        <div className="retail-extension-copy" data-reveal>
          <p className="eyebrow">{copy.extensionsEyebrow}</p>
          <h2>{copy.extensionsTitle}</h2>
          <p>{copy.extensionsBody}</p>
          <div className="extension-origin-grid" aria-label={locale === "es" ? "Tipos de cabello para extensiones" : "Extension hair types"}>
            {copy.extensionTypes.map(([type, detail]) => (
              <div key={type}>
                <h3>{type}</h3>
                <p>{detail}</p>
              </div>
            ))}
          </div>
          <Link className="primary-link" href={localizePath("/hair-extension-technician", locale)}>
            {copy.extensionsLink}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="retail-extension-art" data-reveal>
          <Image
            alt={locale === "es" ? "Extensiones largas, negras y brillantes con ondas suaves" : "Long glossy black hair extensions blended into soft waves"}
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            src="/services/generated/hair-extension-technician-v2.webp"
          />
        </div>
      </section>

      <section className="retail-contact-section" id="ask-the-studio">
        <div data-reveal>
          <p className="eyebrow">{copy.planEyebrow}</p>
          <h2>{copy.planTitle}</h2>
          <p>{copy.planBody}</p>
        </div>
        <div className="retail-contact-actions" data-reveal>
          <a className="primary-link" href={`tel:${phoneNumber}`}>
            <Phone aria-hidden="true" />
            {copy.call}
          </a>
          <a className="retail-whatsapp-link" href={whatsapp} rel="noreferrer" target="_blank">
            <MessageCircle aria-hidden="true" />
            {copy.message}
          </a>
        </div>
      </section>

      <section className="retail-faq-section">
        <div className="retail-faq-heading" data-reveal>
          <p className="eyebrow">{copy.faqEyebrow}</p>
          <h2>{copy.faqTitle}</h2>
        </div>
        <div className="retail-faq-list" data-reveal>
          {copy.faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>{question}<span>+</span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <LocationSection locale={locale} />
      <div className="retail-booking-link">
        <Sparkles aria-hidden="true" />
        <Link href={localizePath("/#booking", locale)}>{locale === "es" ? "Solicitar una cita" : "Request an appointment"}</Link>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "WebPage", name: copy.heroTitle, url: pageUrl, inLanguage: locale },
              {
                "@type": "ItemList",
                name: locale === "es" ? "Selección Olaplex de Katty Hair Studio" : "Katty Hair Studio Olaplex selection",
                itemListElement: copy.olaplexProducts.map(([number, name], position) => ({
                  "@type": "ListItem",
                  position: position + 1,
                  item: {
                    "@type": "Product",
                    name: `Olaplex ${number} ${name}`,
                    brand: { "@type": "Brand", name: "Olaplex" },
                  },
                })),
              },
              { "@type": "FAQPage", inLanguage: locale, mainEntity: copy.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
            ],
          }).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
    </EditorialPageFrame>
  );
}
