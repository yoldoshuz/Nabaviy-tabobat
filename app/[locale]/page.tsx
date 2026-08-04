import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { About } from "@/components/pages/home/about";
import { Certificates } from "@/components/pages/home/certificates";
import { Faq } from "@/components/pages/home/faq";
import { FeaturedProducts } from "@/components/pages/home/featured-products";
import { Hero } from "@/components/pages/home/hero";
import { Testimonials } from "@/components/pages/home/testimonials";
import { Videos } from "@/components/pages/home/videos";
import { JsonLd } from "@/components/shared/json-ld";
import { faqKeys } from "@/lib/faq";
import { faqJsonLd, itemListJsonLd } from "@/lib/json-ld";
import { products } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata(
  props: PageProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return buildMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    path: "/",
  });
}

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const tFaq = await getTranslations({ locale, namespace: "home.faq" });
  const tCatalog = await getTranslations({ locale, namespace: "catalog" });

  return (
    <>
      <Hero />
      <FeaturedProducts />
      <About />
      <Certificates />
      <Videos />
      <Testimonials />
      <Faq />

      <JsonLd
        id="ld-home"
        data={[
          faqJsonLd(
            faqKeys.map((key) => ({
              question: tFaq(`items.${key}.question`),
              answer: tFaq(`items.${key}.answer`),
            })),
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
