import { redirect } from "next/navigation";
import { mevcutKullanici, oturumHazir } from "@/lib/isprogrami-auth";
import { isleriGetir, dbHazir } from "@/lib/isprogrami-db";
import type { Is } from "@/lib/isprogrami-listeler";
import { Panel } from "./panel";

export const dynamic = "force-dynamic";

export default async function IsProgramiPage() {
  // Giriş kontrolü
  const kullanici = await mevcutKullanici();
  if (!kullanici) {
    redirect("/isprogrami/giris");
  }

  // Yapılandırma eksikse yönlendir
  if (!oturumHazir() || !dbHazir()) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-bronze">Son bir adım kaldı</h1>
        <p className="mt-4 leading-relaxed text-white/70">
          İş Programı&apos;nın çalışması için Supabase tabloları ve{" "}
          <b>ISP_SECRET</b> / <b>service_role</b> anahtarının ayarlanması gerekiyor. Kurulum
          tamamlanınca işler burada listelenecek.
        </p>
      </main>
    );
  }

  let isler: Is[] = [];
  let error = "";
  try {
    isler = await isleriGetir();
  } catch {
    error = "İşler yüklenemedi. Lütfen biraz sonra tekrar deneyin.";
  }

  return <Panel initialIsler={isler} loadError={error} kullaniciAdi={kullanici.ad} />;
}
