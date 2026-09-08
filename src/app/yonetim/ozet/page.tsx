import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthed } from "@/lib/admin-auth";
import { getLeads, serviceKeyReady } from "@/lib/supabase-admin";
import {
  type Lead,
  LEAD_STATUSES,
  SOURCE_GROUPS,
  statusMeta,
  sourceGroup,
  waLink,
  isFollowUpDue,
} from "@/lib/leads";

export const dynamic = "force-dynamic";

// Yönetim özet ekranı — satış hattı, kaynak performansı, bugün aranacaklar
export default async function OzetPage() {
  if (!(await isAuthed())) redirect("/yonetim/giris");
  if (!serviceKeyReady()) redirect("/yonetim");

  let leads: Lead[] = [];
  try {
    leads = await getLeads();
  } catch {
    // veri gelmezse boş özet göster
  }

  const total = leads.length;

  // Bu ay gelen adaylar
  const now = new Date();
  const thisMonth = leads.filter((l) => {
    const d = new Date(l.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  // Aşama dağılımı (satış hattı)
  const byStatus: Record<string, number> = {};
  for (const l of leads) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
  const wonTotal = byStatus["won"] ?? 0;
  const conversion = total > 0 ? Math.round((wonTotal / total) * 100) : 0;

  // Kaynak performansı: her kaynaktan kaç aday, kaç satış
  const sourceStats = SOURCE_GROUPS.map((g) => {
    const rows = leads.filter((l) => sourceGroup(l.source) === g.value);
    const won = rows.filter((l) => l.status === "won").length;
    return {
      ...g,
      count: rows.length,
      won,
      rate: rows.length > 0 ? Math.round((won / rows.length) * 100) : 0,
    };
  });
  const maxSource = Math.max(1, ...sourceStats.map((s) => s.count));

  // Bugün/gecikmiş aranacaklar
  const due = leads
    .filter((l) => isFollowUpDue(l.follow_up_at))
    .sort(
      (a, b) =>
        new Date(a.follow_up_at!).getTime() - new Date(b.follow_up_at!).getTime(),
    );

  const maxStatus = Math.max(1, ...LEAD_STATUSES.map((s) => byStatus[s.value] ?? 0));

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Üst bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-display text-xl font-semibold tracking-wide text-bronze">
            LOFT 777
          </div>
          <p className="text-sm text-white/50">Özet Ekranı</p>
        </div>
        <Link
          href="/yonetim"
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-bronze hover:text-bronze"
        >
          ← Talepler
        </Link>
      </div>

      {/* Ana sayılar */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Toplam Aday" value={total} />
        <Tile label="Bu Ay Gelen" value={thisMonth} />
        <Tile label="Toplam Satış" value={wonTotal} accent />
        <Tile label="Dönüşüm" value={`%${conversion}`} />
      </div>

      {/* Satış hattı (funnel) */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-white/60 uppercase">
          Satış Hattı
        </h2>
        <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          {LEAD_STATUSES.map((s) => {
            const n = byStatus[s.value] ?? 0;
            const pct = Math.round((n / maxStatus) * 100);
            return (
              <div key={s.value} className="flex items-center gap-3">
                <div className="w-28 shrink-0 text-sm text-white/70">
                  {s.emoji} {s.label}
                </div>
                <div className="h-6 flex-1 overflow-hidden rounded bg-white/5">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: s.color,
                      minWidth: n > 0 ? "1.5rem" : 0,
                    }}
                  />
                </div>
                <div className="w-8 shrink-0 text-right text-sm font-semibold text-white">
                  {n}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Kaynak performansı */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-white/60 uppercase">
          Kaynak Performansı
        </h2>
        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          {sourceStats.map((s) => (
            <div key={s.value}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-white/80">
                  {s.emoji} {s.label}
                </span>
                <span className="text-white/50">
                  {s.count} aday · {s.won} satış ·{" "}
                  <span className="text-bronze">%{s.rate}</span> dönüşüm
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-white/5">
                <div
                  className="h-full rounded bg-bronze"
                  style={{ width: `${Math.round((s.count / maxSource) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-white/40">
            Hangi kanal daha çok satış getiriyor? Dönüşüm oranı en yüksek kaynağa ağırlık ver.
          </p>
        </div>
      </section>

      {/* Bugün aranacaklar */}
      <section>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-white/60 uppercase">
          ⏰ Bugün / Gecikmiş Aranacaklar ({due.length})
        </h2>
        {due.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/40">
            Bugün için planlanmış arama yok. Adayların detayından takip tarihi verebilirsin.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {due.map((l) => {
              const meta = statusMeta(l.status);
              return (
                <div
                  key={l.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{l.name}</span>
                      <span
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{ backgroundColor: meta.color + "22", color: meta.color }}
                      >
                        {meta.emoji} {meta.label}
                      </span>
                    </div>
                    <div className="mt-0.5 font-mono text-xs text-white/60">{l.phone}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={waLink(l.phone)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-[#25D366] px-3 py-1 text-xs font-semibold text-black transition hover:opacity-90"
                    >
                      WhatsApp
                    </a>
                    <Link
                      href={`/yonetim/leads/${l.id}`}
                      className="rounded-full bg-bronze/20 px-3 py-1 text-xs font-semibold text-bronze transition hover:bg-bronze/30"
                    >
                      Detay →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function Tile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 text-center ${
        accent ? "border-emerald-500/30 bg-emerald-500/[0.06]" : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div
        className={`font-display text-3xl font-bold ${accent ? "text-emerald-400" : "text-bronze"}`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs tracking-wide text-white/50 uppercase">{label}</div>
    </div>
  );
}
