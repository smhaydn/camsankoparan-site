import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendLeadNotification } from "@/lib/mail";

// Meta Lead Ads (Anlık Form) → site CRM webhook'u.
// Meta yeni lead'i buraya gönderir; lead detayını Graph API'den çekip Supabase'e kaydeder + info@ bildirimi atar.

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;
const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const APP_SECRET = process.env.META_APP_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const GRAPH = "https://graph.facebook.com/v21.0";

// 1) Webhook doğrulaması — Meta kurulumda çağırır (hub.challenge'i geri döndürürüz)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && VERIFY_TOKEN && token === VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("forbidden", { status: 403 });
}

// 2) Yeni lead bildirimi (Meta POST eder)
export async function POST(req: Request) {
  const raw = await req.text();

  // İmza doğrulama — sahte istekleri engeller
  if (APP_SECRET) {
    const sig = req.headers.get("x-hub-signature-256") || "";
    const expected =
      "sha256=" + crypto.createHmac("sha256", APP_SECRET).update(raw).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return new Response("invalid signature", { status: 401 });
    }
  }

  let body: { object?: string; entry?: Array<{ changes?: Array<{ field?: string; value?: { leadgen_id?: string } }> }> };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (body.object === "page" && Array.isArray(body.entry)) {
    for (const entry of body.entry) {
      for (const change of entry.changes || []) {
        if (change.field === "leadgen" && change.value?.leadgen_id) {
          await handleLead(change.value.leadgen_id).catch(() => {});
        }
      }
    }
  }

  // Meta hızlı 200 bekler
  return NextResponse.json({ ok: true });
}

async function handleLead(leadId: string): Promise<void> {
  if (!PAGE_TOKEN) return;

  // Lead detayını Meta'dan çek
  const r = await fetch(
    `${GRAPH}/${leadId}?fields=field_data,created_time&access_token=${encodeURIComponent(PAGE_TOKEN)}`,
    { cache: "no-store" },
  );
  if (!r.ok) return;
  const data = (await r.json()) as { field_data?: Array<{ name: string; values?: string[] }> };

  const f: Record<string, string> = {};
  for (const fd of data.field_data || []) {
    f[fd.name] = Array.isArray(fd.values) ? (fd.values[0] ?? "") : "";
  }

  const name =
    f.full_name ||
    [f.first_name, f.last_name].filter(Boolean).join(" ") ||
    "İsimsiz (Meta)";
  const phone = f.phone_number || "—";
  const email = f.email || null;

  // Standart alanlar dışındaki yanıtları (özel sorular) tarayıp daire tipi /
  // ödeme tercihini yakala; geri kalanları "mesaj" notuna ekle. Form alan
  // adları Meta'da serbest olduğu için anahtar kelimeyle eşleştiriyoruz.
  const STD = new Set(["full_name", "first_name", "last_name", "phone_number", "email"]);
  let unit: string | null = null;
  let budget: string | null = null;
  const extras: string[] = [];
  if (f.city) extras.push(`Şehir: ${f.city}`);

  for (const [key, val] of Object.entries(f)) {
    if (STD.has(key) || key === "city" || !val) continue;
    const k = key.toLowerCase();
    const v = val.toLowerCase();
    if (!unit && (k.includes("daire") || k.includes("unit") || k.includes("tip"))) {
      unit = v.includes("a") ? "1+1-a" : v.includes("b") ? "1+1-b" : "farketmez";
    } else if (
      !budget &&
      (k.includes("ödeme") || k.includes("odeme") || k.includes("payment") || k.includes("bütçe") || k.includes("butce") || k.includes("budget"))
    ) {
      budget = v.includes("peş") || v.includes("pes") || v.includes("cash")
        ? "pesin"
        : v.includes("kredi") || v.includes("loan")
          ? "kredi"
          : v.includes("taksit") || v.includes("senet") || v.includes("install")
            ? "taksit"
            : "farketmez";
    } else {
      extras.push(`${key}: ${val}`);
    }
  }

  const lead = {
    name: name.slice(0, 200),
    phone: phone.slice(0, 50),
    email: email ? email.slice(0, 200) : null,
    message: extras.join(" · ") || null,
    source: "meta-lead",
    unit_interest: unit,
    budget,
  };

  // Supabase CRM'e kaydet (RLS: anon insert izinli)
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    await fetch(`${SUPABASE_URL}/rest/v1/loft777_leads`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(lead),
    }).catch(() => {});
  }

  // info@ bildirim maili
  await sendLeadNotification(lead).catch(() => {});
}
