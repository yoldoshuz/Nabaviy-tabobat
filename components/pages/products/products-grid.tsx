import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { ProductCard } from "@/components/shared/product-card";
import type { Product } from "@/types";

export function ProductsGrid({ products }: { products: Product[] }) {
  const t = useTranslations("home.featured");

  return (
    <section className="bg-white pb-16 lg:pb-24">
      <Container>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.slug} className="flex">
              <ProductCard
                product={product}
                badge={t("badge")}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
