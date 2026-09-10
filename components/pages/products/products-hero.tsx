import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { Link } from "@/lib/i18n/navigation";
import type { Product } from "@/types";

const highlightKeys: Record<string, string> = {
  "qora-sedana": "qoraSedana",
  "qust-al-hindi": "qustAlHindi",
  "omega-3": "omega",
} as const;

export function ProductsHero({ products }: { products: Product[] }) {
  const t = useTranslations("products");
  const tCatalog = useTranslations("catalog");

  return (
    <section className="relative overflow-hidden bg-brand">
      <Image
        src="/leafs.png"
        alt=""
        aria-hidden
        width={692}
        height={767}
        priority
        className="pointer-events-none absolute top-0 right-0 w-[300px] max-w-[70%] select-none opacity-50 sm:w-[500px] sm:opacity-100 lg:w-[620px] xl:w-[692px]"
      />

      <Container className="relative py-14 lg:py-20">
        <h1 className="text-balance text-4xl leading-[1.25] text-cream sm:text-5xl">
          {t("title")}
          <span className="mt-1 block text-gold">{t("titleAccent")}</span>
        </h1>

        <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/70">
          {t("subtitle")}
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-3xl">
          {products.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/products/${product.slug}`}
                className="group relative flex h-36 flex-col justify-end overflow-hidden rounded-lg border border-cream/10 p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <Image
                  src={product.image}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
                  className="object-cover opacity-25 transition-transform duration-500 group-hover:scale-110"
                />
                <span className="relative font-brand text-lg text-cream">
                  {tCatalog(`${product.slug}.name`)}
                </span>
                <span className="relative mt-1 text-xs text-cream/70">
                  {t(`highlights.${highlightKeys[product.slug]}`)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
