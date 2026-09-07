import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactsView } from "@/components/pages/contacts/contacts-view";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/types";

export async function generateMetadata(
  props: PageProps<"/[locale]/contacts">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.contacts" });

  return buildMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    path: "/contacts",
  });
}

export default async function ContactsPage(
  props: PageProps<"/[locale]/contacts">,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "metadata.contacts" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <ContactsView />

      <JsonLd
        id="ld-contacts"
        data={[
          localBusinessJsonLd(locale as Locale, t("description")),
          breadcrumbJsonLd(
            [
              { name: tNav("home"), path: "/" },
              { name: tNav("contacts"), path: "/contacts" },
            ],
            locale as Locale,
          ),
        ]}
      />
    </>
  );
}
