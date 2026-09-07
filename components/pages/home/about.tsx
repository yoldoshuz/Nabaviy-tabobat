import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

const cards = ["experts", "natural", "individual", "islamic"] as const;

/** Offsets recreate the staggered speech-bubble layout from the Figma frame. */
const cardOffsets = ["lg:mr-auto", "lg:ml-auto", "lg:mr-auto", "lg:ml-auto"];

export function About() {
  const t = useTranslations("home.about");

  return (
    <section id="about" className="relative overflow-hidden bg-white py-16 lg:py-24">
      <Container>
        <SectionHeading title={t("title")} className="mx-auto" />

        <p className="mx-auto mt-6 max-w-4xl text-center text-sm leading-relaxed text-brand/70 sm:text-base">
          {t("description")}
        </p>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <ul className="flex flex-col gap-4">
            {cards.map((card, index) => (
              <li
                key={card}
                className={cn(
                  "about-plaque w-full max-w-sm px-8 py-10 text-center text-cream",
                  cardOffsets[index],
                )}
              >
                <h3 className="text-base text-cream">{t(`cards.${card}.title`)}</h3>
                <p className="mt-4 text-sm leading-relaxed text-cream/70">
                  {t(`cards.${card}.description`)}
                </p>
              </li>
            ))}
          </ul>

          <div className="relative">
            <Image
              src="/about-package.png"
              alt={t("imageAlt")}
              width={693}
              height={777}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
