import { NextResponse } from "next/server";
import { ISP_COOKIE, oturumOlustur, oturumHazir } from "@/lib/isprogrami-auth";
import { kullaniciDogrula, dbHazir } from "@/lib/isprogrami-db";

// İş Programı girişi — kullanıcı adı + şifre doğruysa oturum çerezi verir
export async function POST(req: Request) {
  const { username, password } = await req
    .json()
    .catch(() => ({}) as Record<string, string>);

  if (!oturumHazir() || !dbHazir()) {
    return NextResponse.json(
      { ok: false, error: "Sunucu yapılandırması eksik (ISP_SECRET / Supabase)" },
      { status: 500 },
    );
  }

  const u = typeof username === "string" ? username.trim() : "";
  const p = typeof password === "string" ? password : "";
  if (!u || !p) {
    return NextResponse.json({ ok: false, error: "Kullanıcı adı ve şifre gerekli" }, { status: 400 });
  }

  let kullanici: { u: string; ad: string } | null = null;
  try {
    kullanici = await kullaniciDogrula(u, p);
  } catch {
    return NextResponse.json({ ok: false, error: "Giriş sırasında hata" }, { status: 500 });
  }
  if (!kullanici) {
    return NextResponse.json({ ok: false, error: "Kullanıcı adı veya şifre hatalı" }, { status: 401 });
  }

  const token = oturumOlustur(kullanici);
  if (!token) {
    return NextResponse.json({ ok: false, error: "Oturum oluşturulamadı" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true, ad: kullanici.ad });
  res.cookies.set(ISP_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 gün
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
