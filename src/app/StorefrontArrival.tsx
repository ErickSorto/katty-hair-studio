import Image from "next/image";
import type { Locale } from "./i18n/config";

const storefrontImage = "/location/katty-hair-studio-storefront.webp";

export default function StorefrontArrival({ locale = "en" }: { locale?: Locale }) {
  const copy = locale === "es"
    ? {
        eyebrow: "Reconoce el salón",
        title: "Busca el toldo azul y el letrero de Katty.",
        body: "Nuestra entrada está en 3816 Bladensburg Road, junto al escaparate de Katty Hair Studio & Beauty Supply.",
        caption: "La fachada de Katty Hair Studio en Brentwood, Maryland.",
        alt: "Fachada de Katty Hair Studio & Beauty Supply en 3816 Bladensburg Road, Brentwood, Maryland",
      }
    : {
        eyebrow: "Know what to look for",
        title: "Look for the blue awning and Katty sign.",
        body: "Our entrance is at 3816 Bladensburg Road, beside the Katty Hair Studio & Beauty Supply storefront.",
        caption: "The Katty Hair Studio storefront in Brentwood, Maryland.",
        alt: "Storefront of Katty Hair Studio and Beauty Supply at 3816 Bladensburg Road in Brentwood, Maryland",
      };

  return (
    <section className="storefront-arrival-section" id="storefront">
      <figure className="storefront-arrival-image" data-reveal>
        <Image
          alt={copy.alt}
          fill
          sizes="(max-width: 900px) 100vw, 55vw"
          src={storefrontImage}
        />
        <figcaption>{copy.caption}</figcaption>
      </figure>
      <div className="storefront-arrival-copy" data-reveal>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
    </section>
  );
}
