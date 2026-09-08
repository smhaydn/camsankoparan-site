import type { Metadata } from "next";
import { FONT_SINIFLARI } from "../layout";

export const metadata: Metadata = {
  title: "İş Programı — Camsan Koparan",
  robots: { index: false, follow: false }, // arama motorları görmesin
};

// Genel sitenin [locale] bölümü dışında; kendi <html>/<body> belgesini kurar.
export default function IsProgramiLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={FONT_SINIFLARI}>
      <body className="antialiased">
        <div className="min-h-screen bg-white text-ink">{children}</div>
      </body>
    </html>
  );
}
