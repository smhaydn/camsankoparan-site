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

import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Stats } from "@/components/site/stats";
import { CTA } from "@/components/site/cta";
import { Reveal } from "@/components/site/reveal";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "about", "/about");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getContent(locale);
  const a = d.aboutPage;

  return (
    <>
      <JsonLd locale={locale} page="about" />
    <main>
      <PageHero kicker={a.kicker} title={a.title} intro={a.intro} image="/renders/hava-genel.jpg" />

      {/* Vizyon & Misyon — beyaz kart yerine kağıt üstünde ince çizgi */}
      <section className="paper bg-paper py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-px bg-line sm:grid-cols-2">
            {[
              { t: a.visionT, d: a.visionD },
              { t: a.missionT, d: a.missionD },
            ].map((b, i) => (
              <Reveal key={b.t} delay={i * 0.08}>
                <div className="h-full bg-paper p-9 lg:p-11">
                  <div className="h-px w-12 bg-accent" />
                  <h2 className="mt-6 font-display text-3xl leading-tight font-light text-base">{b.t}</h2>
                  <p className="mt-4 max-w-[52ch] leading-relaxed text-muted">{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJE KÜNYESİ — mimari föy. Süs yok, veri var. */}
      <section className="paper bg-sand py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-accent" />
                  <span className="kicker text-accent">{a.specKicker}</span>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 font-display text-3xl leading-tight font-light text-base lg:text-4xl">
                  {a.specTitle}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[44ch] text-xs leading-relaxed text-muted italic">{a.specNote}</p>
              </Reveal>
            </div>

            <Reveal delay={0.1} variant="mask">
              <dl className="border-t border-line">
                {a.spec.map((r) => (
                  <div
                    key={r.k}
                    className="grid grid-cols-1 gap-1 border-b border-line py-3.5 sm:grid-cols-[13rem_1fr] sm:gap-6"
                  >
                    <dt className="data text-[11px] tracking-[0.16em] text-muted uppercase">{r.k}</dt>
                    <dd className="text-[15px] leading-snug text-base">{r.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* YAPI & DONANIM — taşındıktan sonra fark edilen kalemler */}
      <section className="paper bg-cream py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-accent" />
                <span className="kicker text-accent">{a.techKicker}</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-3xl leading-tight font-light text-base lg:text-4xl">
                {a.techTitle}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 leading-relaxed text-muted">{a.techBody}</p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {a.tech.map((t, i) => (
              <Reveal key={t.t} delay={Math.min(i * 0.06, 0.24)}>
                <div className="group h-full bg-cream p-8 transition-colors duration-500 hover:bg-sand">
                  <span className="block h-px w-8 bg-accent transition-all duration-500 group-hover:w-14" />
                  <h3 className="mt-5 font-display text-lg font-medium text-base">{t.t}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{t.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Öne çıkanlar — dekoratif 01/02/03 numaraları kaldırıldı (sıra bilgisi taşımıyor) */}
      <section className="paper bg-sand-2 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-12 flex items-center gap-4">
              <span className="h-px w-10 bg-accent" />
              <span className="kicker text-accent">{a.valuesT}</span>
            </div>
          </Reveal>
          <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => (
              <Reveal key={v.t} delay={Math.min(i * 0.07, 0.28)}>
                <div className="h-full bg-sand-2 p-8">
                  <h3 className="font-display text-xl font-medium text-base">{v.t}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Stats labels={d.stats} />
      <CTA t={d.cta} />
    </main>
    </>
  );
}
