import type { ReactNode } from "react";
import { MobileActionBar, SiteFooter, SiteHeader } from "./SiteChrome";
import ViewportReveal from "./ViewportReveal";
import type { Locale } from "./i18n/config";

export default function EditorialPageFrame({
  children,
  className,
  locale = "en",
  showMobileActionBar = true,
}: {
  children: ReactNode;
  className: string;
  locale?: Locale;
  showMobileActionBar?: boolean;
}) {
  return (
    <main className={`site-shell editorial-page-shell ${className}`}>
      <ViewportReveal />
      <SiteHeader locale={locale} />
      {children}
      <SiteFooter locale={locale} />
      {showMobileActionBar ? <MobileActionBar locale={locale} /> : null}
    </main>
  );
}
