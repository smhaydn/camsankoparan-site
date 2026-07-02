"use client";

import { useEffect, useMemo, useState } from "react";
import type { Is } from "@/lib/isprogrami-listeler";
import { durumMeta, isOzeti } from "@/lib/isprogrami-listeler";

const GUN_PX = 26; // bir günün piksel genişliği
const AY_ADLARI = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];

// YYYY-MM-DD → epoch gün sayısı (UTC)
function gunNo(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}
function gunNoTarih(n: number): Date {
  return new Date(n * 86400000);
}

export function Gantt({ isler, onSelect }: { isler: Is[]; onSelect: (is: Is) => void }) {
  const tarihli = useMemo(() => isler.filter((i) => i.baslangic && i.bitis), [isler]);

  // "Bugün" render dışında hesaplanır (impure çağrı render'da olmasın)
  const [bugun, setBugun] = useState<number | null>(null);
  useEffect(() => setBugun(Math.floor(Date.now() / 86400000)), []);

  const model = useMemo(() => {
    if (tarihli.length === 0) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const i of tarihli) {
      const b = gunNo(i.baslangic!);
      const e = gunNo(i.bitis!);
      if (b < min) min = b;
      if (e > max) max = e;
    }
    // Kenarlara birer gün boşluk
    min -= 1;
    max += 1;
    const toplamGun = max - min + 1;
    return { min, max, toplamGun };
  }, [tarihli]);

  if (!model) {
    return (
      <p className="py-16 text-center text-white/40">
        Zaman çizelgesi için başlangıç ve bitiş tarihi olan iş gerekiyor.
      </p>
    );
  }

  const { min, toplamGun } = model;
  const genislik = toplamGun * GUN_PX;

  // Ay başlıkları (segmentler)
  const aylar: { etiket: string; sol: number; gen: number }[] = [];
  {
    let g = min;
    while (g <= model.max) {
      const dt = gunNoTarih(g);
      const ay = dt.getUTCMonth();
      const yil = dt.getUTCFullYear();
      // Bu ayın son gününe kadar ilerle
      let son = g;
      while (son <= model.max && gunNoTarih(son).getUTCMonth() === ay) son++;
      const gun = son - g;
      aylar.push({
        etiket: `${AY_ADLARI[ay]} ${yil}`,
        sol: (g - min) * GUN_PX,
        gen: gun * GUN_PX,
      });
      g = son;
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <div className="flex">
        {/* Sol sabit sütun: iş adları */}
        <div className="w-44 shrink-0 border-r border-white/10 bg-white/[0.02] sm:w-56">
          <div className="h-12 border-b border-white/10 px-3 py-1 text-xs text-white/40">İş</div>
          {tarihli.map((i) => (
            <button
              key={i.id}
              onClick={() => onSelect(i)}
              title={isOzeti(i)}
              className="flex h-9 w-full items-center gap-1.5 truncate border-b border-white/5 px-3 text-left text-xs text-white/80 hover:bg-white/5"
            >
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: durumMeta(i.durum).color }}
              />
              <span className="truncate">{isOzeti(i)}</span>
            </button>
          ))}
        </div>

        {/* Sağ kaydırılabilir zaman çizelgesi */}
        <div className="overflow-x-auto">
          <div style={{ width: genislik }} className="relative">
            {/* Ay başlıkları */}
            <div className="relative h-6 border-b border-white/10">
              {aylar.map((a, idx) => (
                <div
                  key={idx}
                  className="absolute top-0 flex h-6 items-center border-r border-white/10 px-2 text-[11px] font-medium text-white/60"
                  style={{ left: a.sol, width: a.gen }}
                >
                  {a.etiket}
                </div>
              ))}
            </div>
            {/* Gün numaraları + hafta sonu gölgesi */}
            <div className="relative h-6 border-b border-white/10">
              {Array.from({ length: toplamGun }, (_, k) => {
                const dt = gunNoTarih(min + k);
                const haftaSonu = dt.getUTCDay() === 0 || dt.getUTCDay() === 6;
                return (
                  <div
                    key={k}
                    className={`absolute top-0 h-6 text-center text-[9px] leading-6 ${
                      haftaSonu ? "bg-white/[0.04] text-white/30" : "text-white/40"
                    }`}
                    style={{ left: k * GUN_PX, width: GUN_PX }}
                  >
                    {dt.getUTCDate()}
                  </div>
                );
              })}
            </div>

            {/* Satırlar (çubuklar) */}
            <div className="relative">
              {/* Bugün çizgisi */}
              {bugun != null && bugun >= min && bugun <= model.max && (
                <div
                  className="pointer-events-none absolute top-0 bottom-0 z-10 w-px bg-red-500/70"
                  style={{ left: (bugun - min) * GUN_PX + GUN_PX / 2 }}
                />
              )}
              {tarihli.map((i) => {
                const b = gunNo(i.baslangic!);
                const e = gunNo(i.bitis!);
                const sol = (b - min) * GUN_PX;
                const gen = Math.max(GUN_PX, (e - b + 1) * GUN_PX);
                const renk = durumMeta(i.durum).color;
                const yuzde = Math.max(0, Math.min(100, Number(i.gerc_yuzde) || 0));
                return (
                  <div key={i.id} className="relative h-9 border-b border-white/5">
                    <button
                      onClick={() => onSelect(i)}
                      className="absolute top-1.5 flex h-6 items-center overflow-hidden rounded-md text-[10px] font-medium text-black/80 shadow"
                      style={{ left: sol, width: gen, backgroundColor: renk + "66", border: `1px solid ${renk}` }}
                      title={`${isOzeti(i)} · %${yuzde}`}
                    >
                      {/* İlerleme dolgusu */}
                      <span
                        className="absolute top-0 left-0 h-full"
                        style={{ width: `${yuzde}%`, backgroundColor: renk }}
                      />
                      <span className="relative z-10 truncate px-1.5 text-white/90">
                        {i.imalat || isOzeti(i)} {yuzde > 0 ? `· %${yuzde}` : ""}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
