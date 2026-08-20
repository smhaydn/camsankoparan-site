import type { Metadata, Viewport } from "next";
import { Archivo, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/site/theme-provider";
import { getSettings } from "@/lib/supabase-admin";

// TÜM FONTLAR TÜRKÇE GLİF TESTİNDEN GEÇTİ (ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü)
// latin + latin-ext subset'leri şart — Türkçe karakterler ikisine bölünmüş durumda.

// Başlık: Archivo'nun geniş (expanded) kesimi — mimari, kendinden emin
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-display-archivo",
  display: "swap",
});

// Gövde: rafine geometrik sans
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body-jakarta",
  display: "swap",
});

// Veri/etiket: m², kat, tarih — mimari çizim hissi
const jet = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-mono-jet",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#f4f1ec",
};

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const base = "https://camsankoparan.com";
  return {
    metadataBase: new URL(base),
    title: {
      default: "Loft 777 — Gaziemir'de Yeni Nesil Yaşam | Camsan Koparan Group",
      template: "%s | Loft 777",
    },
    description:
      "İzmir Gaziemir'de çarşısı, yüzme havuzu ve modern 1+1 daireleriyle yeni nesil karma yaşam projesi. Loft 777 — Camsan Koparan Group güvencesiyle.",
    // NOT: canonical/hreflang artık her sayfanın kendi generateMetadata'sında (lib/seo.ts).
    openGraph: {
      type: "website",
      siteName: "Loft 777",
      locale: "tr_TR",
      url: base,
    },
    // Google Search Console doğrulama kodu (panelden girilince)
    ...(s.google_site_verification
      ? { verification: { google: s.google_site_verification } }
      : {}),
  };
}

// 20 Agu 2026 — SITENIN TAMAMINI DINAMIK YAPAN SATIR BURADAYDI.
// Eskiden burada `const lang = (await headers()).get("x-locale")` vardi.
// `headers()` bir DINAMIK API'dir: kok layout HER sayfada calistigi icin
// Next.js tum siteyi zorunlu olarak istek aninda uretiyordu. Sayfalara ve
// [locale] layout'una revalidate eklemek ISE YARAMADI, sebep buydu.
// Olculdu (canli): her istekte x-vercel-cache MISS; site Vercel'in ucretsiz
// islemci kotasinin %14'unu yiyordu ve kota asilirsa TUM projeler
// duraklatiliyor (pixra.co dahil, ayni hesapta).
//
// Dil bilgisi ARTIK ROTADAN geliyor: <html lang> etiketi [locale]/layout.tsx'e
// tasindi, orada `params.locale` zaten var. Yani istek basligi okumaya gerek
// kalmadi. lang degeri onceki gibi dogru ("/en" -> "en", "/tr" -> "tr");
// canlida dogrulanmisti, davranis korunuyor.
//
// Bu dosya artik yalnizca font degiskenlerini ve tema saglayicisini kurar;
// <html>/<body> alt layout'ta.
export const FONT_SINIFLARI = `${archivo.variable} ${jakarta.variable} ${jet.variable}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
