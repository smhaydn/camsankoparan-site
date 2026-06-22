import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loft 777 — Yönetim Paneli",
  robots: { index: false, follow: false }, // arama motorları görmesin
};

export default function YonetimLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ink text-white">{children}</div>;
}
