import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AccountView } from "@/components/pages/account/account-view";

/**
 * The account is per-visitor and lives behind a token the server never sees, so
 * it renders on the client and stays out of the index.
 */
export async function generateMetadata(
  props: LayoutProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function AccountPage(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <AccountView />;
}
