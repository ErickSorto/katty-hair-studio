"use client";

import { useEffect } from "react";

export default function ViewportReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const processSteps = Array.from(
      document.querySelectorAll<HTMLElement>("[data-process-step]"),
    );

    if (!elements.length && !processSteps.length) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      processSteps.forEach((step) => step.classList.add("is-active"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "-10% 0px -10% 0px", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));

    const processObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-active");
          processObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -16% 0px", threshold: 0.3 },
    );

    processSteps.forEach((step) => processObserver.observe(step));

    return () => {
      observer.disconnect();
      processObserver.disconnect();
    };
  }, []);

  return null;
}
