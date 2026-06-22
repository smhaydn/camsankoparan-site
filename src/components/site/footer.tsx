import { Logo } from "./logo";
import type { Dict } from "@/lib/dict";

export function Footer({ t }: { t: Dict["footer"] }) {
  return (
    <footer className="bg-[#0d0b09] pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-2">
          <div className="max-w-sm">
            <Logo light />
            <p className="mt-6 leading-relaxed text-white/50">{t.tagline}</p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {t.cols.map((c) => (
              <div key={c.title}>
                <h4 className="mb-4 text-xs font-semibold tracking-[0.2em] text-bronze uppercase">
                  {c.title}
                </h4>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <span className="text-sm text-white/55">{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 pt-7 text-xs text-white/40 sm:flex-row">
          <span>© 2026 Camsan Koparan Group A.Ş. {t.rights}</span>
          <span>
            {t.credit}: <span className="text-bronze/80">Partum Ajans</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
