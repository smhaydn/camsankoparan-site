import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Services } from "@/components/site/services";
import { Reveal } from "@/components/site/reveal";
import { CTA } from "@/components/site/cta";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";

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
    <>
      <JsonLd locale={locale} page="services" />
    <main>
      <PageHero
        kicker={d.servicesPage.kicker}
        title={d.servicesPage.title}
        intro={d.servicesPage.intro}
        image="/renders/hava-genel.jpg"
      />
      <Services t={d.services} />

      {/* Projeye özgü avantajlar — gerçek proje verilerinden.
          Dekoratif 01/02/03 numaraları kaldırıldı: içerik bir sıra değil. */}
      <section className="paper bg-sand py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-4 flex items-center gap-4">
              <span className="h-px w-10 bg-accent" />
              <span className="kicker text-accent">{d.servicesPage.reasonsKicker}</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mb-12 font-display text-3xl leading-tight font-light text-base lg:text-4xl">
              {d.servicesPage.reasonsTitle}
            </h2>
          </Reveal>
          <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {d.servicesPage.reasons.map((r, i) => (
              <Reveal key={r.t} delay={Math.min(i * 0.06, 0.24)}>
                <div className="group h-full bg-sand p-8 transition-colors duration-500 hover:bg-sand-2">
                  <span className="block h-px w-8 bg-accent transition-all duration-500 group-hover:w-14" />
                  <h3 className="mt-5 font-display text-lg font-medium text-base">{r.t}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{r.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ÖDEME & TESLİM — satın alma kararının en somut kısmı, sayfada hiç yoktu */}
      <section className="paper bg-paper py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-accent" />
                <span className="kicker text-accent">{d.servicesPage.payKicker}</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-3xl leading-tight font-light text-base lg:text-4xl">
                {d.servicesPage.payTitle}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 leading-relaxed text-muted">{d.servicesPage.payBody}</p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {d.servicesPage.payItems.map((p, i) => (
              <Reveal key={p.k} delay={Math.min(i * 0.07, 0.28)}>
                <div className="h-full bg-paper p-8">
                  <div className="data text-[11px] tracking-[0.16em] text-muted uppercase">{p.k}</div>
                  <div className="data mt-3 text-3xl leading-none text-accent">{p.v}</div>
                  <p className="mt-3.5 text-sm leading-relaxed text-muted">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-7 max-w-[62ch] text-xs leading-relaxed text-muted italic">
              {d.servicesPage.payNote}
            </p>
          </Reveal>
        </div>
      </section>

      <CTA t={d.cta} />
    </main>
    </>
  );
}
