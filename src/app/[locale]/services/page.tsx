import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Services } from "@/components/site/services";
import { CTA } from "@/components/site/cta";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "services", "/services");
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getContent(locale);
  return (
    <main>
      <PageHero
        kicker={d.servicesPage.kicker}
        title={d.servicesPage.title}
        intro={d.servicesPage.intro}
        image="/renders/hava-genel.jpg"
      />
      <Services t={d.services} />
      <CTA t={d.cta} />
    </main>
  );
}
