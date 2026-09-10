import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Product } from "@/types";

const rows = ["dose", "course", "benefit", "audience"] as const;

export function ComparisonTable({ products }: { products: Product[] }) {
  const t = useTranslations("products");
  const tCatalog = useTranslations("catalog");

  return (
    <section className="bg-white py-16 lg:py-20">
      <Container>
        <SectionHeading title={t("compareTitle")} className="mx-auto" />

        <div className="mt-10 overflow-hidden rounded-xl border border-border shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <caption className="sr-only">{t("compareTitle")}</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-[22%] px-6 pt-8 pb-4 text-left align-bottom font-sans text-xs font-medium tracking-[0.18em] text-brand uppercase"
                  >
                    {t("compareFeatures")}
                  </th>
                  {products.map((product) => (
                    <th key={product.slug} scope="col" className="px-4 pt-6 pb-4">
                      <span className="block overflow-hidden rounded-lg">
                        <span className="block bg-brand py-2 font-brand text-sm text-cream">
                          {tCatalog(`${product.slug}.name`)}
                        </span>
                        {/* Whole bottle, never a slice of its label. */}
                        <Image
                          src={product.image}
                          alt={tCatalog(`${product.slug}.name`)}
                          width={220}
                          height={160}
                          sizes="220px"
                          className="h-[150px] w-full bg-stone object-contain"
                        />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row} className="border-t border-border">
                    <th
                      scope="row"
                      className="px-6 py-4 text-left font-sans text-sm font-normal text-brand/80"
                    >
                      {t(`compare.${row}`)}
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.slug}
                        className="px-4 py-4 text-center text-brand/75"
                      >
                        {tCatalog(`${product.slug}.compare.${row}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}
