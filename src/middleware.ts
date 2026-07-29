import { NextRequest, NextResponse } from "next/server";

// URL'deki dili (tr/en) bir response header'ına yazar; kök layout bunu okuyup
// <html lang> değerini doğru set eder. Routing'e dokunmaz — sadece next() + header.
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const locale = req.nextUrl.pathname.startsWith("/en") ? "en" : "tr";
  res.headers.set("x-locale", locale);
  return res;
}

// _next, api ve statik dosyalar dışındaki tüm sayfalarda çalışır.
export const config = {
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
