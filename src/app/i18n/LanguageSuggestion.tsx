"use client";

import { Languages, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isSpanishPath, localizePath } from "./config";

const preferenceCookie = "katty-locale";
const dismissedKey = "katty-language-suggestion-dismissed";

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))
    ?.split("=")[1];
}

export default function LanguageSuggestion() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (
      isSpanishPath(pathname) ||
      getCookie(preferenceCookie) ||
      window.localStorage.getItem(preferenceCookie) ||
      window.sessionStorage.getItem(dismissedKey)
    ) {
      return;
    }

    const primaryLanguage = navigator.languages?.[0] || navigator.language;
    const frame = window.requestAnimationFrame(() => {
      setVisible(primaryLanguage.toLowerCase().startsWith("es"));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  if (!visible) return null;

  return (
    <aside className="language-suggestion" lang="es" role="status">
      <span className="language-suggestion-icon"><Languages aria-hidden="true" /></span>
      <div>
        <strong>¿Prefieres español?</strong>
        <p>Explora servicios y reserva tu cita completamente en español.</p>
      </div>
      <button
        className="language-suggestion-accept"
        onClick={() => {
          document.cookie = `${preferenceCookie}=es; Path=/; Max-Age=31536000; SameSite=Lax`;
          window.localStorage.setItem(preferenceCookie, "es");
          router.push(`${localizePath(pathname, "es")}${window.location.search}${window.location.hash}`);
        }}
        type="button"
      >
        Ver en español
      </button>
      <button
        aria-label="Cerrar sugerencia de idioma"
        className="language-suggestion-dismiss"
        onClick={() => {
          window.sessionStorage.setItem(dismissedKey, "1");
          setVisible(false);
        }}
        type="button"
      >
        <X aria-hidden="true" />
      </button>
    </aside>
  );
}
