export const siteConfig = {
  name: "Nabaviy Tabobat",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://nabaviytabobat.uz",
  ogImage: "/og-image.png",
  twitter: "@nabaviy_tabobat",
} as const;

export const contacts = {
  phone: "+998 71 203 22 32",
  phoneHref: "tel:+998712032232",
  /*
   * Two Telegram destinations, and they are not interchangeable. `telegram` is
   * the public channel — the footer, the contact card, structured data,
   * anywhere the site is just saying where to find the brand. `telegramAdmin`
   * is a person and belongs only behind a button offering to carry on a
   * conversation. Dropping someone from a footer icon into a private chat with
   * an administrator is what split these apart.
   */
  email: "numafamilyuz@gmail.com",
  emailHref: "mailto:numafamilyuz@gmail.com",
  instagram: "@nabaviy_tabobati",
  instagramHref: "https://www.instagram.com/nabaviy_tabobati",
  telegramHandle: "@nabaviyuz1",
  telegram: "https://t.me/nabaviyuz1",
  telegramAdminHandle: "@Numa_uz_admin",
  telegramAdmin: "https://t.me/Numa_uz_admin",
  facebookHref: "https://www.facebook.com/share/1HAf1K8hW8/",
  /**
   * Resolved from the office address rather than a literal pin — the previous
   * coordinate sat in the city centre. `geo` is omitted until the exact point
   * is surveyed; a wrong one in structured data is worse than none.
   */
  mapEmbed:
    "https://yandex.uz/map-widget/v1/?text=%D0%A2%D0%B0%D1%88%D0%BA%D0%B5%D0%BD%D1%82%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%AD%D0%BB%D0%B1%D0%B5%D0%BA%2C%2031&z=17&lang=ru_RU",
} as const;

/**
 * The six NUMA properties, surfaced from the logo dropdown.
 *
 * Every site carries the whole list including itself, so the menu reads the
 * same everywhere and a visitor can always see where they currently are. The
 * logos live in each site's own `public/brands/` — copied rather than
 * hot-linked, so a neighbour being down never leaves a hole in this menu.
 *
 * These are the deploy URLs, not the brand domains: numafamily.uz,
 * numanutrition.uz and nabaviytabobat.uz do not resolve yet, and a dropdown of
 * dead links is worse than no dropdown. Swap them the day DNS is cut over.
 *
 * NUMA Diagnostics has no site at all, so its `href` is empty and the menu
 * renders it as an inert "coming soon" row: the group is six brands and the
 * menu should say so, but a row that navigates nowhere — or worse, to a
 * different brand — is the bug this shape avoids.
 *
 * `bettery.svg` and `diagnostics.svg` are stand-in marks, not the brands'
 * artwork. Replace both the day real logos arrive.
 */
export const SIBLING_SITES = [
  {
    id: "nutrition",
    label: "NUMA NUTRITION",
    href: "https://numa-nutritition.vercel.app",
    logo: "/brands/nutrition.png",
  },
  {
    id: "kids",
    label: "NUMA KIDS",
    href: "https://numa-kids-olive.vercel.app/ru",
    logo: "/brands/kids.png",
  },
  {
    id: "family",
    label: "NUMA FAMILY",
    href: "https://numa-family.vercel.app/ru",
    logo: "/brands/family.png",
  },
  {
    id: "tabobat",
    label: "NABAVIY TABOBAT",
    href: "https://nabaviy-tabobat.vercel.app",
    logo: "/brands/tabobat.png",
  },
  {
    id: "bettery",
    label: "BETTERY ORGANIC",
    href: "https://betteryorganic.uz",
    logo: "/brands/bettery.svg",
  },
  {
    id: "diagnostics",
    label: "NUMA DIAGNOSTICS",
    href: "",
    logo: "/brands/diagnostics.svg",
  },
] as const;

/**
 * The one certificate on the site we hold the actual document for, linked from
 * the footer.
 *
 * What the PDF says, so nobody has to open it to find out: certificate
 * № 24-E-1770 Rev. 0, ISO 22000:2018 Food Safety Management System, issued by
 * IGC (register: igcert.org) to **NUTRI MAKON FACTORY LLC** — the factory, not
 * the brand — for the production of dietary supplements.
 *
 * Issued 15.08.2024, **expires 14.08.2027**. After that date this link starts
 * advertising a lapsed document, so it wants replacing before then.
 *
 * The other four marks in the certificates row have no document at all; only
 * this one is linked anywhere.
 */
export const ISO_22000_CERTIFICATE = "/certificates/iso-22000-2018.pdf";

export const navigation = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "blog", href: "/blog" },
  { key: "contacts", href: "/contacts" },
] as const;

export const footerNavigation = {
  products: [
    { key: "omega-3", href: "/products/omega-3" },
    { key: "qora-sedana", href: "/products/qora-sedana" },
    { key: "qust-al-hindi", href: "/products/qust-al-hindi" },
  ],
  company: [
    { key: "home", href: "/" },
    { key: "about", href: "/#about" },
    { key: "contacts", href: "/contacts" },
  ],
} as const;

export const localeMeta = {
  uz: { label: "Uz", htmlLang: "uz-Cyrl-UZ", ogLocale: "uz_UZ" },
  ru: { label: "Ru", htmlLang: "ru-RU", ogLocale: "ru_RU" },
  en: { label: "En", htmlLang: "en-US", ogLocale: "en_US" },
} as const;

export const FREE_DELIVERY = true;
