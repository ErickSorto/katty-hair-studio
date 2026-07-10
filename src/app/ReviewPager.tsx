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
  reviews,
}: {
  googleReviewsUrl: string;
  reviews: readonly FeaturedReview[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideCount = reviews.length + 1;

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
    <div className="review-pager" aria-label="Katty Hair Studio Google reviews pager">
      <div className="review-pager-top">
        <a
          aria-label="Open Katty Hair Studio's public Google profile with a 4.8 rating from 156 reviews"
          className="google-rating-signal"
          href={googleReviewsUrl}
          rel="noreferrer"
          target="_blank"
        >
          <span className="google-rating-source">
            <GoogleMark />
            Public Google profile
          </span>
          <span className="google-rating-score">
            <strong>4.8</strong>
            <Stars label="4.8 out of 5 stars" />
            <span>156 reviews</span>
          </span>
        </a>
        <div className="review-pager-controls" aria-label="Review pager controls">
          <button
            aria-label="Previous review slide"
            disabled={activeSlide === 0}
            onClick={() => goToSlide(activeSlide - 1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            aria-label="Next review slide"
            disabled={activeSlide === slideCount - 1}
            onClick={() => goToSlide(activeSlide + 1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="review-swipe-hint">
        Swipe for the next review
        <ChevronRight aria-hidden="true" />
      </p>

      <div className="review-track" ref={trackRef}>
        {reviews.map((review) => (
          <div
            className="review-slide"
            aria-label={`Featured review from ${review.name}`}
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
                  <Stars />
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

        <div className="review-slide" aria-label="Google reviews rating summary">
          <article className="google-summary-card">
            <div className="google-summary-kicker">
              <GoogleMark />
              Public Google profile
            </div>
            <div className="google-score-row">
              <strong>4.8</strong>
              <div>
                <Stars label="4.8 out of 5 stars from 156 Google reviews" />
                <span>156 Google reviews</span>
              </div>
            </div>
            <h3>Proof you can check before you book.</h3>
            <p>
              You can read the featured reviews here, then check the full public profile
              for the broader rating and review count.
            </p>
            <div className="google-summary-points" aria-label="Google review proof notes">
              <span>
                <Check aria-hidden="true" />
                Public rating source
              </span>
              <span>
                <Check aria-hidden="true" />
                Real client reviews featured
              </span>
              <span>
                <Check aria-hidden="true" />
                Service context included
              </span>
            </div>
            <a className="secondary-dark-link" href={googleReviewsUrl} rel="noreferrer" target="_blank">
              <ExternalLink aria-hidden="true" />
              Read Google reviews
            </a>
          </article>
        </div>
      </div>

      <div className="review-dots" aria-label="Review slide position">
        {Array.from({ length: slideCount }).map((_, index) => (
          <button
            aria-label={`Show review slide ${index + 1}`}
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
