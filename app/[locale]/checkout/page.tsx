import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CheckoutView } from "@/components/pages/checkout/checkout-view";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata(
  props: PageProps<"/[locale]/checkout">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.checkout" });

  return buildMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    path: "/checkout",
    noIndex: true,
  });
}

export default async function CheckoutPage(
  props: PageProps<"/[locale]/checkout">,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <CheckoutView />;
}
