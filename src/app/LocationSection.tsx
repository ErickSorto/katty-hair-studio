import { ArrowRight, MapPin, Phone } from "lucide-react";
import type { Locale } from "./i18n/config";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const address = "3816 Bladensburg Rd, Brentwood, MD 20722";
const directionsUrl =
  "https://www.google.com/maps/search/?api=1&query=3816%20Bladensburg%20Rd%2C%20Brentwood%2C%20MD%2020722";
const mapEmbedUrl =
  "https://www.google.com/maps?q=3816%20Bladensburg%20Rd%2C%20Brentwood%2C%20MD%2020722&output=embed";

export default function LocationSection({ locale = "en" }: { locale?: Locale }) {
  const copy = locale === "es"
    ? {
        eyebrow: "Tu visita",
        title: "Encontrarás el salón aquí mismo en Brentwood.",
        directions: "Cómo llegar",
        hoursLabel: "Horario del salón",
        mapTitle: "Mapa para llegar a Katty Hair Studio en Brentwood, Maryland",
        hours: [["Lun", "10:00 a. m. - 6:30 p. m."], ["Mar", "Cerrado"], ["Mié-Vie", "10:00 a. m. - 6:30 p. m."], ["Sáb", "8:00 a. m. - 4:30 p. m."], ["Dom", "10:00 a. m. - 3:30 p. m."]] as const,
      }
    : {
        eyebrow: "Your visit",
        title: "You’ll find the studio right here in Brentwood.",
        directions: "Directions",
        hoursLabel: "Business hours",
        mapTitle: "Map to Katty Hair Studio in Brentwood, Maryland",
        hours: [["Mon", "10:00 AM - 6:30 PM"], ["Tue", "Closed"], ["Wed-Fri", "10:00 AM - 6:30 PM"], ["Sat", "8:00 AM - 4:30 PM"], ["Sun", "10:00 AM - 3:30 PM"]] as const,
      };

  return (
    <section className="location-section" id="location">
      <div className="location-copy" data-reveal>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{address}</p>
        <div className="location-actions">
          <a className="primary-link" href={directionsUrl} rel="noreferrer" target="_blank">
            <MapPin aria-hidden="true" />
            {copy.directions}
            <ArrowRight aria-hidden="true" />
          </a>
          <a className="secondary-dark-link" href={`tel:${phoneNumber}`}>
            <Phone aria-hidden="true" />
            {phoneDisplay}
          </a>
        </div>
        <div className="hours-list" aria-label={copy.hoursLabel}>
          {copy.hours.map(([day, time]) => (
            <p key={day}>
              <span>{day}</span>
              <strong>{time}</strong>
            </p>
          ))}
        </div>
      </div>
      <div className="map-frame" data-reveal>
        <iframe
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapEmbedUrl}
          title={copy.mapTitle}
        />
      </div>
    </section>
  );
}
