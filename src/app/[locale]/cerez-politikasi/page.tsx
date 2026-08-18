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
