import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { StarRating } from "@/components/shared/star-rating";

const testimonials = [
  { key: "one", product: "Omega-3", avatar: "/avatar-1.png", rating: 5 },
  { key: "two", product: "Qora Sedana", avatar: "/avatar-1.png", rating: 5 },
  { key: "three", product: "Qust al-Hindi", avatar: "/avatar-1.png", rating: 5 },
] as const;

export function Testimonials() {
  const t = useTranslations("home.testimonials");

  return (
    <section className="bg-brand py-16 lg:py-24">
      <Container>
        <SectionHeading
          tone="light"
          align="start"
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li
              key={item.key}
              className="flex flex-col rounded-lg bg-white p-7 shadow-card"
            >
              <StarRating value={item.rating} />

              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-brand/85">
                “{t(`items.${item.key}.text`)}”
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-3">
                <Image
                  src={item.avatar}
                  alt=""
                  aria-hidden
                  width={44}
                  height={44}
                  className="size-11 shrink-0 rounded-full object-cover"
                />
                <span>
                  <span className="block text-sm font-medium text-brand">
                    {t(`items.${item.key}.author`)}
                  </span>
                  <span className="block text-xs text-gold-strong">
                    {t("consumer", { product: item.product })}
                  </span>
                </span>
              </figcaption>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
