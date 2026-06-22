import { SEGMENTS } from "@/lib/dict";
import { getContent } from "@/lib/content";
import { isLocale, path } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getContent(locale);
  const p = d.projectsPage;
  const project = d.project;
  const href = path(locale, `${SEGMENTS.projects}/${project.slug}`);

  return (
    <main>
      <PageHero kicker={p.kicker} title={p.title} intro={p.intro} image={project.hero} />

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-10 flex items-center gap-4">
              <span className="h-px w-10 bg-bronze" />
              <span className="kicker text-bronze">{p.ongoing}</span>
            </div>
          </Reveal>

          {/* Tek proje — geniş kart */}
          <Reveal>
            <Link
              href={href}
              className="group grid overflow-hidden rounded-sm border border-line bg-card shadow-sm transition hover:shadow-2xl lg:grid-cols-2"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
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
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-bronze transition-all group-hover:gap-3">
                  {p.detail} <span>→</span>
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Tamamlanan — yakında */}
          <Reveal delay={0.1}>
            <div className="mt-16">
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-10 bg-bronze" />
                <span className="kicker text-bronze">{p.completed}</span>
              </div>
              <div className="rounded-sm border border-dashed border-line bg-surface-2 px-8 py-16 text-center text-muted">
                {p.soon}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
