import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { getLeads } from "@/lib/supabase-admin";

// Talep listesi (giriş korumalı)
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "yetkisiz" }, { status: 401 });
  }
  try {
    const leads = await getLeads();
    return NextResponse.json({ ok: true, leads });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "hata";
    const code = msg === "SERVICE_KEY_MISSING" ? 503 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}
