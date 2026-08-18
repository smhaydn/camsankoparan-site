"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { readConsent, writeConsent, REOPEN_EVENT } from "@/lib/consent";
import type { Dict } from "@/lib/dict";
import { path, type Locale } from "@/lib/i18n";

/**
 * Çerez onay kutusu.
 *
 * Uyum açısından kritik iki nokta:
 *  1) "Reddet", "Kabul et" ile AYNI kolaylıkta olmalı — aynı boy, aynı yer.
 *     Reddi zorlaştırmak (küçük yazı, gizli menü) rızayı geçersiz kılar.
 *  2) Karar verilene kadar hiçbir takip kodu yüklenmez (TrackingScripts bekler).
 *
 * Sayfayı kilitlemiyoruz: gezinmeyi engelleyen bir duvar, kullanıcıyı
 * "kabul et"e zorlamak sayılır ve rızayı yine tartışmalı hale getirir.
 */
export function CookieConsent({ t, locale }: { t: Dict["cookieBanner"]; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // İlk açılış: karar yoksa göster. Sunucuda localStorage yok, o yüzden efektte.
  useEffect(() => {
    if (readConsent() === null) setOpen(true);
  }, []);

  // Footer'daki "Çerez Tercihleri" bağlantısı kutuyu yeniden açar
  useEffect(() => {
    const reopen = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? true);
      setMarketing(c?.marketing ?? true);
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(REOPEN_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_EVENT, reopen);
  }, []);

  // Açıldığında odağı kutuya al — klavye kullanıcısı kaybolmasın
  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open]);

  const decide = useCallback((a: boolean, m: boolean) => {
    writeConsent(a, m);
    setOpen(false);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 24 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-5"
        >
          <div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="false"
            aria-labelledby="cc-title"
            aria-describedby="cc-desc"
            className="pointer-events-auto mx-auto max-w-3xl border border-line bg-paper p-6 shadow-[0_10px_40px_-12px_rgba(26,29,28,0.28)] outline-none sm:p-7"
          >
            <h2 id="cc-title" className="font-display text-lg font-medium text-base">
              {t.title}
            </h2>
            <p id="cc-desc" className="mt-2.5 max-w-[62ch] text-sm leading-relaxed text-muted">
              {t.body}{" "}
              <Link
                href={path(locale, "cerez-politikasi")}
                className="underline decoration-line underline-offset-2 transition hover:text-accent"
              >
                {t.policyLink}
              </Link>
            </p>

            {/* Ayrıntılar — hangi grubu istediğini seçebilsin */}
            {details && (
              <ul className="mt-5 space-y-3 border-t border-line pt-5">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full bg-line px-0.5">
                    <span className="ml-auto block h-4 w-4 rounded-full bg-stone" />
                  </span>
                  <span className="text-sm leading-relaxed text-muted">
                    <strong className="font-medium text-base">{t.necessary}</strong> — {t.necessaryDesc}
                  </span>
                </li>
                <li>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
                    />
                    <span className="text-sm leading-relaxed text-muted">
                      <strong className="font-medium text-base">{t.analytics}</strong> — {t.analyticsDesc}
                    </span>
                  </label>
                </li>
                <li>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
                    />
                    <span className="text-sm leading-relaxed text-muted">
                      <strong className="font-medium text-base">{t.marketing}</strong> — {t.marketingDesc}
                    </span>
                  </label>
                </li>
              </ul>
            )}

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              {/* Kabul ve Ret aynı boyutta — biri diğerinden kolay olmamalı */}
              <button
                type="button"
                onClick={() => (details ? decide(analytics, marketing) : decide(true, true))}
                className="rounded-full bg-accent px-7 py-3 text-sm font-semibold tracking-wide text-onaccent transition hover:opacity-90"
              >
                {details ? t.save : t.acceptAll}
              </button>
              <button
                type="button"
                onClick={() => decide(false, false)}
                className="rounded-full border border-line px-7 py-3 text-sm font-semibold tracking-wide text-base transition hover:bg-sand"
              >
                {t.rejectAll}
              </button>
              {!details && (
                <button
                  type="button"
                  onClick={() => setDetails(true)}
                  className="text-sm text-muted underline decoration-line underline-offset-2 transition hover:text-accent sm:ml-auto"
                >
                  {t.customise}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
