import { MessageSquareText, Phone } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { LeafDecor } from "@/components/shared/leaf-decor";
import { InstagramIcon } from "@/components/shared/social-icons";
import { contacts } from "@/lib/constants";
import { Link } from "@/lib/i18n/navigation";

/** Closing call-to-action panel from the Figma frames (shown on every page). */
export function CtaBanner() {
  const t = useTranslations("cta");
  const tCommon = useTranslations("common");

  return (
    <section className="relative overflow-hidden bg-brand">
      <LeafDecor
        variant="footerLeft"
        className="bottom-0 left-0 w-[150px] sm:w-[220px] lg:w-[281px]"
      />
      <LeafDecor
        variant="footerRight"
        className="top-[18%] right-0 w-[150px] sm:w-[210px] lg:w-[271px]"
      />

      <div className="relative mx-auto w-full max-w-[900px] px-5 pt-4 pb-16 sm:px-10 lg:pb-24">
        <div className="rounded-lg bg-brand-deep/45 px-6 py-14 text-center sm:px-12 lg:px-16">
          <Image
            src="/logo.png"
            alt={tCommon("brand")}
            width={240}
            height={68}
            sizes="260px"
            className="mx-auto h-11 w-auto sm:h-14"
          />

          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-cream/80 sm:text-base">
            {t("description")}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/checkout"
              className="flex h-12 w-full items-center justify-center rounded-lg bg-gold px-8 text-sm font-medium text-brand transition-colors hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto"
            >
              {tCommon("orderNow")}
            </Link>
            <Link
              href="/products"
              className="flex h-12 w-full items-center justify-center rounded-lg border border-cream/30 px-8 text-sm font-medium text-cream transition-colors hover:bg-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto"
            >
              {tCommon("viewProducts")}
            </Link>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-3">
            <ContactCard
              icon={<Phone className="size-5" aria-hidden />}
              label={t("phoneLabel")}
              value={contacts.phone}
              href={contacts.phoneHref}
            />
            <ContactCard
              icon={<InstagramIcon className="size-5" />}
              label={t("instagramLabel")}
              value={contacts.instagram}
              href={contacts.instagramHref}
              external
            />
            {/* "Написать нам" — an offer to talk, so it goes to the administrator
                rather than the channel the other two cards point at. */}
            <ContactCard
              icon={<MessageSquareText className="size-5" aria-hidden />}
              label={t("messageLabel")}
              value={t("messageValue")}
              href={contacts.telegramAdmin}
              external
            />
          </ul>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        className="flex h-full items-center gap-3 rounded-lg bg-brand-soft/60 px-4 py-4 text-left transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-deep text-cream">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block text-xs text-cream/50">{label}</span>
          <span className="block truncate text-sm text-cream">{value}</span>
        </span>
      </a>
    </li>
  );
}
