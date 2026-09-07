import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LoginView } from "@/components/pages/account/login-view";

export async function generateMetadata(
  props: LayoutProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("signInTitle"), robots: { index: false, follow: false } };
}

export default async function LoginPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale } = await props.params;
  const { next } = await props.searchParams;
  setRequestLocale(locale);

  // Only same-site paths are followed after signing in — an absolute URL here
  // would turn the login screen into an open redirect.
  const target = next?.startsWith("/") && !next.startsWith("//") ? next : "/account";

  return <LoginView next={target} />;
}
