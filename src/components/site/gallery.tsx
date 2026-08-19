"use client";

import { useMemo, useState } from "react";
import { Reveal } from "./reveal";
import { Lightbox } from "./lightbox";
import { CoverImage } from "./cover-image";
import type { Dict } from "@/lib/dict";

/**
 * Galeri — editoryal ritim.
 *
 * Önceki hâlde 20 görsel de birebir aynı 4:3 kutudaydı; bu bir galeri değil
 * katalog hissi veriyordu. Artık belirli sıralardaki kareler büyüyor:
 * göz önce büyük kareye takılıyor, sonra küçüklerde geziniyor.
 *
 * Desen İNDEKSE bağlı ve deterministik — filtre değişince kayar ama
 * her zaman aynı ritmi üretir (rastgelelik yok, sunucu/istemci farkı olmaz).
 */
function spanFor(i: number) {
  const m = i % 9;
  if (m === 0) return "col-span-2 row-span-2"; // büyük kare
  if (m === 5) return "col-span-2"; // yatay geniş
  return "";
}

export function Gallery({ t }: { t: Dict["gallery"] }) {
  const [cat, setCat] = useState<string>("all");
  const [idx, setIdx] = useState<number | null>(null);

  const items = useMemo(
    () => t.items.filter((i) => cat === "all" || i.cat === cat),
    [t.items, cat],
  );

  const cats: [string, string][] = [
    ["all", t.categories.all],
    ["exterior", t.categories.exterior],
    ["interior", t.categories.interior],
    ["social", t.categories.social],
    ["commercial", t.categories.commercial],
  ];

  return (
    <section className="paper bg-sand py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-10 bg-accent" />
            <span className="kicker text-accent">{t.kicker}</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-4xl leading-tight font-light text-base lg:text-5xl">
            {t.title1} <span className="text-accent">{t.title2}</span>
          </h2>
        </Reveal>

        {/* Kategori filtresi */}
        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-wrap gap-2" role="group" aria-label={t.kicker}>
            {cats.map(([key, label]) => {
              const on = cat === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setCat(key);
                    setIdx(null);
                  }}
                  aria-pressed={on}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    on
                      ? "bg-accent text-onaccent"
                      : "border border-line text-muted hover:border-accent hover:text-base"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Izgara — sabit satır yüksekliği + seçili karelerde 2'li açılım */}
        <div className="mt-9 grid auto-rows-[8.5rem] grid-cols-2 gap-2.5 sm:auto-rows-[10rem] sm:gap-3 md:auto-rows-[12rem] md:grid-cols-3 lg:auto-rows-[13.5rem] lg:grid-cols-4">
          {items.map((it, i) => (
            <button
              key={it.img}
              type="button"
              onClick={() => setIdx(i)}
              className={`group relative block overflow-hidden bg-sand-2 outline-offset-4 ${spanFor(i)}`}
              aria-label={it.caption}
            >
              <CoverImage
                src={it.img}
                alt={it.caption}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
              {/* Alt karartma — açıklama okunabilsin diye. Yazı BEYAZ:
                  önceki hâlde koyu mürekkep rengiyle koyu zemine yazılıyor,
                  yani pratikte hiç okunmuyordu. */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-1 text-left text-[12px] leading-snug font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {it.caption}
              </span>
              {/* Büyütülebildiğini gösteren işaret */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-paper/90 text-sm leading-none text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              >
                +
              </span>
            </button>
          ))}
        </div>

        <p className="mt-7 text-center text-xs text-muted">{t.hint}</p>
      </div>

      <Lightbox
        images={items.map((i) => ({ img: i.img, caption: i.caption }))}
        index={idx}
        onClose={() => setIdx(null)}
        onIndex={setIdx}
      />
    </section>
  );
}
