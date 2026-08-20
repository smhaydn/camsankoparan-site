// 20 Agu 2026: sayfa ISR ile onbellege alinir.
// Vercel ucretsiz islemci kotasi doldu; asilirsa TUM projeler duraklatiliyor
// (pixra.co dahil, ayni hesapta). Bu site kotanin %14unu yiyordu ve sebebi
// trafik degildi: her ziyarette sayfa sifirdan uretiliyordu (canlida olculdu,
// x-vercel-cache uc kez ust uste MISS).
// Icerik ve ayarlar artik etiketli onbellekten okunuyor; panelden kayit
// yapilinca revalidateTag ANINDA tazeliyor (bkz. api/admin/content ve
// api/admin/settings). Yani "panelde degisince aninda yansisin" davranisi
// korunuyor, bedeli her ziyaretciye odetilmiyor.
export const revalidate = 3600;

import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { getLegal } from "@/lib/legal";
import { LegalPage } from "@/components/site/legal-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "cookies", "/cerez-politikasi");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getContent(locale);
  return (
    <LegalPage
      doc={getLegal(locale, "cookies")}
      active="cookies"
      locale={locale}
      updatedLabel={d.legal.updated}
      otherLabel={d.legal.other}
      siblings={[
        { key: "kvkk", label: d.legal.names.kvkk },
        { key: "privacy", label: d.legal.names.privacy },
        { key: "cookies", label: d.legal.names.cookies },
      ]}
    />
  );
}
