import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Services } from "@/components/site/services";
import { Reveal } from "@/components/site/reveal";
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

      {/* Projeye özgü avantajlar — gerçek proje verilerinden */}
      <section className="bg-surface py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-4 flex items-center gap-4">
              <span className="h-px w-10 bg-bronze" />
              <span className="kicker text-bronze">{d.servicesPage.reasonsKicker}</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mb-12 font-display text-3xl font-light text-base lg:text-4xl">
              {d.servicesPage.reasonsTitle}
            </h2>
          </Reveal>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {d.servicesPage.reasons.map((r, i) => (
              <Reveal key={r.t} delay={i * 0.06}>
                <div className="h-full rounded-sm border border-line bg-card p-7 transition hover:shadow-lg">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-bronze/40 font-display text-sm font-semibold text-bronze">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-base">{r.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{r.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA t={d.cta} />
    </main>
  );
}
