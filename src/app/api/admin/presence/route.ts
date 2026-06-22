import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { getOnlineCount } from "@/lib/supabase-admin";

// Şu an sitede aktif ziyaretçi sayısı (giriş korumalı)
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const count = await getOnlineCount();
  return NextResponse.json({ ok: true, count });
}
