import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { getLeads, createLead } from "@/lib/supabase-admin";

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

// Manuel talep ekle (giriş korumalı)
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "yetkisiz" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "ad ve telefon zorunlu" }, { status: 400 });
  }
  const str = (v: unknown, n: number) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null;
  try {
    await createLead({
      name: name.slice(0, 200),
      phone: phone.slice(0, 50),
      email: str(body.email, 200),
      message: str(body.message, 2000),
      unit_interest: str(body.unit_interest, 30),
      budget: str(body.budget, 30),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "hata";
    const code = msg === "SERVICE_KEY_MISSING" ? 503 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}
