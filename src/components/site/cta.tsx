import { Reveal } from "./reveal";
import type { Dict } from "@/lib/dict";

export function CTA({ t }: { t: Dict["cta"] }) {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center py-32"
      style={{
        backgroundImage:
          "linear-gradient(rgba(20,17,14,0.88), rgba(20,17,14,0.92)), url('/renders/dis-cephe-aksam.jpg')",
      }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <span className="kicker text-bronze">{t.kicker}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 font-display text-4xl font-light leading-tight text-white lg:text-5xl">
            {t.title1}
            <br />
            <span className="text-bronze">{t.title2}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/65">{t.body}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+902322377237"
              className="rounded-full bg-bronze px-8 py-3.5 text-sm font-semibold tracking-wide text-ink transition hover:bg-bronze-light"
            >
              {t.call}
            </a>
            <a
              href="mailto:info@camsankoparan.com"
              className="rounded-full border border-white/25 px-8 py-3.5 text-sm font-medium tracking-wide text-white transition hover:border-white hover:bg-white/5"
            >
              {t.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
