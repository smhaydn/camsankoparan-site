/**
 * Çerez onayı — KVKK / açık rıza.
 *
 * KURAL: Analitik ve pazarlama kodları, ziyaretçi ONAY VERMEDEN yüklenmez.
 * Zorunlu çerezler (oturum) onaya tabi değildir; onlar zaten buradan geçmez.
 *
 * Saklama: localStorage. Sunucuya gitmesi gerekmiyor, cookie olarak tutup
 * her istekte taşımanın anlamı yok — karar tamamen tarayıcı tarafında uygulanıyor.
 */

export type Consent = {
  analytics: boolean;
  marketing: boolean;
  /** Kararın alındığı an — metin güncellenirse rızayı tazelemek için */
  at: string;
  /** Onay metni sürümü; artırılırsa herkese yeniden sorulur */
  v: number;
};

export const CONSENT_VERSION = 1;
const KEY = "loft777_consent";

/** Onay değiştiğinde tetiklenir — takip bileşeni bunu dinler */
export const CONSENT_EVENT = "loft777:consent";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (typeof c?.analytics !== "boolean" || typeof c?.marketing !== "boolean") return null;
    // Sürüm eskiyse karar geçersiz → yeniden sorulur
    if (c.v !== CONSENT_VERSION) return null;
    return c;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean, marketing: boolean) {
  if (typeof window === "undefined") return;
  const c: Consent = { analytics, marketing, at: new Date().toISOString(), v: CONSENT_VERSION };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    // Depolama kapalıysa (gizli sekme vb.) karar yalnızca bu oturumda geçerli olur
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: c }));
}

/** Footer'daki "Çerez Tercihleri" bağlantısı bunu tetikler */
export const REOPEN_EVENT = "loft777:consent-reopen";

export function reopenConsent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REOPEN_EVENT));
}
