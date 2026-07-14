import type { ReactNode } from "react";
import { MobileActionBar, SiteFooter, SiteHeader } from "./SiteChrome";
import ViewportReveal from "./ViewportReveal";

export default function EditorialPageFrame({
  children,
  className,
  showMobileActionBar = true,
}: {
  children: ReactNode;
  className: string;
  showMobileActionBar?: boolean;
}) {
  return (
    <main className={`site-shell editorial-page-shell ${className}`}>
      <ViewportReveal />
      <SiteHeader />
      {children}
      <SiteFooter />
      {showMobileActionBar ? <MobileActionBar /> : null}
    </main>
  );
}
