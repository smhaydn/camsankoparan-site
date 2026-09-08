import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { getActivities, addActivity } from "@/lib/supabase-admin";

// Bir adayın görüşme geçmişini getirir (giriş korumalı)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const activities = await getActivities(id);
    return NextResponse.json({ ok: true, activities });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "hata";
    const code = msg === "SERVICE_KEY_MISSING" ? 503 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}

// Adaya yeni aktivite (arama/not/randevu) ekler (giriş korumalı)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);

  const kind = typeof body.kind === "string" ? body.kind.trim().slice(0, 20) : "note";
  const text =
    typeof body.body === "string" && body.body.trim()
      ? body.body.trim().slice(0, 2000)
      : null;

  // Not türü boş metinle eklenmesin; arama/randevu gibi olaylar metinsiz olabilir
  if (kind === "note" && !text) {
    return NextResponse.json({ ok: false, error: "not boş olamaz" }, { status: 400 });
  }

  try {
    await addActivity(id, kind, text);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "hata";
    const code = msg === "SERVICE_KEY_MISSING" ? 503 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}
