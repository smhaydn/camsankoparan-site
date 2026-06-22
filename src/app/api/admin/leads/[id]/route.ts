import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { updateLead, deleteLead } from "@/lib/supabase-admin";

// Talep güncelle (durum / not)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);

  const patch: { status?: string; notes?: string } = {};
  if (typeof body.status === "string") patch.status = body.status;
  if (typeof body.notes === "string") patch.notes = body.notes;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, error: "boş güncelleme" }, { status: 400 });
  }

  try {
    await updateLead(id, patch);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "güncellenemedi" }, { status: 500 });
  }
}

// Talep sil
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteLead(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "silinemedi" }, { status: 500 });
  }
}
