// Render görsellerini web için optimize eder.
// Orijinalleri public/renders/_orijinal/ altına yedekler, sonra YERİNDE küçültür
// (aynı dosya adı → kod referansları değişmez). Tekrar çalıştırılabilir (hep yedekten işler).
import { readdir, readFile, writeFile, mkdir, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("public/renders");
const backup = path.join(dir, "_orijinal");
if (!existsSync(backup)) await mkdir(backup, { recursive: true });

const files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f));
let totalBefore = 0;
let totalAfter = 0;

for (const f of files) {
  const src = path.join(dir, f);
  const bak = path.join(backup, f);
  if (!existsSync(bak)) await copyFile(src, bak); // ilk seferde yedekle
  const input = await readFile(bak); // her zaman orijinalden işle (kalite kaybı birikmez)
  const before = (await stat(src)).size;
  const out = await sharp(input)
    .resize({ width: 1920, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();
  await writeFile(src, out);
  totalBefore += before;
  totalAfter += out.length;
  console.log(`${f}: ${Math.round(before / 1024)}KB -> ${Math.round(out.length / 1024)}KB`);
}

console.log(
  `\nTOPLAM: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB`,
);
