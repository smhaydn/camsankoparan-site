"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type Lead,
  type Activity,
  LEAD_STATUSES,
  ACTIVITY_KINDS,
  statusMeta,
  activityMeta,
  sourceLabel,
  unitLabel,
  budgetLabel,
  waLink,
  isFollowUpDue,
} from "@/lib/leads";

// Tarihi Türkçe okunur gösterir
function trDate(iso: string, withTime = true) {
  return new Date(iso).toLocaleString("tr-TR", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
  });
}

export function LeadDetail({
  lead,
  initialActivities,
}: {
  lead: Lead;
  initialActivities: Activity[];
}) {
  const [status, setStatus] = useState(lead.status);
  const [followUp, setFollowUp] = useState<string | null>(lead.follow_up_at);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [busy, setBusy] = useState(false);

  const meta = statusMeta(status);
  const due = isFollowUpDue(followUp);

  // Geçmişi sunucudan tazeler
  async function reloadActivities() {
    const r = await fetch(`/api/admin/leads/${lead.id}/activities`).catch(() => null);
    if (r?.ok) {
      const d = await r.json();
      if (d.ok) setActivities(d.activities);
    }
  }

  // Aday alanını günceller (durum / takip tarihi)
  async function patchLead(body: Record<string, unknown>) {
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {});
  }

  // Yeni aktivite ekler (arama / not / randevu…) ve geçmişi tazeler
  async function addActivity(kind: string, text: string | null) {
    await fetch(`/api/admin/leads/${lead.id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, body: text }),
    }).catch(() => {});
    await reloadActivities();
  }

  // Durum değiştir + otomatik geçmişe kaydet
  async function changeStatus(next: string) {
    setStatus(next);
    setBusy(true);
    await patchLead({ status: next });
    await addActivity("status", `Durum: ${statusMeta(next).label}`);
    setBusy(false);
  }

  // Takip tarihini kaydet + geçmişe düş
  async function saveFollowUp(iso: string | null) {
    setFollowUp(iso);
    setBusy(true);
    await patchLead({ follow_up_at: iso });
    if (iso) await addActivity("followup", `Takip planlandı: ${trDate(iso)}`);
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Üst: geri + durum */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/yonetim"
          className="text-sm text-white/50 transition hover:text-bronze"
        >
          ← Tüm talepler
        </Link>
        <span
          className="rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: meta.color + "22", color: meta.color }}
        >
          {meta.emoji} {meta.label}
        </span>
      </div>

      {/* Kimlik kartı */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h1 className="font-display text-2xl font-semibold text-white">{lead.name}</h1>
        <p className="mt-1 text-xs text-white/40">
          {sourceLabel(lead.source)} · İlk temas: {trDate(lead.created_at)}
        </p>

        {/* İletişim aksiyonları */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-white/80">{lead.phone}</span>
          <a
            href={waLink(lead.phone)}
            target="_blank"
            rel="noreferrer"
            onClick={() => addActivity("whatsapp", null)}
            className="rounded-full bg-[#25D366] px-3 py-1 text-xs font-semibold text-black transition hover:opacity-90"
          >
            WhatsApp
          </a>
          <a
            href={`tel:${lead.phone.replace(/\s/g, "")}`}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 transition hover:border-bronze hover:text-bronze"
          >
            Ara
          </a>
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 transition hover:border-bronze hover:text-bronze"
            >
              ✉ {lead.email}
            </a>
          )}
        </div>

        {/* İlgi / bütçe etiketleri */}
        {(lead.unit_interest || lead.budget) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {lead.unit_interest && (
              <span className="rounded-full bg-bronze/15 px-2 py-0.5 text-xs text-bronze-pale">
                İlgilendiği: {unitLabel(lead.unit_interest)}
              </span>
            )}
            {lead.budget && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
                Ödeme: {budgetLabel(lead.budget)}
              </span>
            )}
          </div>
        )}

        {/* İlk mesaj */}
        {lead.message && (
          <p className="mt-4 rounded-md border-l-2 border-bronze/40 bg-white/[0.02] px-3 py-2 text-sm text-white/70">
            {lead.message}
          </p>
        )}

        {/* Durum değiştir */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/40">Aşama:</span>
          <select
            value={status}
            disabled={busy}
            onChange={(e) => changeStatus(e.target.value)}
            className="rounded-md border border-white/15 bg-ink px-3 py-1.5 text-sm text-white outline-none focus:border-bronze disabled:opacity-60"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.emoji} {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Takip hatırlatması */}
      <FollowUpCard due={due} followUp={followUp} onSave={saveFollowUp} busy={busy} />

      {/* Yeni aktivite ekle */}
      <AddActivity onAdd={addActivity} busy={busy} />

      {/* Görüşme geçmişi */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-white/60 uppercase">
          Görüşme Geçmişi ({activities.length})
        </h2>
        {activities.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/40">
            Henüz kayıt yok. Yukarıdan ilk aramayı/notu ekle.
          </p>
        ) : (
          <ol className="relative border-l border-white/10 pl-5">
            {activities.map((a) => {
              const am = activityMeta(a.kind);
              return (
                <li key={a.id} className="mb-5 last:mb-0">
                  <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] ring-1 ring-white/15">
                    {am.emoji}
                  </span>
                  <div className="text-xs text-white/40">
                    {am.label} · {trDate(a.created_at)}
                  </div>
                  {a.body && (
                    <p className="mt-0.5 text-sm text-white/80">{a.body}</p>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}

// ── Takip tarihi kartı ──
function FollowUpCard({
  due,
  followUp,
  onSave,
  busy,
}: {
  due: boolean;
  followUp: string | null;
  onSave: (iso: string | null) => void;
  busy: boolean;
}) {
  // Bugünden itibaren N gün sonrasını (saat 10:00) döndürür
  function inDays(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(10, 0, 0, 0);
    return d.toISOString();
  }

  return (
    <div
      className={`mt-4 rounded-xl border p-5 ${
        due
          ? "border-amber-400/40 bg-amber-400/10"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-white">
          📅 Takip / Sonraki Arama
        </span>
        {followUp ? (
          <span className={`text-sm ${due ? "text-amber-300" : "text-white/70"}`}>
            {due ? "⏰ Bugün/gecikmiş: " : ""}
            {new Date(followUp).toLocaleString("tr-TR", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        ) : (
          <span className="text-sm text-white/40">Planlanmadı</span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          disabled={busy}
          onClick={() => onSave(inDays(1))}
          className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 transition hover:border-bronze hover:text-bronze disabled:opacity-60"
        >
          Yarın
        </button>
        <button
          disabled={busy}
          onClick={() => onSave(inDays(3))}
          className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 transition hover:border-bronze hover:text-bronze disabled:opacity-60"
        >
          3 gün sonra
        </button>
        <button
          disabled={busy}
          onClick={() => onSave(inDays(7))}
          className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 transition hover:border-bronze hover:text-bronze disabled:opacity-60"
        >
          1 hafta sonra
        </button>
        <input
          type="datetime-local"
          disabled={busy}
          onChange={(e) => {
            if (e.target.value) onSave(new Date(e.target.value).toISOString());
          }}
          className="rounded-md border border-white/15 bg-ink px-2 py-1 text-xs text-white outline-none focus:border-bronze disabled:opacity-60"
        />
        {followUp && (
          <button
            disabled={busy}
            onClick={() => onSave(null)}
            className="rounded-full px-3 py-1 text-xs text-white/40 transition hover:text-red-400 disabled:opacity-60"
          >
            Temizle
          </button>
        )}
      </div>
    </div>
  );
}

// ── Yeni aktivite ekleme kutusu ──
function AddActivity({
  onAdd,
  busy,
}: {
  onAdd: (kind: string, text: string | null) => void;
  busy: boolean;
}) {
  const [kind, setKind] = useState<string>("call");
  const [text, setText] = useState("");

  async function submit() {
    if (kind === "note" && !text.trim()) return;
    await onAdd(kind, text.trim() || null);
    setText("");
  }

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <span className="text-sm font-semibold text-white">Görüşme Ekle</span>
      <div className="mt-3 flex flex-wrap gap-2">
        {ACTIVITY_KINDS.map((k) => (
          <button
            key={k.value}
            onClick={() => setKind(k.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              kind === k.value
                ? "bg-bronze text-ink"
                : "border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
            }`}
          >
            {k.emoji} {k.label}
          </button>
        ))}
      </div>
      <textarea
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          kind === "note"
            ? "Not yaz… (zorunlu)"
            : "Kısa açıklama (opsiyonel) — örn. fiyat sordu, düşünüyor"
        }
        className="mt-3 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-bronze"
      />
      <div className="mt-2 text-right">
        <button
          onClick={submit}
          disabled={busy || (kind === "note" && !text.trim())}
          className="rounded-full bg-bronze px-5 py-2 text-sm font-semibold text-ink transition hover:bg-bronze-light disabled:opacity-50"
        >
          Kaydet
        </button>
      </div>
    </div>
  );
}
