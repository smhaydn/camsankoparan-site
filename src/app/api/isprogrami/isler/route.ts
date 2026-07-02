import { NextResponse } from "next/server";
import { mevcutKullanici } from "@/lib/isprogrami-auth";
import { isleriGetir, isEkle } from "@/lib/isprogrami-db";
import { girdiTemizle } from "@/lib/isprogrami-girdi";

// Tüm işleri listele (giriş korumalı)
export async function GET() {
  const k = await mevcutKullanici();
  if (!k) return NextResponse.json({ ok: false, error: "yetkisiz" }, { status: 401 });
  try {
    const isler = await isleriGetir();
    return NextResponse.json({ ok: true, isler });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "hata";
    const code = msg === "SERVICE_KEY_MISSING" ? 503 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}

// Yeni iş ekle (giriş korumalı)
export async function POST(req: Request) {
  const k = await mevcutKullanici();
  if (!k) return NextResponse.json({ ok: false, error: "yetkisiz" }, { status: 401 });

  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const girdi = girdiTemizle(body);
  try {
    const yeni = await isEkle(girdi, k.ad);
    return NextResponse.json({ ok: true, is: yeni });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "hata";
    const code = msg === "SERVICE_KEY_MISSING" ? 503 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}
