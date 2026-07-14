"use client";

import { useEffect } from "react";

export default function DrawerAutoClose() {
  useEffect(() => {
    const drawerToggle = document.getElementById("katty-drawer");

    if (!(drawerToggle instanceof HTMLInputElement)) {
      return;
    }

    const closeDrawer = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest(".mobile-drawer a")) {
        drawerToggle.checked = false;
        drawerToggle.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !drawerToggle.checked) return;

      drawerToggle.checked = false;
      drawerToggle.dispatchEvent(new Event("change", { bubbles: true }));
      document.querySelector<HTMLButtonElement>(".menu-button")?.focus();
    };

    document.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", closeFromEscape);

    return () => {
      document.removeEventListener("click", closeDrawer);
      document.removeEventListener("keydown", closeFromEscape);
    };
  }, []);

  return null;
}
