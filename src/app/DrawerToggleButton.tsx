"use client";

import { useEffect, useState } from "react";

const drawerToggleId = "katty-drawer";

export default function DrawerToggleButton({
  action,
  label,
}: {
  action: "close" | "open";
  label: string;
}) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const input = document.getElementById(drawerToggleId);
    if (!(input instanceof HTMLInputElement)) return;

    const sync = () => setExpanded(input.checked);
    sync();
    input.addEventListener("change", sync);
    return () => input.removeEventListener("change", sync);
  }, []);

  function updateDrawer() {
    const input = document.getElementById(drawerToggleId);
    if (!(input instanceof HTMLInputElement)) return;

    const shouldOpen = action === "open";
    if (input.checked !== shouldOpen) input.click();

    window.requestAnimationFrame(() => {
      const nextFocus = document.querySelector<HTMLButtonElement>(
        shouldOpen ? ".drawer-close-button" : ".menu-button",
      );
      nextFocus?.focus();
    });
  }

  return (
    <button
      aria-controls="katty-mobile-drawer"
      aria-expanded={action === "open" ? expanded : undefined}
      aria-label={label}
      className={action === "open" ? "menu-button" : "drawer-close-button"}
      onClick={updateDrawer}
      type="button"
    >
      {action === "open" ? <><span /><span /><span /></> : <><span /><span /></>}
    </button>
  );
}
