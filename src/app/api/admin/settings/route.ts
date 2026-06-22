import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { saveSettings, type AppSettings } from "@/lib/supabase-admin";

// Reklam & Takip ayarlarını kaydet (giriş korumalı)
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const str = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 300) : "");
  const data: AppSettings = {
    meta_pixel_id: str(body.meta_pixel_id),
    meta_capi_token: str(body.meta_capi_token),
    ga4_id: str(body.ga4_id),
    google_ads_id: str(body.google_ads_id),
    google_ads_label: str(body.google_ads_label),
    google_site_verification: str(body.google_site_verification),
  };

  try {
    await saveSettings(data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "hata";
    const code = msg === "SERVICE_KEY_MISSING" ? 503 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}
