import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Stats } from "@/components/site/stats";
import { CTA } from "@/components/site/cta";
import { Reveal } from "@/components/site/reveal";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getContent(locale);
  const a = d.aboutPage;

  return (
    <main>
      <PageHero kicker={a.kicker} title={a.title} intro={a.intro} />

      {/* Vizyon & Misyon */}
      <section className="bg-surface py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-10">
          {[
            { t: a.visionT, d: a.visionD },
            { t: a.missionT, d: a.missionD },
          ].map((b, i) => (
            <Reveal key={b.t} delay={i * 0.1}>
              <div className="h-full rounded-sm border border-line bg-surface-2 p-10">
                <div className="mb-5 h-px w-12 bg-bronze" />
                <h2 className="font-display text-3xl font-light text-base">{b.t}</h2>
                <p className="mt-4 leading-relaxed text-muted">{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Değerler */}
      <section className="bg-surface-2 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-12 flex items-center gap-4">
              <span className="h-px w-10 bg-bronze" />
              <span className="kicker text-bronze">{a.valuesT}</span>
            </div>
          </Reveal>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.08}>
                <div className="h-full rounded-sm bg-card p-8 shadow-sm">
                  <div className="font-display text-3xl font-extralight text-bronze">
                    0{i + 1}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-base">{v.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Stats labels={d.stats} />
      <CTA t={d.cta} />
    </main>
  );
}
