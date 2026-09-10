import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { SectionHeading } from "@/components/shared/section-heading";
import { SlotImage } from "@/components/shared/slot-image";
import type { ProductContent } from "@/lib/api/blocks";
import type { Product } from "@/types";

export function ProductAdvantages({
  product,
  content,
}: {
  product: Product;
  content?: ProductContent;
}) {
  const t = useTranslations("product");
  const tCatalog = useTranslations(`catalog.${product.slug}`);

  /* The admin's "Преимущества" block, or the bundled copy when it has none. */
  const cms = content?.advantages;
  const title = cms?.title || t("advantagesTitle", { product: tCatalog("name") });

  return (
    <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
      <GreenLeaf
        variant={3}
        className="bottom-0 left-0 hidden w-[160px] opacity-90 lg:block"
      />

      <Container className="relative">
        <SectionHeading title={title} className="mx-auto" />

        {/*
          One picture, from the slot named after this block, in the shape it was
          shot in.

          This was a carousel over the product's whole photo set, with the frame
          measuring each file as it loaded and reshaping to match — machinery
          that existed only because the strip was being handed pictures never
          meant for it. \`advantages_1\` is shot 4:3, the box is 4:3, and there is
          nothing left to measure. Empty slot, no picture: the checklist below is
          the section.
        */}
        <SlotImage
          images={product.images}
          slot="advantages_1"
          alt={tCatalog("name")}
          sizes="(min-width: 1024px) 900px, 92vw"
          className="mx-auto mt-10 w-full max-w-3xl rounded-xl bg-stone"
        />

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {(cms?.items ?? product.advantageKeys.map((key) => tCatalog(`advantages.${key}`))).map((advantage, position) => (
            <li
              key={advantage + position}
              className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-card ring-1 ring-border"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold text-brand">
                <Check className="size-4" aria-hidden />
              </span>
              <span className="text-sm text-brand/85">{advantage}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
