"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isSpanishPath } from "./config";

const preferenceCookie = "katty-locale";

export default function LocaleDocument() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = isSpanishPath(pathname) ? "es" : "en";
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;

    if (locale === "es") {
      document.cookie = `${preferenceCookie}=es; Path=/; Max-Age=31536000; SameSite=Lax`;
      window.localStorage.setItem(preferenceCookie, "es");
    }
  }, [pathname]);

  return null;
}

