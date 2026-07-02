"use client";

import { useEffect, useMemo, useState } from "react";
import type { Is } from "@/lib/isprogrami-listeler";
import { durumMeta, isOzeti } from "@/lib/isprogrami-listeler";

const AY_ADLARI = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];
const MIN_AY = 36; // "Ay" modunda en az ~3 yıl
const SATIR_Y = 40;
const SOL_GEN = 240;

// Görünüm modları — px/gün ve gün numarası gösterilsin mi
const MODLAR = [
  { ad: "Gün", pxGun: 34, gunTick: true, genis3Yil: false },
  { ad: "Hafta", pxGun: 11, gunTick: false, genis3Yil: false },
  { ad: "Ay", pxGun: 2.6, gunTick: false, genis3Yil: true },
] as const;

function ayGun(y: number, m: number): number {
  return new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
}
function epoch(y: number, m: number, d: number): number {
  return Math.floor(Date.UTC(y, m, d) / 86400000);
}
function coz(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d }; // m 0-tabanlı
}
function epochIso(iso: string): number {
  const p = coz(iso);
  return epoch(p.y, p.m, p.d);
}

export function Gantt({ isler, onSelect }: { isler: Is[]; onSelect: (is: Is) => void }) {
  const tarihli = useMemo(() => isler.filter((i) => i.baslangic && i.bitis), [isler]);
  const [mod, setMod] = useState(0); // Gün (varsayılan)

  const [bugunIso, setBugunIso] = useState<string | null>(null);
  // Geçerli tarihi yalnızca ilk mount'ta oku (render saf kalsın)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setBugunIso(new Date().toISOString().slice(0, 10)), []);

  const M = MODLAR[mod];
  const PX = M.pxGun;

  const model = useMemo(() => {
    if (tarihli.length === 0) return null;
    let minKey = Infinity, maxKey = -Infinity;
    for (const i of tarihli) {
      const b = coz(i.baslangic!);
      const e = coz(i.bitis!);
      minKey = Math.min(minKey, b.y * 12 + b.m);
      maxKey = Math.max(maxKey, e.y * 12 + e.m);
    }
    const startY = Math.floor(minKey / 12);
    const startM = minKey % 12;
    const kapsanan = maxKey - minKey + 1;
    return { startY, startM, kapsanan };
  }, [tarihli]);

  if (!model) {
    return (
      <p className="py-16 text-center text-white/40">
        Zaman çizelgesi için başlangıç ve bitiş tarihi olan iş gerekiyor.
      </p>
    );
  }

  const { startY, startM, kapsanan } = model;
  const toplamAy = M.genis3Yil ? Math.max(MIN_AY, kapsanan) : kapsanan;

  // Ay listesi
  const aylar: { y: number; m: number; days: number; solEpoch: number }[] = [];
  {
    let y = startY, m = startM;
    for (let k = 0; k < toplamAy; k++) {
      aylar.push({ y, m, days: ayGun(y, m), solEpoch: epoch(y, m, 1) });
      m++; if (m > 11) { m = 0; y++; }
    }
  }
  const domainStart = epoch(startY, startM, 1);
  const sonAy = aylar[aylar.length - 1];
  const domainEnd = epoch(sonAy.y, sonAy.m, sonAy.days);
  const toplamGun = domainEnd - domainStart + 1;
  const genislik = toplamGun * PX;

  const xEpoch = (e: number) => (e - domainStart) * PX;

  // Yıl bantları
  const yillar: { yil: number; sol: number; gen: number }[] = [];
  for (const a of aylar) {
    const son = yillar[yillar.length - 1];
    const gen = a.days * PX;
    if (son && son.yil === a.y) son.gen += gen;
    else yillar.push({ yil: a.y, sol: xEpoch(a.solEpoch), gen });
  }

  const bugunE = bugunIso ? epochIso(bugunIso) : null;
  const bugunX = bugunE != null && bugunE >= domainStart && bugunE <= domainEnd ? xEpoch(bugunE) : null;

  const yilY = 22, ayY = 20, gunY = M.gunTick ? 18 : 0;
  const basY = yilY + ayY + gunY;

  return (
    <div className="rounded-lg border border-white/10">
      {/* Üst çubuk: mod seçimi */}
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="text-xs text-white/40">
          {aylar[0].y} – {sonAy.y} · {M.ad === "Ay" ? `${toplamAy} ay` : "gün görünümü"}
        </span>
        <div className="flex overflow-hidden rounded-full border border-white/15 text-xs">
          {MODLAR.map((z, idx) => (
            <button
              key={z.ad}
              onClick={() => setMod(idx)}
              className={`px-3 py-1 ${idx === mod ? "bg-bronze text-ink" : "text-white/60 hover:text-white"}`}
            >
              {z.ad}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Sol sabit sütun */}
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

        {/* Sağ kaydırılabilir alan */}
        <div className="overflow-x-auto">
          <div style={{ width: genislik }} className="relative">
            {/* Yıl bandı */}
            <div className="relative border-b border-white/10" style={{ height: yilY }}>
              {yillar.map((yb) => (
                <div
                  key={yb.yil}
                  className="absolute top-0 flex items-center justify-center border-r border-white/15 text-[11px] font-semibold text-bronze"
                  style={{ left: yb.sol, width: yb.gen, height: yilY }}
                >
                  {yb.yil}
                </div>
              ))}
            </div>
            {/* Ay bandı */}
            <div className="relative border-b border-white/10" style={{ height: ayY }}>
              {aylar.map((a, k) => (
                <div
                  key={k}
                  className={`absolute top-0 flex items-center justify-center overflow-hidden border-r border-white/8 text-[10px] ${a.m === 0 ? "text-white/70" : "text-white/45"}`}
                  style={{ left: xEpoch(a.solEpoch), width: a.days * PX, height: ayY }}
                >
                  {AY_ADLARI[a.m]}{M.ad !== "Gün" ? ` ${a.y}` : ""}
                </div>
              ))}
            </div>
            {/* Gün numaraları (yalnızca Gün modu) */}
            {M.gunTick && (
              <div className="relative border-b border-white/10" style={{ height: gunY }}>
                {aylar.map((a) =>
                  Array.from({ length: a.days }, (_, di) => {
                    const e = a.solEpoch + di;
                    const dow = new Date(e * 86400000).getUTCDay();
                    const hs = dow === 0 || dow === 6;
                    return (
                      <div
                        key={e}
                        className={`absolute top-0 text-center text-[9px] leading-[18px] ${hs ? "bg-white/[0.05] text-white/35" : "text-white/50"}`}
                        style={{ left: xEpoch(e), width: PX, height: gunY }}
                      >
                        {di + 1}
                      </div>
                    );
                  }),
                )}
              </div>
            )}

            {/* Gövde */}
            <div className="relative">
              {/* Dikey ızgara: Gün modunda günlük, diğerinde aylık */}
              {M.gunTick
                ? aylar.map((a) =>
                    Array.from({ length: a.days }, (_, di) => {
                      const e = a.solEpoch + di;
                      const dow = new Date(e * 86400000).getUTCDay();
                      const hs = dow === 0 || dow === 6;
                      return (
                        <div
                          key={e}
                          className={`absolute top-0 bottom-0 ${hs ? "bg-white/[0.03]" : ""} border-r ${di === 0 ? "border-white/12" : "border-white/[0.04]"}`}
                          style={{ left: xEpoch(e), width: PX }}
                        />
                      );
                    }),
                  )
                : aylar.map((a, k) => (
                    <div
                      key={k}
                      className={`absolute top-0 bottom-0 border-r ${a.m === 0 ? "border-white/12" : "border-white/[0.04]"}`}
                      style={{ left: xEpoch(a.solEpoch) + a.days * PX - 1, width: 0 }}
                    />
                  ))}

              {/* Bugün çizgisi */}
              {bugunX != null && (
                <div className="pointer-events-none absolute top-0 bottom-0 z-10 w-px bg-red-500/80" style={{ left: bugunX }}>
                  <span className="absolute left-1 text-[9px] text-red-400">bugün</span>
                </div>
              )}

              {tarihli.map((i, idx) => {
                const sol = xEpoch(epochIso(i.baslangic!));
                const gen = Math.max(4, (epochIso(i.bitis!) - epochIso(i.baslangic!) + 1) * PX);
                const renk = durumMeta(i.durum).color;
                const yuzde = Math.max(0, Math.min(100, Number(i.gerc_yuzde) || 0));
                const darBar = gen < 64;
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
                        left: sol, width: gen, top: (SATIR_Y - 22) / 2, height: 22,
                        backgroundColor: renk + "44", border: `1px solid ${renk}`,
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
