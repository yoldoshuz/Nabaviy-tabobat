import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ProductContent } from "@/lib/api/blocks";
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
