import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İş Programı — Camsan Koparan",
  robots: { index: false, follow: false }, // arama motorları görmesin
};

export default function IsProgramiLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white text-ink">{children}</div>;
}
