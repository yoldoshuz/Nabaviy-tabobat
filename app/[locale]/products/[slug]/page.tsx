import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ProductAbout } from "@/components/pages/product/product-about";
import { ProductAdvantages } from "@/components/pages/product/product-advantages";
import { ProductBenefits } from "@/components/pages/product/product-benefits";
import { ProductCta } from "@/components/pages/product/product-cta";
import { ProductMeters } from "@/components/pages/product/product-meters";
import { ProductShowcase } from "@/components/pages/product/product-showcase";
import { ProductUsage } from "@/components/pages/product/product-usage";
import { JsonLd } from "@/components/shared/json-ld";
import { locales } from "@/lib/i18n/routing";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/json-ld";
import { getProduct, products } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    products.map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/products/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return {};

  const t = await getTranslations({ locale, namespace: "metadata.product" });
  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const name = tCatalog(`${product.slug}.name`);

  return buildMetadata({
    locale: locale as Locale,
    title: t("title", { product: name }),
    description: tCatalog(`${product.slug}.description`),
    keywords: t("keywords", { product: name }).split(", "),
    path: `/products/${product.slug}`,
    images: [product.gallery[0]],
    type: "article",
  });
}

export default async function ProductPage(
  props: PageProps<"/[locale]/products/[slug]">,
) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  const product = getProduct(slug);
  if (!product) notFound();

  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const tProduct = await getTranslations({ locale, namespace: "product" });
  const name = tCatalog(`${product.slug}.name`);

  return (
    <>
      <ProductShowcase product={product} />
      <ProductBenefits product={product} />
      <ProductUsage product={product} />
      <ProductAbout product={product} />
      <ProductAdvantages product={product} />
      <ProductMeters product={product} />
      <ProductCta product={product} />

      <JsonLd
        id={`ld-product-${product.slug}`}
        data={[
          productJsonLd(product, locale as Locale, {
            name,
            description: tCatalog(`${product.slug}.description`),
          }),
          breadcrumbJsonLd(
            [
              { name: tProduct("breadcrumbHome"), path: "/" },
              { name: tProduct("breadcrumbProducts"), path: "/products" },
              { name, path: `/products/${product.slug}` },
            ],
            locale as Locale,
          ),
        ]}
      />
    </>
  );
}
