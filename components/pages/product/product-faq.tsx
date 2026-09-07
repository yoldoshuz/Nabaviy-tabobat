"use client";

import { Container } from "@/components/shared/container";
import { GreenLeaf } from "@/components/shared/green-leaf";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductContent } from "@/lib/api/blocks";

/**
 * Questions and answers about one product, written in the admin.
 *
 * There is no bundled fallback and none is wanted: the section exists only
 * when a moderator has something to answer, so a product with no FAQ block
 * simply does not have it — which is why this returns `null` rather than
 * rendering an empty state.
 *
 * Open by default, like the home page's FAQ: these are short answers a reader
 * scans on the way to deciding, not a reference they look one thing up in.
 */
export function ProductFaq({ content }: { content?: ProductContent }) {
  const faq = content?.faq;
  if (!faq) return null;

  const values = faq.items.map((_, index) => `faq-${index}`);

  return (
    <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
      <GreenLeaf
        variant={2}
        flip
        className="top-16 right-0 hidden w-[150px] opacity-90 lg:block"
      />

      <Container className="relative">
        {faq.title && <SectionHeading title={faq.title} className="mx-auto" />}

        <Accordion
          defaultValue={values}
          className="mx-auto mt-12 max-w-4xl gap-4"
        >
          {faq.items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={values[index]}
              className="rounded-lg border-0 bg-stone px-5 py-2 sm:px-7"
            >
              <AccordionTrigger className="py-4 text-left font-display text-base font-normal text-brand hover:no-underline sm:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pr-6 pb-5 text-sm leading-relaxed whitespace-pre-line text-brand/75">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
