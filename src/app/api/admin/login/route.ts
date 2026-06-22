import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

// Yönetim paneli girişi — kullanıcı adı + şifre doğruysa oturum çerezi verir
export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}) as Record<string, string>);

  const U = process.env.ADMIN_USERNAME;
  const P = process.env.ADMIN_PASSWORD;
  const S = process.env.ADMIN_SECRET;

  if (!U || !P || !S) {
    return NextResponse.json({ ok: false, error: "Sunucu yapılandırması eksik" }, { status: 500 });
  }

  if (username !== U || password !== P) {
    return NextResponse.json(
      { ok: false, error: "Kullanıcı adı veya şifre hatalı" },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, S, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
