import { cookies } from "next/headers";
import crypto from "node:crypto";

// İş Programı oturumu — kullanıcı bazlı (yönetim panelinden ayrı).
// Çerez, ISP_SECRET ile HMAC imzalanır; içeriği kurcalanamaz.

export const ISP_COOKIE = "isp_oturum";
const OTURUM_SURESI = 60 * 60 * 24 * 30; // 30 gün (saniye)

export type IspKullanici = { u: string; ad: string };
type Payload = IspKullanici & { exp: number };

function secret(): string | null {
  // Tercihen ISP_SECRET; yoksa sitenin mevcut ADMIN_SECRET'ına geri düşer
  // (böylece ayrı bir env değişkeni eklemeye gerek kalmaz).
  return process.env.ISP_SECRET || process.env.ADMIN_SECRET || null;
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function imzala(data: string, s: string): string {
  return b64url(crypto.createHmac("sha256", s).update(data).digest());
}

// Kullanıcı için imzalı oturum jetonu üretir
export function oturumOlustur(k: IspKullanici): string | null {
  const s = secret();
  if (!s) return null;
  const payload: Payload = {
    u: k.u,
    ad: k.ad,
    exp: Math.floor(Date.now() / 1000) + OTURUM_SURESI,
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${imzala(body, s)}`;
}

// Jetonu doğrular; geçerliyse kullanıcıyı döndürür
function jetonCoz(token: string | undefined): IspKullanici | null {
  const s = secret();
  if (!s || !token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  // Zamanlama-güvenli imza karşılaştırması
  const beklenen = imzala(body, s);
  if (
    sig.length !== beklenen.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(beklenen))
  ) {
    return null;
  }
  try {
    const p = JSON.parse(Buffer.from(body, "base64").toString()) as Payload;
    if (!p.u || typeof p.exp !== "number" || p.exp < Date.now() / 1000) return null;
    return { u: p.u, ad: p.ad };
  } catch {
    return null;
  }
}

// Geçerli oturumdaki kullanıcı (giriş yoksa null)
export async function mevcutKullanici(): Promise<IspKullanici | null> {
  const store = await cookies();
  return jetonCoz(store.get(ISP_COOKIE)?.value);
}

export function oturumHazir(): boolean {
  return Boolean(secret());
}
