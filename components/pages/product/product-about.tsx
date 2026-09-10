import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { SlotImage } from "@/components/shared/slot-image";
import type { ProductContent } from "@/lib/api/blocks";
import { hasSlots } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

/** Positions of the floating stat chips around the bottle (Figma detail page). */
const chipPositions = [
  "left-[-2%] top-[14%] sm:left-[-8%]",
  "right-[-2%] top-[20%] sm:right-[-8%]",
  "left-[-2%] bottom-[16%] sm:left-[-6%]",
  "right-[-4%] bottom-[10%] sm:right-[-10%]",
];

export function ProductAbout({
  product,
  content,
}: {
  product: Product;
  content?: ProductContent;
}) {
  const t = useTranslations("product");
  const tCatalog = useTranslations(`catalog.${product.slug}`);

  /*
   * The admin's "описание с цифрами" block. Four chips, because they sit on the
   * ring's four compass points and a fifth would have nowhere to go — the extra
   * numbers belong in the paragraph beside it.
   */
  const cms = content?.about;
  /*
   * The ring holds `about_1` — the photograph shot for this block, rather than
   * the packshot it used to borrow. With the slot empty the copy takes the whole
   * width and the ring is not drawn around an empty middle.
   */
  const illustrated = hasSlots(product.images, "about_1");

  const chips = cms?.stats.length
    ? cms.stats.slice(0, 4).map((stat) => ({ value: stat.value, label: stat.label }))
    : product.highlights.map((highlight) => ({
        value: highlight.value,
        label: t(`highlightLabels.${highlight.labelKey}`),
      }));

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

      <Container
        className={cn(
          "relative grid items-center gap-12",
          illustrated && "lg:grid-cols-2",
        )}
      >
        <div>
          <h2 className="text-balance text-3xl leading-[1.3] text-brand sm:text-4xl">
            {cms?.title || tCatalog("aboutTitle")}
          </h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-brand/75">
            {cms?.text || tCatalog("aboutText")}
          </p>

          {/* No ring to orbit, so the numbers stand on their own row. */}
          {!illustrated && (
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-4">
              {chips.map((chip, index) => (
                <li
                  key={chip.label + index}
                  className="rounded-lg bg-brand px-3 py-3 text-center text-cream shadow-card sm:px-4"
                >
                  <span className="block text-sm">{chip.value}</span>
                  <span className="mt-1 block text-xs tracking-[0.14em] text-cream/70">
                    {chip.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {illustrated && (
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

            {/*
              A fixed box inside the ring, letterboxing into it, so whatever is
              placed in the slot cannot change the ring's size. It used to take
              its width from the file — `h-[72%] w-auto` — which a landscape frame
              answered by laying itself across the four chips orbiting it.
            */}
            <SlotImage
              images={product.images}
              slot="about_1"
              alt={tCatalog("name")}
              sizes="(min-width: 1024px) 340px, 60vw"
              className="absolute top-1/2 left-1/2 w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-xl"
            />

            {chips.map((chip, index) => (
              <div
                key={chip.label + index}
                className={`absolute w-28 rounded-lg bg-brand px-3 py-3 text-center text-cream shadow-card sm:w-32 sm:px-4 ${chipPositions[index]}`}
              >
                <span className="block text-sm">{chip.value}</span>
                <span className="mt-1 block text-xs tracking-[0.14em] text-cream/70">
                  {chip.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
