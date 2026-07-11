import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  BadgePercent,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock,
  ExternalLink,
  Gem,
  Heart,
  MapPin,
  MapPinned,
  MessageCircle,
  Palette,
  Phone,
  Quote,
  Scissors,
  Sparkles,
  Star,
  Store,
  Timer,
  WandSparkles,
} from "lucide-react";
import BookingSection from "./BookingSection";
import DrawerAutoClose from "./DrawerAutoClose";
import ReviewPager from "./ReviewPager";
import ViewportReveal from "./ViewportReveal";

type SiteIcon = LucideIcon;

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const whatsappNumber = "+12404784065";
const whatsappDisplay = "(240) 478-4065";
const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;
const address = "3816 Bladensburg Rd, Brentwood, MD 20722";
const directionsUrl =
  "https://www.google.com/maps/search/?api=1&query=3816%20Bladensburg%20Rd%2C%20Brentwood%2C%20MD%2020722";
const mapEmbedUrl =
  "https://www.google.com/maps?q=3816%20Bladensburg%20Rd%2C%20Brentwood%2C%20MD%2020722&output=embed";
const instagramUrl = "https://www.instagram.com/kattyhairstudio_/";
const facebookUrl = "https://www.facebook.com/DominicanKattyHairStudio";
const youtubeUrl = "https://www.youtube.com/@DominicanKattyHairStudio";
const xUrl = "https://x.com/DominicanKatty";
const tiktokUrl = "https://www.tiktok.com/@dominicankattyhairstudio";
const googleReviewsUrl =
  "https://www.google.com/search?q=katty+hair+studio&oq=ka&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7Mg8IARAuGCcYrwEYxwEYjgUyBggCEEUYOzIGCAMQIxgnMgoIBBAuGLEDGIAEMgYIBRBFGDkyBggGEEUYPTIGCAcQRRg90gEIMjg4MWowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#";
const bestProsUrl =
  "https://www.bestprosintown.com/md/brentwood/dominican-katty-hair-studio-/";

const socialLinks = [
  { label: "Instagram", href: instagramUrl, platform: "instagram" },
  { label: "Facebook", href: facebookUrl, platform: "facebook" },
  { label: "YouTube", href: youtubeUrl, platform: "youtube" },
  { label: "X", href: xUrl, platform: "x" },
  { label: "TikTok", href: tiktokUrl, platform: "tiktok" },
] as const;

const navLinks = [
  ["Services", "#services"],
  ["Prices", "#prices"],
  ["Gallery", "#gallery"],
  ["Info", "#info"],
  ["Location", "#location"],
  ["Booking", "#booking"],
] as const;

const services = [
  {
    title: "Dominican blowouts",
    detail: "You get smooth roots, soft body, and brushed shine.",
    icon: Sparkles,
  },
  {
    title: "Color and highlights",
    detail: "Your history and hair health guide every gloss, highlight, and lift.",
    icon: Palette,
  },
  {
    title: "Extensions and wigs",
    detail: "Your install is prepped, blended, styled, and explained for easy upkeep.",
    icon: Gem,
  },
  {
    title: "Braids, cuts, and styling",
    detail: "You choose the shape, detail, or event finish that fits your look.",
    icon: Scissors,
  },
] as const;

const studioInfo = [
  {
    title: "Quote confirmed",
    detail: "You confirm your goal, timing, and quote before the chair.",
    icon: Award,
  },
  {
    title: "Dominican technique",
    detail: "You get controlled heat, smooth roots, body, and shine.",
    icon: WandSparkles,
  },
  {
    title: "Supply support",
    detail: "You can ask about hair, products, and care in one stop.",
    icon: Store,
  },
  {
    title: "Reference ready",
    detail: "You bring the photo and leave with a realistic finish plan.",
    icon: ClipboardCheck,
  },
] as const;

const process = [
  {
    step: "01",
    title: "Show your goal",
    detail: "Bring your photo, texture history, and must-haves.",
    icon: MessageCircle,
    art: "/process/katty-step-1-show-goal.webp",
  },
  {
    step: "02",
    title: "See it take shape",
    detail: "Your service is built with clean sections, careful color, and balanced blending.",
    icon: Timer,
    art: "/process/katty-step-2-take-shape.webp",
  },
  {
    step: "03",
    title: "Leave ready",
    detail: "You leave with polished edges, movement, shine, and care notes.",
    icon: Check,
    art: "/process/katty-step-3-leave-ready.webp",
  },
] as const;

const priceItems = [
  {
    name: "Blowouts and styling",
    type: "Finish services",
    price: "Quoted by length",
    note: "Your length, density, and finish determine the time and quote.",
  },
  {
    name: "Color, gloss, and highlights",
    type: "Color services",
    price: "Consult first",
    note: "Your color history, lift goal, and hair health shape the quote.",
  },
  {
    name: "Extensions, wigs, and installs",
    type: "Length services",
    price: "Custom quote",
    note: "Your method, hair source, blending, and install time shape the quote.",
  },
  {
    name: "Braids, cuts, and barber services",
    type: "Shape services",
    price: "Ask stylist",
    note: "Your pattern, shape, and detail level are confirmed before you begin.",
  },
] as const;

const gallery = [
  {
    image: "/gallery/katty-glossy-body-waves-themed.webp",
    title: "Glossy body waves",
    alt: "Client with long glossy black body waves styled by Katty Hair Studio",
    position: "58% center",
  },
  {
    image: "/gallery/katty-golden-dimension-themed.webp",
    title: "Golden dimension",
    alt: "Client with voluminous black and golden blonde curls styled by Katty Hair Studio",
    position: "50% center",
  },
  {
    image: "/gallery/katty-silky-side-waves-themed-v2.webp",
    title: "Silky side waves",
    alt: "Client with long glossy black side-parted waves in a warm rose-toned salon",
    position: "50% 42%",
  },
  {
    image: "/gallery/katty-copper-waves-themed.webp",
    title: "Copper waves",
    alt: "Client with long polished copper waves styled by Katty Hair Studio",
    position: "50% center",
  },
  {
    image: "/gallery/katty-sculpted-curls-themed.webp",
    title: "Sculpted curls",
    alt: "Client with long glossy sculpted curls styled by Katty Hair Studio",
    position: "50% center",
  },
  {
    image: "/gallery/katty-vintage-curl-set-themed-v2.webp",
    title: "Vintage curl set",
    alt: "Client with a glossy sculpted vintage curl set in a warm rose-toned salon",
    position: "50% 40%",
  },
] as const;

const hours = [
  ["Mon", "10:00 AM - 6:30 PM"],
  ["Tue", "Closed"],
  ["Wed-Fri", "10:00 AM - 6:30 PM"],
  ["Sat", "8:00 AM - 4:30 PM"],
  ["Sun", "10:00 AM - 3:30 PM"],
] as const;

const proofPoints = [
  {
    value: "4.8",
    label: "156 Google reviews",
    icon: Star,
    href: googleReviewsUrl,
    ariaLabel: "Read Katty Hair Studio Google reviews",
  },
  {
    value: "$10 off",
    label: "Mondays only",
    icon: BadgePercent,
  },
  {
    value: "Upfront quote",
    label: "Before service",
    icon: ClipboardCheck,
  },
] as const;

const featuredReviews = [
  {
    name: "Faben Henok",
    meta: "Local Guide · Google review",
    details: ["Edited 4 months ago", "$100-120", "Hair straightening"],
    image: "/reviews/faben-henok-client-photo.webp",
    imageBadge: "Healthy shine",
    alt: "Faben Henok smiling outdoors with long smooth hair after a Katty Hair Studio visit",
    quote: "I always leave feeling confident, refreshed, and taken care of.",
    highlights: [
      "A 10-year client who keeps coming back for healthy, beautiful hair.",
      "Honest advice, careful listening, and a wash that feels like a mini spa moment.",
      "A long-term stylist relationship built on trust, consistency, and care.",
    ],
  },
  {
    name: "Marimar Montero",
    meta: "1 review · 2 photos",
    details: ["9 months ago", "Cut and styling", "Personalized finish"],
    image: "/reviews/marimar-montero-client-photo.webp",
    imageBadge: "Precision finish",
    alt: "Marimar Montero seated in a salon with a short burgundy haircut after a Katty Hair Studio visit",
    quote: "I walked out feeling confident, refreshed, and truly cared for.",
    highlights: [
      "Katty listened first and made sure every detail felt right.",
      "A relaxing wash and scalp massage led into precise cut and styling work.",
      "The final look was shaped around her face and hair texture.",
    ],
  },
] as const;

function Icon({ icon: IconComponent }: { icon: SiteIcon }) {
  return <IconComponent aria-hidden="true" className="site-icon" />;
}

type SocialPlatform = (typeof socialLinks)[number]["platform"] | "whatsapp";

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "instagram") {
    return (
      <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24">
        <rect fill="none" height="18" rx="5" stroke="currentColor" strokeWidth="2" width="18" x="3" y="3" />
        <circle cx="12" cy="12" fill="none" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.4" cy="6.6" fill="currentColor" r="1.1" />
      </svg>
    );
  }

  if (platform === "facebook") {
    return (
      <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24">
        <path d="M13.55 22v-8h2.7l.4-3.12h-3.1v-2c0-.9.25-1.52 1.55-1.52h1.66V4.57c-.29-.04-1.27-.12-2.42-.12-2.4 0-4.05 1.47-4.05 4.17v2.26H7.57V14h2.72v8h3.26Z" fill="currentColor" />
      </svg>
    );
  }

  if (platform === "youtube") {
    return (
      <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24">
        <rect fill="none" height="14" rx="4" stroke="currentColor" strokeWidth="2" width="20" x="2" y="5" />
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
      </svg>
    );
  }

  if (platform === "x") {
    return (
      <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.4L6.47 22H3.36l7.25-8.29L2.96 2h6.4l4.42 5.85L18.9 2Zm-1.1 17.84h1.72L8.42 4.05H6.58L17.8 19.84Z" fill="currentColor" />
      </svg>
    );
  }

  if (platform === "tiktok") {
    return (
      <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-3.95h-3.36v13.78a2.91 2.91 0 1 1-2-2.76V10.4a6.28 6.28 0 1 0 5.36 6.12V9.53a8.16 8.16 0 0 0 4.77 1.54V7.71a4.8 4.8 0 0 1-1-.1Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26A9.89 9.89 0 0 1 12.05 2a9.89 9.89 0 0 1 0 19.8M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.23-6.17-3.48-8.41" fill="currentColor" />
    </svg>
  );
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <span className="brand-logo-frame">
        <Image
          alt=""
          aria-hidden="true"
          height={512}
          loading="eager"
          src="/brand/katty-official-crest.png"
          width={512}
        />
      </span>
      {!compact && (
        <span className="brand-wordmark">
          Katty
          <small>Hair Studio</small>
        </span>
      )}
    </>
  );
}

function BestProsInTownBadge() {
  return (
    <>
      <link
        href="https://cdn6.localdatacdn.com/badges/bestprosintown/css/badge-v3.2.css?v=84924"
        rel="stylesheet"
      />
      <div
        className="bestpros-native-badge"
        id="circle_v3"
        style={{ height: "calc(227px * 1)", width: "calc(294px * 1)" }}
        tabIndex={0}
      >
        <div className="rb_flex rb_top">
          <div className="arc-heading">
            <svg
              height="160"
              viewBox="0 0 150 140"
              width="160"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <path d="M 30 80 a 50 50 0 1 1 110 0" id="heading-arc" />
              </defs>
              <text
                className="arc-heading__heading"
                fill="#000"
                textAnchor="middle"
              >
                <textPath href="#heading-arc" startOffset="50%">
                  Recommended
                </textPath>
              </text>
            </svg>
          </div>
          <div id="circletype_v3_brand_name">
            <a
              aria-label="View Dominican Katty Hair Studio on BestProsInTown"
              className="ahref_emprty_area"
              href={bestProsUrl}
              rel="noreferrer"
              style={{ fontSize: "12.4px", fontWeight: 700 }}
              target="_blank"
            >
              <svg height="62" width="235" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <path d="M15,40 A110,31 0 0 1 220 40" id="bestpros-brand-path" />
                </defs>
                <text className="bestpros-brand-text" textAnchor="middle">
                  <textPath
                    href="#bestpros-brand-path"
                    lengthAdjust="spacingAndGlyphs"
                    startOffset="50%"
                    textLength="196"
                  >
                    Dominican Katty Hair Studio and Barber Shop
                  </textPath>
                </text>
              </svg>
            </a>
          </div>
          <div className="arc-heading arc-heading__bottom">
            <svg
              height="160"
              viewBox="0 0 150 150"
              width="160"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <path d="M 12 60 a 55 55 0 0 0 140 0" id="subheading-arc" />
              </defs>
              <text
                className="arc-heading__subheading"
                fill="#000"
                textAnchor="middle"
              >
                <textPath href="#subheading-arc" startOffset="50%">
                  <a
                    href="https://www.bestprosintown.com"
                    rel="noreferrer"
                    target="_blank"
                  >
                    BestProsInTown
                  </a>
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      <input
        aria-label="Toggle mobile menu"
        className="drawer-toggle"
        id="katty-drawer"
        type="checkbox"
      />
      <DrawerAutoClose />
      <ViewportReveal />

      <header className="site-header">
        <div className="announcement-bar">
          <a className="announcement-pill" href="#prices">
            <Icon icon={BadgePercent} />
            <span className="announcement-copy-long">
              Mondays: $10 off all services
            </span>
            <span className="announcement-copy-short">Mondays: $10 off services</span>
          </a>
          <div className="announcement-contact">
            <a className="announcement-center" href={`tel:${phoneNumber}`}>
              <Phone aria-hidden="true" />
              <span>Call {phoneDisplay}</span>
              <ChevronRight aria-hidden="true" />
            </a>
            <a
              aria-label={`WhatsApp Katty Hair Studio at ${whatsappDisplay}`}
              className="announcement-whatsapp"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              <SocialIcon platform="whatsapp" />
              <span>WhatsApp</span>
            </a>
          </div>
          <div className="announcement-utilities">
            <nav aria-label="Katty Hair Studio social profiles" className="announcement-socials">
              {socialLinks.map((social) => (
                <a
                  aria-label={social.label}
                  href={social.href}
                  key={social.platform}
                  rel="noreferrer"
                  target="_blank"
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </nav>
            <a
              className="announcement-link"
              href={directionsUrl}
              rel="noreferrer"
              target="_blank"
            >
              <MapPin aria-hidden="true" />
              Brentwood, MD
            </a>
          </div>
        </div>

        <div className="main-nav">
          <a className="brand" href="#home" aria-label="Katty Hair Studio home">
            <BrandLogo />
          </a>

          <nav aria-label="Main navigation" className="desktop-nav">
            {navLinks.map(([label, href]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <a className="nav-cta" href="#booking">
              <CalendarDays aria-hidden="true" />
              Request appointment
            </a>
            <label className="menu-button" htmlFor="katty-drawer" aria-label="Open menu">
              <span />
              <span />
              <span />
            </label>
          </div>
        </div>
      </header>

      <label className="drawer-backdrop" htmlFor="katty-drawer" aria-label="Close menu" />
      <aside className="mobile-drawer" aria-label="Mobile navigation drawer">
        <div className="drawer-top">
          <a className="brand drawer-brand" href="#home" aria-label="Katty Hair Studio home">
            <BrandLogo />
          </a>
          <label htmlFor="katty-drawer" aria-label="Close menu">
            <span />
            <span />
          </label>
        </div>

        <nav className="drawer-links" aria-label="Mobile page links">
          {navLinks.map(([label, href]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="drawer-card">
          <span className="drawer-card-icon">
            <Icon icon={Clock} />
          </span>
          <div>
            <p>Today</p>
            <strong>Open by posted hours</strong>
          </div>
        </div>
        <div className="drawer-card">
          <span className="drawer-card-icon">
            <Icon icon={MapPinned} />
          </span>
          <div>
            <p>Studio</p>
            <strong>3816 Bladensburg Rd</strong>
          </div>
        </div>

        <a className="drawer-cta" href="#booking">
          <Icon icon={CalendarDays} />
          Request appointment
        </a>
        <div className="drawer-socials">
          <p>Connect</p>
          <div className="drawer-contact-links">
            <a href={`tel:${phoneNumber}`}>
              <Phone aria-hidden="true" />
              Call
            </a>
            <a href={whatsappUrl} rel="noreferrer" target="_blank">
              <SocialIcon platform="whatsapp" />
              WhatsApp
            </a>
          </div>
          <div className="drawer-social-icon-row" aria-label="Social media profiles">
            {socialLinks.map((social) => (
              <a
                aria-label={social.label}
                href={social.href}
                key={social.platform}
                rel="noreferrer"
                target="_blank"
                title={social.label}
              >
                <SocialIcon platform={social.platform} />
              </a>
            ))}
          </div>
        </div>
      </aside>

      <section className="hero" id="home">
        <Image
          alt="Warm modern salon interior with marble floors, black styling chairs, blush accents, and gold details"
          className="hero-image"
          fill
          priority
          sizes="100vw"
          src="/hero/katty-salon-interior-hero-clear-pink-v4.webp"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">Dominican-owned hair studio and beauty supply</p>
          <h1>
            <span className="hero-title-desktop">Katty Hair Studio</span>
            <span className="hero-title-mobile">
              Katty
              <br />
              Hair
              <br />
              Studio
            </span>
          </h1>
          <p className="hero-copy">
            Bring your texture and reference. We’ll shape the service around you.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#booking">
              <CalendarDays aria-hidden="true" />
              Request appointment
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="secondary-link" href="#services">
              <Scissors aria-hidden="true" />
              Explore services
            </a>
          </div>
          <p className="hero-trust-line">
            4.8 from 156 Google reviews · Quote confirmed before the chair.
          </p>
        </div>
        <div className="hero-mobile-signals" aria-label="Studio proof points">
          {proofPoints.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <Icon aria-hidden="true" className="hero-signal-icon" />
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </>
            );

            return "href" in item ? (
              <a
                aria-label={item.ariaLabel}
                className="hero-mobile-signal"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                {content}
              </a>
            ) : (
              <div className="hero-mobile-signal" key={item.label}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="proof-band" aria-label="Studio proof points">
        {proofPoints.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <Icon aria-hidden="true" className="proof-icon" />
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </>
          );

          return "href" in item ? (
            <a
              aria-label={item.ariaLabel}
              className="proof-card"
              href={item.href}
              key={item.label}
              rel="noreferrer"
              target="_blank"
            >
              {content}
            </a>
          ) : (
            <div className="proof-card" key={item.label}>
              {content}
            </div>
          );
        })}
      </section>

      <section className="reviews-section" aria-labelledby="featured-review-heading" data-reveal>
        <div className="reviews-copy">
          <p className="eyebrow">What clients say</p>
          <h2 id="featured-review-heading">See what you can expect from every visit.</h2>
          <p>
            You’ll see the same themes across real Google reviews: careful listening,
            relaxing care, and a finish that feels like you.
          </p>
          <div className="review-proof-row" aria-label="Review highlights">
            <span>
              <Star aria-hidden="true" />
              5-star review
            </span>
            <span>
              <Heart aria-hidden="true" />
              10-year client
            </span>
            <span>
              <Scissors aria-hidden="true" />
              Cut + styling
            </span>
          </div>
        </div>

        <ReviewPager googleReviewsUrl={googleReviewsUrl} reviews={featuredReviews} />
      </section>

      <section className="intro-section section-grid" data-reveal id="visit-plan">
        <div className="section-copy">
          <p className="eyebrow">Your visit, made clear</p>
          <h2>You’ll know the plan before your service begins.</h2>
          <p>
            Show Katty the look you want. You’ll talk through your hair history,
            timing, upkeep, and quote before the chair.
          </p>
          <div className="signal-chips" aria-label="What to expect before your service">
            <span>
              <MessageCircle aria-hidden="true" />
              Bring a reference
            </span>
            <span>
              <ClipboardCheck aria-hidden="true" />
              Confirm your plan
            </span>
            <span>
              <Heart aria-hidden="true" />
              Leave with care notes
            </span>
          </div>
        </div>
        <div className="signal-art" aria-label="Editorial preview of a burgundy ombré finish">
          <figure className="signal-photo signal-photo-large">
            <Image
              alt="Rear view of long glossy chestnut-brown layered hair finished with soft curled ends in a blush-toned salon"
              fill
              loading="eager"
              sizes="(max-width: 1100px) 100vw, 42vw"
              src="/editorial/katty-reference-chestnut-layers-v4.webp"
            />
          </figure>
          <a
            aria-label="Share your reference and request an appointment"
            className="finish-cta"
            href="#booking"
          >
            <MessageCircle aria-hidden="true" className="finish-cta-icon" />
            <span className="finish-cta-copy">
              <strong>Have a look in mind?</strong>
              <small>Share your reference and confirm the timing and quote.</small>
            </span>
            <ArrowRight aria-hidden="true" className="finish-cta-arrow" />
          </a>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="services-media" data-reveal>
          <Image
            alt="Client with voluminous black and golden blonde curls styled by Katty Hair Studio"
            fill
            sizes="(max-width: 900px) 100vw, 42vw"
            src="/gallery/katty-golden-dimension-themed.webp"
          />
          <div className="media-caption">
            <span>Your color story</span>
            <strong>Your history guides every choice. Your hair health stays first.</strong>
          </div>
        </div>
        <div className="services-copy" data-reveal>
          <p className="eyebrow">Your service</p>
          <h2>Choose your goal. Your service is shaped around your hair.</h2>
          <p>
            Bring your reference and leave the consultation knowing what fits, how long
            it takes, and what to expect.
          </p>
          <div className="service-list">
            {services.map((service) => (
              <article className="service-item" key={service.title}>
                <span>
                  <Icon icon={service.icon} />
                </span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="process-heading centered" data-reveal>
          <p className="eyebrow">Your appointment</p>
          <h2>You’ll always know what happens next.</h2>
          <p>You bring the goal. Your service moves through three clear steps, from plan to polish.</p>
        </div>
        <div className="process-story" data-reveal aria-label="Your three appointment steps">
          <div className="process-days">
            <div className="process-connector process-connector-one" aria-hidden="true" />
            <div className="process-connector process-connector-two" aria-hidden="true" />
            {process.map((item) => {
              const StepIcon = item.icon;

              return (
                <article className="process-day" key={item.step}>
                  <div className="process-day-art">
                    <Image
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(max-width: 740px) 132px, 180px"
                      src={item.art}
                    />
                  </div>
                  <span className="process-day-label">
                    <StepIcon aria-hidden="true" />
                    Step {Number(item.step)}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="prices-section" id="prices">
        <div className="prices-layout">
          <div className="prices-copy" data-reveal>
            <p className="eyebrow">Your quote</p>
            <h2>You’ll confirm your price before the chair.</h2>
            <p>
              Your texture, length, history, and reference shape the quote. You’ll confirm it
              before your service begins.
            </p>
            <div className="price-grid">
              {priceItems.map((item) => (
                <article className="price-row" key={item.name}>
                  <span>{item.type}</span>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.note}</p>
                  </div>
                  <strong>{item.price}</strong>
                </article>
              ))}
            </div>
            <a className="secondary-dark-link price-cta" href="#booking">
              <MessageCircle aria-hidden="true" />
              Send a reference for your quote
            </a>
          </div>
          <div className="price-art" data-reveal>
            <Image
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 32vw"
              src="/editorial/katty-price-still-life.webp"
            />
            <div className="price-offer">
              <BadgePercent aria-hidden="true" />
              <strong>$10 off</strong>
              <span>Monday services only</span>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="gallery-heading" data-reveal>
          <div>
            <p className="eyebrow">Your inspiration</p>
            <h2>Save the finish you want to bring in.</h2>
          </div>
          <a className="secondary-dark-link" href={instagramUrl} rel="noreferrer" target="_blank">
            <ExternalLink aria-hidden="true" />
            Instagram
          </a>
        </div>
        <div className="gallery-grid" data-reveal>
          {gallery.map((item) => (
            <article className="gallery-tile" key={item.title}>
              <Image
                alt={item.alt}
                fill
                sizes="(max-width: 740px) calc((100vw - 44px) / 2), (max-width: 1100px) 33vw, 17vw"
                src={item.image}
                style={{ objectPosition: item.position }}
              />
              <span>{item.title}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="info-section" id="info">
        <div className="info-portrait" data-reveal>
          <Image
            alt="Katty, founder and stylist, centered inside her blush-toned salon"
            fill
            sizes="(max-width: 900px) 100vw, 42vw"
            src="/founder/katty-founder-portrait-pink-v4.webp"
          />
          <span>
            <Award aria-hidden="true" />
            Katty · Founder + stylist
          </span>
        </div>
        <div className="info-copy" data-reveal>
          <p className="eyebrow">Meet Katty</p>
          <h2>Your texture deserves a stylist who listens first.</h2>
          <p>
            From your reference photo to your final care notes, Katty keeps the visit
            personal, clear, and grounded in what your hair can support.
          </p>
          <div className="info-card-grid">
            {studioInfo.map((item) => (
              <article className="info-card" key={item.title}>
                <span>
                  <Icon icon={item.icon} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="info-quote">
            <Quote aria-hidden="true" />
            <p>
              Bring the look you want. Your appointment is shaped around the finish
              you want to leave with.
            </p>
          </div>
          <div className="founder-proof">
            <div className="founder-proof-mark">
              <BestProsInTownBadge />
            </div>
            <span className="founder-proof-copy">
              <small>Recommended locally</small>
              <strong>BestProsInTown</strong>
              <a href={bestProsUrl} rel="noreferrer" target="_blank">
                View profile <ExternalLink aria-hidden="true" />
              </a>
            </span>
          </div>
        </div>
      </section>

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

      <BookingSection phoneDisplay={phoneDisplay} phoneNumber={phoneNumber} />

      <section className="final-banner" data-reveal>
        <div>
          <p className="eyebrow">Ready when you are</p>
          <h2>Bring your reference. Leave with a clear plan.</h2>
        </div>
        <div className="final-brand-mark" aria-hidden="true">
          <Image
            alt=""
            height={801}
            src="/brand/katty-official-lockup.png"
            width={1080}
          />
        </div>
        <a className="primary-link" href="#booking">
          <Heart aria-hidden="true" />
          Request appointment
          <ArrowRight aria-hidden="true" />
        </a>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#home" aria-label="Katty Hair Studio home">
          <BrandLogo />
        </a>
        <div>
          <p>Dominican Katty Hair Studio and Barber Shop</p>
          <p>{address}</p>
        </div>
        <div className="footer-links">
          <a href={`tel:${phoneNumber}`}>
            <Phone aria-hidden="true" />
            Call
          </a>
          <a href={whatsappUrl} rel="noreferrer" target="_blank">
            <SocialIcon platform="whatsapp" />
            WhatsApp
          </a>
          <a href={directionsUrl} rel="noreferrer" target="_blank">
            <MapPinned aria-hidden="true" />
            Map
          </a>
          {socialLinks.map((social) => (
            <a
              aria-label={social.label}
              className="footer-social-link"
              href={social.href}
              key={social.platform}
              rel="noreferrer"
              target="_blank"
              title={social.label}
            >
              <SocialIcon platform={social.platform} />
            </a>
          ))}
        </div>
      </footer>

      <nav className="mobile-action-bar" aria-label="Quick appointment actions">
        <a className="mobile-action-primary" href="#booking">
          <CalendarDays aria-hidden="true" />
          Request
        </a>
        <a className="mobile-action-secondary" href={`tel:${phoneNumber}`}>
          <Phone aria-hidden="true" />
          Call
        </a>
      </nav>
    </main>
  );
}
