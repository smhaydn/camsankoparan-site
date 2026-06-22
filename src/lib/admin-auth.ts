import { cookies } from "next/headers";

// Yönetim paneli oturum çerezi
export const ADMIN_COOKIE = "loft_admin";

// Çerez geçerli mi? (giriş yapılmış mı)
export async function isAuthed(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === secret;
}
