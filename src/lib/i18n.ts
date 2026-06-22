export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

// Çok dilli sayfa yollarını üretir: /tr/projeler, /en/projects ...
export function path(locale: Locale, segment: string = "") {
  return `/${locale}${segment ? "/" + segment : ""}`;
}
