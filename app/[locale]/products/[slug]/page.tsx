import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ProductAbout } from "@/components/pages/product/product-about";
import { ProductAdvantages } from "@/components/pages/product/product-advantages";
import { ProductBenefits } from "@/components/pages/product/product-benefits";
import { ProductCta } from "@/components/pages/product/product-cta";
import { ProductFaq } from "@/components/pages/product/product-faq";
import { ProductMeters } from "@/components/pages/product/product-meters";
import { ProductShowcase } from "@/components/pages/product/product-showcase";
import {
  ProductBanner,
  ProductCertificate,
  ProductLabel,
  ProductLifestyle,
} from "@/components/pages/product/product-slot-sections";
import { ProductUsage } from "@/components/pages/product/product-usage";
import { JsonLd } from "@/components/shared/json-ld";
import { locales } from "@/lib/i18n/routing";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/json-ld";
import {
  resolveProductContent,
  resolveSectionOrder,
  type ContentSection,
} from "@/lib/api/blocks";
import { getProduct } from "@/lib/api/catalog";
import { products } from "@/lib/products";
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
  const product = await getProduct(slug);
  if (!product) return {};

  const t = await getTranslations({ locale, namespace: "metadata.product" });
  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const name = tCatalog(`${product.slug}.name`);

  return buildMetadata({
    locale: locale as Locale,
    title: t("title", { product: name }),
    description:
      resolveProductContent(product.blocks, locale as Locale).hero?.text ||
      tCatalog(`${product.slug}.description`),
    keywords: t("keywords", { product: name }).split(", "),
    path: `/products/${product.slug}`,
    images: [product.image],
    type: "article",
  });
}

export default async function ProductPage(
  props: PageProps<"/[locale]/products/[slug]">,
) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  const product = await getProduct(slug);
  if (!product) notFound();

  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const tProduct = await getTranslations({ locale, namespace: "product" });
  const name = tCatalog(`${product.slug}.name`);

  /*
   * Everything below the buy box is written in the admin now. What comes back
   * empty stays on the copy bundled in `messages/`, so a product whose landing
   * nobody has filled in renders exactly the page it renders today.
   */
  const content = resolveProductContent(product.blocks, locale as Locale);

  /* The order the moderator arranged the blocks in. */
  const SECTION: Record<ContentSection, React.ReactNode> = {
    benefits: <ProductBenefits key="benefits" product={product} content={content} />,
    howToUse: <ProductUsage key="howToUse" product={product} content={content} />,
    about: <ProductAbout key="about" product={product} content={content} />,
    advantages: (
      <ProductAdvantages key="advantages" product={product} content={content} />
    ),
    metrics: <ProductMeters key="metrics" product={product} content={content} />,
    faq: <ProductFaq key="faq" content={content} />,
  };

  return (
    <>
      <ProductShowcase product={product} content={content} />
      {resolveSectionOrder(product.blocks).map((section) => SECTION[section])}

      {/*
        The four sections that are a photograph and nothing else. They have no
        CMS block to order them, so they close the page in the order the shared
        template lays down — label, lifestyle, certificate, wide strip — and
        each one renders only if its slot has a file in it.
      */}
      <ProductLabel product={product} />
      <ProductLifestyle product={product} />
      <ProductCertificate product={product} />
      <ProductBanner product={product} />

      <ProductCta product={product} />

      <JsonLd
        id={`ld-product-${product.slug}`}
        data={[
          productJsonLd(product, locale as Locale, {
            name,
            description:
              content.hero?.text || tCatalog(`${product.slug}.description`),
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
