import crypto from "crypto";
import { getSettings } from "./supabase-admin";

// Meta Conversions API (CAPI) — sunucu taraflı "Lead" olayı.
// Reklam blokerlerine takılmaz, eşleştirme için telefon SHA-256 ile hash'lenir.
// Token yoksa sessizce hiçbir şey yapmaz.

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export async function sendMetaCapiLead(phone: string): Promise<void> {
  try {
    const s = await getSettings();
    if (!s.meta_capi_token || !s.meta_pixel_id) return;

    const digits = (phone || "").replace(/\D/g, "");
    const norm = digits.startsWith("0")
      ? "90" + digits.slice(1)
      : digits.startsWith("90")
        ? digits
        : "90" + digits;

    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          user_data: { ph: [sha256(norm)] },
        },
      ],
    };

    await fetch(
      `https://graph.facebook.com/v21.0/${s.meta_pixel_id}/events?access_token=${encodeURIComponent(
        s.meta_capi_token,
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
  } catch {
    // CAPI hatası lead kaydını etkilemesin
  }
}
