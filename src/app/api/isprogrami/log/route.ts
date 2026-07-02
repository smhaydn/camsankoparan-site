import { NextResponse } from "next/server";
import { mevcutKullanici } from "@/lib/isprogrami-auth";
import { logGetir } from "@/lib/isprogrami-db";

// Değişiklik geçmişi (giriş korumalı)
export async function GET() {
  const k = await mevcutKullanici();
  if (!k) return NextResponse.json({ ok: false, error: "yetkisiz" }, { status: 401 });
  try {
    const log = await logGetir();
    return NextResponse.json({ ok: true, log });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "hata";
    const code = msg === "SERVICE_KEY_MISSING" ? 503 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}
