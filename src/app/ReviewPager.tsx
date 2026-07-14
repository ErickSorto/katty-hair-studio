"use client";

import Image from "next/image";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "./i18n/config";

type FeaturedReview = {
  name: string;
  meta: string;
  details: readonly string[];
  image: string;
  imageBadge: string;
  alt: string;
  quote: string;
  highlights: readonly string[];
};

function Stars({ label = "5 out of 5 stars" }: { label?: string }) {
  return (
    <div className="stars" aria-label={label}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star aria-hidden="true" key={index} />
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      className="google-mark"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z" fill="#4285F4" />
      <path d="M12 22c2.7 0 4.98-.9 6.63-2.38l-3.24-2.53c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z" fill="#34A853" />
      <path d="M6.39 13.92A6.02 6.02 0 0 1 6.08 12c0-.67.11-1.32.31-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.63.39 3.17 1.04 4.53l3.35-2.61Z" fill="#FBBC05" />
      <path d="M12 5.95c1.47 0 2.79.5 3.82 1.5l2.88-2.88A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z" fill="#EA4335" />
    </svg>
  );
}

export default function ReviewPager({
  googleReviewsUrl,
  locale = "en",
  reviews,
}: {
  googleReviewsUrl: string;
  locale?: Locale;
  reviews: readonly FeaturedReview[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideCount = reviews.length + 1;
  const copy = locale === "es"
    ? {
        aria: "Carrusel de reseñas de Google de Katty Hair Studio",
        controls: "Controles del carrusel de reseñas",
        featured: "Reseña destacada de",
        fullProfile: "Abrir el perfil público de Katty Hair Studio en Google, con una calificación de 4.8 basada en 156 reseñas",
        next: "Siguiente reseña",
        position: "Posición en el carrusel de reseñas",
        previous: "Reseña anterior",
        profile: "Perfil público de Google",
        proofBody: "Lee aquí las reseñas destacadas y consulta después el perfil público completo para ver la calificación general y todas las opiniones.",
        proofNotes: "Datos de respaldo de las reseñas de Google",
        proofPoints: ["Fuente pública de la calificación", "Reseñas de clientes reales", "Contexto del servicio incluido"],
        proofTitle: "Opiniones que puedes comprobar antes de reservar.",
        read: "Leer reseñas en Google",
        reviews: "156 reseñas",
        reviewsGoogle: "156 reseñas de Google",
        show: "Mostrar reseña",
        stars: "4.8 de 5 estrellas",
        starsFull: "4.8 de 5 estrellas según 156 reseñas de Google",
        swipe: "Desliza para ver la siguiente reseña",
      }
    : {
        aria: "Katty Hair Studio Google reviews pager",
        controls: "Review pager controls",
        featured: "Featured review from",
        fullProfile: "Open Katty Hair Studio's public Google profile with a 4.8 rating from 156 reviews",
        next: "Next review slide",
        position: "Review slide position",
        previous: "Previous review slide",
        profile: "Public Google profile",
        proofBody: "You can read the featured reviews here, then check the full public profile for the broader rating and review count.",
        proofNotes: "Google review proof notes",
        proofPoints: ["Public rating source", "Real client reviews featured", "Service context included"],
        proofTitle: "Proof you can check before you book.",
        read: "Read Google reviews",
        reviews: "156 reviews",
        reviewsGoogle: "156 Google reviews",
        show: "Show review slide",
        stars: "4.8 out of 5 stars",
        starsFull: "4.8 out of 5 stars from 156 Google reviews",
        swipe: "Swipe for the next review",
      };

  const goToSlide = (index: number) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(index, slideCount - 1));
    track.scrollTo({
      behavior: "smooth",
      left: nextIndex * track.clientWidth,
    });
    setActiveSlide(nextIndex);
  };

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nextIndex = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
        setActiveSlide(Math.max(0, Math.min(nextIndex, slideCount - 1)));
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", handleScroll);
    };
  }, [slideCount]);

  return (
    <div className="review-pager" aria-label={copy.aria}>
      <div className="review-pager-top">
        <a
          aria-label={copy.fullProfile}
          className="google-rating-signal"
          href={googleReviewsUrl}
          rel="noreferrer"
          target="_blank"
        >
          <span className="google-rating-source">
            <GoogleMark />
            {copy.profile}
          </span>
          <span className="google-rating-score">
            <strong>4.8</strong>
            <Stars label={copy.stars} />
            <span>{copy.reviews}</span>
          </span>
        </a>
        <div className="review-pager-controls" aria-label={copy.controls}>
          <button
            aria-label={copy.previous}
            disabled={activeSlide === 0}
            onClick={() => goToSlide(activeSlide - 1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            aria-label={copy.next}
            disabled={activeSlide === slideCount - 1}
            onClick={() => goToSlide(activeSlide + 1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="review-swipe-hint">
        {copy.swipe}
        <ChevronRight aria-hidden="true" />
      </p>

      <div className="review-track" ref={trackRef}>
        {reviews.map((review) => (
          <div
            className="review-slide"
            aria-label={`${copy.featured} ${review.name}`}
            key={review.name}
          >
            <article className="featured-review-card">
              <div className="featured-review-image">
                <Image
                  alt={review.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 28vw"
                  src={review.image}
                />
                <span>
                  <Sparkles aria-hidden="true" />
                  {review.imageBadge}
                </span>
              </div>
              <div className="featured-review-content">
                <div className="review-card-top">
                  <div>
                    <strong>{review.name}</strong>
                    <span>{review.meta}</span>
                  </div>
                  <Stars label={locale === "es" ? "5 de 5 estrellas" : "5 out of 5 stars"} />
                </div>
                <p className="review-card-meta">{review.details.join(" · ")}</p>
                <blockquote className="review-card-quote">
                  <Quote aria-hidden="true" className="review-quote-icon review-quote-icon-open" />
                  <p>{review.quote}</p>
                  <Quote aria-hidden="true" className="review-quote-icon review-quote-icon-close" />
                </blockquote>
                <div className="review-highlight-list">
                  {review.highlights.map((highlight) => (
                    <p key={highlight}>
                      <Check aria-hidden="true" />
                      {highlight}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          </div>
        ))}

        <div className="review-slide" aria-label={locale === "es" ? "Resumen de reseñas de Google" : "Google reviews rating summary"}>
          <article className="google-summary-card">
            <div className="google-summary-kicker">
              <GoogleMark />
              {copy.profile}
            </div>
            <div className="google-score-row">
              <strong>4.8</strong>
              <div>
                <Stars label={copy.starsFull} />
                <span>{copy.reviewsGoogle}</span>
              </div>
            </div>
            <h3>{copy.proofTitle}</h3>
            <p>{copy.proofBody}</p>
            <div className="google-summary-points" aria-label={copy.proofNotes}>
              {copy.proofPoints.map((point) => <span key={point}><Check aria-hidden="true" />{point}</span>)}
            </div>
            <a className="secondary-dark-link" href={googleReviewsUrl} rel="noreferrer" target="_blank">
              <ExternalLink aria-hidden="true" />
              {copy.read}
            </a>
          </article>
        </div>
      </div>

      <div className="review-dots" aria-label={copy.position}>
        {Array.from({ length: slideCount }).map((_, index) => (
          <button
            aria-label={`${copy.show} ${index + 1}`}
            aria-pressed={activeSlide === index}
            className="review-dot"
            key={index}
            onClick={() => goToSlide(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
