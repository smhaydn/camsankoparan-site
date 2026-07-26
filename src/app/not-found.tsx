import Link from "next/link";
import { getDict } from "@/lib/dict";

/**
 * 404 — "7" motifiyle tasarlanmış özel sayfa.
 * (Awwwards jürisi 404'ü kontrol eder; ayrıca kırık bağlantıda kullanıcıyı kaybetmemek için.)
 * Kök seviyede olduğu için dil belirlenemez → TR varsayılan.
 */
export default function NotFound() {
  const d = getDict("tr");
  const t = d.notFound;

  return (
    <main className="paper relative flex min-h-screen items-center overflow-hidden bg-paper">
      {/* Dev "777" filigranı — marka motifi */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 font-display text-[34vw] leading-none font-light text-accent/[0.06] select-none lg:text-[26vw]"
      >
        777
      </span>

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="h-px w-12 bg-accent" />
        <div className="kicker mt-4 text-accent">{t.kicker}</div>
        <h1 className="mt-6 max-w-2xl font-display text-4xl leading-[1.1] font-light text-base lg:text-6xl">
          {t.title1}
          <br />
          <span className="text-accent">{t.title2}</span>
        </h1>
        <p className="mt-7 max-w-md leading-relaxed text-muted">{t.body}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/tr"
            className="bg-accent px-8 py-3.5 text-sm font-semibold tracking-wide text-onaccent transition hover:bg-bronze-light"
          >
            {t.home}
          </Link>
          <Link
            href="/tr/contact"
            className="border border-line px-8 py-3.5 text-sm font-medium tracking-wide text-base transition hover:border-accent hover:text-accent"
          >
            {t.contact}
          </Link>
        </div>
      </div>
    </main>
  );
}
