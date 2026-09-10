import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { SectionHeading } from "@/components/shared/section-heading";
import { SlotImage } from "@/components/shared/slot-image";
import type { ProductContent } from "@/lib/api/blocks";
import { hasSlots } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductBenefits({
  product,
  content,
}: {
  product: Product;
  content?: ProductContent;
}) {
  const t = useTranslations("product");
  const tCatalog = useTranslations(`catalog.${product.slug}`);

  /* The admin's "Для чего нужен" block, or the bundled copy when it has none. */
  const cms = content?.benefits;
  const items =
    cms?.items ??
    product.benefitKeys.map((key) => ({
      title: tCatalog(`benefits.${key}.title`),
      text: tCatalog(`benefits.${key}.description`),
    }));

  /*
   * Two photographs belong to this block and the section never showed either —
   * only the decorative leaves. `benefits_1` and `benefits_2` have been
   * fillable in the admin all along, which is also why nobody filled them:
   * there was nowhere for them to appear.
   */
  const shots = hasSlots(product.images, "benefits_1", "benefits_2");
  const paired =
    hasSlots(product.images, "benefits_1") && hasSlots(product.images, "benefits_2");

  return (
    <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
      <GreenLeaf
        variant={2}
        flip
        className="top-10 right-0 hidden w-[170px] opacity-90 lg:block"
      />

      <Container className="relative">
        <SectionHeading
          title={cms?.title || t("benefitsTitle", { product: tCatalog("name") })}
          subtitle={cms?.subtitle || tCatalog("benefitsSubtitle")}
          className="mx-auto"
        />

        {shots && (
          <div
            className={cn(
              "mt-10 grid gap-5",
              paired ? "sm:grid-cols-2" : "mx-auto max-w-2xl",
            )}
          >
            <SlotImage
              images={product.images}
              slot="benefits_1"
              alt={tCatalog("name")}
              sizes={paired ? "(min-width: 640px) 45vw, 100vw" : "(min-width: 768px) 680px, 100vw"}
              className="rounded-lg bg-stone"
            />
            <SlotImage
              images={product.images}
              slot="benefits_2"
              alt={tCatalog("name")}
              sizes={paired ? "(min-width: 640px) 45vw, 100vw" : "(min-width: 768px) 680px, 100vw"}
              className="rounded-lg bg-stone"
            />
          </div>
        )}

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <li
              key={item.title + index}
              className="rounded-lg bg-white px-7 py-6 shadow-card ring-1 ring-border"
            >
              <h3 className="font-sans text-sm font-medium text-brand">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
