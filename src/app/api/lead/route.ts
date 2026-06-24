import { NextResponse } from "next/server";
import { sendMetaCapiLead } from "@/lib/tracking-server";
import { sendLeadNotification } from "@/lib/mail";

// "Sizi Arayalım / Fiyat Al" form taleplerini (lead) Supabase'e kaydeder.
// Tablo: public.loft777_leads (Partum projesi)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Zorunlu alanlar: ad + telefon
    if (!data?.name || !data?.phone) {
      return NextResponse.json({ ok: false, error: "eksik bilgi" }, { status: 400 });
    }

    // Gelen veriyi temizle ve makul uzunluklara kırp
    const lead = {
      name: String(data.name).trim().slice(0, 200),
      phone: String(data.phone).trim().slice(0, 50),
      email: data.email ? String(data.email).trim().slice(0, 200) : null,
      message: data.message ? String(data.message).trim().slice(0, 2000) : null,
      source: data.source ? String(data.source).trim().slice(0, 50) : "call-form",
      unit_interest: data.unit_interest
        ? String(data.unit_interest).trim().slice(0, 30)
        : null,
      budget: data.budget ? String(data.budget).trim().slice(0, 30) : null,
    };

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("[LEAD] Supabase ortam değişkenleri eksik (.env.local)");
      return NextResponse.json({ ok: false, error: "sunucu yapılandırması" }, { status: 500 });
    }

    // Supabase REST API'sine kayıt ekle (RLS: sadece insert izinli)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/loft777_leads`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(lead),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[LEAD] Supabase kayıt hatası:", res.status, detail);
      return NextResponse.json({ ok: false, error: "kayıt yapılamadı" }, { status: 502 });
    }

    // Meta CAPI'ye sunucu taraflı Lead olayı (token varsa) — kaydı bloke etmez
    await sendMetaCapiLead(lead.phone);

    // info@ adresine bildirim maili (SMTP ayarı varsa) — kaydı bloke etmez
    await sendLeadNotification(lead);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "geçersiz istek" }, { status: 400 });
  }
}
