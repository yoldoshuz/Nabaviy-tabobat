import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import type { Product } from "@/types";

/** Positions of the floating stat chips around the bottle (Figma detail page). */
const chipPositions = [
  "left-[-2%] top-[14%] sm:left-[-8%]",
  "right-[-2%] top-[20%] sm:right-[-8%]",
  "left-[-2%] bottom-[16%] sm:left-[-6%]",
  "right-[-4%] bottom-[10%] sm:right-[-10%]",
];

export function ProductAbout({ product }: { product: Product }) {
  const t = useTranslations("product");
  const tCatalog = useTranslations(`catalog.${product.slug}`);

  return (
    <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
      <GreenLeaf
        variant={2}
        className="top-6 left-0 hidden w-[150px] opacity-90 lg:block"
      />
      <GreenLeaf
        variant={3}
        flip
        className="right-0 bottom-10 hidden w-[160px] opacity-90 lg:block"
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-balance text-3xl leading-[1.3] text-brand sm:text-4xl">
            {tCatalog("aboutTitle")}
          </h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-brand/75">
            {tCatalog("aboutText")}
          </p>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[480px]">
          <div className="absolute inset-[6%] rounded-full bg-stone/60" />
          <div className="absolute inset-[6%] rounded-full border border-brand/35" />
          {[
            "top-[6%] left-1/2 -translate-x-1/2",
            "bottom-[6%] left-1/2 -translate-x-1/2",
            "top-1/2 left-[6%] -translate-y-1/2",
            "top-1/2 right-[6%] -translate-y-1/2",
          ].map((position) => (
            <span
              key={position}
              aria-hidden
              className={`absolute size-2.5 rounded-full bg-brand ${position}`}
            />
          ))}

          <Image
            src={product.image}
            alt={tCatalog("name")}
            width={360}
            height={580}
            sizes="(min-width: 1024px) 360px, 60vw"
            className="absolute top-1/2 left-1/2 h-[72%] w-auto -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_20px_40px_rgba(16,40,27,0.25)]"
          />

          {product.highlights.map((highlight, index) => (
            <div
              key={highlight.labelKey}
              className={`absolute w-28 rounded-lg bg-brand px-3 py-3 text-center text-cream shadow-card sm:w-32 sm:px-4 ${chipPositions[index]}`}
            >
              <span className="block text-sm">{highlight.value}</span>
              <span className="mt-1 block text-xs tracking-[0.14em] text-cream/70">
                {t(`highlightLabels.${highlight.labelKey}`)}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
