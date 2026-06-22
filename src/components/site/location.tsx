import { Reveal } from "./reveal";
import type { Dict } from "@/lib/dict";

export function Location({
  t,
  address,
}: {
  t: Dict["location"];
  address: string;
}) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(t.mapQuery)}&z=14&output=embed`;

  return (
    <section className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-10 bg-bronze" />
            <span className="kicker text-bronze">{t.kicker}</span>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Sol: başlık + avantajlar + adres */}
          <div>
            <Reveal delay={0.05}>
              <h2 className="font-display text-4xl font-light leading-tight text-white lg:text-5xl">
                {t.title1} <span className="text-bronze">{t.title2}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-lg leading-relaxed text-white/65">{t.body}</p>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {t.points.map((p, i) => (
                <Reveal key={p.t} delay={0.12 + i * 0.06}>
                  <div className="rounded-sm border border-white/10 bg-white/[0.03] p-5">
                    <div className="font-display text-lg font-semibold text-bronze">{p.t}</div>
                    <p className="mt-1 text-sm leading-relaxed text-white/55">{p.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <div className="mt-8 border-t border-white/10 pt-5">
                <div className="kicker text-bronze-pale">{t.addressTitle}</div>
                <p className="mt-2 text-white/75">{address}</p>
              </div>
            </Reveal>
          </div>

          {/* Sağ: harita */}
          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-sm border border-white/10">
              <iframe
                src={mapSrc}
                title="Harita"
                className="h-[420px] w-full grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
