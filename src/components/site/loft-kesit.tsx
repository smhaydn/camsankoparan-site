"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "./reveal";
import type { Dict } from "@/lib/dict";

/**
 * GALERİ BOŞLUĞU — dairenin kendi kesiti (ikinci imza bölüm).
 * Çift yükseklik planda görünmez, fotoğrafta anlaşılmaz; sadece KESİTTE okunur.
 * Mahaller üzerine gelince vurgulanır, m² mono fontla belirir.
 * Ölçüler C Blok kat planından (gerçek veri).
 */

// SVG yerleşimi: zemin kat altta, asma kat üstte, salon iki katı birden kaplar
const GEO = {
  salon: { x: 60, y: 150, w: 250, h: 190 },
  mutfak: { x: 310, y: 250, w: 130, h: 90 },
  yatak: { x: 310, y: 150, w: 130, h: 96 },
  banyo: { x: 444, y: 150, w: 76, h: 96 },
  galeri: { x: 60, y: 150, w: 250, h: 96 },
} as const;

type RoomId = keyof typeof GEO;

export function LoftKesit({ t }: { t: Dict["loftKesit"] }) {
  const [hover, setHover] = useState<RoomId | null>(null);
  const reduce = useReducedMotion();
  const T = { duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] as const };

  const isOn = (id: RoomId) => hover === id;
  const dim = (id: RoomId) => (hover && !isOn(id) ? 0.35 : 1);

  return (
    <section className="paper bg-sand py-32" aria-label={t.kicker}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          {/* Sol: metin + mahal listesi */}
          <div>
            <Reveal>
              <div className="h-px w-12 bg-accent" />
              <div className="kicker mt-4 text-accent">{t.kicker}</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-4xl leading-[1.1] font-light text-base lg:text-5xl">
                {t.title1}
                <br />
                <span className="text-accent">{t.title2}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md leading-relaxed text-muted">{t.body}</p>
            </Reveal>

            {/* Mahal listesi — hover ile çizimle eşleşir */}
            <Reveal delay={0.15}>
              <ul className="mt-9 border-t border-line">
                {t.rooms.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setHover(r.id as RoomId)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(r.id as RoomId)}
                      onBlur={() => setHover(null)}
                      className={`flex w-full items-baseline justify-between border-b border-line py-3.5 text-left transition-colors ${
                        isOn(r.id as RoomId) ? "text-accent" : "text-base"
                      }`}
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          className={`inline-block h-1.5 w-1.5 transition-colors ${
                            isOn(r.id as RoomId) ? "bg-accent" : "bg-line"
                          }`}
                        />
                        <span className={r.floor === "void" ? "font-medium" : ""}>{r.t}</span>
                      </span>
                      <span className="data text-sm">{r.m2} m²</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-muted italic">{t.note}</p>
            </Reveal>
          </div>

          {/* Sağ: kesit çizimi */}
          <Reveal delay={0.1} variant="mask">
            <figure>
              <svg
                viewBox="0 0 580 400"
                className="w-full"
                role="img"
                aria-label="1+1 Loft dairenin kesiti: zemin katta salon ve mutfak, asma katta yatak odası ve banyo, salonun üstünde 19 metrekarelik galeri boşluğu ve 5,5 metre çift yükseklik"
              >
                {/* zemin çizgisi */}
                <line x1="30" y1="340" x2="550" y2="340" stroke="var(--accent)" strokeWidth="1.6" />
                {Array.from({ length: 26 }).map((_, i) => (
                  <line
                    key={i}
                    x1={30 + i * 20}
                    y1={340}
                    x2={22 + i * 20}
                    y2={352}
                    stroke="var(--line)"
                    strokeWidth="1"
                  />
                ))}

                {/* GALERİ BOŞLUĞU — taramalı, imza detay */}
                <defs>
                  <pattern id="voidHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="var(--accent)" strokeWidth="1" opacity="0.35" />
                  </pattern>
                </defs>
                <motion.rect
                  {...GEO.galeri}
                  fill="url(#voidHatch)"
                  animate={{ opacity: isOn("galeri") ? 1 : 0.55 }}
                  transition={T}
                />

                {/* mahaller */}
                {(["salon", "mutfak", "yatak", "banyo"] as RoomId[]).map((id) => (
                  <motion.rect
                    key={id}
                    {...GEO[id]}
                    fill={isOn(id) ? "var(--accent)" : "transparent"}
                    fillOpacity={isOn(id) ? 0.1 : 0}
                    stroke="var(--accent)"
                    strokeWidth="1.3"
                    animate={{ opacity: dim(id) }}
                    transition={T}
                  />
                ))}

                {/* asma kat döşemesi — SADECE sağ tarafta (solda boşluk var) */}
                <line x1="310" y1="246" x2="520" y2="246" stroke="var(--accent)" strokeWidth="2" />

                {/* dış kabuk */}
                <rect x="60" y="150" width="460" height="190" fill="none" stroke="var(--accent)" strokeWidth="1.6" />

                {/* metal merdiven — zeminden asma kata */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <path
                    key={i}
                    d={`M${268 - i * 5} ${338 - i * 11} h14 v-11`}
                    fill="none"
                    stroke={hover === null || isOn("salon") ? "var(--accent)" : "var(--line)"}
                    strokeWidth="1.3"
                  />
                ))}

                {/* 5,5 m ÖLÇÜ OKU — çift yükseklik */}
                <line x1="105" y1="158" x2="105" y2="332" stroke="var(--accent)" strokeWidth="1.2" />
                <path d="M100 164 l5 -7 l5 7" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
                <path d="M100 326 l5 7 l5 -7" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
                <rect x="78" y="234" width="56" height="22" fill="var(--color-sand)" />
                <text x="84" y="250" className="data" fontSize="14" fill="var(--accent)">
                  5,5 m
                </text>

                {/* kat etiketleri */}
                <text x="36" y="300" className="data" fontSize="9" fill="var(--color-stone)" letterSpacing="1.4" writingMode="tb">
                  {t.floors.ground.toUpperCase()}
                </text>
                <text x="540" y="200" className="data" fontSize="9" fill="var(--color-stone)" letterSpacing="1.4" writingMode="tb">
                  {t.floors.mezzanine.toUpperCase()}
                </text>

                {/* galeri boşluğu etiketi */}
                <motion.g animate={{ opacity: isOn("galeri") ? 1 : 0.75 }} transition={T}>
                  <text x="120" y="196" className="data" fontSize="10" fill="var(--accent)" letterSpacing="1.6">
                    {t.voidLabel.toUpperCase()}
                  </text>
                  <text x="120" y="214" className="data" fontSize="13" fill="var(--accent)">
                    19,02 m²
                  </text>
                </motion.g>

                {/* merdiven notu */}
                <text x="200" y="372" className="data" fontSize="8.5" fill="var(--color-stone)" letterSpacing="1.2">
                  {t.stair.toUpperCase()}
                </text>
              </svg>
              <figcaption className="mt-4 text-center text-xs text-muted lg:hidden">{t.hint}</figcaption>
            </figure>

            {/* KANIT FOTOĞRAFI — çizim anlatır, fotoğraf kanıtlar.
                Asma kat ve metal merdiven bu karede net görünüyor. */}
            <figure className="mt-8">
              <div
                className="aspect-[16/9] w-full bg-cover bg-center"
                role="img"
                aria-label={t.proofAlt}
                style={{ backgroundImage: `url('${t.proofImg}')` }}
              />
              <figcaption className="mt-3 flex items-start gap-2.5 text-xs leading-relaxed text-muted">
                <span className="mt-1.5 block h-px w-5 shrink-0 bg-accent" />
                {t.proofCaption}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
