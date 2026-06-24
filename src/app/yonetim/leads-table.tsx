"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OnlineCount } from "./online-count";
import {
  type Lead,
  LEAD_STATUSES,
  SOURCE_GROUPS,
  statusMeta,
  sourceLabel,
  sourceGroup,
  waLink,
  unitLabel,
  budgetLabel,
} from "@/lib/leads";

export function LeadsBoard({
  initialLeads,
  loadError,
}: {
  initialLeads: Lead[];
  loadError?: string;
}) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [srcFilter, setSrcFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    let today = 0;
    const todayStr = new Date().toDateString();
    for (const l of leads) {
      byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
      bySource[sourceGroup(l.source)] = (bySource[sourceGroup(l.source)] ?? 0) + 1;
      if (new Date(l.created_at).toDateString() === todayStr) today++;
    }
    return { total: leads.length, today, byStatus, bySource };
  }, [leads]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (srcFilter !== "all" && sourceGroup(l.source) !== srcFilter) return false;
      if (needle) {
        const hay = `${l.name} ${l.phone} ${l.email ?? ""} ${l.message ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [leads, q, filter, srcFilter]);

  async function addLead(data: {
    name: string;
    phone: string;
    email: string;
    unit_interest: string;
    budget: string;
    message: string;
  }) {
    const r = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (r.ok) {
      setAddOpen(false);
      router.refresh();
    } else {
      alert("Eklenemedi. Ad ve telefon zorunlu.");
    }
  }

  async function patchLead(id: string, body: Partial<Pick<Lead, "status" | "notes">>) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...body } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {});
  }

  async function removeLead(id: string) {
    if (!confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" }).catch(() => {});
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.replace("/yonetim/giris");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Üst bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-display text-xl font-semibold tracking-wide text-bronze">
            LOFT 777
          </div>
          <p className="text-sm text-white/50">Müşteri Talepleri</p>
        </div>
        <div className="flex items-center gap-3">
          <OnlineCount />
          <button
            onClick={() => setAddOpen(true)}
            className="rounded-full bg-bronze px-4 py-2 text-sm font-semibold text-ink transition hover:bg-bronze-light"
          >
            + Manuel Lead
          </button>
          <Link
            href="/yonetim/icerik"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-bronze hover:text-bronze"
          >
            Site İçeriği
          </Link>
          <Link
            href="/yonetim/reklam"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-bronze hover:text-bronze"
          >
            Reklam & Takip
          </Link>
          <a
            href="/api/admin/leads/export"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-bronze hover:text-bronze"
          >
            Excel&apos;e Aktar
          </a>
          <button
            onClick={logout}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:border-red-400 hover:text-red-400"
          >
            Çıkış
          </button>
        </div>
      </div>

      {/* Özet */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Summary label="Toplam Talep" value={counts.total} />
        <Summary label="Bugün Gelen" value={counts.today} />
        <Summary label="Yeni" value={counts.byStatus["new"] ?? 0} />
        <Summary label="Satış" value={counts.byStatus["won"] ?? 0} />
      </div>

      {/* Arama + filtre */}
      <div className="mb-6 flex flex-col gap-3">
        <input
          placeholder="Ada, telefona veya mesaja göre ara…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-bronze"
        />
        <div className="flex flex-wrap gap-2">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            Tümü ({counts.total})
          </Chip>
          {LEAD_STATUSES.map((s) => (
            <Chip key={s.value} active={filter === s.value} onClick={() => setFilter(s.value)}>
              {s.emoji} {s.label} ({counts.byStatus[s.value] ?? 0})
            </Chip>
          ))}
        </div>
        {/* Kaynak filtresi: Web / Instagram-Meta / Manuel */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/40">Kaynak:</span>
          <Chip active={srcFilter === "all"} onClick={() => setSrcFilter("all")}>
            Tümü
          </Chip>
          {SOURCE_GROUPS.map((g) => (
            <Chip key={g.value} active={srcFilter === g.value} onClick={() => setSrcFilter(g.value)}>
              {g.emoji} {g.label} ({counts.bySource[g.value] ?? 0})
            </Chip>
          ))}
        </div>
      </div>

      {loadError && (
        <p className="rounded-md border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
          {loadError}
        </p>
      )}

      {/* Liste */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-white/40">
          {leads.length === 0 ? "Henüz talep yok." : "Bu filtreye uygun talep yok."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onStatus={(status) => patchLead(lead.id, { status })}
              onNotes={(notes) => patchLead(lead.id, { notes })}
              onDelete={() => removeLead(lead.id)}
            />
          ))}
        </div>
      )}

      {addOpen && <AddLeadModal onClose={() => setAddOpen(false)} onSave={addLead} />}
    </main>
  );
}

function AddLeadModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: {
    name: string;
    phone: string;
    email: string;
    unit_interest: string;
    budget: string;
    message: string;
  }) => void;
}) {
  const [f, setF] = useState({
    name: "",
    phone: "",
    email: "",
    unit_interest: "",
    budget: "",
    message: "",
  });
  const [saving, setSaving] = useState(false);

  const UNITS = [
    { value: "1+1-a", label: "1+1 A Tipi" },
    { value: "1+1-b", label: "1+1 B Tipi" },
    { value: "farketmez", label: "Farketmez" },
  ];
  const BUDGETS = [
    { value: "pesin", label: "Peşin" },
    { value: "kredi", label: "Banka Kredisi" },
    { value: "taksit", label: "Taksit / Senet" },
    { value: "farketmez", label: "Farketmez" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-white/15 bg-ink p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-bronze">Manuel Lead Ekle</h3>
          <button onClick={onClose} className="text-xl text-white/50 hover:text-white">
            ×
          </button>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!f.name.trim() || !f.phone.trim()) return;
            setSaving(true);
            await onSave(f);
            setSaving(false);
          }}
          className="flex flex-col gap-3"
        >
          <input
            required
            placeholder="Ad Soyad *"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-bronze"
          />
          <input
            required
            placeholder="Telefon *"
            value={f.phone}
            onChange={(e) => setF({ ...f, phone: e.target.value })}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-bronze"
          />
          <input
            placeholder="E-posta (opsiyonel)"
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-bronze"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={f.unit_interest}
              onChange={(e) => setF({ ...f, unit_interest: e.target.value })}
              className="rounded-md border border-white/15 bg-ink px-3 py-2.5 text-sm text-white outline-none focus:border-bronze"
            >
              <option value="">Daire tipi</option>
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
            <select
              value={f.budget}
              onChange={(e) => setF({ ...f, budget: e.target.value })}
              className="rounded-md border border-white/15 bg-ink px-3 py-2.5 text-sm text-white outline-none focus:border-bronze"
            >
              <option value="">Ödeme tercihi</option>
              {BUDGETS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <textarea
            rows={3}
            placeholder="Not / mesaj (opsiyonel)"
            value={f.message}
            onChange={(e) => setF({ ...f, message: e.target.value })}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-bronze"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-bronze px-6 py-2.5 text-sm font-semibold text-ink transition hover:bg-bronze-light disabled:opacity-60"
          >
            {saving ? "Ekleniyor…" : "Lead Ekle"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-center">
      <div className="font-display text-3xl font-bold text-bronze">{value}</div>
      <div className="mt-1 text-xs tracking-wide text-white/50 uppercase">{label}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-bronze text-ink"
          : "border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function LeadCard({
  lead,
  onStatus,
  onNotes,
  onDelete,
}: {
  lead: Lead;
  onStatus: (status: string) => void;
  onNotes: (notes: string) => void;
  onDelete: () => void;
}) {
  const meta = statusMeta(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [copied, setCopied] = useState(false);

  const date = new Date(lead.created_at).toLocaleString("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  function copyPhone() {
    navigator.clipboard?.writeText(lead.phone).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      {/* Başlık satırı */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-white">{lead.name}</span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: meta.color + "22", color: meta.color }}
            >
              {meta.emoji} {meta.label}
            </span>
          </div>
          <div className="mt-0.5 text-xs text-white/40">
            {sourceLabel(lead.source)} · {date}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {lead.unit_interest && (
              <span className="inline-block rounded-full bg-bronze/15 px-2 py-0.5 text-xs text-bronze-pale">
                İlgilendiği: {unitLabel(lead.unit_interest)}
              </span>
            )}
            {lead.budget && (
              <span className="inline-block rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
                Ödeme: {budgetLabel(lead.budget)}
              </span>
            )}
          </div>
        </div>

        <select
          value={lead.status}
          onChange={(e) => onStatus(e.target.value)}
          className="rounded-md border border-white/15 bg-ink px-3 py-1.5 text-sm text-white outline-none focus:border-bronze"
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.emoji} {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Telefon + aksiyonlar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm text-white/80">{lead.phone}</span>
        <a
          href={waLink(lead.phone)}
          target="_blank"
          rel="noreferrer"
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
        <button
          onClick={copyPhone}
          className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60 transition hover:border-white/50 hover:text-white"
        >
          {copied ? "Kopyalandı ✓" : "Kopyala"}
        </button>
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 transition hover:border-bronze hover:text-bronze"
          >
            ✉ {lead.email}
          </a>
        )}
      </div>

      {/* Mesaj */}
      {lead.message && (
        <p className="mt-3 rounded-md border-l-2 border-bronze/40 bg-white/[0.02] px-3 py-2 text-sm text-white/70">
          {lead.message}
        </p>
      )}

      {/* Not */}
      <div className="mt-4">
        <textarea
          rows={2}
          placeholder="Ekip notu ekle… (örn. aradım, düşünüyor)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if (notes !== (lead.notes ?? "")) onNotes(notes);
          }}
          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-bronze"
        />
      </div>

      <div className="mt-2 text-right">
        <button
          onClick={onDelete}
          className="text-xs text-white/30 transition hover:text-red-400"
        >
          Sil
        </button>
      </div>
    </div>
  );
}
