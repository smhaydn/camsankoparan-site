import type { MetadataRoute } from "next";
import { allBlogSlugs } from "@/lib/blog";

// Site haritası — Google tüm sayfaları hızlı bulsun (TR + EN, hreflang ile)
const BASE = "https://camsankoparan.com";
const PATHS = [
  "",
  "/about",
  "/projects",
  "/projects/loft-777",
  "/services",
  "/contact",
  "/blog",
  ...allBlogSlugs().map((s) => `/blog/${s}`),
  // Yasal metinler — nadiren değişir, düşük öncelik
  "/kvkk",
  "/gizlilik",
  "/cerez-politikasi",
];
const LEGAL = new Set(["/kvkk", "/gizlilik", "/cerez-politikasi"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const p of PATHS) {
    const languages = { tr: `${BASE}/tr${p}`, en: `${BASE}/en${p}` };
    entries.push({
      url: `${BASE}/tr${p}`,
      lastModified,
      changeFrequency: LEGAL.has(p) ? "yearly" : "weekly",
      priority: LEGAL.has(p) ? 0.2 : p === "" ? 1 : 0.8,
      alternates: { languages },
    });
    entries.push({
      url: `${BASE}/en${p}`,
      lastModified,
      changeFrequency: LEGAL.has(p) ? "yearly" : "weekly",
      priority: LEGAL.has(p) ? 0.2 : p === "" ? 0.9 : 0.7,
      alternates: { languages },
    });
  }

  return entries;
}
