"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Dict } from "@/lib/dict";

/**
 * KESİT — sitenin imza bölümü.
 * Projenin dikey istifini (otopark → çarşı → loft → teras) kaydırdıkça
 * kat kat açar. Kağıt üzerine mimari çizim dili: ince kontur, ölçü oku, tarama.
 *
 * Masaüstü: sticky + scroll'a bağlı kat geçişi.
 * Mobil: dikey yığın (pin yok), aynı sıra.
 */

const BANDS = [
  { y: 392, h: 116 }, // 0 · otopark (2 bodrum)
  { y: 300, h: 92 }, // 1 · çarşı + avlu
  { y: 168, h: 132 }, // 2 · loft (çift yükseklik)
  { y: 104, h: 64 }, // 3 · dubleks + teras
];

export function Kesit({ t }: { t: Dict["kesit"] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  // Kaydırma ilerlemesini doğrudan ölçeriz — bölüm başlangıçta gizli (lg:block)
  // olabildiği için ölçüm tabanlı yöntem güvenilir çalışır.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onScroll = () => {
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total);
      const p = scrolled / total;
      // 4 kata böl; son katta nefes payı bırak
      setActive(Math.min(3, Math.max(0, Math.floor(p * 4.4))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="paper bg-cream" aria-label={t.kicker}>
      {/* ── Başlık ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pt-32 lg:px-10">
        <div className="h-px w-12 bg-accent" />
        <div className="kicker mt-4 text-accent">{t.kicker}</div>
        <h2 className="mt-5 max-w-3xl font-display text-4xl font-light leading-[1.08] text-base lg:text-6xl">
          {t.title1}
          <br />
          {t.title2}
          <br />
          <span className="text-accent">{t.title3}</span>
        </h2>
        <p className="mt-7 max-w-xl leading-relaxed text-muted">{t.intro}</p>
      </div>

      {/* ── MASAÜSTÜ: sticky + scroll'a bağlı ──────────────── */}
      <div ref={wrap} className="relative mt-16 hidden h-[420vh] lg:block">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1.15fr_1fr] items-center gap-12 px-6 lg:px-10">
            {/* Dikey ilerleme çizgisi */}
            <ol className="relative flex h-[360px] flex-col justify-between" aria-hidden="true">
              <span className="absolute left-[5px] top-2 h-[calc(100%-16px)] w-px bg-line" />
              {[3, 2, 1, 0].map((idx) => (
                <li key={idx} className="relative flex items-center gap-4">
                  <span
                    className={`relative z-10 block h-[11px] w-[11px] rounded-full border transition-all duration-500 ${
                      active === idx
                        ? "scale-125 border-accent bg-accent"
                        : active > idx
                          ? "border-accent bg-accent/35"
                          : "border-line bg-cream"
                    }`}
                  />
                  <span
                    className={`data text-[10px] tracking-[0.18em] whitespace-nowrap transition-colors duration-500 ${
                      active === idx ? "text-accent" : "text-muted"
                    }`}
                  >
                    {t.layers[idx].no}
                  </span>
                </li>
              ))}
            </ol>

            {/* Çizim */}
            <SectionDrawing active={active} reduce={!!reduce} />

            {/* Aktif kat bilgisi */}
            <div className="relative min-h-[260px]">
              {t.layers.map((l, i) => (
                <motion.div
                  key={l.t}
                  className="absolute inset-x-0 top-0"
                  initial={false}
                  animate={{
                    opacity: active === i ? 1 : 0,
                    y: active === i ? 0 : 14,
                  }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ pointerEvents: active === i ? "auto" : "none" }}
                >
                  <div className="data text-[11px] tracking-[0.2em] text-accent">{l.no}</div>
                  <h3 className="mt-3 font-display text-3xl font-light text-base">{l.t}</h3>
                  <p className="mt-4 max-w-sm leading-relaxed text-muted">{l.d}</p>
                  <dl className="mt-7 flex gap-10 border-t border-line pt-5">
                    {l.data.map((d) => (
                      <div key={d.v}>
                        <dt className="data text-2xl text-base">{d.k}</dt>
                        <dd className="mt-1 text-[11px] tracking-[0.14em] text-muted uppercase">
                          {d.v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBİL: dikey yığın, pin yok ─────────────────────── */}
      <div className="mt-14 space-y-px lg:hidden">
        <div className="px-6 pb-6">
          <SectionDrawing active={3} reduce mobile />
        </div>
        {t.layers
          .slice()
          .reverse()
          .map((l) => (
            <div key={l.t} className="border-t border-line px-6 py-9">
              <div className="data text-[11px] tracking-[0.2em] text-accent">{l.no}</div>
              <h3 className="mt-2 font-display text-2xl font-light text-base">{l.t}</h3>
              <p className="mt-3 leading-relaxed text-muted">{l.d}</p>
              <dl className="mt-5 flex gap-8">
                {l.data.map((d) => (
                  <div key={d.v}>
                    <dt className="data text-xl text-base">{d.k}</dt>
                    <dd className="mt-0.5 text-[10px] tracking-[0.14em] text-muted uppercase">
                      {d.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
      </div>

      <div className="pb-32" />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Mimari kesit çizimi (SVG) — kağıt üzerine ince kontur.
   Aktif kat vurgulanır, diğerleri soluklaşır.
   ───────────────────────────────────────────────────────────── */
function SectionDrawing({
  active,
  reduce,
  mobile = false,
}: {
  active: number;
  reduce: boolean;
  mobile?: boolean;
}) {
  const dim = (i: number) => (mobile ? 1 : active === i ? 1 : 0.22);
  const T = { duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <svg
      viewBox="0 0 760 560"
      className="w-full"
      role="img"
      aria-label="Loft 777 dikey kesit çizimi: iki bodrum otopark, zemin katta çarşı ve havuzlu avlu, üstte çift yükseklik loft daireler ve teraslar"
    >
      {/* zemin çizgisi + toprak taraması */}
      <line x1="40" y1="392" x2="720" y2="392" stroke="var(--accent)" strokeWidth="1.4" />
      {Array.from({ length: 34 }).map((_, i) => (
        <line
          key={i}
          x1={40 + i * 20}
          y1={392}
          x2={32 + i * 20}
          y2={404}
          stroke="var(--line)"
          strokeWidth="1"
        />
      ))}

      {/* aktif kat vurgusu (yumuşak dolgu) */}
      {!mobile && (
        <motion.rect
          x="96"
          width="568"
          rx="1"
          fill="var(--accent)"
          initial={false}
          animate={{ y: BANDS[active].y, height: BANDS[active].h, opacity: 0.06 }}
          transition={T}
        />
      )}

      {/* ── 0 · OTOPARK (2 bodrum) ───────────────────── */}
      <motion.g animate={{ opacity: dim(0) }} transition={T}>
        <rect x="96" y="392" width="568" height="116" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
        <line x1="96" y1="450" x2="664" y2="450" stroke="var(--accent)" strokeWidth="1" />
        {[0, 1].map((row) =>
          Array.from({ length: 7 }).map((_, i) => (
            <rect
              key={`${row}-${i}`}
              x={124 + i * 74}
              y={row === 0 ? 410 : 468}
              width="46"
              height="20"
              rx="4"
              fill="none"
              stroke="var(--line)"
              strokeWidth="1.1"
            />
          )),
        )}
        <text x="110" y="500" className="data" fontSize="9" fill="var(--accent)" letterSpacing="2">
          −2 / −1
        </text>
      </motion.g>

      {/* ── 1 · ÇARŞI + AVLU ─────────────────────────── */}
      <motion.g animate={{ opacity: dim(1) }} transition={T}>
        <rect x="96" y="300" width="568" height="92" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
        {/* dükkan vitrinleri (dışa dönük yüz) */}
        {Array.from({ length: 4 }).map((_, i) => (
          <rect key={i} x={112 + i * 62} y={330} width="46" height="62" fill="none" stroke="var(--line)" strokeWidth="1.1" />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <rect key={`r${i}`} x={490 + i * 44} y={330} width="32" height="62" fill="none" stroke="var(--line)" strokeWidth="1.1" />
        ))}
        {/* havuzlu avlu (içe dönük) */}
        <rect x="300" y="352" width="152" height="40" fill="var(--accent)" opacity="0.14" />
        <path d="M300 372 q19 -7 38 0 t38 0 t38 0 t38 0" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
        <text x="322" y="343" className="data" fontSize="9" fill="var(--accent)" letterSpacing="1.6">
          HAVUZLU AVLU
        </text>
      </motion.g>

      {/* ── 2 · LOFT (çift yükseklik + galeri boşluğu) ── */}
      <motion.g animate={{ opacity: dim(2) }} transition={T}>
        <rect x="96" y="168" width="568" height="132" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
        {/* asma kat döşemesi — SADECE kenarlarda; ortada galeri boşluğu */}
        <line x1="96" y1="234" x2="286" y2="234" stroke="var(--accent)" strokeWidth="1.2" />
        <line x1="474" y1="234" x2="664" y2="234" stroke="var(--accent)" strokeWidth="1.2" />
        {/* merdiven */}
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={i}
            d={`M${286 + i * 9} ${292 - i * 10} h9 v-10`}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1.2"
          />
        ))}
        {/* GALERİ BOŞLUĞU — imza detay */}
        <rect x="300" y="168" width="152" height="132" fill="var(--accent)" opacity="0.08" />
        {/* 5,5 m ölçü oku */}
        <line x1="376" y1="176" x2="376" y2="292" stroke="var(--accent)" strokeWidth="1.1" />
        <path d="M371 182 l5 -7 l5 7" fill="none" stroke="var(--accent)" strokeWidth="1.1" />
        <path d="M371 286 l5 7 l5 -7" fill="none" stroke="var(--accent)" strokeWidth="1.1" />
        <rect x="352" y="222" width="48" height="17" fill="var(--color-cream)" />
        <text x="357" y="235" className="data" fontSize="11" fill="var(--accent)" letterSpacing="0.5">
          5,5 m
        </text>
        {/* pencereler */}
        {Array.from({ length: 3 }).map((_, i) => (
          <rect key={i} x={120 + i * 56} y={186} width="34" height="40" fill="none" stroke="var(--line)" strokeWidth="1.1" />
        ))}
        {Array.from({ length: 3 }).map((_, i) => (
          <rect key={`b${i}`} x={498 + i * 56} y={186} width="34" height="40" fill="none" stroke="var(--line)" strokeWidth="1.1" />
        ))}
      </motion.g>

      {/* ── 3 · DUBLEKS + TERAS ──────────────────────── */}
      <motion.g animate={{ opacity: dim(3) }} transition={T}>
        <rect x="96" y="104" width="568" height="64" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
        {/* teras korkulukları */}
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={i} x1={112 + i * 26} y1={104} x2={112 + i * 26} y2={88} stroke="var(--line)" strokeWidth="1" />
        ))}
        <line x1="96" y1="88" x2="664" y2="88" stroke="var(--accent)" strokeWidth="1.2" />
        <text x="110" y="128" className="data" fontSize="9" fill="var(--accent)" letterSpacing="1.6">
          TERAS
        </text>
      </motion.g>
    </svg>
  );
}
