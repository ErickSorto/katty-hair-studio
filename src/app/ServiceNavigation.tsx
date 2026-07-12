"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const serviceGroups = [
  {
    label: "Color & highlights",
    links: [
      ["Balayage", "/services/balayage"],
      ["Hair coloring", "/services/hair-coloring"],
      ["Hair highlighting", "/services/hair-highlighting"],
      ["Partial highlights", "/services/partial-hair-highlights"],
    ],
  },
  {
    label: "Blowouts & styling",
    links: [
      ["Dominican blowouts", "/services/blowouts"],
      ["Hair blowouts", "/services/hair-blowouts"],
      ["Curly hair", "/services/curly-hair"],
      ["Hair straightening", "/services/hair-straightening"],
      ["Hair stylist", "/services/hair-stylist"],
      ["Hairstyling", "/services/hairstyling"],
      ["Smoothing treatments", "/services/smoothing-hair-treatment"],
    ],
  },
  {
    label: "Cuts, braids & detail",
    links: [
      ["Bang trim", "/services/bang-trim"],
      ["Women’s haircuts", "/services/womens-haircuts"],
      ["Men’s haircuts", "/services/mens-haircuts"],
      ["Braids", "/services/braids"],
      ["Braiding services", "/services/hair-braiding-services"],
      ["Twist braids", "/services/twist-braids"],
      ["Wigs", "/services/wigs"],
      ["Eyebrow waxing", "/services/eyebrow-waxing"],
    ],
  },
  {
    label: "Hair extensions",
    links: [
      ["Extension consultation", "/services/hair-extension-consultation"],
      ["Extension installation", "/services/hair-extension-installation"],
      ["Blending & styling", "/services/hair-extension-blending-and-styling"],
      ["Extension maintenance", "/services/hair-extension-maintenance"],
      ["Extension removal", "/services/hair-extension-removal"],
      ["Tape-in extensions", "/services/tape-in-hair-extensions"],
      ["Sew-in extensions", "/services/sew-in-hair-extensions"],
      ["Microlink extensions", "/services/microlink-hair-extensions"],
      ["K-tip extensions", "/services/k-tip-hair-extensions"],
      ["Quick weave", "/services/quick-weave"],
      ["Quick weave + closure", "/services/quick-weave-with-closure"],
      ["Brazilian knots", "/services/brazilian-knots-hair-extensions"],
    ],
  },
] as const;

function CategoryGateways({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? "drawer-category-gateways" : "services-category-gateways"}>
      <Link href="/hair-salon">
        <span>01</span>
        <div>
          <small>Primary category</small>
          <strong>Hair salon</strong>
          {!mobile && <p>Color, cuts, blowouts, braids, treatments, and styling.</p>}
        </div>
        <ArrowRight aria-hidden="true" />
      </Link>
      <Link href="/hair-extension-technician">
        <span>02</span>
        <div>
          <small>Extension category</small>
          <strong>Hair extensions</strong>
          {!mobile && <p>Consultation, installation, blending, care, and removal.</p>}
        </div>
        <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}

export function DesktopServicesMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeFromOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuRef.current?.querySelector("button")?.focus();
      }
    };

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromEscape);

    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromEscape);
    };
  }, []);

  return (
    <div
      className="services-menu"
      data-open={isOpen}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
      ref={menuRef}
    >
      <button
        aria-controls="katty-services-menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        Services
        <ChevronDown aria-hidden="true" />
      </button>
      <div
        aria-hidden={!isOpen}
        className="services-mega-panel"
        id="katty-services-menu"
        onClick={() => setIsOpen(false)}
      >
        <div className="services-mega-intro">
          <p className="services-menu-kicker">Explore Katty</p>
          <h2>Find the right service for your hair.</h2>
          <p>Start with a category or go directly to the service you have in mind.</p>
          <CategoryGateways />
        </div>
        <div className="services-mega-directory">
          {serviceGroups.map((group) => (
            <section className={group.label === "Hair extensions" ? "services-mega-extensions" : undefined} key={group.label}>
              <h3>{group.label}</h3>
              <div>
                {group.links.map(([label, href]) => (
                  <Link href={href} key={href}>
                    {label}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="services-mega-footer">
          <span>Not sure where to begin? Bring a reference and we’ll help shape the plan.</span>
          <Link href="/#booking">Request an appointment <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  );
}

export function DrawerServicesMenu() {
  return (
    <details className="drawer-services">
      <summary>
        <span>Services</span>
        <ChevronDown aria-hidden="true" />
      </summary>
      <div className="drawer-services-content">
        <CategoryGateways mobile />
        <div className="drawer-service-groups">
          {serviceGroups.map((group) => (
            <section key={group.label}>
              <h3>{group.label}</h3>
              <div>
                {group.links.map(([label, href]) => (
                  <Link href={href} key={href}>{label}</Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </details>
  );
}
