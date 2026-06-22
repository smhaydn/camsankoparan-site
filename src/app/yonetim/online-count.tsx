"use client";

import { useEffect, useState } from "react";

// Admin'de "şu an sitede kaç kişi var" canlı göstergesi
export function OnlineCount() {
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/admin/presence")
        .then((r) => r.json())
        .then((d) => {
          if (alive && d?.ok) setN(d.count);
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm">
      <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
      <span className="text-white/75">
        Sitede: <b className="text-white">{n ?? "…"}</b> kişi
      </span>
    </div>
  );
}
