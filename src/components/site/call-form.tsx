"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Dict } from "@/lib/dict";
import { trackLead } from "@/lib/track";

export function CallForm({ t, extra }: { t: Dict["callForm"]; extra: Dict["formExtra"] }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", phone: "", message: "", unit: "", kvkk: false });
  const [kvkkErr, setKvkkErr] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    if (!form.kvkk) {
      setKvkkErr(true);
      return;
    }
    setKvkkErr(false);
    setState("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          message: form.message,
          unit_interest: form.unit,
          source: "call-form",
        }),
      });
      if (r.ok) {
        setState("done");
        trackLead();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <>
      {/* Sağ kenardaki dikey sekme */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 origin-bottom-right items-center gap-2 rounded-t-md bg-bronze px-4 py-3 text-sm font-semibold text-ink shadow-lg transition hover:bg-bronze-light"
        style={{ writingMode: "vertical-rl" }}
        aria-label={t.tab}
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-ink" />
        {t.tab}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-ink p-8 shadow-2xl sm:p-10"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-6 top-6 text-2xl text-white/60 transition hover:text-white"
                aria-label="Kapat"
              >
                ×
              </button>

              <div className="mt-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-8 bg-bronze" />
                  <span className="kicker text-bronze">{t.title}</span>
                </div>
                <h3 className="font-display text-3xl font-light text-white">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{t.sub}</p>
              </div>

              {state === "done" ? (
                <div className="mt-10 rounded-sm border border-bronze/40 bg-bronze/10 p-6 text-center text-bronze-pale">
                  {t.success}
                </div>
              ) : (
                <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
                  <input
                    required
                    placeholder={t.name}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-bronze"
                  />
                  <input
                    required
                    type="tel"
                    placeholder={t.phone}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-bronze"
                  />
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-bronze"
                  >
                    <option value="" className="bg-ink">
                      {extra.unitPlaceholder}
                    </option>
                    {extra.unitOptions.map((o) => (
                      <option key={o.value} value={o.value} className="bg-ink">
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <textarea
                    rows={3}
                    placeholder={t.msg}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-bronze"
                  />

                  <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-white/55">
                    <input
                      type="checkbox"
                      checked={form.kvkk}
                      onChange={(e) => {
                        setForm({ ...form, kvkk: e.target.checked });
                        if (e.target.checked) setKvkkErr(false);
                      }}
                      className="mt-0.5 accent-bronze"
                    />
                    <span>{extra.kvkkText}</span>
                  </label>
                  {kvkkErr && <p className="text-xs text-red-400">{extra.kvkkRequired}</p>}

                  {state === "error" && <p className="text-sm text-red-400">{t.error}</p>}
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="rounded-full bg-bronze px-8 py-3.5 text-sm font-semibold tracking-wide text-ink transition hover:bg-bronze-light disabled:opacity-60"
                  >
                    {state === "sending" ? t.sending : t.send}
                  </button>
                </form>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
