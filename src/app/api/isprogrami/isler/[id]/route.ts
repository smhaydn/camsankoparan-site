import { NextResponse } from "next/server";
import { mevcutKullanici } from "@/lib/isprogrami-auth";
import { isGuncelle, isSil } from "@/lib/isprogrami-db";
import { girdiTemizle } from "@/lib/isprogrami-girdi";

// İşi güncelle (giriş korumalı) — sadece gönderilen alanlar değişir
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const k = await mevcutKullanici();
  if (!k) return NextResponse.json({ ok: false, error: "yetkisiz" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const patch = girdiTemizle(body, true);
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, error: "boş güncelleme" }, { status: 400 });
  }
  try {
    await isGuncelle(id, patch, k.ad);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "hata";
    const code = msg === "SERVICE_KEY_MISSING" ? 503 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}

// İşi sil (giriş korumalı)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const k = await mevcutKullanici();
  if (!k) return NextResponse.json({ ok: false, error: "yetkisiz" }, { status: 401 });

  const { id } = await params;
  try {
    await isSil(id, k.ad);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "hata";
    const code = msg === "SERVICE_KEY_MISSING" ? 503 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}
