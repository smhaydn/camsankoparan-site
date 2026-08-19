"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

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
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex((index! + 1) % images.length);
      else if (e.key === "ArrowLeft") onIndex((index! - 1 + images.length) % images.length);
      else if (e.key === "Tab") {
        // Odak tuzağı: sekme penceresinin dışına çıkmasın
        const f = panel.current?.querySelectorAll<HTMLElement>("button");
        if (!f || f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, images.length, onClose, onIndex]);

  // Açıkken arka planın kaymasını durdur; kapanınca odağı geldiği yere iade et.
  // Kaydırma çubuğunun genişliği kadar dolgu eklenir, yoksa sayfa sıçrıyor.
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const bar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (bar > 0) body.style.paddingRight = `${bar}px`;
    panel.current?.focus();
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      opener.current?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          ref={panel}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={images[index!]?.caption ?? ""}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            // Mobilde parmakla kaydırarak gezinme
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) < 50) return;
            onIndex(
              dx < 0
                ? (index! + 1) % images.length
                : (index! - 1 + images.length) % images.length,
            );
          }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm outline-none"
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
              className="max-h-[82vh] w-auto rounded-md object-contain"
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
