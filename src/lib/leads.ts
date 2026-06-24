// Lead (talep) tipi ve durum etiketleri — panel ve dışa aktarım ortak kullanır

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  message: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  unit_interest: string | null;
};

// İlgilenilen daire tipi etiketi (CRM/Excel için Türkçe)
export function unitLabel(value: string | null) {
  switch (value) {
    case "1+1-a":
      return "1+1 A Tipi";
    case "1+1-b":
      return "1+1 B Tipi";
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
      return "Sizi Arayalım";
    case "contact-page":
      return "İletişim Sayfası";
    case "meta-lead":
      return "Meta Reklam (Lead)";
    default:
      return source || "—";
  }
}

// Telefonu WhatsApp linkine çevirir (Türkiye): 0555... → 90555...
export function waLink(phone: string) {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) d = "90" + d.slice(1);
  else if (!d.startsWith("90")) d = "90" + d;
  return `https://wa.me/${d}`;
}
