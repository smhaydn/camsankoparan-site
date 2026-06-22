import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/site/theme-provider";
import { getSettings } from "@/lib/supabase-admin";

// Başlıklar için geometrik, logoyla uyumlu yazı tipi
const sora = Sora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sora",
  weight: ["200", "300", "400", "600", "700"],
  display: "swap",
});

// Gövde metni için modern, okunaklı yazı tipi
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#14110e",
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
    alternates: {
      canonical: "/tr",
      languages: { tr: "/tr", en: "/en" },
    },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable}`}
    >
      <body className="bg-surface text-base antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
