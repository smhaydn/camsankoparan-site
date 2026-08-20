import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthed } from "@/lib/admin-auth";
import { saveContent } from "@/lib/supabase-admin";

// Site içeriğini kaydet (giriş korumalı)
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "geçersiz" }, { status: 400 });
  }
  const tr = (body as Record<string, unknown>).tr ?? {};
  const en = (body as Record<string, unknown>).en ?? {};
  try {
    await saveContent(tr, en);
    // 20 Agu 2026: icerik artik onbellekten okunuyor (bkz. lib/content.ts).
    // Kayittan sonra etiketi tazelemezsek panel degisikligi siteye YANSIMAZ —
    // eski davranisin (no-store) korunmasi gereken tek yani buydu.
    // Next 16 imzasi: revalidateTag(tag, profile). "max" = her onbellek
    // profilini gecersiz kilar, yani kayit aninda tazelenir.
    revalidateTag("site-content", "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "kaydedilemedi" }, { status: 500 });
  }
}
