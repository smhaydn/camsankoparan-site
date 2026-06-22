import Link from "next/link";
import { Reveal } from "./reveal";
import { SEGMENTS, type Dict } from "@/lib/dict";
import { path, type Locale } from "@/lib/i18n";

export function About({ t, locale }: { t: Dict["about"]; locale: Locale }) {
  return (
    <section className="bg-surface py-28">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <Reveal>
          <div className="relative">
            <div
              className="aspect-[4/5] w-full rounded-sm bg-cover bg-center shadow-2xl"
              style={{
                backgroundImage: "url('/renders/teras-balkon.jpg')",
              }}
            />
            <div className="absolute -bottom-8 -right-4 hidden rounded-sm bg-ink px-8 py-6 text-center shadow-xl sm:block lg:-right-8">
              <div className="font-display text-4xl font-bold text-bronze">238</div>
              <div className="mt-1 text-xs tracking-widest text-white/60">{t.badge}</div>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col justify-center">
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
          <Reveal delay={0.1}>
            <p className="mt-7 text-lg leading-relaxed text-muted">{t.body}</p>
          </Reveal>

          <div className="mt-10 flex flex-col gap-6">
            {t.points.map((p, i) => (
              <Reveal key={p.t} delay={0.15 + i * 0.08}>
                <div className="flex gap-5">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-bronze/40 text-sm font-semibold text-bronze">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-base">{p.t}</h3>
                    <p className="mt-1 text-muted">{p.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <Link
              href={path(locale, SEGMENTS.about)}
              className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-semibold tracking-wide text-bronze transition hover:gap-3"
            >
              {t.more} <span>→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
