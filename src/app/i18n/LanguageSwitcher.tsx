"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { Languages } from "lucide-react";
import { isSpanishPath, localizePath, type Locale } from "./config";

const preferenceCookie = "katty-locale";

function rememberLocale(locale: Locale) {
  document.cookie = `${preferenceCookie}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  window.localStorage.setItem(preferenceCookie, locale);
}

export default function LanguageSwitcher({ placement = "desktop" }: { placement?: "desktop" | "drawer" }) {
  const pathname = usePathname();
  const locale: Locale = isSpanishPath(pathname) ? "es" : "en";

  function chooseLocale(event: MouseEvent<HTMLAnchorElement>, nextLocale: Locale) {
    rememberLocale(nextLocale);
    const suffix = `${window.location.search}${window.location.hash}`;

    if (suffix) {
      event.preventDefault();
      window.location.assign(`${localizePath(pathname, nextLocale)}${suffix}`);
    }
  }

  return (
    <div
      aria-label={locale === "es" ? "Seleccionar idioma" : "Choose language"}
      className={`language-switcher language-switcher--${placement}`}
      role="group"
    >
      <Languages aria-hidden="true" />
      <span className="language-switcher-options">
        <Link
          aria-current={locale === "en" ? "page" : undefined}
          href={localizePath(pathname, "en")}
          onClick={(event) => chooseLocale(event, "en")}
          prefetch={false}
        >
          EN
        </Link>
        <span aria-hidden="true" />
        <Link
          aria-current={locale === "es" ? "page" : undefined}
          href={localizePath(pathname, "es")}
          onClick={(event) => chooseLocale(event, "es")}
          prefetch={false}
        >
          ES
        </Link>
      </span>
    </div>
  );
}
