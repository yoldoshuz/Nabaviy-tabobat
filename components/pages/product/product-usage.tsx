import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { SectionHeading } from "@/components/shared/section-heading";
import { SlotImage } from "@/components/shared/slot-image";
import type { ProductContent } from "@/lib/api/blocks";
import { hasSlots } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const importantKeys = ["one", "two", "three", "four", "five"] as const;

export function ProductUsage({
  product,
  content,
}: {
  product: Product;
  content?: ProductContent;
}) {
  const t = useTranslations("product");
  const tCatalog = useTranslations(`catalog.${product.slug}`);

  /*
   * The admin's "как принимать" and "важно соблюдать" blocks.
   *
   * Both bundled lists are shared by the whole range — `product.usage.*` and
   * `product.important.*` are one set of words printed on every product page —
   * so this is the first time either can say something specific to the bottle
   * the reader is looking at. Step numbers come from the order, so three steps
   * or six both render correctly.
   */
  const cms = content?.howToUse;
  const steps =
    cms?.steps ??
    product.usageKeys.map((key) => ({
      title: t(`usage.${key}.title`),
      text: t(`usage.${key}.description`),
    }));
  const warnings = content?.warnings;
  const important =
    warnings?.items ?? importantKeys.map((key) => t(`important.${key}`));

  /*
   * One photograph, from the slot shot for these instructions.
   *
   * The three frames here used to be `banners[2]`, `gallery[1]` and
   * `banners[1]` — positions in an unordered upload pile, which on Qora Sedana
   * resolved to `gallery_3`, `gallery_2` and `gallery_2` again, the last of
   * them cropped into a 544×254 strip. When `how_to_use_1` is empty the steps
   * take the full width rather than a column collapsing into a grey box.
   */
  const illustrated = hasSlots(product.images, "how_to_use_1");

  return (
    <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
      <GreenLeaf
        variant={1}
        className="top-1/3 left-0 hidden w-[130px] opacity-90 lg:block"
      />

      <Container className="relative">
        <SectionHeading
          title={cms?.title || t("usageTitle", { product: tCatalog("name") })}
          subtitle={
            cms?.subtitle || t("usageSubtitle", { product: tCatalog("name") })
          }
          className="mx-auto"
        />

        <div
          className={cn(
            "mt-12 grid gap-8",
            illustrated && "lg:grid-cols-2 lg:gap-12",
          )}
        >
          <ol className="relative space-y-6 border-l border-border pl-8 lg:pl-10">
            {steps.map((step, index) => (
              <li key={step.title + index} className="relative">
                <span
                  aria-hidden
                  className="absolute top-1 -left-[3.25rem] flex size-11 items-center justify-center rounded-full border border-border bg-white font-display text-lg text-brand lg:-left-[3.75rem]"
                >
                  {index + 1}
                </span>
                <div className="rounded-lg bg-brand px-6 py-5 text-cream">
                  <h3 className="font-sans text-sm font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/75">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="space-y-5">
            <SlotImage
              images={product.images}
              slot="how_to_use_1"
              alt={tCatalog("name")}
              sizes="(min-width: 1024px) 540px, 90vw"
              fit="cover"
              className="rounded-lg bg-stone"
            />

            {/*
              "Важно соблюдать" has no slot of its own — it is a list of rules,
              and the photo that used to sit behind it, dimmed under a green
              veil, was borrowed from the gallery. It keeps the deep green plate
              instead, which is what the copy reads on.
            */}
            <div className="rounded-lg bg-brand-deep px-6 py-8 sm:px-10">
              <h3 className="font-display text-lg text-gold">
                {warnings?.title || t("importantTitle")}
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-cream/90">
                {important.map((rule, index) => (
                  <li key={rule + index}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
