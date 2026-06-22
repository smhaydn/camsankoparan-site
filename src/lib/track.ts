// Form başarıyla gönderilince çağrılır — Meta + Google'a "Lead" olayı bildirir.
// Takip kodları yüklü değilse sessizce hiçbir şey yapmaz.
export function trackLead() {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as {
      fbq?: (...a: unknown[]) => void;
      gtag?: (...a: unknown[]) => void;
      __LOFT_TRACK?: { adsId?: string; label?: string };
    };
    w.fbq?.("track", "Lead");

    const t = w.__LOFT_TRACK;
    if (t?.adsId && t?.label) {
      w.gtag?.("event", "conversion", { send_to: `${t.adsId}/${t.label}` });
    } else {
      w.gtag?.("event", "generate_lead");
    }
  } catch {
    // takip hatası formu etkilemesin
  }
}
