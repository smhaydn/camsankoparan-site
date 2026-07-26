import { Reveal } from "./reveal";
import type { Dict } from "@/lib/dict";

export function Services({ t }: { t: Dict["services"] }) {
  return (
    <section className="paper relative overflow-hidden bg-cream py-32">
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('/renders/havuz-sosyal.jpg')",
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
            <h2 className="font-display text-4xl font-light leading-tight text-base lg:text-5xl">
              {t.title1}
              <br />
              <span className="text-bronze">{t.title2}</span>
            </h2>
          </Reveal>
        </div>

        {/* Dekoratif 01/02/03 numaraları kaldırıldı — içerik bir sıra değil (jenerik şablon işareti) */}
        <div className="grid gap-px overflow-hidden bg-line sm:grid-cols-2">
          {t.items.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.08}>
              <div className="card-flat group h-full p-10 transition-colors duration-500 hover:bg-sand">
                <span className="block h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
                <h3 className="mt-6 font-display text-2xl font-medium text-base">{s.t}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
