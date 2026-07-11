import { ArrowRight, MapPin, Phone } from "lucide-react";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const address = "3816 Bladensburg Rd, Brentwood, MD 20722";
const directionsUrl =
  "https://www.google.com/maps/search/?api=1&query=3816%20Bladensburg%20Rd%2C%20Brentwood%2C%20MD%2020722";
const mapEmbedUrl =
  "https://www.google.com/maps?q=3816%20Bladensburg%20Rd%2C%20Brentwood%2C%20MD%2020722&output=embed";

const hours = [
  ["Mon", "10:00 AM - 6:30 PM"],
  ["Tue", "Closed"],
  ["Wed-Fri", "10:00 AM - 6:30 PM"],
  ["Sat", "8:00 AM - 4:30 PM"],
  ["Sun", "10:00 AM - 3:30 PM"],
] as const;

export default function LocationSection() {
  return (
    <section className="location-section" id="location">
      <div className="location-copy" data-reveal>
        <p className="eyebrow">Your visit</p>
        <h2>You’ll find the studio right here in Brentwood.</h2>
        <p>{address}</p>
        <div className="location-actions">
          <a className="primary-link" href={directionsUrl} rel="noreferrer" target="_blank">
            <MapPin aria-hidden="true" />
            Directions
            <ArrowRight aria-hidden="true" />
          </a>
          <a className="secondary-dark-link" href={`tel:${phoneNumber}`}>
            <Phone aria-hidden="true" />
            {phoneDisplay}
          </a>
        </div>
        <div className="hours-list" aria-label="Business hours">
          {hours.map(([day, time]) => (
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
          title="Map to Katty Hair Studio in Brentwood, Maryland"
        />
      </div>
    </section>
  );
}
