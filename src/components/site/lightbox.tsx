"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

export type LightboxImage = { img: string; caption?: string };

// Görsel büyütme penceresi (ok/Esc ile gezinme). Kontrollü: ebeveyn index'i yönetir.
export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex((index! + 1) % images.length);
      else if (e.key === "ArrowLeft") onIndex((index! - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, images.length, onClose, onIndex]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
        >
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="absolute right-5 top-5 text-3xl leading-none text-white/70 transition hover:text-white"
          >
            ×
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index! - 1 + images.length) % images.length);
            }}
            aria-label="Önceki"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-2xl text-white/80 transition hover:border-bronze hover:text-bronze sm:left-6"
          >
            ‹
          </button>

          <motion.figure
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88vh] max-w-5xl flex-col items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index!].img}
              alt={images[index!].caption ?? ""}
              className="max-h-[82vh] w-auto rounded-md object-contain shadow-2xl"
            />
            {images[index!].caption && (
              <figcaption className="mt-3 text-center text-sm text-white/70">
                {images[index!].caption} · {index! + 1}/{images.length}
              </figcaption>
            )}
          </motion.figure>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index! + 1) % images.length);
            }}
            aria-label="Sonraki"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-2xl text-white/80 transition hover:border-bronze hover:text-bronze sm:right-6"
          >
            ›
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
