import { getContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Stats } from "@/components/site/stats";
import { Projects } from "@/components/site/projects";
import { Services } from "@/components/site/services";
import { Gallery } from "@/components/site/gallery";
import { Construction } from "@/components/site/construction";
import { Faq } from "@/components/site/faq";
import { Location } from "@/components/site/location";
import { CTA } from "@/components/site/cta";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getContent(locale);
  const l = locale as Locale;
  return (
    <main>
      <Hero t={d.hero} locale={l} catalogLabel={d.catalog.title} />
      <About t={d.about} locale={l} />
      <Stats labels={d.stats} />
      <Projects t={d.projectsHome} project={d.project} locale={l} />
      <Gallery t={d.gallery} />
      <Construction t={d.construction} />
      <Services t={d.services} />
      <Faq t={d.faq} />
      <Location t={d.location} address={d.contactPage.address} />
      <CTA t={d.cta} />
    </main>
  );
}
