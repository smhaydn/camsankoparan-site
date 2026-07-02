import type { IsGirdi } from "./isprogrami-listeler";

// Tarayıcıdan gelen ham gövdeyi güvenli İş alanlarına dönüştürür.
// Bilinmeyen alanları atar, tipleri zorlar. Ekleme ve güncellemede ortak kullanılır.

const METIN_ALANLAR = [
  "ana_kalemi",
  "imalat",
  "blok",
  "kat",
  "aciklama1",
  "aciklama2",
  "birim",
  "durum",
  "ekip",
  "bagli_is_1",
  "bagli_is_2",
  "bagli_is_3",
  "oncelik",
] as const;

const SAYI_ALANLAR = ["metraj", "gerc_yuzde", "gun", "sira"] as const;
const TARIH_ALANLAR = ["baslangic", "bitis"] as const;

function metin(v: unknown, max = 300): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}

function sayi(v: unknown): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function tarih(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  // YYYY-MM-DD bekliyoruz; geçersizse null
  const m = v.trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(m) ? m : null;
}

// `sadeceVerilen=true` ise yalnızca gövdede bulunan anahtarları döndürür (PATCH için).
export function girdiTemizle(
  body: Record<string, unknown>,
  sadeceVerilen = false,
): Partial<IsGirdi> {
  const out: Record<string, unknown> = {};
  const ekle = (alan: string, deger: unknown) => {
    if (!sadeceVerilen || alan in body) out[alan] = deger;
  };
  for (const alan of METIN_ALANLAR) ekle(alan, metin(body[alan]));
  for (const alan of SAYI_ALANLAR) ekle(alan, sayi(body[alan]));
  for (const alan of TARIH_ALANLAR) ekle(alan, tarih(body[alan]));
  // Yüzde 0-100 aralığına sıkıştır
  if ("gerc_yuzde" in out && typeof out.gerc_yuzde === "number") {
    out.gerc_yuzde = Math.max(0, Math.min(100, out.gerc_yuzde));
  }
  return out as Partial<IsGirdi>;
}
