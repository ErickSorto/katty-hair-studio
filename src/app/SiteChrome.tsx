import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  CalendarDays,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  MapPinned,
  Phone,
} from "lucide-react";
import DrawerAutoClose from "./DrawerAutoClose";
import BookingScrollLink from "./BookingScrollLink";
import { DesktopServicesMenu, DrawerServicesMenu } from "./ServiceNavigation";

const phoneNumber = "+12405826622";
const phoneDisplay = "(240) 582-6622";
const whatsappNumber = "+12404784065";
const whatsappDisplay = "(240) 478-4065";
const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;
const address = "3816 Bladensburg Rd, Brentwood, MD 20722";
const directionsUrl =
  "https://www.google.com/maps/search/?api=1&query=3816%20Bladensburg%20Rd%2C%20Brentwood%2C%20MD%2020722";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/kattyhairstudio_/", platform: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/DominicanKattyHairStudio", platform: "facebook" },
  { label: "YouTube", href: "https://www.youtube.com/@DominicanKattyHairStudio", platform: "youtube" },
  { label: "X", href: "https://x.com/DominicanKatty", platform: "x" },
  { label: "TikTok", href: "https://www.tiktok.com/@dominicankattyhairstudio", platform: "tiktok" },
] as const;

const navLinks = [
  ["Prices", "/#prices"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
  ["Location", "/location"],
  ["Booking", "/booking"],
] as const;

type SocialPlatform = (typeof socialLinks)[number]["platform"] | "whatsapp";

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "instagram") return <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24"><rect fill="none" height="18" rx="5" stroke="currentColor" strokeWidth="2" width="18" x="3" y="3"/><circle cx="12" cy="12" fill="none" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.4" cy="6.6" fill="currentColor" r="1.1"/></svg>;
  if (platform === "facebook") return <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24"><path d="M13.55 22v-8h2.7l.4-3.12h-3.1v-2c0-.9.25-1.52 1.55-1.52h1.66V4.57c-.29-.04-1.27-.12-2.42-.12-2.4 0-4.05 1.47-4.05 4.17v2.26H7.57V14h2.72v8h3.26Z" fill="currentColor"/></svg>;
  if (platform === "youtube") return <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24"><rect fill="none" height="14" rx="4" stroke="currentColor" strokeWidth="2" width="20" x="2" y="5"/><path d="m10 9 5 3-5 3V9Z" fill="currentColor"/></svg>;
  if (platform === "x") return <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24"><path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.4L6.47 22H3.36l7.25-8.29L2.96 2h6.4l4.42 5.85L18.9 2Zm-1.1 17.84h1.72L8.42 4.05H6.58L17.8 19.84Z" fill="currentColor"/></svg>;
  if (platform === "tiktok") return <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-3.95h-3.36v13.78a2.91 2.91 0 1 1-2-2.76V10.4a6.28 6.28 0 1 0 5.36 6.12V9.53a8.16 8.16 0 0 0 4.77 1.54V7.71a4.8 4.8 0 0 1-1-.1Z" fill="currentColor"/></svg>;
  return <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26A9.89 9.89 0 0 1 12.05 2a9.89 9.89 0 0 1 0 19.8M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.23-6.17-3.48-8.41" fill="currentColor"/></svg>;
}

function BrandLogo() {
  return <><span className="brand-logo-frame"><Image alt="" aria-hidden="true" height={512} loading="eager" src="/brand/katty-official-crest.png" width={512}/></span><span className="brand-wordmark">Katty<small>Hair Studio</small></span></>;
}

function HeaderBrandLogo() {
  return <Image alt="" aria-hidden="true" className="brand-lockup-image" height={801} loading="eager" src="/brand/katty-official-lockup.png" width={1080}/>;
}

export function SiteHeader() {
  return (
    <>
      <input aria-label="Toggle mobile menu" className="drawer-toggle" id="katty-drawer" type="checkbox" />
      <DrawerAutoClose />
      <header className="site-header">
        <div className="announcement-bar">
          <Link className="announcement-pill" href="/#prices"><BadgePercent aria-hidden="true" className="site-icon"/><span className="announcement-copy-long">Mondays: $10 off all services</span><span className="announcement-copy-short">Mondays: $10 off services</span></Link>
          <div className="announcement-contact">
            <a className="announcement-center" href={`tel:${phoneNumber}`}><Phone aria-hidden="true"/><span>Call {phoneDisplay}</span><ChevronRight aria-hidden="true"/></a>
            <a aria-label={`WhatsApp Katty Hair Studio at ${whatsappDisplay}`} className="announcement-whatsapp" href={whatsappUrl} rel="noreferrer" target="_blank"><SocialIcon platform="whatsapp"/><span>WhatsApp</span></a>
          </div>
          <div className="announcement-utilities">
            <nav aria-label="Katty Hair Studio social profiles" className="announcement-socials">{socialLinks.map((social)=><a aria-label={social.label} href={social.href} key={social.platform} rel="noreferrer" target="_blank"><SocialIcon platform={social.platform}/></a>)}</nav>
            <a className="announcement-link" href={directionsUrl} rel="noreferrer" target="_blank"><MapPin aria-hidden="true"/>Brentwood, MD</a>
          </div>
        </div>
        <div className="main-nav">
          <Link aria-label="Katty Hair Studio home" className="brand brand-lockup-link" href="/"><HeaderBrandLogo/></Link>
          <nav aria-label="Main navigation" className="desktop-nav"><DesktopServicesMenu />{navLinks.map(([label,href])=><Link href={href} key={href}>{label}</Link>)}</nav>
          <div className="nav-actions"><Link className="nav-cta" href="/booking"><CalendarDays aria-hidden="true"/>Request appointment</Link><label aria-label="Open menu" className="menu-button" htmlFor="katty-drawer"><span/><span/><span/></label></div>
        </div>
      </header>
      <label aria-label="Close menu" className="drawer-backdrop" htmlFor="katty-drawer" />
      <aside aria-label="Mobile navigation drawer" className="mobile-drawer">
        <div className="drawer-top"><Link aria-label="Katty Hair Studio home" className="brand drawer-brand" href="/"><BrandLogo/></Link><label aria-label="Close menu" htmlFor="katty-drawer"><span/><span/></label></div>
        <nav aria-label="Mobile page links" className="drawer-links"><DrawerServicesMenu />{navLinks.map(([label,href])=><Link href={href} key={href}>{label}</Link>)}</nav>
        <div className="drawer-card"><span className="drawer-card-icon"><Clock aria-hidden="true" className="site-icon"/></span><div><p>Today</p><strong>Open by posted hours</strong></div></div>
        <div className="drawer-card"><span className="drawer-card-icon"><MapPinned aria-hidden="true" className="site-icon"/></span><div><p>Studio</p><strong>3816 Bladensburg Rd</strong></div></div>
        <Link className="drawer-cta" href="/booking"><CalendarDays aria-hidden="true" className="site-icon"/>Request appointment</Link>
        <div className="drawer-socials"><p>Connect</p><div className="drawer-contact-links"><a href={`tel:${phoneNumber}`}><Phone aria-hidden="true"/>Call</a><a href={whatsappUrl} rel="noreferrer" target="_blank"><SocialIcon platform="whatsapp"/>WhatsApp</a></div><div aria-label="Social media profiles" className="drawer-social-icon-row">{socialLinks.map((social)=><a aria-label={social.label} href={social.href} key={social.platform} rel="noreferrer" target="_blank" title={social.label}><SocialIcon platform={social.platform}/></a>)}</div></div>
      </aside>
    </>
  );
}

export function SiteFinalBanner() {
  return <section className="final-banner" data-reveal><div><p className="eyebrow">Ready when you are</p><h2>Bring your reference. Leave with a clear plan.</h2></div><div aria-hidden="true" className="final-brand-mark"><Image alt="" height={801} src="/brand/katty-official-lockup.png" width={1080}/></div><Link className="primary-link" href="#booking"><Heart aria-hidden="true"/>Request appointment<ArrowRight aria-hidden="true"/></Link></section>;
}

export function SiteFooter() {
  return <footer className="site-footer"><Link aria-label="Katty Hair Studio home" className="brand" href="/"><BrandLogo/></Link><div><p>Dominican Katty Hair Studio and Barber Shop</p><p>{address}</p></div><div className="footer-links"><a href={`tel:${phoneNumber}`}><Phone aria-hidden="true"/>Call</a><a href={whatsappUrl} rel="noreferrer" target="_blank"><SocialIcon platform="whatsapp"/>WhatsApp</a><a href={directionsUrl} rel="noreferrer" target="_blank"><MapPinned aria-hidden="true"/>Map</a>{socialLinks.map((social)=><a aria-label={social.label} className="footer-social-link" href={social.href} key={social.platform} rel="noreferrer" target="_blank" title={social.label}><SocialIcon platform={social.platform}/></a>)}</div></footer>;
}

export function MobileActionBar() {
  return <nav aria-label="Quick appointment actions" className="mobile-action-bar"><BookingScrollLink className="mobile-action-primary"><CalendarDays aria-hidden="true"/>Request</BookingScrollLink><a className="mobile-action-secondary" href={`tel:${phoneNumber}`}><Phone aria-hidden="true"/>Call</a></nav>;
}
