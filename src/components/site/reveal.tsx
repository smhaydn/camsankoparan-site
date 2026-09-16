"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Kaydırınca beliren içerik.
 * variant="mask" → maskeli açılma (clip-path), editoryal his
 * variant="up"   → yumuşak yukarı kayma (varsayılan)
 * Hareket azaltma tercihinde animasyon yok; içerik son haliyle görünür.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  variant = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  variant?: "up" | "mask";
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  if (variant === "mask") {
    return (
      <motion.div
        className={className}
        initial={{ clipPath: "inset(100% 0 0 0)", y: 12, opacity: 0 }}
        whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.85, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Başlığı SATIR SATIR maskeli açar (70ms kayma).
 * Ödüllü sitelerin imza hareketi — abartısız, orkestrasyonlu.
 */
export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span className={className}>
        {lines.map((l, i) => (
          <span key={i} className={`block ${lineClassName}`}>
            {l}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Başlığı KELİME KELİME, görünüme girince maskeden açar (ERA tarzı).
 * `parts` birden fazla parça alır → renkli ikinci yarı gibi vurgular korunur.
 * Kelimeler satır sonunda doğal kırılır; ekran okuyucu tam metni okur.
 */
export function WordReveal({
  parts,
  delay = 0,
}: {
  parts: { text: string; className?: string; br?: boolean }[]; // br: parçadan önce satır kır
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return parts.map((p, i) => (
      <span key={i} className={p.className}>
        {i > 0 && (p.br ? <br /> : " ")}
        {p.text}
      </span>
    ));
  }

  let n = 0;
  return (
    <motion.span
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-80px" }}
      aria-label={parts.map((p) => p.text).join(" ")}
    >
      {parts.map((p, pi) =>
        p.text.split(" ").map((w, wi) => {
          const i = n++;
          return (
            <span key={`${pi}-${wi}`} aria-hidden="true">
              {i > 0 && (wi === 0 && p.br ? <br /> : " ")}
              <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className={`inline-block ${p.className ?? ""}`}
                  variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
                  transition={{ duration: 0.9, delay: delay + i * 0.045, ease: EASE }}
                >
                  {w}
                </motion.span>
              </span>
            </span>
          );
        }),
      )}
    </motion.span>
  );
}
