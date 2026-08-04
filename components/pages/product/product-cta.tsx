import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { contacts } from "@/lib/constants";
import { Link } from "@/lib/i18n/navigation";
import type { Product } from "@/types";

export function ProductCta({ product }: { product: Product }) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const tCatalog = useTranslations(`catalog.${product.slug}`);

  return (
    <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
      <GreenLeaf
        variant={4}
        flip
        className="bottom-10 left-0 hidden w-[190px] opacity-90 lg:block"
      />
      <GreenLeaf
        variant={2}
        className="top-0 right-0 hidden w-[150px] opacity-90 lg:block"
      />

      <Container className="relative">
        <div className="mx-auto max-w-[800px] rounded-xl bg-brand px-6 py-12 text-center sm:px-12">
          <h2 className="font-display text-2xl text-gold sm:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/75">
            {t("ctaDescription", { product: tCatalog("name") })}
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/checkout"
              className="flex h-13 items-center justify-center rounded-lg bg-gold text-sm font-medium text-brand transition-colors hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {tCommon("orderNow")}
            </Link>
            <a
              href={contacts.phoneHref}
              className="flex h-13 items-center justify-center rounded-lg border border-cream/25 text-sm font-medium text-cream transition-colors hover:bg-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {contacts.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
