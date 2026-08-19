import { SEGMENTS } from "@/lib/dict";
import { getContent } from "@/lib/content";
import { isLocale, path } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { CoverImage } from "@/components/site/cover-image";
import { LoftKesit } from "@/components/site/loft-kesit";
import { CTA } from "@/components/site/cta";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "projects", "/projects");
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getContent(locale);
  const p = d.projectsPage;
  const project = d.project;
  const href = path(locale, `${SEGMENTS.projects}/${project.slug}`);

  return (
    <main>
      <PageHero kicker={p.kicker} title={p.title} intro={p.intro} image={project.hero} />

      {/* DAİRE TİPLERİ — sayfa "Daireler" adını taşıyor ama tip karşılaştırması yoktu.
          Ölçüler C Blok uygulama projesinden; bilinmeyen değer uydurulmadı. */}
      <section className="paper bg-paper py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-accent" />
                <span className="kicker text-accent">{p.typesKicker}</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-3xl leading-tight font-light text-base lg:text-4xl">
                {p.typesTitle}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 leading-relaxed text-muted">{p.typesBody}</p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-px bg-line lg:grid-cols-2">
            {p.types.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="flex h-full flex-col bg-paper p-8 lg:p-10">
                  <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
                    <div>
                      <h3 className="font-display text-2xl font-medium text-base lg:text-3xl">
                        {t.name}
                      </h3>
                      <div className="kicker mt-2 text-muted">{t.tag}</div>
                    </div>
                    <div className="data shrink-0 text-2xl leading-none text-accent lg:text-3xl">
                      {t.area}
                    </div>
                  </div>

                  <p className="mt-6 max-w-[46ch] leading-relaxed text-muted">{t.lead}</p>

                  <dl className="mt-7 border-t border-line">
                    {t.rows.map((r) => (
                      <div
                        key={r.k}
                        className="flex items-baseline justify-between gap-5 border-b border-line py-3"
                      >
                        <dt className="data text-[11px] tracking-[0.16em] text-muted uppercase">
                          {r.k}
                        </dt>
                        <dd className="text-right text-[15px] leading-snug text-base">{r.v}</dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={path(locale, SEGMENTS.contact)}
                    className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold tracking-wide text-accent transition hover:gap-3"
                  >
                    {p.typesPlanCta} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.18}>
            <p className="mt-7 max-w-[68ch] text-xs leading-relaxed text-muted italic">
              {p.typesNote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* İKİNCİ İMZA — dairenin kesiti: çift yükseklik sadece burada okunur */}
      <LoftKesit t={d.loftKesit} />

      <section className="paper bg-cream py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-10 flex items-center gap-4">
              <span className="h-px w-10 bg-accent" />
              <span className="kicker text-accent">{p.ongoing}</span>
            </div>
          </Reveal>

          {/* Tek proje — geniş kart. "Tamamlanan projeler / yakında" kutusu
              kaldırıldı: içi boş bir vaatti, sayfayı zayıflatıyordu. */}
          <Reveal>
            <Link
              href={href}
              className="group grid overflow-hidden border border-line bg-paper transition-colors duration-500 hover:bg-sand lg:grid-cols-2"
            >
              <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto">
                <CoverImage
                  src={project.hero}
                  alt={`${project.name} — ${project.location}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />
                <span className="absolute top-5 left-5 bg-accent px-3 py-1.5 text-[11px] font-semibold tracking-wide text-onaccent">
                  {project.status}
                </span>
              </div>
              <div className="flex flex-col justify-center p-9 lg:p-12">
                <div className="kicker text-accent">{project.location}</div>
                <h3 className="mt-3 font-display text-3xl font-medium text-base lg:text-4xl">
                  {project.name}
                </h3>
                <p className="mt-4 leading-relaxed text-muted">{project.tagline}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all group-hover:gap-3">
                  {p.detail} <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <CTA t={d.cta} />
    </main>
  );
}
