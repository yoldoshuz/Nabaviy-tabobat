"use client";

import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { useCarousel } from "@/hooks";
import { videos } from "@/lib/videos";
import { cn } from "@/lib/utils";

export function Videos() {
  const t = useTranslations("home.videos");
  const tCommon = useTranslations("common");
  const { ref, canScrollPrev, canScrollNext, scrollBy } =
    useCarousel<HTMLUListElement>();

  /*
   * The clip currently open, by index. The player is a dialog rather than an
   * in-card swap: these are 9:16 portrait films, and a 294px-wide card plays
   * them at about the size of a phone's notification.
   */
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <section className="bg-brand py-16 lg:py-24">
      <Container>
        <SectionHeading
          tone="light"
          title={t("title")}
          subtitle={t("subtitle")}
          className="mx-auto"
        />

        <div className="relative mt-12 lg:mt-16">
          <ul
            ref={ref}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
          >
            {videos.map((video, index) => (
              <li
                key={video.id}
                className="w-[240px] shrink-0 snap-start sm:w-[280px] lg:w-[294px]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`${t("play")}: ${t("itemLabel", { index: index + 1 })}`}
                  className="group relative block aspect-[294/532] w-full overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                >
                  <Image
                    src={video.poster}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1024px) 294px, 60vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-brand-deep/10 transition-colors group-hover:bg-brand-deep/25" />
                  <span className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand shadow-float transition-transform group-hover:scale-110">
                    <Play className="size-5 translate-x-0.5 fill-brand" aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <CarouselButton
            direction="prev"
            label={tCommon("prev")}
            disabled={!canScrollPrev}
            onClick={() => scrollBy(-1)}
          />
          <CarouselButton
            direction="next"
            label={tCommon("next")}
            disabled={!canScrollNext}
            onClick={() => scrollBy(1)}
          />
        </div>
      </Container>

      {openIndex !== null && (
        <Player
          src={videos[openIndex].url}
          poster={videos[openIndex].poster}
          label={t("itemLabel", { index: openIndex + 1 })}
          closeLabel={tCommon("close")}
          onClose={close}
        />
      )}
    </section>
  );
}

function Player({
  src,
  poster,
  label,
  closeLabel,
  onClose,
}: {
  src: string;
  poster: string;
  label: string;
  closeLabel: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // The page behind must not scroll while a full-screen film is playing.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-brand-deep/85 p-4 sm:p-6"
    >
      <div
        className="flex max-h-full flex-col items-center gap-3"
        // The backdrop closes the player; the player itself must not.
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="flex size-10 items-center justify-center self-end rounded-full bg-cream/15 text-cream transition-colors hover:bg-cream/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <X className="size-5" aria-hidden />
        </button>

        {/*
          Bounded by height, not width: a 9:16 film given the full width of a
          desktop window is taller than the screen. `playsInline` keeps iOS
          from taking it fullscreen and dropping the visitor out of the page.
        */}
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="max-h-[78vh] w-auto max-w-full rounded-lg bg-black"
        />
      </div>
    </div>
  );
}

function CarouselButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 bg-brand text-cream transition-opacity hover:bg-brand-soft disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:flex",
        direction === "prev" ? "-left-5" : "-right-5",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
