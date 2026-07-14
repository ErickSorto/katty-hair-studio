import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { MobileActionBar, SiteFooter, SiteHeader } from "@/app/SiteChrome";

export default function EnglishNotFound() {
  return (
    <main className="site-shell not-found-page">
      <SiteHeader locale="en" />
      <section className="booking-manage-page">
        <p className="eyebrow">404 · Page not found</p>
        <h1>This page is no longer in the chair.</h1>
        <p>The address may have changed, but you can still explore the salon or reserve your next visit.</p>
        <div className="not-found-actions">
          <Link className="primary-link" href="/"><Home aria-hidden="true" />Return home</Link>
          <Link className="secondary-dark-link" href="/booking">Request an appointment<ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
      <SiteFooter locale="en" />
      <MobileActionBar locale="en" />
    </main>
  );
}
