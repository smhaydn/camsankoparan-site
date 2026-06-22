"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AppSettings } from "@/lib/supabase-admin";

export function ReklamEditor({ initial }: { initial: AppSettings }) {
  const router = useRouter();
  const [s, setS] = useState<AppSettings>({
    meta_pixel_id: initial.meta_pixel_id ?? "",
    meta_capi_token: initial.meta_capi_token ?? "",
    ga4_id: initial.ga4_id ?? "",
    google_ads_id: initial.google_ads_id ?? "",
    google_ads_label: initial.google_ads_label ?? "",
    google_site_verification: initial.google_site_verification ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  function set(k: keyof AppSettings, v: string) {
    setS((p) => ({ ...p, [k]: v }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setErr("");
    try {
      const r = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      if (r.ok) {
        setSaved(true);
        router.refresh();
      } else {
        const d = await r.json().catch(() => ({}));
        setErr(
          d.error === "SERVICE_KEY_MISSING"
            ? "Önce ayar tablosu (app_settings) oluşturulmalı."
            : "Kaydedilemedi, tekrar deneyin.",
        );
      }
    } catch {
      setErr("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-display text-xl font-semibold tracking-wide text-bronze">
            LOFT 777
          </div>
          <p className="text-sm text-white/50">Reklam & Takip</p>
        </div>
        <Link
          href="/yonetim"
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-bronze hover:text-bronze"
        >
          ← Talepler
        </Link>
      </div>

      <p className="mb-6 rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/60">
        Reklam takip kimliklerini buraya girince site otomatik olarak <b>sayfa görüntüleme</b> ve
        form dolunca <b>&quot;Lead&quot;</b> olayını Meta ve Google&apos;a gönderir. Hesaplar henüz
        kurulmadıysa boş bırak; sonra birlikte dolduracağız.
      </p>

      <div className="flex flex-col gap-8">
        {/* Meta */}
        <Section title="Meta (Facebook / Instagram)">
          <Field
            label="Meta Pixel ID"
            placeholder="ör. 1234567890"
            value={s.meta_pixel_id ?? ""}
            onChange={(v) => set("meta_pixel_id", v)}
          />
          <Field
            label="Meta CAPI Erişim Anahtarı (gizli — sunucuda kalır)"
            placeholder="EAAB... (Conversions API token)"
            value={s.meta_capi_token ?? ""}
            onChange={(v) => set("meta_capi_token", v)}
          />
        </Section>

        {/* Google */}
        <Section title="Google (Analytics & Ads)">
          <Field
            label="GA4 Ölçüm Kimliği"
            placeholder="G-XXXXXXX"
            value={s.ga4_id ?? ""}
            onChange={(v) => set("ga4_id", v)}
          />
          <Field
            label="Google Ads Dönüşüm Kimliği"
            placeholder="AW-XXXXXXXXX"
            value={s.google_ads_id ?? ""}
            onChange={(v) => set("google_ads_id", v)}
          />
          <Field
            label="Google Ads Dönüşüm Etiketi (label)"
            placeholder="ör. abcDEF123"
            value={s.google_ads_label ?? ""}
            onChange={(v) => set("google_ads_label", v)}
          />
        </Section>

        {/* Google Search Console */}
        <Section title="Google Search Console (SEO)">
          <Field
            label="Doğrulama kodu (google-site-verification → content değeri)"
            placeholder="ör. AbC123... (tüm etiket değil, sadece kod)"
            value={s.google_site_verification ?? ""}
            onChange={(v) => set("google_site_verification", v)}
          />
        </Section>
      </div>

      <div className="sticky bottom-0 mt-8 flex items-center gap-4 border-t border-white/10 bg-ink/95 py-4 backdrop-blur">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-bronze px-8 py-3 text-sm font-semibold text-ink transition hover:bg-bronze-light disabled:opacity-60"
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {saved && <span className="text-sm text-green-400">Kaydedildi ✓</span>}
        {err && <span className="text-sm text-red-400">{err}</span>}
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-white">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-white/50">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-bronze"
      />
    </label>
  );
}
