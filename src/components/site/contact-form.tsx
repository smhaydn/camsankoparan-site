"use client";

import { useState } from "react";
import type { Dict } from "@/lib/dict";
import { trackLead } from "@/lib/track";

// İletişim sayfasındaki form — talepleri /api/lead üzerinden Supabase'e kaydeder.
export function ContactForm({
  t,
  fb,
  extra,
}: {
  t: Dict["contactPage"];
  fb: Dict["callForm"]; // success / error / sending mesajları
  extra: Dict["formExtra"];
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    unit: "",
    kvkk: false,
  });
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
          message: [form.email ? `E-posta: ${form.email}` : "", form.message]
            .filter(Boolean)
            .join(" — "),
          unit_interest: form.unit,
          source: "contact-page",
        }),
      });
      if (r.ok) {
        setState("done");
        trackLead();
        setForm({ name: "", email: "", phone: "", message: "", unit: "", kvkk: false });
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-sm border border-bronze/40 bg-bronze/10 p-8 text-center text-bronze-pale">
        {fb.success}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-sm border border-line bg-surface-2 p-8">
      <div className="grid gap-5">
        <input
          required
          placeholder={t.formName}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-sm border border-line bg-card px-4 py-3 text-sm outline-none focus:border-bronze"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <input
            type="email"
            placeholder={t.formMail}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-sm border border-line bg-card px-4 py-3 text-sm outline-none focus:border-bronze"
          />
          <input
            required
            type="tel"
            placeholder={t.formPhone}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-sm border border-line bg-card px-4 py-3 text-sm outline-none focus:border-bronze"
          />
        </div>
        <select
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          className="rounded-sm border border-line bg-card px-4 py-3 text-sm outline-none focus:border-bronze"
        >
          <option value="">{extra.unitPlaceholder}</option>
          {extra.unitOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <textarea
          placeholder={t.formMsg}
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="rounded-sm border border-line bg-card px-4 py-3 text-sm outline-none focus:border-bronze"
        />

        <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-base/70">
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
        {kvkkErr && <p className="text-xs text-red-500">{extra.kvkkRequired}</p>}

        {state === "error" && <p className="text-sm text-red-500">{fb.error}</p>}
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-ink px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-bronze hover:text-ink disabled:opacity-60"
        >
          {state === "sending" ? fb.sending : t.formSend}
        </button>
      </div>
    </form>
  );
}
