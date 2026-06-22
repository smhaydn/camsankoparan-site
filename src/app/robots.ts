import type { MetadataRoute } from "next";

// Arama motorlarına tarama talimatı (yönetim paneli ve API'leri gizle)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/yonetim", "/api/"],
    },
    sitemap: "https://camsankoparan.com/sitemap.xml",
    host: "https://camsankoparan.com",
  };
}
