"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { SEGMENTS, type Dict } from "@/lib/dict";
import { path, type Locale } from "@/lib/i18n";
import { CoverImage } from "./cover-image";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({
  t,
  locale,
}: {
  t: Dict["hero"];
  locale: Locale;
}) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      <div className="absolute inset-0">
        {t.video ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={t.video}
            poster="/renders/hava-on-cephe.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <CoverImage
            src="/renders/hava-on-cephe.jpg"
            alt={
              locale === "en"
                ? "Loft 777 residential complex at sunset, Gaziemir Izmir"
                : "Loft 777 konut projesi gün batımında, Gaziemir İzmir"
            }
            priority
            sizes="100vw"
            className="kenburns"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 lg:px-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="mb-6 flex items-center gap-4"
          >
            <span className="h-px w-12 bg-bronze" />
            <span className="kicker text-bronze-pale">{t.kicker}</span>
          </motion.div>

          {/* Satır satır MASKELİ açılma — imza giriş hareketi */}
          <h1 className="font-display text-5xl font-light leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            {t.lines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "108%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, delay: 0.15 + i * 0.08, ease }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "108%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, delay: 0.15 + t.lines.length * 0.08, ease }}
                className="block font-normal text-bronze"
              >
                {t.last}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-white/70"
          >
            {t.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href={path(locale, SEGMENTS.projects)}
              className="rounded-full bg-bronze px-8 py-3.5 text-sm font-semibold tracking-wide text-onaccent transition hover:bg-bronze-light"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href={path(locale, SEGMENTS.contact)}
              className="rounded-full border border-white/25 px-8 py-3.5 text-sm font-medium tracking-wide text-white transition hover:border-white hover:bg-white/5"
            >
              {t.ctaSecondary}
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-11 w-6 items-start justify-center rounded-full border border-white/30 p-1.5">
          <motion.span
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-bronze"
          />
        </div>
      </motion.div>
    </section>
  );
}
