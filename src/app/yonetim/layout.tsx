import type { Metadata } from "next";
import { FONT_SINIFLARI } from "../layout";

export const metadata: Metadata = {
  title: "Loft 777 — Yönetim Paneli",
  robots: { index: false, follow: false }, // arama motorları görmesin
};

// Yönetim paneli genel sitenin [locale] bölümü dışında; kendi <html>/<body>
// belgesini burada kurar (genel sitedeki çalışan kalıbın aynısı). Böylece
// tema sağlayıcısı script'ini bağlayacak bir belge bulur, dev hatası çıkmaz.
export default function YonetimLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={FONT_SINIFLARI}>
      <body className="antialiased">
        {/* Koyu zemin body'de değil bu div'de: globals.css'teki genel
            body{background:açık} kuralı Tailwind'i ezdiği için renk buraya. */}
        <div className="min-h-screen bg-ink text-white">{children}</div>
      </body>
    </html>
  );
}
