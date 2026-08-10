"use client";

import { Check, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { ArticleProducts } from "@/components/pages/blog/article-products";
import { Container } from "@/components/shared/container";
import type { BlogArticle } from "@/types";

export function BlogView({ articles: blogArticles }: { articles: BlogArticle[] }) {
  const t = useTranslations("blog");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return blogArticles;

    return blogArticles.filter((article) => {
      const haystack = [
        t(`articles.${article.slug}.title`),
        t(`articles.${article.slug}.intro`),
        ...article.cardKeys.map((key) =>
          t(`articles.${article.slug}.cards.${key}.title`),
        ),
      ]
        .join(" ")
        .toLocaleLowerCase();
      return haystack.includes(needle);
    });
  }, [query, t]);

  return (
    <>
      <section className="bg-white pt-14 pb-10 lg:pt-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance text-4xl leading-[1.15] text-brand sm:text-5xl">
              {t("title")}
              <span className="mt-1 block text-gold">{t("titleAccent")}</span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>

            <div className="relative mt-8">
              <label htmlFor="blog-search" className="sr-only">
                {t("searchLabel")}
              </label>
              <input
                id="blog-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-14 w-full rounded-lg bg-gold px-5 pr-14 text-sm text-brand outline-none transition-shadow placeholder:text-brand/55 focus-visible:ring-3 focus-visible:ring-brand/25"
              />
              <Search
                aria-hidden
                className="absolute top-1/2 right-5 size-5 -translate-y-1/2 text-brand/70"
              />
            </div>
          </div>
        </Container>
      </section>

      {visible.length === 0 ? (
        <Container className="pb-20">
          <p className="text-center text-sm text-muted-foreground">
            {t("empty")}
          </p>
        </Container>
      ) : null}

      {visible.map((article) => (
        <section key={article.slug} className="bg-white pb-16 lg:pb-20">
          <Container>
            <article>
              <h2 className="text-balance text-center text-2xl leading-tight text-brand sm:text-3xl lg:text-4xl">
                {t(`articles.${article.slug}.title`)}
              </h2>

              <p className="mx-auto mt-6 max-w-4xl text-center text-sm leading-relaxed text-brand/75">
                {t(`articles.${article.slug}.intro`)}
              </p>

              <h3 className="mx-auto mt-10 max-w-3xl text-balance text-center text-xl leading-tight text-brand sm:text-2xl lg:text-3xl">
                {t(`articles.${article.slug}.subtitle`)}
              </h3>

              <ul className="mt-10 grid gap-6 md:grid-cols-2">
                {article.cardKeys.map((key) => (
                  <li
                    key={key}
                    className="rounded-lg bg-white px-7 py-6 shadow-card ring-1 ring-border"
                  >
                    <h4 className="font-sans text-sm font-medium text-brand">
                      {t(`articles.${article.slug}.cards.${key}.title`)}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {t(`articles.${article.slug}.cards.${key}.description`)}
                    </p>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-center text-sm text-brand/70">
                {t(`articles.${article.slug}.note`)}
              </p>

              <h3 className="mt-12 text-center text-2xl text-brand sm:text-3xl">
                {t("tipsTitle")}
              </h3>

              <ul className="mt-8 grid gap-4 md:grid-cols-2">
                {article.tipKeys.map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-3 rounded-lg bg-white px-5 py-3.5 shadow-card ring-1 ring-border"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold text-brand">
                      <Check className="size-4" aria-hidden />
                    </span>
                    <span className="text-sm text-brand/85">
                      {t(`tips.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>

              <ArticleProducts
                products={article.relatedProducts}
                note={article.relatedNote}
              />
            </article>
          </Container>
        </section>
      ))}
    </>
  );
}
