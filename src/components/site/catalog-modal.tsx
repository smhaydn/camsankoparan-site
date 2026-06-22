"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Dict } from "@/lib/dict";

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0, scale: 1.05 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0, scale: 1.05 }),
};

export function CatalogModal({
  dict,
  onClose,
}: {
  dict: Dict["catalog"];
  onClose: () => void;
}) {
  const pages = dict.pages;
  const [[page, dir], setPage] = useState<[number, number]>([0, 0]);

  const go = useCallback(
    (d: number) => {
      setPage(([p]) => {
        const next = p + d;
        if (next < 0 || next >= pages.length) return [p, d];
        return [next, d];
      });
    },
    [pages.length],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [go, onClose]);

  const cur = pages[page];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex flex-col bg-ink"
    >
      {/* Üst bar */}
      <div className="flex items-center justify-between px-6 py-5 lg:px-10">
        <div>
          <div className="kicker text-bronze">{dict.title}</div>
          <div className="mt-1 text-xs text-white/50">{dict.subtitle}</div>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-sm font-medium text-white/60">
            {String(page + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
          </span>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-xl text-white/70 transition hover:border-bronze hover:text-bronze"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
      </div>

      {/* Sahne */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence custom={dir} initial={false} mode="popLayout">
          <motion.div
            key={page}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.4 }, scale: { duration: 0.7 } }}
            className="absolute inset-0"
          >
            <div
              className="kenburns absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${cur.img}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-8 pb-16 lg:pb-20">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
              >
                <div className="mb-3 h-px w-14 bg-bronze" />
                <h2 className="font-display text-4xl font-light text-white lg:text-6xl">
                  {cur.title}
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-white/70">{cur.caption}</p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Oklar */}
        <button
          onClick={() => go(-1)}
          disabled={page === 0}
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/40 text-xl text-white backdrop-blur transition hover:border-bronze hover:text-bronze disabled:opacity-30 lg:left-8"
          aria-label="Önceki"
        >
          ‹
        </button>
        <button
          onClick={() => go(1)}
          disabled={page === pages.length - 1}
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/40 text-xl text-white backdrop-blur transition hover:border-bronze hover:text-bronze disabled:opacity-30 lg:right-8"
          aria-label="Sonraki"
        >
          ›
        </button>
      </div>

      {/* Alt: nokta göstergeleri */}
      <div className="flex items-center justify-center gap-2 py-6">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > page ? 1 : -1])}
            className={`h-1.5 rounded-full transition-all ${
              i === page ? "w-8 bg-bronze" : "w-2 bg-white/25 hover:bg-white/50"
            }`}
            aria-label={`Sayfa ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
