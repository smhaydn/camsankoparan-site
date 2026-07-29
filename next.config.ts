import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Modern formatlar — sharp ile sunucuda otomatik AVIF/WebP dönüşümü.
    // JPG render'lar (554 KB'a kadar) %60-70 küçülerek servis edilir.
    formats: ["image/avif", "image/webp"],
    // Yerel görseller responsive srcset için bu genişliklerde üretilir.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 yıl — render'lar değişmez
  },
};

export default nextConfig;
