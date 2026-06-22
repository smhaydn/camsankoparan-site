import { NextResponse } from "next/server";
import { recordPing } from "@/lib/supabase-admin";

// Ziyaretçi "buradayım" sinyali — site tarafından periyodik çağrılır (herkese açık)
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const sid = typeof body.sid === "string" ? body.sid.slice(0, 64) : "";
  if (!sid) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await recordPing(sid);
  return NextResponse.json({ ok: true });
}
