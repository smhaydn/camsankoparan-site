import { Reveal } from "./reveal";
import type { Dict } from "@/lib/dict";

export function Services({ t }: { t: Dict["services"] }) {
  return (
    <section className="relative overflow-hidden bg-ink py-28">
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('/renders/sosyal-alan.jpg')",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 max-w-2xl">
          <Reveal>
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-10 bg-bronze" />
              <span className="kicker text-bronze">{t.kicker}</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl font-light leading-tight text-white lg:text-5xl">
              {t.title1}
              <br />
              <span className="text-bronze">{t.title2}</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-2">
          {t.items.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.08}>
              <div className="group h-full bg-ink p-9 transition-colors duration-500 hover:bg-ink-2">
                <div className="font-display text-5xl font-extralight text-bronze/40 transition-colors group-hover:text-bronze">
                  {s.no}
                </div>
                <h3 className="mt-5 font-display text-2xl font-medium text-white">{s.t}</h3>
                <p className="mt-3 leading-relaxed text-white/60">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
