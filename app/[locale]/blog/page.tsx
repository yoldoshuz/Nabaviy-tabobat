import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BlogView } from "@/components/pages/blog/blog-view";
import { JsonLd } from "@/components/shared/json-ld";
import { blogArticles } from "@/lib/blog";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata(
  props: PageProps<"/[locale]/blog">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.blog" });

  return buildMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    path: "/blog",
  });
}

export default async function BlogPage(props: PageProps<"/[locale]/blog">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <BlogView />

      <JsonLd
        id="ld-blog"
        data={[
          breadcrumbJsonLd(
            [
              { name: tNav("home"), path: "/" },
              { name: tNav("blog"), path: "/blog" },
            ],
            locale as Locale,
          ),
          ...blogArticles.map((article) =>
            articleJsonLd({
              headline: t(`articles.${article.slug}.title`),
              description: t(`articles.${article.slug}.intro`),
              path: "/blog",
              locale: locale as Locale,
              publishedAt: article.publishedAt,
            }),
          ),
        ]}
      />
    </>
  );
}
