// Marka ikonlarını üretir: favicon (icon.png), apple-icon.png, opengraph-image.png
// C|K monogramı (marka logosuna uygun) + Loft 777 sosyal görseli.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const appDir = path.resolve("src/app");
const INK = "#14110e";
const CREAM = "#f1eadf";
const BRONZE = "#c08a4d";

// C|K monogram ikonu (kare). bg: arka plan, rounded: köşe yuvarlama
function iconSvg(bg = INK, rounded = true) {
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="${rounded ? 104 : 0}" fill="${bg}"/>
  <g fill="none" stroke="${CREAM}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 246 190 A 66 66 0 1 0 246 322"/>
    <path d="M 302 186 L 302 326"/>
    <path d="M 302 256 L 368 186"/>
    <path d="M 302 256 L 368 326"/>
  </g>
  <line x1="256" y1="180" x2="256" y2="332" stroke="${BRONZE}" stroke-width="12" stroke-linecap="round"/>
</svg>`;
}

// OG (sosyal paylaşım) görseli — render üzerine koyu degrade + metin
function ogOverlaySvg() {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14110e" stop-opacity="0.45"/>
      <stop offset="0.55" stop-color="#14110e" stop-opacity="0.65"/>
      <stop offset="1" stop-color="#14110e" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="80" y="300" font-family="Arial, sans-serif" font-size="34" letter-spacing="8" fill="${BRONZE}">CAMSAN KOPARAN GROUP</text>
  <text x="76" y="410" font-family="Arial, sans-serif" font-size="110" font-weight="700" fill="#ffffff">LOFT 777</text>
  <text x="80" y="475" font-family="Arial, sans-serif" font-size="34" fill="#f1eadf">İzmir Gaziemir'de yeni nesil karma yaşam</text>
  <text x="80" y="540" font-family="Arial, sans-serif" font-size="26" fill="#e7c79b">238 Daire · 1+1 · Çarşılı · Havuzlu</text>
</svg>`;
}

// 1) Favicon (icon.png) — Next App Router otomatik <link> üretir
await sharp(Buffer.from(iconSvg(INK, true))).resize(512, 512).png().toFile(path.join(appDir, "icon.png"));

// 2) Apple touch icon (180x180, köşesiz dolu kare iOS için)
await sharp(Buffer.from(iconSvg(INK, false))).resize(180, 180).png().toFile(path.join(appDir, "apple-icon.png"));

// 3) OG görseli (1200x630) — hero render + degrade + metin
const render = path.resolve("public/renders/dis-cephe-gece-1.jpg");
const og = await sharp(render)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .composite([{ input: Buffer.from(ogOverlaySvg()) }])
  .png()
  .toFile(path.join(appDir, "opengraph-image.png"));

console.log("Marka ikonları üretildi: icon.png, apple-icon.png, opengraph-image.png");
console.log(og);
