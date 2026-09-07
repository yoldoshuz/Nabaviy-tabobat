"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqKeys } from "@/lib/faq";

export function Faq() {
  const t = useTranslations("home.faq");

  return (
    <section id="faq" className="bg-white py-16 lg:py-24">
      <Container>
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          className="mx-auto"
        />

        <Accordion
          defaultValue={[...faqKeys]}
          className="mx-auto mt-12 max-w-4xl gap-4 lg:mt-16"
        >
          {faqKeys.map((key) => (
            <AccordionItem
              key={key}
              value={key}
              className="rounded-lg border-0 bg-stone px-5 py-2 sm:px-7"
            >
              <AccordionTrigger className="py-4 text-left font-display text-base font-normal text-brand hover:no-underline sm:text-lg">
                {t(`items.${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="pr-6 pb-5 text-sm leading-relaxed text-brand/75">
                {t(`items.${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
