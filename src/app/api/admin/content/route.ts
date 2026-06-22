import { NextResponse } from "next/server";
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
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "kaydedilemedi" }, { status: 500 });
  }
}
