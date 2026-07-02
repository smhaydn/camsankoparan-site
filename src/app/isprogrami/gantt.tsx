"use client";

import { useEffect, useMemo, useState } from "react";
import type { Is } from "@/lib/isprogrami-listeler";
import { durumMeta, isOzeti } from "@/lib/isprogrami-listeler";

const AY_ADLARI = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];

// En az bu kadar ay göster (çok yıllık eksen için ~3 yıl)
const MIN_AY = 36;
const SATIR_Y = 40; // satır yüksekliği (px)
const SOL_GEN = 240; // sol sabit sütun genişliği (px)

// Ay içindeki gün sayısı (m: 0-11)
function ayGun(y: number, m: number): number {
  return new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
}

type Parcali = { y: number; m: number; d: number };
function coz(iso: string): Parcali {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d }; // m 0-tabanlı
}

// Yakınlaştırma seviyeleri (ay genişliği px)
const ZOOM = [
  { ad: "Dar", px: 42 },
  { ad: "Orta", px: 68 },
  { ad: "Geniş", px: 104 },
] as const;

export function Gantt({ isler, onSelect }: { isler: Is[]; onSelect: (is: Is) => void }) {
  const tarihli = useMemo(() => isler.filter((i) => i.baslangic && i.bitis), [isler]);
  const [zoom, setZoom] = useState(1); // Orta

  // "Bugün" render dışında hesaplanır
  const [bugunIso, setBugunIso] = useState<string | null>(null);
  // Geçerli tarihi yalnızca ilk mount'ta oku (render saf kalsın)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setBugunIso(new Date().toISOString().slice(0, 10)), []);

  const model = useMemo(() => {
    if (tarihli.length === 0) return null;
    let minKey = Infinity;
    let maxKey = -Infinity;
    for (const i of tarihli) {
      const b = coz(i.baslangic!);
      const e = coz(i.bitis!);
      minKey = Math.min(minKey, b.y * 12 + b.m);
      maxKey = Math.max(maxKey, e.y * 12 + e.m);
    }
    const startY = Math.floor(minKey / 12);
    const startM = minKey % 12;
    const kapsanan = maxKey - minKey + 1; // işlerin kapsadığı ay sayısı
    const ayAdedi = Math.max(MIN_AY, kapsanan);
    return { startY, startM, ayAdedi };
  }, [tarihli]);

  if (!model) {
    return (
      <p className="py-16 text-center text-white/40">
        Zaman çizelgesi için başlangıç ve bitiş tarihi olan iş gerekiyor.
      </p>
    );
  }

  const { startY, startM, ayAdedi } = model;
  const AY_PX = ZOOM[zoom].px;

  // Ay listesi (grid + başlıklar)
  const aylar = Array.from({ length: ayAdedi }, (_, k) => {
    const m = (startM + k) % 12;
    const y = startY + Math.floor((startM + k) / 12);
    return { k, y, m, gun: ayGun(y, m) };
  });

  // Yıl bantları (ardışık ayları yıla göre grupla)
  const yillar: { yil: number; sol: number; gen: number }[] = [];
  for (const a of aylar) {
    const son = yillar[yillar.length - 1];
    if (son && son.yil === a.y) son.gen += AY_PX;
    else yillar.push({ yil: a.y, sol: a.k * AY_PX, gen: AY_PX });
  }

  const genislik = ayAdedi * AY_PX;

  // Bir tarihin x konumu (ay ızgarasına oturur)
  function xTarih(iso: string): number {
    const p = coz(iso);
    const ai = (p.y - startY) * 12 + (p.m - startM);
    const dim = ayGun(p.y, p.m);
    return (ai + (p.d - 1) / dim) * AY_PX;
  }
  function xBitis(iso: string): number {
    const p = coz(iso);
    const ai = (p.y - startY) * 12 + (p.m - startM);
    const dim = ayGun(p.y, p.m);
    return (ai + p.d / dim) * AY_PX; // bitiş günü dahil
  }

  const bugunX =
    bugunIso && (() => {
      const p = coz(bugunIso);
      const ai = (p.y - startY) * 12 + (p.m - startM);
      return ai >= 0 && ai < ayAdedi ? xTarih(bugunIso) : null;
    })();

  const basY = 44; // başlık yüksekliği (yıl + ay)

  return (
    <div className="rounded-lg border border-white/10">
      {/* Üst çubuk: yakınlaştırma */}
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="text-xs text-white/40">
          {aylar[0].y} – {aylar[aylar.length - 1].y} · {ayAdedi} ay
        </span>
        <div className="flex overflow-hidden rounded-full border border-white/15 text-xs">
          {ZOOM.map((z, idx) => (
            <button
              key={z.ad}
              onClick={() => setZoom(idx)}
              className={`px-3 py-1 ${idx === zoom ? "bg-bronze text-ink" : "text-white/60 hover:text-white"}`}
            >
              {z.ad}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Sol sabit sütun: iş adları */}
        <div className="shrink-0 border-r border-white/10 bg-white/[0.02]" style={{ width: SOL_GEN }}>
          <div className="flex items-end border-b border-white/10 px-3 pb-1 text-xs text-white/40" style={{ height: basY }}>
            İş
          </div>
          {tarihli.map((i, idx) => (
            <button
              key={i.id}
              onClick={() => onSelect(i)}
              title={isOzeti(i)}
              className={`flex w-full flex-col justify-center border-b border-white/5 px-3 text-left hover:bg-white/5 ${idx % 2 ? "bg-white/[0.015]" : ""}`}
              style={{ height: SATIR_Y }}
            >
              <span className="flex items-center gap-1.5 truncate text-xs font-medium text-white/90">
                <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: durumMeta(i.durum).color }} />
                <span className="truncate">{i.aciklama1 || i.imalat || "İş"}</span>
              </span>
              <span className="truncate pl-3.5 text-[11px] text-white/45">
                {[i.blok, i.kat, i.aciklama2].filter(Boolean).join(" · ")}
              </span>
            </button>
          ))}
        </div>

        {/* Sağ kaydırılabilir zaman çizelgesi */}
        <div className="overflow-x-auto">
          <div style={{ width: genislik }} className="relative">
            {/* Yıl bandı */}
            <div className="relative border-b border-white/10" style={{ height: 22 }}>
              {yillar.map((yb) => (
                <div
                  key={yb.yil}
                  className="absolute top-0 flex h-[22px] items-center justify-center border-r border-white/15 text-[11px] font-semibold text-bronze"
                  style={{ left: yb.sol, width: yb.gen }}
                >
                  {yb.yil}
                </div>
              ))}
            </div>
            {/* Ay bandı */}
            <div className="relative border-b border-white/10" style={{ height: basY - 22 }}>
              {aylar.map((a) => (
                <div
                  key={a.k}
                  className={`absolute top-0 flex items-center justify-center border-r border-white/5 text-[10px] ${a.m === 0 ? "text-white/60" : "text-white/40"}`}
                  style={{ left: a.k * AY_PX, width: AY_PX, height: basY - 22 }}
                >
                  {AY_ADLARI[a.m]}
                </div>
              ))}
            </div>

            {/* Gövde */}
            <div className="relative">
              {/* Ay ızgara çizgileri */}
              {aylar.map((a) => (
                <div
                  key={a.k}
                  className={`absolute top-0 bottom-0 border-r ${a.m === 0 ? "border-white/12" : "border-white/[0.04]"}`}
                  style={{ left: (a.k + 1) * AY_PX - 1, width: 0 }}
                />
              ))}
              {/* Bugün çizgisi */}
              {bugunX != null && (
                <div className="pointer-events-none absolute top-0 bottom-0 z-10 w-px bg-red-500/70" style={{ left: bugunX }}>
                  <span className="absolute -top-0 left-1 text-[9px] text-red-400">bugün</span>
                </div>
              )}
              {tarihli.map((i, idx) => {
                const sol = xTarih(i.baslangic!);
                const gen = Math.max(8, xBitis(i.bitis!) - sol);
                const renk = durumMeta(i.durum).color;
                const yuzde = Math.max(0, Math.min(100, Number(i.gerc_yuzde) || 0));
                const darBar = gen < 70;
                return (
                  <div
                    key={i.id}
                    className={`relative border-b border-white/5 ${idx % 2 ? "bg-white/[0.015]" : ""}`}
                    style={{ height: SATIR_Y }}
                  >
                    <button
                      onClick={() => onSelect(i)}
                      className="absolute flex items-center overflow-hidden rounded-md shadow"
                      style={{
                        left: sol,
                        width: gen,
                        top: (SATIR_Y - 22) / 2,
                        height: 22,
                        backgroundColor: renk + "44",
                        border: `1px solid ${renk}`,
                      }}
                      title={`${isOzeti(i)} · %${yuzde}`}
                    >
                      <span className="absolute top-0 left-0 h-full" style={{ width: `${yuzde}%`, backgroundColor: renk }} />
                      {!darBar && (
                        <span className="relative z-10 truncate px-1.5 text-[10px] font-medium text-white">
                          {i.imalat || i.aciklama1} {yuzde > 0 ? `· %${yuzde}` : ""}
                        </span>
                      )}
                    </button>
                    {/* Dar çubuklarda etiketi çubuğun sağına yaz */}
                    {darBar && (
                      <span
                        className="pointer-events-none absolute z-10 whitespace-nowrap text-[10px] text-white/70"
                        style={{ left: sol + gen + 4, top: (SATIR_Y - 14) / 2 }}
                      >
                        {i.imalat || i.aciklama1} {yuzde > 0 ? `· %${yuzde}` : ""}
                      </span>
                    )}
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
