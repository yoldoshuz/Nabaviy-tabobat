import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ComparisonTable } from "@/components/pages/products/comparison-table";
import { ProductsGrid } from "@/components/pages/products/products-grid";
import { ProductsHero } from "@/components/pages/products/products-hero";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/json-ld";
import { getProducts } from "@/lib/api/catalog";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata(
  props: PageProps<"/[locale]/products">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.products" });

  return buildMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    path: "/products",
  });
}

export default async function ProductsPage(
  props: PageProps<"/[locale]/products">,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const products = await getProducts();

  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const tProduct = await getTranslations({ locale, namespace: "product" });

  return (
    <>
      <ProductsHero products={products} />
      <ComparisonTable products={products} />
      <ProductsGrid products={products} />

      <JsonLd
        id="ld-products"
        data={[
          breadcrumbJsonLd(
            [
              { name: tProduct("breadcrumbHome"), path: "/" },
              { name: tProduct("breadcrumbProducts"), path: "/products" },
            ],
            locale as Locale,
          ),
          itemListJsonLd(
            products.map((product) => ({
              name: tCatalog(`${product.slug}.name`),
              path: `/products/${product.slug}`,
            })),
            locale as Locale,
          ),
        ]}
      />
    </>
  );
}
