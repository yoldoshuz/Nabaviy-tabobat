import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { PaymentReturnView } from "@/components/pages/payment/payment-return-view";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata(
  props: PageProps<"/[locale]/payment/return">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "PaymentReturn" });

  return buildMetadata({
    locale: locale as Locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/payment/return",
    // Carries an orderId and reflects one person's purchase.
    noIndex: true,
  });
}

export default async function PaymentReturnPage(
  props: PageProps<"/[locale]/payment/return">,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // useSearchParams needs a Suspense boundary to keep the route's static shell.
  return (
    <Suspense fallback={null}>
      <PaymentReturnView />
    </Suspense>
  );
}
