"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IsProgramiGiris() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setErr("");
    try {
      const r = await fetch("/api/isprogrami/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        router.replace("/isprogrami");
        router.refresh();
      } else {
        setState("error");
        setErr(data.error || "Giriş yapılamadı");
      }
    } catch {
      setState("error");
      setErr("Bağlantı hatası");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display text-2xl font-semibold tracking-wide text-bronze">
            CAMSAN KOPARAN
          </div>
          <p className="mt-1 text-sm text-white/50">Şantiye İş Programı</p>
        </div>

        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-7"
        >
          <input
            autoFocus
            placeholder="Kullanıcı adı"
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-bronze"
          />
          <input
            type="password"
            placeholder="Şifre"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-bronze"
          />
          {state === "error" && <p className="text-sm text-red-400">{err}</p>}
          <button
            type="submit"
            disabled={state === "sending"}
            className="mt-1 rounded-full bg-bronze px-6 py-3 text-sm font-semibold text-ink transition hover:bg-bronze-light disabled:opacity-60"
          >
            {state === "sending" ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>
      </div>
    </main>
  );
}
