import type { Metadata } from "next";
import { getDict } from "./dict";
import type { Locale } from "./i18n";

// Her sayfanın KENDİ canonical + benzersiz title/description + hreflang'ını üretir.
// (Kök layout artık sabit canonical basmıyor; T1/T2/T3 düzeltmesi.)

const BASE = "https://camsankoparan.com";

export type SeoKey = "home" | "about" | "projects" | "project" | "services" | "contact";

export function pageMeta(locale: Locale, key: SeoKey, segment: string): Metadata {
  const s = getDict(locale).seo[key];
  const trPath = `/tr${segment}`;
  const enPath = `/en${segment}`;
  const url = `${BASE}/${locale}${segment}`;
  return {
    // absolute → başlık şablonu ("| Loft 777") eklenmez, tam kontrol bizde
    title: { absolute: s.title },
    description: s.description,
    alternates: {
      canonical: `/${locale}${segment}`,
      languages: { tr: trPath, en: enPath, "x-default": trPath },
    },
    openGraph: {
      type: "website",
      siteName: "Loft 777",
      url,
      title: s.title,
      description: s.description,
      locale: locale === "tr" ? "tr_TR" : "en_US",
    },
  };
}
