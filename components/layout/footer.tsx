import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";
import { contacts, footerNavigation } from "@/lib/constants";
import { Link } from "@/lib/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tCatalog = useTranslations("catalog");

  return (
    <footer className="bg-brand text-cream">
      <Container className="py-14 lg:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          <div className="max-w-xs">
            <Image
              src="/logo.png"
              alt={tCommon("brand")}
              width={240}
              height={68}
              sizes="200px"
              className="h-8 w-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-cream/60">
              {t("description")}
            </p>
          </div>

          <FooterColumn title={t("products")}>
            {footerNavigation.products.map((item) => (
              <li key={item.key}>
                <FooterLink href={item.href}>
                  {tCatalog(`${item.key}.name`)}
                </FooterLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t("company")}>
            {footerNavigation.company.map((item) => (
              <li key={item.key}>
                <FooterLink href={item.href}>{tNav(item.key)}</FooterLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t("contacts")}>
            <li>
              <a
                href={contacts.phoneHref}
                className="text-sm text-cream/60 transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {contacts.phone}
              </a>
            </li>
            <li>
              <a
                href={contacts.instagramHref}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-cream/60 transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {contacts.instagram}
              </a>
            </li>
            <li>
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-cream/60 transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {contacts.telegramHandle}
              </a>
            </li>
            <li>
              <a
                href={contacts.facebookHref}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-cream/60 transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={contacts.emailHref}
                className="text-sm text-cream/60 transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {contacts.email}
              </a>
            </li>
          </FooterColumn>
        </div>

        <div className="mt-12 border-t border-brand-line pt-6">
          <p className="text-xs text-cream/45">{t("rights")}</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-sans text-xs font-medium tracking-[0.22em] text-gold uppercase">
        {title}
      </h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-cream/60 transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {children}
    </Link>
  );
}
