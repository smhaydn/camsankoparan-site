"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Is } from "@/lib/isprogrami-listeler";
import { DURUMLAR, BLOKLAR, durumMeta, isOzeti } from "@/lib/isprogrami-listeler";
import { IsForm } from "./is-form";
import { Gantt } from "./gantt";
import { Gecmis } from "./gecmis";

function trTarih(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export function Panel({
  initialIsler,
  loadError,
  kullaniciAdi,
}: {
  initialIsler: Is[];
  loadError?: string;
  kullaniciAdi: string;
}) {
  const router = useRouter();
  const [isler, setIsler] = useState<Is[]>(initialIsler);
  const [gorunum, setGorunum] = useState<"tablo" | "gantt">("tablo");
  const [q, setQ] = useState("");
  const [blokF, setBlokF] = useState("all");
  const [durumF, setDurumF] = useState("all");
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState<Is | null>(null);
  const [gecmisAcik, setGecmisAcik] = useState(false);

  async function yenile() {
    try {
      const r = await fetch("/api/isprogrami/isler", { cache: "no-store" });
      const d = await r.json();
      if (d.ok) setIsler(d.isler);
    } catch {
      /* yoksay */
    }
  }

  const ozet = useMemo(() => {
    const byDurum: Record<string, number> = {};
    let toplamYuzde = 0;
    for (const i of isler) {
      byDurum[i.durum ?? "—"] = (byDurum[i.durum ?? "—"] ?? 0) + 1;
      toplamYuzde += Number(i.gerc_yuzde) || 0;
    }
    return {
      toplam: isler.length,
      tamam: byDurum["Tamamlandı"] ?? 0,
      devam: byDurum["Devam Ediyor"] ?? 0,
      geciken: byDurum["Gecikmede"] ?? 0,
      ortalama: isler.length ? Math.round(toplamYuzde / isler.length) : 0,
    };
  }, [isler]);

  const filtreli = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return isler.filter((i) => {
      if (blokF !== "all" && i.blok !== blokF) return false;
      if (durumF !== "all" && i.durum !== durumF) return false;
      if (needle) {
        const hay = `${i.ana_kalemi ?? ""} ${i.imalat ?? ""} ${i.blok ?? ""} ${i.kat ?? ""} ${i.aciklama1 ?? ""} ${i.aciklama2 ?? ""} ${i.ekip ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [isler, q, blokF, durumF]);

  const bagliSecenekler = useMemo(
    () => isler.map((i) => ({ id: i.id, etiket: isOzeti(i) })),
    [isler],
  );

  function yeniEkle() {
    setDuzenlenen(null);
    setFormAcik(true);
  }
  function duzenle(is: Is) {
    setDuzenlenen(is);
    setFormAcik(true);
  }
  async function kaydedildi() {
    setFormAcik(false);
    setDuzenlenen(null);
    await yenile();
  }
  async function sil(is: Is) {
    if (!confirm(`"${isOzeti(is)}" işini silmek istediğinize emin misiniz?`)) return;
    setIsler((p) => p.filter((x) => x.id !== is.id));
    await fetch(`/api/isprogrami/isler/${is.id}`, { method: "DELETE" }).catch(() => {});
    await yenile();
  }
  async function hizliDurum(is: Is, durum: string) {
    setIsler((p) => p.map((x) => (x.id === is.id ? { ...x, durum } : x)));
    await fetch(`/api/isprogrami/isler/${is.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durum }),
    }).catch(() => {});
  }
  async function cikis() {
    await fetch("/api/isprogrami/logout", { method: "POST" }).catch(() => {});
    router.replace("/isprogrami/giris");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
      {/* Üst bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-display text-xl font-semibold tracking-wide text-bronze">
            CAMSAN KOPARAN
          </div>
          <p className="text-sm text-white/50">Şantiye İş Programı</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-sm text-white/50 sm:inline">👷 {kullaniciAdi}</span>
          <button
            onClick={yeniEkle}
            className="rounded-full bg-bronze px-4 py-2 text-sm font-semibold text-ink transition hover:bg-bronze-light"
          >
            + Yeni İş
          </button>
          <button
            onClick={() => setGecmisAcik(true)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-bronze hover:text-bronze"
          >
            Geçmiş
          </button>
          <button
            onClick={cikis}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:border-red-400 hover:text-red-400"
          >
            Çıkış
          </button>
        </div>
      </div>

      {/* Özet kartlar */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Ozet label="Toplam İş" value={ozet.toplam} />
        <Ozet label="Tamamlanan" value={ozet.tamam} renk="#22c55e" />
        <Ozet label="Devam Eden" value={ozet.devam} renk="#3b82f6" />
        <Ozet label="Geciken" value={ozet.geciken} renk="#ef4444" />
        <Ozet label="Ort. İlerleme" value={`%${ozet.ortalama}`} />
      </div>

      {/* Kontroller */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          placeholder="Ara: imalat, blok, kat, açıklama…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-w-[180px] flex-1 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-bronze"
        />
        <select
          value={blokF}
          onChange={(e) => setBlokF(e.target.value)}
          className="rounded-md border border-white/15 bg-ink px-3 py-2 text-sm outline-none focus:border-bronze [color-scheme:dark] [&>option]:bg-ink [&>option]:text-white"
        >
          <option value="all">Tüm Bloklar</option>
          {BLOKLAR.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          value={durumF}
          onChange={(e) => setDurumF(e.target.value)}
          className="rounded-md border border-white/15 bg-ink px-3 py-2 text-sm outline-none focus:border-bronze [color-scheme:dark] [&>option]:bg-ink [&>option]:text-white"
        >
          <option value="all">Tüm Durumlar</option>
          {DURUMLAR.map((d) => (
            <option key={d.value} value={d.value}>
              {d.emoji} {d.value}
            </option>
          ))}
        </select>
        {/* Görünüm anahtarı */}
        <div className="flex overflow-hidden rounded-full border border-white/15">
          <button
            onClick={() => setGorunum("tablo")}
            className={`px-4 py-2 text-sm ${gorunum === "tablo" ? "bg-bronze text-ink" : "text-white/60"}`}
          >
            Tablo
          </button>
          <button
            onClick={() => setGorunum("gantt")}
            className={`px-4 py-2 text-sm ${gorunum === "gantt" ? "bg-bronze text-ink" : "text-white/60"}`}
          >
            Zaman Çizelgesi
          </button>
        </div>
      </div>

      {loadError && (
        <p className="mb-4 rounded-md border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
          {loadError}
        </p>
      )}

      {filtreli.length === 0 ? (
        <p className="py-16 text-center text-white/40">
          {isler.length === 0 ? "Henüz iş eklenmemiş. “+ Yeni İş” ile başlayın." : "Bu filtreye uygun iş yok."}
        </p>
      ) : gorunum === "gantt" ? (
        <Gantt isler={filtreli} onSelect={duzenle} />
      ) : (
        <Tablo isler={filtreli} onDuzenle={duzenle} onSil={sil} onDurum={hizliDurum} />
      )}

      {formAcik && (
        <IsForm
          is={duzenlenen}
          bagliSecenekler={bagliSecenekler}
          onClose={() => setFormAcik(false)}
          onSaved={kaydedildi}
        />
      )}
      {gecmisAcik && <Gecmis onClose={() => setGecmisAcik(false)} />}
    </main>
  );
}

function Ozet({ label, value, renk }: { label: string; value: number | string; renk?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-center">
      <div className="font-display text-2xl font-bold" style={{ color: renk ?? "#c08a4d" }}>
        {value}
      </div>
      <div className="mt-0.5 text-[11px] tracking-wide text-white/50 uppercase">{label}</div>
    </div>
  );
}

function Tablo({
  isler,
  onDuzenle,
  onSil,
  onDurum,
}: {
  isler: Is[];
  onDuzenle: (is: Is) => void;
  onSil: (is: Is) => void;
  onDurum: (is: Is, durum: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs text-white/50">
            <th className="px-3 py-2.5 font-medium">Blok / Kat</th>
            <th className="px-3 py-2.5 font-medium">İmalat / Açıklama</th>
            <th className="px-3 py-2.5 font-medium">Metraj</th>
            <th className="px-3 py-2.5 font-medium">Başlangıç–Bitiş</th>
            <th className="px-3 py-2.5 font-medium">Gün</th>
            <th className="px-3 py-2.5 font-medium">İlerleme</th>
            <th className="px-3 py-2.5 font-medium">Durum</th>
            <th className="px-3 py-2.5 font-medium">Ekip</th>
            <th className="px-3 py-2.5 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {isler.map((i) => {
            const meta = durumMeta(i.durum);
            const yuzde = Math.max(0, Math.min(100, Number(i.gerc_yuzde) || 0));
            return (
              <tr key={i.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-3 py-2.5">
                  <div className="font-medium text-white/90">{i.blok || "—"}</div>
                  <div className="text-xs text-white/45">{i.kat || ""}</div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="text-white/90">{i.aciklama1 || i.imalat || "—"}</div>
                  <div className="text-xs text-white/45">
                    {[i.ana_kalemi, i.aciklama2].filter(Boolean).join(" · ")}
                  </div>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap text-white/70">
                  {i.metraj != null ? `${i.metraj} ${i.birim ?? ""}` : "—"}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap text-white/70">
                  {trTarih(i.baslangic)} <span className="text-white/30">→</span> {trTarih(i.bitis)}
                </td>
                <td className="px-3 py-2.5 text-center text-white/70">{i.gun ?? "—"}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${yuzde}%`, backgroundColor: meta.color }} />
                    </div>
                    <span className="text-xs text-white/60">%{yuzde}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <select
                    value={i.durum ?? "Başlanmadı"}
                    onChange={(e) => onDurum(i, e.target.value)}
                    className="rounded-md border border-white/10 bg-ink px-2 py-1 text-xs outline-none focus:border-bronze [color-scheme:dark] [&>option]:bg-ink [&>option]:text-white"
                    style={{ color: meta.color }}
                  >
                    {DURUMLAR.map((d) => (
                      <option key={d.value} value={d.value} className="text-white">
                        {d.emoji} {d.value}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap text-white/70">{i.ekip || "—"}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-right">
                  <button
                    onClick={() => onDuzenle(i)}
                    className="rounded px-2 py-1 text-xs text-white/60 transition hover:text-bronze"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => onSil(i)}
                    className="rounded px-2 py-1 text-xs text-white/30 transition hover:text-red-400"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
