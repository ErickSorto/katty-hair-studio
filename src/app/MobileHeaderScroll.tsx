"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const mobileHeaderQuery = "(max-width: 740px)";
const announcementHeight = 44;

export default function MobileHeaderScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");

    if (!header) return;

    const mobileMedia = window.matchMedia(mobileHeaderQuery);
    let animationFrame = 0;

    const updateHeaderOffset = () => {
      animationFrame = 0;

      if (!mobileMedia.matches) {
        header.style.removeProperty("--mobile-header-scroll-offset");
        return;
      }

      const offset = Math.min(announcementHeight, Math.max(0, window.scrollY));
      header.style.setProperty("--mobile-header-scroll-offset", `${-offset}px`);
    };

    const requestHeaderUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateHeaderOffset);
    };

    updateHeaderOffset();
    window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
    window.addEventListener("resize", requestHeaderUpdate);
    mobileMedia.addEventListener("change", requestHeaderUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestHeaderUpdate);
      window.removeEventListener("resize", requestHeaderUpdate);
      mobileMedia.removeEventListener("change", requestHeaderUpdate);
      header.style.removeProperty("--mobile-header-scroll-offset");
    };
  }, [pathname]);

  return null;
}
