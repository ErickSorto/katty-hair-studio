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
      }
    };

    document.addEventListener("click", closeDrawer);

    return () => {
      document.removeEventListener("click", closeDrawer);
    };
  }, []);

  return null;
}
