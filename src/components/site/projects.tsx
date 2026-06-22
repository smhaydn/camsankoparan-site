import Link from "next/link";
import { Reveal } from "./reveal";
import { SEGMENTS, type Dict } from "@/lib/dict";
import { path, type Locale } from "@/lib/i18n";

export function Projects({
  t,
  project,
  locale,
}: {
  t: Dict["projectsHome"];
  project: Dict["project"];
  locale: Locale;
}) {
  const href = path(locale, `${SEGMENTS.projects}/${project.slug}`);
  return (
    <section className="bg-surface-2 py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <div className="mb-5 flex items-center gap-4">
                <span className="h-px w-10 bg-bronze" />
                <span className="kicker text-bronze">{t.kicker}</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-4xl font-light leading-tight text-base lg:text-5xl">
                {t.title1}
                <br />
                <span className="text-bronze">{t.title2}</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Link
              href={path(locale, SEGMENTS.projects)}
              className="rounded-full border border-line px-7 py-3 text-sm font-medium text-base transition hover:border-bronze hover:text-bronze"
            >
              {t.all} →
            </Link>
          </Reveal>
        </div>

        {/* Tek öne çıkan proje — geniş kart */}
        <Reveal>
          <Link
            href={href}
            className="group grid overflow-hidden rounded-sm bg-card shadow-sm transition hover:shadow-2xl lg:grid-cols-2"
          >
            <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                style={{ backgroundImage: `url('${project.hero}')` }}
              />
              <span className="absolute left-5 top-5 rounded-full bg-bronze/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-ink">
                {project.status}
              </span>
            </div>
            <div className="flex flex-col justify-center p-9 lg:p-12">
              <div className="text-xs tracking-widest text-bronze uppercase">
                {project.location}
              </div>
              <h3 className="mt-3 font-display text-3xl font-medium text-base lg:text-4xl">
                {project.name}
              </h3>
              <p className="mt-4 leading-relaxed text-muted">{project.tagline}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {project.facts.slice(2).map((f) => (
                  <span
                    key={f.k}
                    className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-muted"
                  >
                    {f.k}: {f.v}
                  </span>
                ))}
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-bronze transition-all group-hover:gap-3">
                {t.incele} <span>→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
