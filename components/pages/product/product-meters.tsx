import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import type { ProductContent } from "@/lib/api/blocks";
import { slotImage } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductMeters({
  product,
  content,
}: {
  product: Product;
  content?: ProductContent;
}) {
  const t = useTranslations("product");
  const tCatalog = useTranslations(`catalog.${product.slug}`);

  /*
   * The admin's "шкалы эффективности" block. The bundled meters read their
   * words from one range-wide list under `product.meters.*`, so until now every
   * bottle claimed the same things at the same percentages.
   */
  const cms = content?.metrics;
  const meters =
    cms?.items.map((item) => ({
      title: item.title,
      description: item.description,
      value: item.percent,
    })) ??
    product.meters.map((meter) => ({
      title: t(`meters.${meter.key}.title`),
      description: t(`meters.${meter.key}.description`),
      value: meter.value,
    }));

  return (
    <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
      <GreenLeaf
        variant={1}
        className="right-0 -bottom-6 hidden w-[140px] opacity-90 lg:block"
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          {/*
            The design gives this block no heading, because the bundled meters
            are the same five claims on every page and needed no introduction.
            A block written in the admin can have one, and dropping it would
            mean a moderator typing a title into a field that does nothing.
          */}
          {cms?.title && (
            <h2 className="mb-8 text-balance text-3xl leading-[1.35] text-brand sm:text-4xl">
              {cms.title}
            </h2>
          )}
          <ul className="space-y-6">
          {meters.map((meter, index) => (
            <li key={meter.title + index} className="border-b border-border pb-5">
              <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto]">
                <div>
                  <h3 className="text-sm tracking-[0.06em] text-brand">
                    {meter.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {meter.description}
                  </p>
                </div>

                <div
                  className="h-3.5 w-full overflow-hidden rounded-full bg-stone"
                  role="meter"
                  aria-valuenow={meter.value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={meter.title}
                >
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${meter.value}%` }}
                  />
                </div>

                <span className="text-sm text-brand/80">{meter.value}%</span>
              </div>
            </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[440px]">
          <div className="absolute inset-0 rounded-full bg-stone/50" />
          <div className="absolute inset-[10%] rounded-full bg-brand/10" />
          <Image
            src={slotImage(product, "metrics_1", product.image)!}
            alt={tCatalog("name")}
            width={360}
            height={580}
            sizes="(min-width: 1024px) 340px, 60vw"
            className="absolute top-1/2 left-1/2 h-[70%] w-auto -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_20px_40px_rgba(16,40,27,0.28)]"
          />
        </div>
      </Container>
    </section>
  );
}
