"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Product } from "@/types";

export function ProductAdvantages({ product }: { product: Product }) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const tCatalog = useTranslations(`catalog.${product.slug}`);
  const [index, setIndex] = useState(0);

  /**
   * Banners are uploaded photos, so their shapes are whatever the shop sent —
   * portrait bottles and landscape scenes in the same carousel. A fixed frame
   * cropped the portrait ones down to a band of label, so the frame takes the
   * shape of the photo it is showing instead, measured as it loads. The width
   * cap keeps a tall photo from pushing the rest of the page off the screen.
   *
   * `ratio` holds the shape on screen and `ratios` remembers the ones already
   * measured: on the way to a photo seen before the frame reshapes with the
   * click, and on the way to a new one it keeps the outgoing shape until the
   * photo lands, rather than snapping through a placeholder in between.
   */
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [ratio, setRatio] = useState(1200 / 415);

  const src = product.banners[index];
  const total = product.banners.length;

  const go = (step: number) => {
    const next = (index + step + total) % total;
    setIndex(next);
    const known = ratios[product.banners[next]];
    if (known) setRatio(known);
  };

  return (
    <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
      <GreenLeaf
        variant={3}
        className="bottom-0 left-0 hidden w-[160px] opacity-90 lg:block"
      />

      <Container className="relative">
        <SectionHeading
          title={t("advantagesTitle", { product: tCatalog("name") })}
          className="mx-auto"
        />

        <div
          className="relative mx-auto mt-10 w-full"
          style={{ maxWidth: `calc(70vh * ${ratio})` }}
        >
          <div
            className="relative w-full overflow-hidden rounded-xl bg-stone"
            style={{ aspectRatio: ratio }}
          >
            <Image
              key={src}
              src={src}
              alt={tCatalog("name")}
              fill
              sizes="(min-width: 1200px) 1140px, 92vw"
              onLoad={(event) => {
                const { naturalWidth, naturalHeight } = event.currentTarget;
                if (!naturalWidth || !naturalHeight) return;
                const loaded = naturalWidth / naturalHeight;
                setRatio(loaded);
                setRatios((current) => ({ ...current, [src]: loaded }));
              }}
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={tCommon("prev")}
            className="absolute top-1/2 -left-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-brand shadow-card transition-colors hover:bg-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:-left-6"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={tCommon("next")}
            className="absolute top-1/2 -right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-brand shadow-card transition-colors hover:bg-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:-right-6"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {product.advantageKeys.map((key) => (
            <li
              key={key}
              className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-card ring-1 ring-border"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold text-brand">
                <Check className="size-4" aria-hidden />
              </span>
              <span className="text-sm text-brand/85">
                {tCatalog(`advantages.${key}`)}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
