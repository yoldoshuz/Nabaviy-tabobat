import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Link } from "@/lib/i18n/navigation";

export function Hero() {
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common");

  return (
    <section className="relative overflow-hidden bg-white">
      <Image
        src="/glow-circle.png"
        alt=""
        aria-hidden
        width={148}
        height={576}
        priority
        className="pointer-events-none absolute top-1/2 left-0 hidden w-[148px] -translate-y-1/2 select-none lg:block"
      />

      <Image
        src="/leafs.png"
        alt=""
        aria-hidden
        width={692}
        height={767}
        priority
        className="pointer-events-none absolute top-0 right-0 w-[300px] max-w-[70%] select-none opacity-50 sm:w-[500px] sm:opacity-100 lg:w-[620px] xl:w-[692px]"
      />

      <Container className="relative grid min-h-[520px] items-center py-16 sm:min-h-[600px] lg:min-h-[660px] lg:py-24">
        <div className="max-w-xl">
          <h1 className="text-balance text-4xl leading-[1.25] text-brand sm:text-5xl">
            {t("title")}
            <span className="mt-1 block text-gold">{t("titleAccent")}</span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-brand/70 sm:text-base">
            {t("description")}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="group inline-flex h-13 items-center justify-center gap-3 rounded-lg bg-brand px-7 text-sm font-medium text-cream transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {tCommon("viewProducts")}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
            <Link
              href="/checkout"
              className="inline-flex h-13 items-center justify-center rounded-lg border border-brand/20 bg-white/70 px-7 text-sm font-medium text-brand backdrop-blur-sm transition-colors hover:bg-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {tCommon("orderNow")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
