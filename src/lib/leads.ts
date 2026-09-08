// Lead (talep) tipi ve durum etiketleri — panel ve dışa aktarım ortak kullanır

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  unit_interest: string | null;
  budget: string | null;
  follow_up_at: string | null; // sonraki arama/takip tarihi (boşsa takip yok)
};

// Bir adayın görüşme geçmişindeki tek kayıt (arama, not, randevu…)
export type Activity = {
  id: string;
  lead_id: string;
  created_at: string;
  kind: string;
  body: string | null;
};

// Aktivite türleri — detay ekranında buton olarak çıkar
export const ACTIVITY_KINDS = [
  { value: "call", label: "Arama", emoji: "📞" },
  { value: "whatsapp", label: "WhatsApp", emoji: "💬" },
  { value: "appointment", label: "Randevu", emoji: "📅" },
  { value: "note", label: "Not", emoji: "📝" },
] as const;

export function activityMeta(value: string) {
  return (
    ACTIVITY_KINDS.find((k) => k.value === value) ??
    // status/followup gibi otomatik kayıtlar için nötr etiket
    { value, label: value, emoji: "•" }
  );
}

// Takip tarihi bugünden geçmiş/bugün mü? (panelde "aranacak" uyarısı için)
export function isFollowUpDue(followUpAt: string | null): boolean {
  if (!followUpAt) return false;
  const d = new Date(followUpAt);
  if (Number.isNaN(d.getTime())) return false;
  // Günün sonuna kadar olan takipler "bugün aranacak" sayılır
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return d.getTime() <= endOfToday.getTime();
}

// İlgilenilen daire tipi etiketi (CRM/Excel için Türkçe)
export function unitLabel(value: string | null) {
  switch (value) {
    case "1+1-a":
      return "1+1 Loft";
    case "1+1-b":
      return "1+1 Dubleks";
    case "farketmez":
      return "Farketmez";
    default:
      return value || "—";
  }
}

// Ödeme tercihi etiketi (CRM/Excel için Türkçe)
export function budgetLabel(value: string | null) {
  switch (value) {
    case "pesin":
      return "Peşin";
    case "kredi":
      return "Banka Kredisi";
    case "taksit":
      return "Taksit / Senet";
    case "farketmez":
      return "Farketmez";
    default:
      return value || "—";
  }
}

// Satış hattı durumları: 🆕 Yeni → 📞 Arandı → 🔥 İlgileniyor → 📅 Randevu → ✅ Satış / ❌ Olumsuz
export const LEAD_STATUSES = [
  { value: "new", label: "Yeni", emoji: "🆕", color: "#3b82f6" },
  { value: "called", label: "Arandı", emoji: "📞", color: "#a855f7" },
  { value: "interested", label: "İlgileniyor", emoji: "🔥", color: "#f97316" },
  { value: "appointment", label: "Randevu", emoji: "📅", color: "#eab308" },
  { value: "won", label: "Satış", emoji: "✅", color: "#22c55e" },
  { value: "rejected", label: "Olumsuz", emoji: "❌", color: "#ef4444" },
] as const;

export function statusMeta(value: string) {
  return (
    LEAD_STATUSES.find((s) => s.value === value) ?? {
      value,
      label: value,
      emoji: "•",
      color: "#9ca3af",
    }
  );
}

// Kaynak etiketleri (hangi formdan geldi)
export function sourceLabel(source: string | null) {
  switch (source) {
    case "call-form":
      return "Web · Sizi Arayalım";
    case "contact-page":
      return "Web · İletişim Sayfası";
    case "meta-lead":
      return "Instagram / Meta Reklam";
    case "manual":
      return "Manuel Giriş";
    default:
      return source || "—";
  }
}

// Kaynak grupları — panelde filtreleme için (Web / Instagram-Meta / Manuel)
export const SOURCE_GROUPS = [
  { value: "web", label: "Web Sitesi", emoji: "🌐", match: ["call-form", "contact-page"] },
  { value: "meta", label: "Instagram / Meta", emoji: "📷", match: ["meta-lead"] },
  { value: "manual", label: "Manuel", emoji: "✍️", match: ["manual"] },
] as const;

export function sourceGroup(source: string | null): "web" | "meta" | "manual" | "other" {
  const s = source ?? "";
  const g = SOURCE_GROUPS.find((grp) => (grp.match as readonly string[]).includes(s));
  return g ? (g.value as "web" | "meta" | "manual") : "other";
}

// Telefonu WhatsApp linkine çevirir (Türkiye): 0555... → 90555...
export function waLink(phone: string) {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) d = "90" + d.slice(1);
  else if (!d.startsWith("90")) d = "90" + d;
  return `https://wa.me/${d}`;
}
