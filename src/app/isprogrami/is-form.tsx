"use client";

import { useState } from "react";
import type { Is } from "@/lib/isprogrami-listeler";
import {
  ANA_KALEMLER,
  BLOKLAR,
  KATLAR,
  ACIKLAMA2,
  BIRIMLER,
  EKIPLER,
  ONCELIKLER,
  DURUMLAR,
  IMALAT_DETAYLARI,
} from "@/lib/isprogrami-listeler";

// Tarih yardımcıları (saat dilimi sorunlarını önlemek için düz metin matematiği)
function tarihEkle(iso: string, gun: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + gun);
  return dt.toISOString().slice(0, 10);
}
function tarihFark(a: string, b: string): number {
  const da = Date.UTC(...(a.split("-").map(Number) as [number, number, number]));
  const db = Date.UTC(...(b.split("-").map(Number) as [number, number, number]));
  return Math.round((db - da) / 86400000);
}

type FormAlan = {
  ana_kalemi: string;
  imalat: string;
  blok: string;
  kat: string;
  aciklama1: string;
  aciklama2: string;
  metraj: string;
  birim: string;
  gerc_yuzde: string;
  gun: string;
  baslangic: string;
  bitis: string;
  durum: string;
  ekip: string;
  bagli_is_1: string;
  oncelik: string;
};

function bosForm(): FormAlan {
  return {
    ana_kalemi: "",
    imalat: "",
    blok: "",
    kat: "",
    aciklama1: "",
    aciklama2: "",
    metraj: "",
    birim: "",
    gerc_yuzde: "0",
    gun: "",
    baslangic: "",
    bitis: "",
    durum: "Başlanmadı",
    ekip: "",
    bagli_is_1: "",
    oncelik: "Normal",
  };
}

function doldur(is: Is): FormAlan {
  const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));
  return {
    ana_kalemi: s(is.ana_kalemi),
    imalat: s(is.imalat),
    blok: s(is.blok),
    kat: s(is.kat),
    aciklama1: s(is.aciklama1),
    aciklama2: s(is.aciklama2),
    metraj: s(is.metraj),
    birim: s(is.birim),
    gerc_yuzde: s(is.gerc_yuzde ?? 0),
    gun: s(is.gun),
    baslangic: s(is.baslangic),
    bitis: s(is.bitis),
    durum: s(is.durum) || "Başlanmadı",
    ekip: s(is.ekip),
    bagli_is_1: s(is.bagli_is_1),
    oncelik: s(is.oncelik) || "Normal",
  };
}

export function IsForm({
  is,
  bagliSecenekler,
  onClose,
  onSaved,
}: {
  is: Is | null;
  bagliSecenekler: { id: string; etiket: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = useState<FormAlan>(is ? doldur(is) : bosForm());
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function set(alan: keyof FormAlan, v: string) {
    setF((p) => ({ ...p, [alan]: v }));
  }

  // gün değişince bitişi hesapla
  function gunDegis(v: string) {
    setF((p) => {
      const next = { ...p, gun: v };
      const g = Number(v);
      if (p.baslangic && Number.isFinite(g) && g > 0) {
        next.bitis = tarihEkle(p.baslangic, g);
      }
      return next;
    });
  }
  // başlangıç değişince (gün varsa) bitişi hesapla
  function baslangicDegis(v: string) {
    setF((p) => {
      const next = { ...p, baslangic: v };
      const g = Number(p.gun);
      if (v && Number.isFinite(g) && g > 0) next.bitis = tarihEkle(v, g);
      return next;
    });
  }
  // bitiş elle değişince günü hesapla
  function bitisDegis(v: string) {
    setF((p) => {
      const next = { ...p, bitis: v };
      if (p.baslangic && v) {
        const fark = tarihFark(p.baslangic, v);
        if (fark >= 0) next.gun = String(fark);
      }
      return next;
    });
  }

  async function kaydet(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    const govde = {
      ...f,
      metraj: f.metraj === "" ? null : f.metraj,
      gerc_yuzde: f.gerc_yuzde === "" ? null : f.gerc_yuzde,
      gun: f.gun === "" ? null : f.gun,
    };
    const url = is ? `/api/isprogrami/isler/${is.id}` : "/api/isprogrami/isler";
    const method = is ? "PATCH" : "POST";
    try {
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(govde),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        onSaved();
      } else {
        setErr(data.error || "Kaydedilemedi");
        setSaving(false);
      }
    } catch {
      setErr("Bağlantı hatası");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-4 w-full max-w-2xl rounded-xl border border-white/15 bg-ink p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-bronze">
            {is ? "İşi Düzenle" : "Yeni İş Ekle"}
          </h3>
          <button onClick={onClose} className="text-2xl leading-none text-white/50 hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={kaydet} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Alan label="Ana İnş. Kalemi">
            <Sec value={f.ana_kalemi} onChange={(v) => set("ana_kalemi", v)} secenekler={ANA_KALEMLER} />
          </Alan>
          <Alan label="İmalat (kod/ad)">
            <Metin value={f.imalat} onChange={(v) => set("imalat", v)} placeholder="ör. Kalıp-001" />
          </Alan>
          <Alan label="Blok">
            <Sec value={f.blok} onChange={(v) => set("blok", v)} secenekler={BLOKLAR} />
          </Alan>
          <Alan label="Kat">
            <Sec value={f.kat} onChange={(v) => set("kat", v)} secenekler={KATLAR} />
          </Alan>
          <Alan label="Açıklama-1 (İmalat Detayı)">
            <Sec value={f.aciklama1} onChange={(v) => set("aciklama1", v)} secenekler={IMALAT_DETAYLARI} />
          </Alan>
          <Alan label="Açıklama-2">
            <Sec value={f.aciklama2} onChange={(v) => set("aciklama2", v)} secenekler={ACIKLAMA2} />
          </Alan>
          <Alan label="Metraj">
            <Metin value={f.metraj} onChange={(v) => set("metraj", v)} placeholder="0" inputMode="decimal" />
          </Alan>
          <Alan label="Birim">
            <Sec value={f.birim} onChange={(v) => set("birim", v)} secenekler={BIRIMLER} />
          </Alan>
          <Alan label="Başlangıç Tarihi">
            <input
              type="date"
              value={f.baslangic}
              onChange={(e) => baslangicDegis(e.target.value)}
              className={inputCls}
            />
          </Alan>
          <Alan label="Süre (gün)">
            <Metin value={f.gun} onChange={gunDegis} placeholder="0" inputMode="numeric" />
          </Alan>
          <Alan label="Bitiş Tarihi">
            <input
              type="date"
              value={f.bitis}
              onChange={(e) => bitisDegis(e.target.value)}
              className={inputCls}
            />
          </Alan>
          <Alan label="Gerçekleşme (%)">
            <Metin value={f.gerc_yuzde} onChange={(v) => set("gerc_yuzde", v)} placeholder="0" inputMode="numeric" />
          </Alan>
          <Alan label="Durum">
            <select value={f.durum} onChange={(e) => set("durum", e.target.value)} className={inputCls}>
              {DURUMLAR.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.emoji} {d.value}
                </option>
              ))}
            </select>
          </Alan>
          <Alan label="Ekip">
            <Sec value={f.ekip} onChange={(v) => set("ekip", v)} secenekler={EKIPLER} />
          </Alan>
          <Alan label="Öncelik">
            <select value={f.oncelik} onChange={(e) => set("oncelik", e.target.value)} className={inputCls}>
              {ONCELIKLER.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Alan>
          <Alan label="Bağlı İş (önce biten)">
            <select
              value={f.bagli_is_1}
              onChange={(e) => set("bagli_is_1", e.target.value)}
              className={inputCls}
            >
              <option value="">— Yok —</option>
              {bagliSecenekler.map((b) => (
                <option key={b.id} value={b.etiket}>
                  {b.etiket}
                </option>
              ))}
            </select>
          </Alan>

          {err && <p className="sm:col-span-2 text-sm text-red-400">{err}</p>}

          <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-bronze px-6 py-2.5 text-sm font-semibold text-ink transition hover:bg-bronze-light disabled:opacity-60"
            >
              {saving ? "Kaydediliyor…" : is ? "Kaydet" : "İş Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-bronze [color-scheme:dark]";

function Alan({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-white/50">{label}</span>
      {children}
    </label>
  );
}

function Metin({
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "decimal" | "numeric";
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      className={inputCls}
    />
  );
}

function Sec({
  value,
  onChange,
  secenekler,
}: {
  value: string;
  onChange: (v: string) => void;
  secenekler: readonly string[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      <option value="">— Seç —</option>
      {secenekler.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
