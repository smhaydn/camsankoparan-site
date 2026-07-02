import { NextResponse } from "next/server";
import { ISP_COOKIE } from "@/lib/isprogrami-auth";

// Oturumu kapatır (çerezi siler)
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ISP_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
