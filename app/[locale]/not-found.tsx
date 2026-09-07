import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { Link } from "@/lib/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="bg-white py-24">
      <Container className="text-center">
        <p className="font-display text-6xl text-gold">404</p>
        <h1 className="mt-6 text-3xl text-brand sm:text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {t("description")}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-brand px-8 text-sm font-medium text-cream transition-colors hover:bg-brand-soft"
        >
          {t("action")}
        </Link>
      </Container>
    </section>
  );
}
