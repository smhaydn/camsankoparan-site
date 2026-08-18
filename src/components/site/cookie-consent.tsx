"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { readConsent, writeConsent, REOPEN_EVENT } from "@/lib/consent";
import type { Dict } from "@/lib/dict";
import { path, type Locale } from "@/lib/i18n";

/**
 * Çerez onay kutusu — sağ altta, kompakt.
 *
 * Konum: WhatsApp düğmesi `bottom-6 right-6` + 56px yüksekliğinde, yani
 * alt sağ köşede 24–80px arası dolu. Kutuyu 92px'ten başlatıyoruz ki
 * o düğmenin üzerini kapatmasın (mobilde de geçerli).
 *
 * Uyum açısından kritik iki nokta:
 *  1) "Reddet", "Kabul et" ile AYNI boyutta ve aynı yerde. Reddi
 *     zorlaştırmak (küçük yazı, gizli menü) rızayı geçersiz kılar.
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

  const row = "flex items-start gap-2.5 text-[12.5px] leading-snug text-muted";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 16 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          /* Mobil: iki kenardan boşluklu şerit · sm+: sağ alt köşede kutu.
             WhatsApp düğmesinin üstünde kalacak şekilde yükseltildi. */
          className="pointer-events-none fixed inset-x-3 bottom-[5.75rem] z-[70] sm:inset-x-auto sm:right-6 sm:bottom-[6.25rem]"
        >
          <div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="false"
            aria-labelledby="cc-title"
            aria-describedby="cc-desc"
            className="pointer-events-auto w-full rounded-sm border border-line bg-paper p-4 shadow-[0_12px_34px_-14px_rgba(26,29,28,0.4)] outline-none sm:w-[20.5rem] sm:p-5 lg:w-[22rem]"
          >
            <h2 id="cc-title" className="font-display text-[15px] font-medium text-base">
              {t.title}
            </h2>
            <p id="cc-desc" className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
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
              <ul className="mt-3.5 space-y-2 border-t border-line pt-3.5">
                <li className={row}>
                  <span className="mt-[3px] block h-3.5 w-3.5 shrink-0 rounded-[3px] border border-line bg-sand" />
                  <span>
                    <strong className="font-medium text-base">{t.necessary}</strong> — {t.necessaryDesc}
                  </span>
                </li>
                <li>
                  <label className={`${row} cursor-pointer`}>
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="mt-[3px] h-3.5 w-3.5 shrink-0 accent-[var(--accent)]"
                    />
                    <span>
                      <strong className="font-medium text-base">{t.analytics}</strong> — {t.analyticsDesc}
                    </span>
                  </label>
                </li>
                <li>
                  <label className={`${row} cursor-pointer`}>
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="mt-[3px] h-3.5 w-3.5 shrink-0 accent-[var(--accent)]"
                    />
                    <span>
                      <strong className="font-medium text-base">{t.marketing}</strong> — {t.marketingDesc}
                    </span>
                  </label>
                </li>
              </ul>
            )}

            {/* Kabul ve Ret eşit genişlikte — biri diğerinden kolay olmamalı */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => (details ? decide(analytics, marketing) : decide(true, true))}
                className="rounded-full bg-accent px-3 py-2 text-[12.5px] font-semibold tracking-wide text-onaccent transition hover:opacity-90"
              >
                {details ? t.save : t.acceptAll}
              </button>
              <button
                type="button"
                onClick={() => decide(false, false)}
                className="rounded-full border border-line px-3 py-2 text-[12.5px] font-semibold tracking-wide text-base transition hover:bg-sand"
              >
                {t.rejectAll}
              </button>
            </div>

            {!details && (
              <button
                type="button"
                onClick={() => setDetails(true)}
                className="mt-2.5 text-[12px] text-muted underline decoration-line underline-offset-2 transition hover:text-accent"
              >
                {t.customise}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
