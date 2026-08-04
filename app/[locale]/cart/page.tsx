import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CartView } from "@/components/pages/cart/cart-view";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata(
  props: PageProps<"/[locale]/cart">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.cart" });

  return buildMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    path: "/cart",
    noIndex: true,
  });
}

export default async function CartPage(props: PageProps<"/[locale]/cart">) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <CartView />;
}
