import { SEGMENTS } from "@/lib/dict";
import { getContent } from "@/lib/content";
import { isLocale, path } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { Gallery } from "@/components/site/gallery";
import { CTA } from "@/components/site/cta";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getContent(locale);
  const pr = d.project;
  if (slug !== pr.slug) notFound();

  return (
    <main>
      {/* Proje kapağı */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden bg-ink pb-16 pt-40">
        <div className="absolute inset-0">
          <div className="kenburns absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${pr.hero}')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/40" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
          <Link
            href={path(locale, SEGMENTS.projects)}
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-bronze"
          >
            <span>←</span> {pr.backToProjects}
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-bronze px-3 py-1 text-[11px] font-semibold tracking-wide text-ink">
              {pr.status}
            </span>
            <span className="text-xs tracking-widest text-bronze-pale uppercase">{pr.location}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-light text-white lg:text-6xl">{pr.name}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/70">{pr.tagline}</p>
        </div>
      </section>

      {/* Genel bakış + künye */}
      <section className="bg-surface py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.4fr_1fr] lg:px-10">
          <Reveal>
            <div>
              <div className="mb-5 flex items-center gap-4">
                <span className="h-px w-10 bg-bronze" />
                <span className="kicker text-bronze">{pr.overviewT}</span>
              </div>
              <p className="text-lg leading-relaxed text-muted">{pr.overview}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-sm border border-line bg-surface-2 p-8">
              <dl className="divide-y divide-line">
                {pr.facts.map((f) => (
                  <div key={f.k} className="flex items-center justify-between py-3.5">
                    <dt className="text-sm text-muted">{f.k}</dt>
                    <dd className="font-display font-semibold text-base">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Daire Çeşitleri */}
      <section className="bg-surface-2 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-3 flex items-center gap-4">
              <span className="h-px w-10 bg-bronze" />
              <span className="kicker text-bronze">{pr.unitsT}</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mb-12 max-w-2xl text-lg text-muted">{pr.unitsD}</p>
          </Reveal>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {pr.units.map((u, i) => (
              <Reveal key={u.type} delay={i * 0.08}>
                <div className="group overflow-hidden rounded-sm bg-card shadow-sm transition hover:shadow-xl">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${u.img}')` }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-2xl font-semibold text-base">{u.type}</h3>
                      <span className="text-sm font-medium text-bronze">{u.size}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{u.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ortak Alanlar & Sosyal Donatılar */}
      <section className="bg-ink py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-3 flex items-center gap-4">
              <span className="h-px w-10 bg-bronze" />
              <span className="kicker text-bronze">{pr.amenitiesT}</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mb-12 max-w-2xl text-lg text-white/60">{pr.amenitiesD}</p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pr.amenities.map((am, i) => (
              <Reveal key={am.t} delay={i * 0.08}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-sm">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] group-hover:scale-110"
                    style={{ backgroundImage: `url('${am.img}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-xl font-medium text-white">{am.t}</h3>
                    <p className="mt-1 text-sm text-white/70">{am.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Ek donatılar */}
          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-3">
              {pr.extras.map((e) => (
                <span
                  key={e}
                  className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/75"
                >
                  {e}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Görseller — tam galeri + lightbox */}
      <Gallery t={d.gallery} />

      <CTA t={d.cta} />
    </main>
  );
}
