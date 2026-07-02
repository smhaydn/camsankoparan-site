import type { Is, IsGirdi } from "./isprogrami-listeler";
import { isOzeti } from "./isprogrami-listeler";

// İş Programı veri erişimi — Supabase "service_role" anahtarıyla (RLS'i aşar).
// SADECE sunucu tarafında, giriş korumalı API'lerden çağrılır. Tarayıcıya asla sızmaz.

const URL = process.env.SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const T_ISLER = "isprogrami_isler";
const T_LOG = "isprogrami_log";
const T_KULLANICI = "isprogrami_kullanicilar";

export function dbHazir() {
  return Boolean(URL && SERVICE && SERVICE !== "BURAYA_SERVICE_ROLE_ANAHTARI");
}

function h() {
  return {
    apikey: SERVICE as string,
    Authorization: `Bearer ${SERVICE}`,
    "Content-Type": "application/json",
  };
}

function guard() {
  if (!dbHazir()) throw new Error("SERVICE_KEY_MISSING");
}

// ───────────── Kullanıcılar (giriş) ─────────────

export type DbKullanici = { kullanici_adi: string; ad: string; sifre: string; aktif: boolean };

// Kullanıcı adı + şifre doğruysa kullanıcıyı döndürür, değilse null
export async function kullaniciDogrula(
  kullaniciAdi: string,
  sifre: string,
): Promise<{ u: string; ad: string } | null> {
  guard();
  const r = await fetch(
    `${URL}/rest/v1/${T_KULLANICI}?kullanici_adi=eq.${encodeURIComponent(kullaniciAdi)}&aktif=eq.true&select=kullanici_adi,ad,sifre`,
    { headers: h(), cache: "no-store" },
  );
  if (!r.ok) throw new Error("kullanici_sorgu_" + r.status);
  const rows = (await r.json()) as DbKullanici[];
  const k = rows[0];
  if (!k || k.sifre !== sifre) return null;
  return { u: k.kullanici_adi, ad: k.ad };
}

// ───────────── İşler ─────────────

export async function isleriGetir(): Promise<Is[]> {
  guard();
  const r = await fetch(
    `${URL}/rest/v1/${T_ISLER}?select=*&order=sira.asc,baslangic.asc`,
    { headers: h(), cache: "no-store" },
  );
  if (!r.ok) throw new Error("isler_getir_" + r.status);
  return r.json();
}

async function tekIs(id: string): Promise<Is | null> {
  const r = await fetch(`${URL}/rest/v1/${T_ISLER}?id=eq.${id}&select=*`, {
    headers: h(),
    cache: "no-store",
  });
  if (!r.ok) return null;
  const rows = (await r.json()) as Is[];
  return rows[0] ?? null;
}

// Yeni iş ekler ve log kaydı düşer
export async function isEkle(
  girdi: Partial<IsGirdi>,
  kullanici: string,
): Promise<Is> {
  guard();
  const body = {
    ...girdi,
    // sira NOT NULL: verilmezse sona ekle (0 = en üst yerine güvenli varsayılan)
    sira: girdi.sira ?? 0,
    created_by: kullanici,
    updated_by: kullanici,
  };
  const r = await fetch(`${URL}/rest/v1/${T_ISLER}`, {
    method: "POST",
    headers: { ...h(), Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("is_ekle_" + r.status);
  const yeni = ((await r.json()) as Is[])[0];
  await logYaz(kullanici, "ekle", yeni.id, isOzeti(yeni), null);
  return yeni;
}

// İşi günceller; sadece değişen alanları loglar
export async function isGuncelle(
  id: string,
  patch: Partial<IsGirdi>,
  kullanici: string,
): Promise<void> {
  guard();
  const eski = await tekIs(id);
  const govde = { ...patch, updated_by: kullanici, updated_at: new Date().toISOString() };
  const r = await fetch(`${URL}/rest/v1/${T_ISLER}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...h(), Prefer: "return=minimal" },
    body: JSON.stringify(govde),
  });
  if (!r.ok) throw new Error("is_guncelle_" + r.status);

  // Değişiklikleri çıkar (eski → yeni)
  const degisiklikler: Record<string, { eski: unknown; yeni: unknown }> = {};
  if (eski) {
    for (const [alan, yeniDeger] of Object.entries(patch)) {
      const eskiDeger = (eski as Record<string, unknown>)[alan];
      if (eskiDeger !== yeniDeger) degisiklikler[alan] = { eski: eskiDeger, yeni: yeniDeger };
    }
  }
  await logYaz(
    kullanici,
    "güncelle",
    id,
    isOzeti(eski ?? {}),
    Object.keys(degisiklikler).length ? degisiklikler : null,
  );
}

// İşi siler ve log kaydı düşer
export async function isSil(id: string, kullanici: string): Promise<void> {
  guard();
  const eski = await tekIs(id);
  const r = await fetch(`${URL}/rest/v1/${T_ISLER}?id=eq.${id}`, {
    method: "DELETE",
    headers: { ...h(), Prefer: "return=minimal" },
  });
  if (!r.ok) throw new Error("is_sil_" + r.status);
  await logYaz(kullanici, "sil", id, isOzeti(eski ?? {}), null);
}

// ───────────── Değişiklik geçmişi (log) ─────────────

export type LogKaydi = {
  id: number;
  at: string;
  kullanici: string | null;
  islem: string;
  is_id: string | null;
  is_ozet: string | null;
  degisiklikler: Record<string, { eski: unknown; yeni: unknown }> | null;
};

async function logYaz(
  kullanici: string,
  islem: string,
  isId: string | null,
  ozet: string,
  degisiklikler: Record<string, { eski: unknown; yeni: unknown }> | null,
): Promise<void> {
  // Log yazımı ana işlemi bloklamasın — hata olsa da fırlatma
  await fetch(`${URL}/rest/v1/${T_LOG}`, {
    method: "POST",
    headers: { ...h(), Prefer: "return=minimal" },
    body: JSON.stringify({
      kullanici,
      islem,
      is_id: isId,
      is_ozet: ozet,
      degisiklikler,
    }),
  }).catch(() => {});
}

export async function logGetir(limit = 200): Promise<LogKaydi[]> {
  guard();
  const r = await fetch(
    `${URL}/rest/v1/${T_LOG}?select=*&order=at.desc&limit=${limit}`,
    { headers: h(), cache: "no-store" },
  );
  if (!r.ok) throw new Error("log_getir_" + r.status);
  return r.json();
}
