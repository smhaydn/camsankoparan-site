import Link from "next/link";
import { Reveal } from "./reveal";
import { path, type Locale } from "@/lib/i18n";
import { LEGAL_SEGMENTS, type LegalDoc, type LegalKey } from "@/lib/legal";

/**
 * Yasal metin sayfası — okunabilirlik önceliği.
 * Ölçülü satır uzunluğu (65ch), numaralı başlıklar, kardeş belgelere geçiş.
 */

type Sibling = { key: LegalKey; label: string };

export function LegalPage({
  doc,
  active,
  locale,
  siblings,
  updatedLabel,
  otherLabel,
}: {
  doc: LegalDoc;
  active: LegalKey;
  locale: Locale;
  siblings: Sibling[];
  updatedLabel: string;
  otherLabel: string;
}) {
  return (
    <main className="paper bg-paper">
      {/* Başlık — görselsiz, sade; yasal metin sayfası pazarlama sayfası değil */}
      <header className="border-b border-line pt-36 pb-14 lg:pt-44">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-accent" />
              <span className="kicker text-accent">{doc.kicker}</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-3xl leading-tight font-light text-base lg:text-4xl">
              {doc.title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[62ch] leading-relaxed text-muted">{doc.intro}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="data mt-7 text-xs tracking-wider text-muted">
              {updatedLabel}: {doc.updated}
            </p>
          </Reveal>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-20">
        {doc.sections.map((s, i) => (
          <Reveal key={s.h} delay={Math.min(i * 0.03, 0.15)}>
            <section className={i > 0 ? "mt-12" : ""}>
              <h2 className="font-display text-xl font-medium text-base lg:text-2xl">{s.h}</h2>
              {s.p.map((t) => (
                <p key={t.slice(0, 40)} className="mt-4 max-w-[68ch] leading-[1.75] text-muted">
                  {t}
                </p>
              ))}
              {s.list && (
                <ul className="mt-5 space-y-2.5 border-l border-line pl-5">
                  {s.list.map((li) => (
                    <li key={li.slice(0, 40)} className="max-w-[64ch] leading-[1.7] text-muted">
                      {li}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </Reveal>
        ))}

        {/* Diğer yasal metinler */}
        <nav className="mt-16 border-t border-line pt-8">
          <h2 className="kicker text-accent">{otherLabel}</h2>
          <ul className="mt-4 space-y-2">
            {siblings
              .filter((s) => s.key !== active)
              .map((s) => (
                <li key={s.key}>
                  <Link
                    href={path(locale, LEGAL_SEGMENTS[s.key])}
                    className="inline-flex items-center gap-2 text-sm text-accent transition hover:gap-3"
                  >
                    {s.label} <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </article>
    </main>
  );
}
