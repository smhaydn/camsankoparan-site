import type { Lead } from "./leads";

// Yönetim tarafı veri erişimi — Supabase "service_role" anahtarıyla (RLS'i aşar).
// SADECE sunucu tarafında, giriş korumalı API'lerden çağrılır. Tarayıcıya asla sızmaz.

const URL = process.env.SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

function ready() {
  return Boolean(URL && SERVICE && SERVICE !== "BURAYA_SERVICE_ROLE_ANAHTARI");
}

function authHeaders() {
  return {
    apikey: SERVICE as string,
    Authorization: `Bearer ${SERVICE}`,
    "Content-Type": "application/json",
  };
}

const TABLE = "loft777_leads";

// Tüm talepleri en yeni üstte getirir
export async function getLeads(): Promise<Lead[]> {
  if (!ready()) throw new Error("SERVICE_KEY_MISSING");
  const r = await fetch(
    `${URL}/rest/v1/${TABLE}?select=*&order=created_at.desc`,
    { headers: authHeaders(), cache: "no-store" },
  );
  if (!r.ok) throw new Error("leads_fetch_failed_" + r.status);
  return r.json();
}

// Bir talebin durumunu / notunu günceller
export async function updateLead(
  id: string,
  patch: Partial<Pick<Lead, "status" | "notes">>,
): Promise<void> {
  if (!ready()) throw new Error("SERVICE_KEY_MISSING");
  const r = await fetch(`${URL}/rest/v1/${TABLE}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error("update_failed_" + r.status);
}

// Panelden manuel talep ekler (telefonla gelen, fuardan tanıdık vb.)
export async function createLead(lead: {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  unit_interest?: string | null;
  budget?: string | null;
}): Promise<void> {
  if (!ready()) throw new Error("SERVICE_KEY_MISSING");
  const r = await fetch(`${URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: { ...authHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify({ ...lead, source: "manual", status: "new" }),
  });
  if (!r.ok) throw new Error("create_failed_" + r.status);
}

// Bir talebi siler
export async function deleteLead(id: string): Promise<void> {
  if (!ready()) throw new Error("SERVICE_KEY_MISSING");
  const r = await fetch(`${URL}/rest/v1/${TABLE}?id=eq.${id}`, {
    method: "DELETE",
    headers: { ...authHeaders(), Prefer: "return=minimal" },
  });
  if (!r.ok) throw new Error("delete_failed_" + r.status);
}

// Panelden düzenlenen site içeriğini kaydeder (site_content tek satırı)
export async function saveContent(tr: unknown, en: unknown): Promise<void> {
  if (!ready()) throw new Error("SERVICE_KEY_MISSING");
  const r = await fetch(`${URL}/rest/v1/site_content?id=eq.1`, {
    method: "PATCH",
    headers: { ...authHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify({ tr, en, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error("content_save_failed_" + r.status);
}

// ───────── Canlı ziyaretçi sayacı ─────────

// Bir ziyaretçi oturumunun "son görülme" zamanını günceller (upsert)
export async function recordPing(sessionId: string): Promise<void> {
  if (!ready()) return;
  await fetch(`${URL}/rest/v1/visitor_pings`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ session_id: sessionId, last_seen: new Date().toISOString() }),
  }).catch(() => {});
}

// Son `windowSec` saniyede aktif olan ziyaretçi sayısı
export async function getOnlineCount(windowSec = 45): Promise<number> {
  if (!ready()) return 0;
  const since = new Date(Date.now() - windowSec * 1000).toISOString();
  try {
    const r = await fetch(
      `${URL}/rest/v1/visitor_pings?last_seen=gte.${encodeURIComponent(since)}&select=session_id`,
      { headers: authHeaders(), cache: "no-store" },
    );
    if (!r.ok) return 0;
    const rows = await r.json();

    // Eski kayıtları temizle (10 dakikadan eski) — fire-and-forget
    const stale = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    fetch(`${URL}/rest/v1/visitor_pings?last_seen=lt.${encodeURIComponent(stale)}`, {
      method: "DELETE",
      headers: { ...authHeaders(), Prefer: "return=minimal" },
    }).catch(() => {});

    return Array.isArray(rows) ? rows.length : 0;
  } catch {
    return 0;
  }
}

// ───────── Reklam & Takip ayarları (app_settings) ─────────

export type AppSettings = {
  meta_pixel_id?: string;
  meta_capi_token?: string; // GİZLİ — tarayıcıya gönderilmez
  ga4_id?: string;
  google_ads_id?: string;
  google_ads_label?: string;
  google_site_verification?: string; // Google Search Console doğrulama kodu
};

// Ayarları okur (service_role — app_settings RLS kapalı, anon erişemez)
export async function getSettings(): Promise<AppSettings> {
  if (!ready()) return {};
  try {
    const r = await fetch(`${URL}/rest/v1/app_settings?id=eq.1&select=data`, {
      headers: authHeaders(),
      cache: "no-store",
    });
    if (!r.ok) return {};
    const rows = await r.json();
    return (Array.isArray(rows) && rows[0]?.data) || {};
  } catch {
    return {};
  }
}

// Ayarları kaydeder (upsert)
export async function saveSettings(data: AppSettings): Promise<void> {
  if (!ready()) throw new Error("SERVICE_KEY_MISSING");
  const r = await fetch(`${URL}/rest/v1/app_settings`, {
    method: "POST",
    headers: { ...authHeaders(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ id: 1, data, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error("settings_save_failed_" + r.status);
}

export function serviceKeyReady() {
  return ready();
}
