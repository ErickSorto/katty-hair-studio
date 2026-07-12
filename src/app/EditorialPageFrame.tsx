import type { ReactNode } from "react";
import { MobileActionBar, SiteFooter, SiteHeader } from "./SiteChrome";
import ViewportReveal from "./ViewportReveal";

export default function EditorialPageFrame({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <main className={`site-shell editorial-page-shell ${className}`}>
      <ViewportReveal />
      <SiteHeader />
      {children}
      <SiteFooter />
      <MobileActionBar />
    </main>
  );
}
