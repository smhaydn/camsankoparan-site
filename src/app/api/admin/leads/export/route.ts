import { isAuthed } from "@/lib/admin-auth";
import { getLeads } from "@/lib/supabase-admin";
import { statusMeta, sourceLabel, unitLabel } from "@/lib/leads";

// Talepleri CSV (Excel) olarak indir
function cell(v: string) {
  return `"${(v ?? "").replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAuthed())) {
    return new Response("yetkisiz", { status: 401 });
  }

  let leads;
  try {
    leads = await getLeads();
  } catch {
    return new Response("liste alınamadı", { status: 500 });
  }

  const head = [
    "Tarih",
    "Ad Soyad",
    "Telefon",
    "İlgilenilen Daire",
    "Mesaj",
    "Kaynak",
    "Durum",
    "Not",
  ];
  const rows = leads.map((l) =>
    [
      new Date(l.created_at).toLocaleString("tr-TR"),
      l.name,
      l.phone,
      l.unit_interest ? unitLabel(l.unit_interest) : "",
      l.message ?? "",
      sourceLabel(l.source),
      statusMeta(l.status).label,
      l.notes ?? "",
    ]
      .map(cell)
      .join(","),
  );

  // Başına BOM ekliyoruz ki Excel Türkçe karakterleri doğru göstersin
  const csv = "﻿" + [head.map(cell).join(","), ...rows].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="loft777-talepler.csv"`,
    },
  });
}
