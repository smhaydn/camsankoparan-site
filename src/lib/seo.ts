import type { Metadata } from "next";
import { getDict } from "./dict";
import type { Locale } from "./i18n";

// Her sayfanın KENDİ canonical + benzersiz title/description + hreflang'ını üretir.
// (Kök layout artık sabit canonical basmıyor; T1/T2/T3 düzeltmesi.)

const BASE = "https://camsankoparan.com";

export type SeoKey =
  | "home" | "about" | "projects" | "project" | "services" | "contact"
  | "kvkk" | "privacy" | "cookies";

/**
 * Sayfa başına PAYLAŞIM GÖRSELİ.
 * Önceden hiç og:image basılmıyordu: link WhatsApp'ta çıplak görünüyordu.
 * 1200x630 — WhatsApp, Facebook, LinkedIn ve X'in beklediği ölçü.
 * Yasal sayfalara da genel görsel verildi; görselsiz link paylaşımda ölü duruyor.
 */
const OG: Record<SeoKey, string> = {
  home: "/og/home.jpg",
  about: "/og/about.jpg",
  projects: "/og/projects.jpg",
  project: "/og/projects.jpg",
  services: "/og/services.jpg",
  contact: "/og/contact.jpg",
  kvkk: "/og/home.jpg",
  privacy: "/og/home.jpg",
  cookies: "/og/home.jpg",
};

export function pageMeta(locale: Locale, key: SeoKey, segment: string): Metadata {
  const s = getDict(locale).seo[key];
  const trPath = `/tr${segment}`;
  const enPath = `/en${segment}`;
  const url = `${BASE}/${locale}${segment}`;
  const image = `${BASE}${OG[key]}`;
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
      images: [{ url: image, width: 1200, height: 630, alt: s.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: s.title,
      description: s.description,
      images: [image],
    },
  };
}
