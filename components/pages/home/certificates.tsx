import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const certificates = [
  { key: "euroLeaf", image: "/cert-euro-leaf.png" },
  { key: "halal", image: "/cert-halal.png" },
  { key: "usda", image: "/cert-usda-organic.png" },
  { key: "iso", image: "/cert-iso-22000.png" },
  { key: "gmp", image: "/cert-gmp.png" },
] as const;

export function Certificates() {
  const t = useTranslations("home.certificates");

  return (
    <section className="bg-brand py-16 lg:py-24">
      <Container>
        <SectionHeading
          tone="light"
          title={t("title")}
          subtitle={t("subtitle")}
          className="mx-auto"
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:grid-cols-5">
          {certificates.map((certificate) => (
            <li
              key={certificate.key}
              className="flex flex-col items-center rounded-lg bg-cream px-5 py-8 text-center"
            >
              <Image
                src={certificate.image}
                alt={t(`items.${certificate.key}.name`)}
                width={100}
                height={100}
                sizes="100px"
                className="size-[88px] object-contain"
              />
              <h3 className="mt-6 font-sans text-sm font-medium tracking-wide text-brand">
                {t(`items.${certificate.key}.name`)}
              </h3>
              <p className="mt-3 text-xs text-brand/80">
                {t(`items.${certificate.key}.title`)}
              </p>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                {t(`items.${certificate.key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
