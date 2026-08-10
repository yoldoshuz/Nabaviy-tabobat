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
  email: "info@nabaviytabobati.uz",
  emailHref: "mailto:info@nabaviytabobati.uz",
  instagram: "@nabaviy_tabobati",
  instagramHref: "https://instagram.com/nabaviy_tabobati",
  telegram: "https://t.me/nabaviy_tabobati",
  mapEmbed:
    "https://yandex.uz/map-widget/v1/?ll=69.294%2C41.311&z=16&pt=69.294,41.311,pm2rdm",
  geo: { latitude: 41.311081, longitude: 69.294067 },
} as const;

/**
 * The rest of the NUMA group, surfaced from the logo dropdown. Every storefront
 * carries the same list minus itself, so the header is one consistent way in
 * and out of the group.
 */
export const SIBLING_SITES = [
  { id: "family", href: "https://numafamily.uz" },
  { id: "nutrition", href: "https://numanutrition.uz" },
  { id: "kids", href: "https://numakids.com" },
  { id: "catering", href: "https://numacatering.com" },
] as const;

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
