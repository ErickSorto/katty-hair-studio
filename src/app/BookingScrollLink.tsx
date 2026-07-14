"use client";

import type { MouseEvent, ReactNode } from "react";

const targetId = "booking-container";
const headerGap = 12;

function getDocumentTop(element: HTMLElement) {
  let top = 0;
  let current: HTMLElement | null = element;

  while (current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return top;
}

export default function BookingScrollLink({
  children,
  className,
  fallbackHref = `#${targetId}`,
}: {
  children: ReactNode;
  className: string;
  fallbackHref?: string;
}) {
  function scrollToBooking(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    const header = document.querySelector<HTMLElement>(".site-header");
    const headerHeight = header?.offsetHeight ?? 0;
    const top = Math.max(0, getDocumentTop(target) - headerHeight - headerGap);

    if (window.location.hash !== `#${targetId}`) {
      window.history.pushState(null, "", `#${targetId}`);
    }

    window.scrollTo({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      top,
    });
  }

  return (
    <a className={className} href={fallbackHref} onClick={scrollToBooking}>
      {children}
    </a>
  );
}
