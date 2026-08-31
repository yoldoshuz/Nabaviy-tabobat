import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";

import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { Link } from "@/lib/i18n/navigation";
import { cn, isSoldOut } from "@/lib/utils";
import type { Product } from "@/types";

interface ArticleProductsProps {
  products: Product[];
  /** The editor's line for the lead product, when the CMS carries one. */
  note: string | null;
}

/**
 * The "buy what you just read about" strip that closes every article.
 *
 * An article that explains what black cumin does and then ends is a dead end —
 * the reader has to go back to the catalogue and work out which jar was meant.
 * The products come from the article's own curated list (`blog_post_products`),
 * so the strip always offers the thing the text is actually about.
 *
 * Renders nothing when the list is empty, which is the case whenever the
 * storefront is running on its static fallback.
 */
export function ArticleProducts({ products, note }: ArticleProductsProps) {
  const t = useTranslations("blog.buy");
  const tCommon = useTranslations("common");
  const format = useFormatter();

  if (products.length === 0) return null;

  return (
    <aside className="mt-14 rounded-lg border border-gold/40 bg-stone/50 p-6 sm:p-8">
      <h3 className="text-center text-xl text-brand sm:text-2xl">{t("title")}</h3>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
        {note ?? t("subtitle")}
      </p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const soldOut = isSoldOut(product);
          return (
          <li
            key={product.slug}
            className="group flex flex-col rounded-lg bg-white p-5 text-center ring-1 ring-border transition-shadow hover:shadow-card"
          >
            <Link
              href={`/products/${product.slug}`}
              className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={140}
                height={220}
                sizes="140px"
                className={cn(
                  "mx-auto h-[130px] w-auto object-contain transition-transform duration-300 group-hover:scale-105",
                  // Drained of colour, so the card reads as unavailable at a glance.
                  soldOut && "opacity-45 saturate-25",
                )}
              />
            </Link>

            <h4 className="mt-4 text-lg text-brand">
              <Link
                href={`/products/${product.slug}`}
                className="transition-colors hover:text-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {product.name}
              </Link>
            </h4>

            <p className="mt-2 text-xs font-medium text-brand">
              {tCommon("price", { value: format.number(product.price) })}
            </p>

            {/* The lead-product strip pulls straight from the article's curated
                list, so a jar that has since sold out lands here too — it must
                carry the same disabled control as every other card, not the one
                path that still took the order. */}
            <AddToCartButton
              slug={product.slug}
              soldOut={soldOut}
              className="mt-4 h-10 w-full px-3 text-xs"
            />
          </li>
          );
        })}
      </ul>
    </aside>
  );
}
