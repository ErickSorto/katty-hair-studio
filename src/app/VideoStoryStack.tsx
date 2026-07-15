"use client";

import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "./i18n/config";

type VideoStory = {
  eyebrow: string;
  title: string;
  detail: string;
  poster: string;
  src: string;
  captions: string;
  alt: string;
};

type VideoStoryStackProps = {
  locale?: Locale;
  stories: readonly VideoStory[];
};

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

export default function VideoStoryStack({ locale = "en", stories }: VideoStoryStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [requestedIndex, setRequestedIndex] = useState<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const stackRef = useRef<HTMLDivElement>(null);
  const copy = locale === "es"
    ? { choose: "Elegir un video de cliente", next: "Siguiente video de cliente", play: "Reproducir", plays: "Se reproduce aquí", previous: "Video de cliente anterior", show: "Mostrar" }
    : { choose: "Choose a client video", next: "Next client video", play: "Play", plays: "Plays here", previous: "Previous client video", show: "Show" };

  useEffect(() => {
    const stack = stackRef.current;

    if (!stack) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(stack);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      isPaused ||
      playingIndex !== null ||
      stories.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((index) => wrapIndex(index + 1, stories.length));
    }, 10000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, playingIndex, stories.length]);

  const pauseVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video && !video.paused) {
        video.pause();
      }
    });
    setPlayingIndex(null);
    setRequestedIndex(null);
  };

  const move = (direction: 1 | -1) => {
    pauseVideos();
    setActiveIndex((index) => wrapIndex(index + direction, stories.length));
  };

  const selectStory = (index: number) => {
    pauseVideos();
    setIsPaused(true);
    setActiveIndex(index);
  };

  return (
    <div
      className="video-story-stack"
      ref={stackRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="video-story-list" aria-live="polite">
        {stories.map((story, index) => {
          const position = wrapIndex(index - activeIndex, stories.length);
          const isActive = position === 0;
          const isPlaying = playingIndex === index;
          const isStarting = requestedIndex === index;

          return (
            <article
              aria-hidden={!isActive}
              className={`video-story-card${isPlaying ? " is-playing" : ""}${
                isStarting ? " is-starting" : ""
              }`}
              data-position={position}
              key={story.src}
            >
              <div
                className="video-story-media"
                onClick={() => {
                  if (isActive && !isPlaying) {
                    const video = videoRefs.current[index];
                    setRequestedIndex(index);
                    if (video && !video.currentSrc) {
                      video.src = story.src;
                      video.load();
                    }
                    void video?.play().catch(() => {
                      setRequestedIndex((current) => (current === index ? null : current));
                    });
                  }
                }}
              >
                <video
                  aria-label={story.alt}
                  className="video-story-video"
                  controls={isActive && isPlaying}
                  controlsList="nodownload"
                  playsInline
                  poster={isNearViewport && isActive ? story.poster : undefined}
                  preload="none"
                  ref={(node) => {
                    videoRefs.current[index] = node;
                  }}
                  tabIndex={isActive ? 0 : -1}
                  onEnded={() => {
                    setPlayingIndex(null);
                    setRequestedIndex(null);
                    setIsPaused(false);
                    setActiveIndex((current) => wrapIndex(current + 1, stories.length));
                  }}
                  onPause={() => {
                    setPlayingIndex((current) => (current === index ? null : current));
                    setRequestedIndex((current) => (current === index ? null : current));
                  }}
                  onPlay={() => {
                    setIsPaused(true);
                    setPlayingIndex(index);
                    setRequestedIndex(null);
                  }}
                >
                  <track
                    default
                    kind="captions"
                    label="Español"
                    src={story.captions}
                    srcLang="es"
                  />
                </video>
                <span className="video-story-shade" aria-hidden="true" />
                <button
                  aria-label={`${copy.play} ${story.title}`}
                  className="video-story-play"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  <Play aria-hidden="true" fill="currentColor" />
                </button>
                <span className="video-story-watch">
                  {copy.plays}
                </span>
                <span className="video-story-caption">
                  <small>{story.eyebrow}</small>
                  <strong>{story.title}</strong>
                  <span>{story.detail}</span>
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="video-story-controls" aria-label={copy.choose}>
        <button aria-label={copy.previous} onClick={() => move(-1)} type="button">
          <ChevronLeft aria-hidden="true" />
        </button>
        <div className="video-story-dots">
          {stories.map((story, index) => (
            <button
              aria-label={`${copy.show} ${story.title}`}
              aria-pressed={index === activeIndex}
              key={story.src}
              onClick={() => selectStory(index)}
              type="button"
            />
          ))}
        </div>
        <button aria-label={copy.next} onClick={() => move(1)} type="button">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
