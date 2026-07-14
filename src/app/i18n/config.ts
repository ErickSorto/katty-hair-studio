import type { Metadata } from "next";

export const siteOrigin = "https://www.kattyhairstudio.com";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export function isSpanishPath(pathname: string) {
  return pathname === "/es" || pathname.startsWith("/es/");
}

export function stripLocale(pathname: string) {
  if (!isSpanishPath(pathname)) return pathname || "/";

  const stripped = pathname.slice(3);
  return stripped || "/";
}

export function localizePath(path: string, locale: Locale) {
  if (!path || path.startsWith("#") || /^(?:[a-z]+:|\/\/)/i.test(path)) {
    return path;
  }

  const [pathnameWithQuery, hash = ""] = path.split("#", 2);
  const [pathname = "/", query = ""] = pathnameWithQuery.split("?", 2);
  const basePath = stripLocale(pathname.startsWith("/") ? pathname : `/${pathname}`);
  const localizedPath = locale === "es" ? `/es${basePath === "/" ? "" : basePath}` : basePath;

  return `${localizedPath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function absoluteLocalizedUrl(path: string, locale: Locale) {
  return `${siteOrigin}${localizePath(path, locale)}`;
}

export function localizedAlternates(path: string, locale: Locale): Metadata["alternates"] {
  const english = absoluteLocalizedUrl(path, "en");
  const spanish = absoluteLocalizedUrl(path, "es");

  return {
    canonical: locale === "es" ? spanish : english,
    languages: {
      en: english,
      es: spanish,
      "x-default": english,
    },
  };
}

