import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { ConsultationButton } from "@/components/layout/consultation-button";
import { Container } from "@/components/shared/container";
import { FacebookIcon, InstagramIcon, TelegramIcon } from "@/components/shared/social-icons";
import { contacts } from "@/lib/constants";
import { Link } from "@/lib/i18n/navigation";

export function ContactsView() {
  const t = useTranslations("contacts");
  const tCommon = useTranslations("common");

  return (
    <>
      <section className="bg-white pt-14 pb-10 lg:pt-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance text-4xl leading-[1.15] text-brand sm:text-5xl">
              {t("title")}
              <span className="mt-1 block text-gold">{t("titleAccent")}</span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/checkout"
                className="flex h-12 w-full items-center justify-center rounded-lg bg-gold px-8 text-sm font-medium text-brand transition-colors hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {tCommon("orderNow")}
              </Link>
              <a
                href={contacts.telegramAdmin}
                target="_blank"
                rel="noreferrer noopener"
                className="flex h-12 w-full items-center justify-center rounded-lg border border-brand/20 px-8 text-sm font-medium text-brand transition-colors hover:bg-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {tCommon("viaTelegram")}
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white pb-16 lg:pb-24">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-7 shadow-card ring-1 ring-border">
              <h2 className="text-xl text-brand">{t("cardTitle")}</h2>

              <ul className="mt-7 space-y-5">
                <ContactRow
                  icon={<Phone className="size-5" aria-hidden />}
                  href={contacts.phoneHref}
                  label={contacts.phone}
                />
                <ContactRow
                  icon={<InstagramIcon className="size-5" />}
                  href={contacts.instagramHref}
                  label={contacts.instagram}
                  external
                />
                <ContactRow
                  icon={<TelegramIcon className="size-5" />}
                  href={contacts.telegram}
                  label={contacts.telegramHandle}
                  external
                />
                <ContactRow
                  icon={<FacebookIcon className="size-5" />}
                  href={contacts.facebookHref}
                  label="Facebook"
                  external
                />
                <ContactRow
                  icon={<Clock className="size-5" aria-hidden />}
                  label={t("workingHours")}
                />
                <ContactRow
                  icon={<MapPin className="size-5" aria-hidden />}
                  label={t("address")}
                />
                <ContactRow
                  icon={<Mail className="size-5" aria-hidden />}
                  href={contacts.emailHref}
                  label={contacts.email}
                />
              </ul>
            </div>

            <ConsultationButton className="h-13 w-full bg-gold hover:bg-sand">
              {t("callNow")}
            </ConsultationButton>

            <a
              href={contacts.telegramAdmin}
              target="_blank"
              rel="noreferrer noopener"
              className="flex h-13 w-full items-center justify-center gap-2 rounded-lg border border-brand/20 text-sm font-medium text-brand transition-colors hover:bg-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <TelegramIcon className="size-4" />
              {t("writeTelegram")}
            </a>
          </div>

          <div className="overflow-hidden rounded-lg ring-1 ring-border">
            <iframe
              title={t("mapTitle")}
              src={contacts.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full border-0 lg:h-full lg:min-h-[520px]"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

function ContactRow({
  icon,
  label,
  href,
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border text-brand">
        {icon}
      </span>
      <span className="text-sm text-brand/85">{label}</span>
    </>
  );

  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
          className="flex items-center gap-4 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {content}
        </a>
      ) : (
        <div className="flex items-center gap-4">{content}</div>
      )}
    </li>
  );
}
