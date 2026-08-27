import Image from "next/image";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ISO_22000_CERTIFICATE } from "@/lib/constants";

/** The only mark we hold the document for — see `ISO_22000_CERTIFICATE`. */
const DOCUMENTED_KEY = "iso";

const certificates = [
  { key: "euroLeaf", image: "/cert-euro-leaf.png" },
  { key: "halal", image: "/cert-halal.png" },
  { key: "usda", image: "/cert-usda-organic.png" },
  { key: "iso", image: "/cert-iso-22000.png" },
  { key: "gmp", image: "/cert-gmp.png" },
] as const;

export function Certificates() {
  const t = useTranslations("home.certificates");
  // The footer names this document already; reusing its label keeps one string
  // for one PDF instead of two translations that can drift apart.
  const tFooter = useTranslations("footer");

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
          {certificates.map((certificate) => {
            /*
             * Only the mark we hold the PDF for is clickable. The card keeps
             * exactly the same height either way — the affordance is a 13px
             * glyph beside the name, not another line — so one card gaining a
             * link does not stretch the other four to match it.
             */
            const documented = certificate.key === DOCUMENTED_KEY;
            const Card = documented ? "a" : "div";
            return (
              <li key={certificate.key} className="h-full">
                <Card
                  {...(documented
                    ? {
                        href: ISO_22000_CERTIFICATE,
                        target: "_blank",
                        rel: "noreferrer noopener",
                      }
                    : {})}
                  className="flex h-full flex-col items-center rounded-lg bg-cream px-5 py-8 text-center transition-colors hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <Image
                    src={certificate.image}
                    alt={t(`items.${certificate.key}.name`)}
                    width={100}
                    height={100}
                    sizes="100px"
                    className="size-[88px] object-contain"
                  />
                  <h3 className="mt-6 flex items-center gap-1.5 font-sans text-sm font-medium tracking-wide text-brand">
                    {t(`items.${certificate.key}.name`)}
                    {documented && (
                      <>
                        <FileText className="size-3.5 shrink-0 text-gold-strong" aria-hidden />
                        <span className="sr-only">{tFooter("certificate")}</span>
                      </>
                    )}
                  </h3>
                  <p className="mt-3 text-xs text-brand/80">
                    {t(`items.${certificate.key}.title`)}
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    {t(`items.${certificate.key}.description`)}
                  </p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
