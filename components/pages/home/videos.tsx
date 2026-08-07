"use client";

import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { useCarousel } from "@/hooks";
import { cn } from "@/lib/utils";

const videos = [
  { key: "one", poster: "/video-1.png" },
  { key: "two", poster: "/video-2.png" },
  { key: "three", poster: "/video-3.png" },
  { key: "four", poster: "/video-4.png" },
] as const;

export function Videos() {
  const t = useTranslations("home.videos");
  const tCommon = useTranslations("common");
  const { ref, canScrollPrev, canScrollNext, scrollBy } =
    useCarousel<HTMLUListElement>();

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
            {videos.map((video) => (
              <li
                key={video.key}
                className="w-[240px] shrink-0 snap-start sm:w-[280px] lg:w-[294px]"
              >
                <button
                  type="button"
                  aria-label={`${t("play")}: ${t(`items.${video.key}`)}`}
                  className="group relative block aspect-[294/532] w-full overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                >
                  <Image
                    src={video.poster}
                    alt={t(`items.${video.key}`)}
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
    </section>
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
