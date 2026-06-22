"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { SEGMENTS, type Dict } from "@/lib/dict";
import { path, type Locale } from "@/lib/i18n";
import { useCatalog } from "./catalog-provider";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({
  t,
  locale,
  catalogLabel,
}: {
  t: Dict["hero"];
  locale: Locale;
  catalogLabel: string;
}) {
  const { open: openCatalog } = useCatalog();
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      <div className="absolute inset-0">
        {t.video ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={t.video}
            poster="/renders/dis-cephe-gece-1.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div
            className="kenburns absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/renders/dis-cephe-gece-1.jpg')" }}
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

          <h1 className="font-display text-5xl font-light leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            {t.lines.map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.13, ease }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease }}
              className="block font-normal text-bronze"
            >
              {t.last}
            </motion.span>
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
              className="rounded-full bg-bronze px-8 py-3.5 text-sm font-semibold tracking-wide text-ink transition hover:bg-bronze-light"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href={path(locale, SEGMENTS.contact)}
              className="rounded-full border border-white/25 px-8 py-3.5 text-sm font-medium tracking-wide text-white transition hover:border-white hover:bg-white/5"
            >
              {t.ctaSecondary}
            </Link>
            <button
              onClick={openCatalog}
              className="group flex items-center gap-3 px-3 py-3.5 text-sm font-medium tracking-wide text-white transition hover:text-bronze"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-bronze/50 text-bronze transition group-hover:bg-bronze group-hover:text-ink">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 7v13M3 5h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6v12h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3H3z" />
                </svg>
              </span>
              {catalogLabel}
            </button>
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
