import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { OrnateProductCard } from "@/components/shared/ornate-product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Product } from "@/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const t = useTranslations("home.featured");

  return (
    <section id="products" className="bg-brand py-16 lg:py-24">
      <Container>
        <SectionHeading
          tone="light"
          title={t("title")}
          subtitle={t("subtitle")}
          className="mx-auto"
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {products.map((product) => (
            <OrnateProductCard
              key={product.slug}
              product={product}
              badge={t("badge")}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
