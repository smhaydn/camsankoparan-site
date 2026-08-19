import type { MetadataRoute } from "next";

// Arama motorlarına tarama talimatı (yönetim paneli ve API'leri gizle).
//
// GEO NOTU: Yapay zekâ arama motorları da açıkça karşılanıyor. "*" kuralı
// zaten izin veriyordu, ama Google-Extended özel bir durum: Google, AI
// Overviews ve Gemini için ayrı bu ajanı dinliyor ve engellenirse proje
// yapay zekâ yanıtlarında kaynak gösterilmiyor. Açıkça izin veriyoruz.
const PRIVATE = ["/yonetim", "/isprogrami", "/demo", "/api/"];

const AI_AGENTS = [
  "Google-Extended", // Google AI Overviews / Gemini
  "GPTBot", // ChatGPT
  "OAI-SearchBot", // ChatGPT arama
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Applebot-Extended", // Apple Intelligence
  "CCBot", // Common Crawl — birçok modelin veri kaynağı
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: "https://camsankoparan.com/sitemap.xml",
    host: "https://camsankoparan.com",
  };
}
