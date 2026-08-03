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
    heroTitle: "Olaplex No. 7, plus hair that fits your finish.",
    heroDescription: "Shop Olaplex No. 7 Bonding Oil at Katty Hair Studio in Brentwood, then ask about low-priced Hispanic and Indian hair extensions with help matching texture, length, and your install plan.",
    heroAction: "Ask about availability",
    heroAlt: "Professional hair-care products and styling tools arranged in a warm editorial still life",
    introEyebrow: "One studio, more ways to leave ready",
    introTitle: "The detail after the appointment matters.",
    introBody: "Whether you are adding shine at home or planning a new install, we keep the decision simple: tell us your goal, show us your reference, and we will help you find the right next step in the studio.",
    olaplexTitle: "Olaplex No. 7 Bonding Oil",
    olaplexEyebrow: "Professional take-home care",
    olaplexBody: "Ask for Olaplex No. 7 Bonding Oil when you want a lightweight finishing oil for shine, softness, and heat-styling support. It is an easy add-on for a polished blowout, silk press, or everyday style.",
    silkLink: "Explore silk presses",
    extensionsTitle: "Hispanic and Indian hair extensions at low prices",
    extensionsEyebrow: "Extension supply",
    extensionsBody: "Katty Hair Studio also carries Hispanic and Indian hair extension options at low prices. Share your desired length, fullness, texture, and installation goal so we can help you compare the hair that makes sense for your look and budget.",
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
      ["Do you sell Olaplex No. 7 Bonding Oil in Brentwood?", "Yes—Katty Hair Studio offers Olaplex No. 7 Bonding Oil in the studio. Contact the salon for current availability before your visit."],
      ["What types of hair extensions do you sell?", "The studio offers Hispanic and Indian hair extension options. Let us know the texture, length, fullness, and intended install so we can help you find a suitable option."],
      ["How much do the hair extensions cost?", "We keep extension options low-priced and help you compare choices in the studio. Pricing can vary by length, texture, and amount of hair, so contact us for the current options."],
    ],
  },
  es: {
    eyebrow: "Productos del salón · extensiones",
    pageLabel: "Productos y extensiones",
    heroTitle: "Olaplex No. 7 y cabello que combina con tu acabado.",
    heroDescription: "Encuentra Olaplex No. 7 Bonding Oil en Katty Hair Studio en Brentwood y pregunta por extensiones de cabello hispano e indio a precios accesibles, con ayuda para comparar textura, largo y tu plan de instalación.",
    heroAction: "Consultar disponibilidad",
    heroAlt: "Productos profesionales para el cabello y herramientas de estilismo en una composición editorial cálida",
    introEyebrow: "Un salón, más formas de salir lista",
    introTitle: "El detalle después de la cita también importa.",
    introBody: "Ya sea que quieras agregar brillo en casa o planear una nueva instalación, simplificamos la decisión: cuéntanos tu objetivo, enséñanos tu referencia y te ayudaremos a encontrar el siguiente paso adecuado en el salón.",
    olaplexTitle: "Olaplex No. 7 Bonding Oil",
    olaplexEyebrow: "Cuidado profesional para llevar",
    olaplexBody: "Pregunta por Olaplex No. 7 Bonding Oil si buscas un aceite de acabado ligero para brillo, suavidad y apoyo para el peinado con calor. Es un complemento ideal para un blowout pulido, un silk press o tu estilo diario.",
    silkLink: "Explora los silk press",
    extensionsTitle: "Extensiones de cabello hispano e indio a precios accesibles",
    extensionsEyebrow: "Cabello para extensiones",
    extensionsBody: "Katty Hair Studio también ofrece opciones de extensiones de cabello hispano e indio a precios accesibles. Comparte el largo, volumen, textura y objetivo de instalación que deseas para ayudarte a comparar el cabello que tiene sentido para tu look y presupuesto.",
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
      ["¿Venden Olaplex No. 7 Bonding Oil en Brentwood?", "Sí—Katty Hair Studio ofrece Olaplex No. 7 Bonding Oil en el salón. Comunícate con el salón para confirmar la disponibilidad actual antes de tu visita."],
      ["¿Qué tipos de extensiones de cabello venden?", "El salón ofrece opciones de extensiones de cabello hispano e indio. Cuéntanos la textura, el largo, el volumen y la instalación que deseas para ayudarte a encontrar una opción adecuada."],
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
        image="/editorial/katty-olaplex-no7-bonding-oil-v1.webp"
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
            src="/editorial/katty-olaplex-no7-bonding-oil-v1.webp"
          />
          <span>01 · Olaplex</span>
        </div>
        <div className="retail-product-copy" data-reveal>
          <p className="eyebrow">{copy.olaplexEyebrow}</p>
          <h2>{copy.olaplexTitle}</h2>
          <p>{copy.olaplexBody}</p>
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
              { "@type": "Product", name: "Olaplex No. 7 Bonding Oil", brand: { "@type": "Brand", name: "Olaplex" }, availableAtOrFrom: { "@type": "HairSalon", name: "Katty Hair Studio", address: { "@type": "PostalAddress", streetAddress: "3816 Bladensburg Rd", addressLocality: "Brentwood", addressRegion: "MD", postalCode: "20722", addressCountry: "US" } } },
              { "@type": "FAQPage", inLanguage: locale, mainEntity: copy.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
            ],
          }).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
    </EditorialPageFrame>
  );
}
