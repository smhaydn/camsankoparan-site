import { getDict, type Dict } from "./dict";
import type { Locale } from "./i18n";

// Panelden düzenlenen içerik (site_content tablosu) ile kod içeriğini birleştirir.
// Kod = varsayılan/yedek; panel değeri varsa onun üstüne biner.

const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;

export type Overrides = {
  tr?: Record<string, unknown>;
  en?: Record<string, unknown>;
};

// site_content tek satırını okur (anon, herkese açık okuma)
export async function getOverrides(): Promise<Overrides> {
  if (!URL || !ANON) return {};
  try {
    const r = await fetch(`${URL}/rest/v1/site_content?id=eq.1&select=tr,en`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
      cache: "no-store", // panelde değişince anında yansısın
    });
    if (!r.ok) return {};
    const rows = await r.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    return { tr: row?.tr ?? {}, en: row?.en ?? {} };
  } catch {
    return {};
  }
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Yalnızca dolu (boş olmayan) override değerlerini tabanın üstüne bindirir
function deepMerge<T>(base: T, override: unknown): T {
  if (!isObj(override)) return base;
  if (!isObj(base)) return (override as T) ?? base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(override)) {
    if (v === undefined || v === null || v === "") continue; // boşsa kod değerini koru
    const bv = (base as Record<string, unknown>)[k];
    if (isObj(v) && isObj(bv)) out[k] = deepMerge(bv, v);
    else out[k] = v;
  }
  return out as T;
}

// Site bileşenlerinin kullanacağı birleşik içerik
export async function getContent(locale: Locale): Promise<Dict> {
  const base = getDict(locale);
  const ov = await getOverrides();
  const o = locale === "en" ? ov.en : ov.tr;
  return deepMerge(base, o);
}
