"use client";

import { useMemo, useState } from "react";
import { Reveal } from "./reveal";
import { Lightbox } from "./lightbox";
import type { Dict } from "@/lib/dict";

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
    <section className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-10 bg-bronze" />
            <span className="kicker text-bronze">{t.kicker}</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-4xl font-light leading-tight text-white lg:text-5xl">
            {t.title1} <span className="text-bronze">{t.title2}</span>
          </h2>
        </Reveal>

        {/* Kategori filtresi */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-2">
            {cats.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCat(key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  cat === key
                    ? "bg-bronze text-ink"
                    : "border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Izgara */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.img} delay={(i % 8) * 0.04}>
              <button
                onClick={() => setIdx(i)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-sm"
                aria-label={it.caption}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${it.img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {it.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-white/40">{t.hint}</p>
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
