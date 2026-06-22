import type { MetadataRoute } from "next";

// Mobil "ana ekrana ekle" (PWA) tanımı + ikonlar
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Loft 777 — Camsan Koparan Group",
    short_name: "Loft 777",
    description: "İzmir Gaziemir'de çarşısı, havuzu ve modern 1+1 daireleriyle yeni nesil yaşam.",
    start_url: "/",
    display: "standalone",
    background_color: "#14110e",
    theme_color: "#14110e",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
