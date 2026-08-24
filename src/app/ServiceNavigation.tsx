"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Scissors } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { localizePath, type Locale } from "./i18n/config";
import { serviceNavigationCopy } from "./i18n/shared-copy";

function CategoryGateways({ locale, mobile = false }: { locale: Locale; mobile?: boolean }) {
  const copy = serviceNavigationCopy[locale];

  return (
    <div className={mobile ? "drawer-category-gateways" : "services-category-gateways"}>
      {copy.categoryGateways.map((gateway, index) => (
        <Link href={localizePath(gateway.href, locale)} key={gateway.href}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <small>{gateway.eyebrow}</small>
            <strong>{gateway.label}</strong>
            {!mobile && <p>{gateway.description}</p>}
          </div>
          <ArrowRight aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

export function DesktopServicesMenu({ locale = "en" }: { locale?: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const copy = serviceNavigationCopy[locale];

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
        {copy.menuLabel}
        <ChevronDown aria-hidden="true" />
      </button>
      <div
        aria-hidden={!isOpen}
        className="services-mega-panel"
        id="katty-services-menu"
        onClick={() => setIsOpen(false)}
      >
        <div className="services-mega-intro">
          <p className="services-menu-kicker">{copy.kicker}</p>
          <h2>{copy.title}</h2>
          <p>{copy.intro}</p>
          <CategoryGateways locale={locale} />
        </div>
        <div className="services-mega-directory">
          {copy.groups.map((group, index) => (
            <section className={index === 3 ? "services-mega-extensions" : undefined} key={group.label}>
              <h3>{group.label}</h3>
              <div>
                {group.links.map(([label, href]) => (
                  <Link href={localizePath(href, locale)} key={href}>
                    {label}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="services-mega-footer">
          <span>{copy.footer}</span>
          <div className="services-mega-footer-links">
            <Link href={localizePath("/services", locale)}>{copy.viewAll} <ArrowRight aria-hidden="true" /></Link>
            <Link href={localizePath("/booking", locale)}>{copy.request} <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DrawerServicesMenu({ locale = "en" }: { locale?: Locale }) {
  const copy = serviceNavigationCopy[locale];

  return (
    <details className="drawer-services">
      <summary className="drawer-destination-row">
        <span className="drawer-destination-icon"><Scissors aria-hidden="true" /></span>
        <span className="drawer-destination-copy">
          <strong>{copy.menuLabel}</strong>
          <span>{copy.menuDetail}</span>
        </span>
        <ChevronDown aria-hidden="true" className="drawer-destination-arrow" />
      </summary>
      <div className="drawer-services-content">
        <Link className="drawer-all-services-link" href={localizePath("/services", locale)}>
          {copy.viewAll}<ArrowRight aria-hidden="true" />
        </Link>
        <CategoryGateways locale={locale} mobile />
      </div>
    </details>
  );
}
