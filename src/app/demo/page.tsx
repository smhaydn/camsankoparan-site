import type { Metadata } from "next";
import Scrub from "./scrub";

// Geçici sinematik gezinme demosu — Google'a kapalı (noindex).
export const metadata: Metadata = {
  title: "Loft 777 — Sinematik Gezinme (Demo)",
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return <Scrub />;
}
