"use client";

import { useEffect, useState } from "react";
import type { LogKaydi } from "@/lib/isprogrami-db";

const ISLEM_ETIKET: Record<string, { etiket: string; renk: string }> = {
  ekle: { etiket: "Ekledi", renk: "#22c55e" },
  güncelle: { etiket: "Güncelledi", renk: "#3b82f6" },
  sil: { etiket: "Sildi", renk: "#ef4444" },
};

// Alan adlarını insan-okur etikete çevir
const ALAN_ETIKET: Record<string, string> = {
  ana_kalemi: "Ana Kalem",
  imalat: "İmalat",
  blok: "Blok",
  kat: "Kat",
  aciklama1: "Açıklama-1",
  aciklama2: "Açıklama-2",
  metraj: "Metraj",
  birim: "Birim",
  gerc_yuzde: "Gerçekleşme %",
  gun: "Süre (gün)",
  baslangic: "Başlangıç",
  bitis: "Bitiş",
  durum: "Durum",
  ekip: "Ekip",
  bagli_is_1: "Bağlı İş",
  oncelik: "Öncelik",
  sira: "Sıra",
};

function deger(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

export function Gecmis({ onClose }: { onClose: () => void }) {
  const [log, setLog] = useState<LogKaydi[] | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/isprogrami/log")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setLog(d.log);
        else setErr(d.error || "Geçmiş yüklenemedi");
      })
      .catch(() => setErr("Bağlantı hatası"));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-white/15 bg-ink p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-bronze">Değişiklik Geçmişi</h3>
          <button onClick={onClose} className="text-2xl leading-none text-white/50 hover:text-white">
            ×
          </button>
        </div>

        {err && <p className="text-sm text-red-400">{err}</p>}
        {!log && !err && <p className="text-sm text-white/40">Yükleniyor…</p>}
        {log && log.length === 0 && <p className="text-sm text-white/40">Henüz kayıt yok.</p>}

        <div className="flex flex-col gap-3">
          {log?.map((k) => {
            const meta = ISLEM_ETIKET[k.islem] ?? { etiket: k.islem, renk: "#94a3b8" };
            const tarih = new Date(k.at).toLocaleString("tr-TR", {
              dateStyle: "short",
              timeStyle: "short",
            });
            return (
              <div key={k.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-white/90">{k.kullanici || "—"}</span>
                  <span
                    className="rounded-full px-2 py-0.5 font-medium"
                    style={{ backgroundColor: meta.renk + "22", color: meta.renk }}
                  >
                    {meta.etiket}
                  </span>
                  <span className="text-white/40">{tarih}</span>
                </div>
                <div className="mt-1 text-sm text-white/70">{k.is_ozet || "—"}</div>
                {k.degisiklikler && Object.keys(k.degisiklikler).length > 0 && (
                  <ul className="mt-2 space-y-0.5 border-t border-white/5 pt-2 text-xs text-white/50">
                    {Object.entries(k.degisiklikler).map(([alan, d]) => (
                      <li key={alan}>
                        <span className="text-white/60">{ALAN_ETIKET[alan] ?? alan}:</span>{" "}
                        <span className="text-red-300/70 line-through">{deger(d.eski)}</span>{" "}
                        → <span className="text-emerald-300/80">{deger(d.yeni)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
