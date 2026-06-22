"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type EditableContent = {
  contact: { phone: string; address: string; mail: string };
  project: { status: string; location: string };
  units: { type: string; size: string; d: string; img: string }[];
  texts: { heroSub: string; aboutBody: string; aboutIntro: string };
};

function toOverride(c: EditableContent) {
  return {
    contactPage: {
      phone: c.contact.phone,
      address: c.contact.address,
      mail: c.contact.mail,
    },
    project: {
      status: c.project.status,
      location: c.project.location,
      units: c.units.map((u) => ({ type: u.type, size: u.size, d: u.d, img: u.img })),
    },
    hero: { sub: c.texts.heroSub },
    about: { body: c.texts.aboutBody },
    aboutPage: { intro: c.texts.aboutIntro },
  };
}

export function ContentEditor({
  initialTr,
  initialEn,
}: {
  initialTr: EditableContent;
  initialEn: EditableContent;
}) {
  const router = useRouter();
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [tr, setTr] = useState<EditableContent>(initialTr);
  const [en, setEn] = useState<EditableContent>(initialEn);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  const c = lang === "tr" ? tr : en;
  const setC = lang === "tr" ? setTr : setEn;

  function patch(updater: (d: EditableContent) => EditableContent) {
    setC(updater(c));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setErr("");
    try {
      const r = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tr: toOverride(tr), en: toOverride(en) }),
      });
      if (r.ok) {
        setSaved(true);
        router.refresh();
      } else {
        setErr("Kaydedilemedi, tekrar deneyin.");
      }
    } catch {
      setErr("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Üst bar + sekmeler */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-display text-xl font-semibold tracking-wide text-bronze">
            LOFT 777
          </div>
          <p className="text-sm text-white/50">Site İçeriği</p>
        </div>
        <Link
          href="/yonetim"
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-bronze hover:text-bronze"
        >
          ← Talepler
        </Link>
      </div>

      {/* Dil seçimi */}
      <div className="mb-6 inline-flex rounded-full border border-white/15 p-1">
        {(["tr", "en"] as const).map((l) => (
          <button
            key={l}
            onClick={() => {
              setLang(l);
              setSaved(false);
            }}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition ${
              lang === l ? "bg-bronze text-ink" : "text-white/60 hover:text-white"
            }`}
          >
            {l === "tr" ? "Türkçe" : "English"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {/* İletişim */}
        <Section title="İletişim Bilgileri">
          <Field
            label="Telefon"
            value={c.contact.phone}
            onChange={(v) => patch((d) => ({ ...d, contact: { ...d.contact, phone: v } }))}
          />
          <Field
            label="Adres"
            textarea
            value={c.contact.address}
            onChange={(v) => patch((d) => ({ ...d, contact: { ...d.contact, address: v } }))}
          />
          <Field
            label="E-posta"
            value={c.contact.mail}
            onChange={(v) => patch((d) => ({ ...d, contact: { ...d.contact, mail: v } }))}
          />
        </Section>

        {/* Proje künyesi */}
        <Section title="Proje Künyesi">
          <Field
            label="Durum (ör. Kaba İnşaat Aşamasında)"
            value={c.project.status}
            onChange={(v) => patch((d) => ({ ...d, project: { ...d.project, status: v } }))}
          />
          <Field
            label="Konum (ör. Gaziemir, İzmir)"
            value={c.project.location}
            onChange={(v) => patch((d) => ({ ...d, project: { ...d.project, location: v } }))}
          />
        </Section>

        {/* Daire tipleri */}
        <Section title="Daire Tipleri">
          {c.units.map((u, i) => (
            <div key={i} className="rounded-md border border-white/10 p-4">
              <div className="mb-3 text-xs font-semibold tracking-wide text-bronze uppercase">
                {i + 1}. Daire
              </div>
              <Field
                label="Tip adı (ör. 1+1 — A Tipi)"
                value={u.type}
                onChange={(v) =>
                  patch((d) => ({
                    ...d,
                    units: d.units.map((x, j) => (j === i ? { ...x, type: v } : x)),
                  }))
                }
              />
              <Field
                label="Metrekare (ör. 55 m²)"
                value={u.size}
                onChange={(v) =>
                  patch((d) => ({
                    ...d,
                    units: d.units.map((x, j) => (j === i ? { ...x, size: v } : x)),
                  }))
                }
              />
              <Field
                label="Açıklama"
                textarea
                value={u.d}
                onChange={(v) =>
                  patch((d) => ({
                    ...d,
                    units: d.units.map((x, j) => (j === i ? { ...x, d: v } : x)),
                  }))
                }
              />
            </div>
          ))}
        </Section>

        {/* Ana metinler */}
        <Section title="Ana Metinler">
          <Field
            label="Hero alt yazısı (ana sayfa açılış metni)"
            textarea
            rows={3}
            value={c.texts.heroSub}
            onChange={(v) => patch((d) => ({ ...d, texts: { ...d.texts, heroSub: v } }))}
          />
          <Field
            label="Ana sayfa 'Hakkında' metni"
            textarea
            rows={4}
            value={c.texts.aboutBody}
            onChange={(v) => patch((d) => ({ ...d, texts: { ...d.texts, aboutBody: v } }))}
          />
          <Field
            label="Hakkında sayfası giriş metni"
            textarea
            rows={4}
            value={c.texts.aboutIntro}
            onChange={(v) => patch((d) => ({ ...d, texts: { ...d.texts, aboutIntro: v } }))}
          />
        </Section>
      </div>

      {/* Kaydet */}
      <div className="sticky bottom-0 mt-8 flex items-center gap-4 border-t border-white/10 bg-ink/95 py-4 backdrop-blur">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-bronze px-8 py-3 text-sm font-semibold text-ink transition hover:bg-bronze-light disabled:opacity-60"
        >
          {saving ? "Kaydediliyor…" : "Kaydet (TR + EN)"}
        </button>
        {saved && <span className="text-sm text-green-400">Kaydedildi ✓ Sitede güncellendi.</span>}
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
  textarea,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-white/50">{label}</span>
      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-bronze"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-bronze"
        />
      )}
    </label>
  );
}
