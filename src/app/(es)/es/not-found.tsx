import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { MobileActionBar, SiteFooter, SiteHeader } from "@/app/SiteChrome";

export default function SpanishNotFound() {
  return (
    <main className="site-shell not-found-page">
      <SiteHeader locale="es" />
      <section className="booking-manage-page">
        <p className="eyebrow">404 · Página no encontrada</p>
        <h1>Esta página ya no está disponible.</h1>
        <p>Es posible que la dirección haya cambiado, pero aún puedes explorar el salón o reservar tu próxima visita.</p>
        <div className="not-found-actions">
          <Link className="primary-link" href="/es"><Home aria-hidden="true" />Volver al inicio</Link>
          <Link className="secondary-dark-link" href="/es/booking">Solicitar una cita<ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
      <SiteFooter locale="es" />
      <MobileActionBar locale="es" />
    </main>
  );
}
