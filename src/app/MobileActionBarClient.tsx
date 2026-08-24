"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const bookingSectionSelector = ".booking-experience--section";

export default function MobileActionBarClient({
  ariaLabel,
  bookingHref,
  callLabel,
  phoneNumber,
  requestLabel,
}: {
  ariaLabel: string;
  bookingHref: string;
  callLabel: string;
  phoneNumber: string;
  requestLabel: string;
}) {
  const actionBarRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [isBookingVisible, setIsBookingVisible] = useState(false);

  useEffect(() => {
    const bookingSection = document.querySelector<HTMLElement>(bookingSectionSelector);

    if (!bookingSection || !("IntersectionObserver" in window)) {
      const frame = window.requestAnimationFrame(() => setIsBookingVisible(false));
      return () => window.cancelAnimationFrame(frame);
    }

    let observer: IntersectionObserver | null = null;

    const observeBookingSection = () => {
      observer?.disconnect();

      const headerHeight = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
      const actionBarHeight = actionBarRef.current?.offsetHeight ?? 0;

      observer = new IntersectionObserver(
        ([entry]) => setIsBookingVisible(entry.isIntersecting),
        {
          rootMargin: `-${headerHeight}px 0px -${actionBarHeight}px 0px`,
          threshold: 0,
        },
      );
      observer.observe(bookingSection);
    };

    observeBookingSection();
    window.addEventListener("resize", observeBookingSection);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observeBookingSection);
    };
  }, [pathname]);

  return (
    <nav
      aria-hidden={isBookingVisible}
      aria-label={ariaLabel}
      className={`mobile-action-bar${isBookingVisible ? " mobile-action-bar--hidden" : ""}`}
      ref={actionBarRef}
    >
      <Link
        className="mobile-action-primary"
        href={bookingHref}
        tabIndex={isBookingVisible ? -1 : undefined}
      >
        <CalendarDays aria-hidden="true" />
        {requestLabel}
      </Link>
      <a
        className="mobile-action-secondary"
        href={`tel:${phoneNumber}`}
        tabIndex={isBookingVisible ? -1 : undefined}
      >
        <Phone aria-hidden="true" />
        {callLabel}
      </a>
    </nav>
  );
}
