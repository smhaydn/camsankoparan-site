import { Reveal } from "./reveal";
import type { Dict } from "@/lib/dict";

export function Construction({ t }: { t: Dict["construction"] }) {
  return (
    <section className="bg-surface-2 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-10 bg-bronze" />
            <span className="kicker text-bronze">{t.kicker}</span>
          </div>
        </Reveal>

        <div className="max-w-3xl">
          <div>
            <Reveal delay={0.05}>
              <h2 className="font-display text-4xl font-light leading-tight text-base lg:text-5xl">
                {t.title1} <span className="text-bronze">{t.title2}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-bronze/15 px-4 py-1.5 text-sm font-semibold text-bronze">
                <span className="h-2 w-2 animate-pulse rounded-full bg-bronze" />
                {t.status}
              </span>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-lg leading-relaxed text-muted">{t.body}</p>
            </Reveal>

            {/* Aşama çizelgesi */}
            <Reveal delay={0.2}>
              <ol className="mt-10 space-y-4">
                {t.steps.map((step, i) => {
                  const done = i < t.currentStep;
                  const active = i === t.currentStep;
                  return (
                    <li key={step} className="flex items-center gap-4">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          active
                            ? "bg-bronze text-onaccent"
                            : done
                              ? "bg-bronze/30 text-bronze"
                              : "border border-line text-muted"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      <span
                        className={`text-sm ${active ? "font-semibold text-base" : "text-muted"}`}
                      >
                        {step}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
