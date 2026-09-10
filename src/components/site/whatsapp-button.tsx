"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { waLink } from "@/lib/leads";
import type { Dict } from "@/lib/dict";
import { trackLead } from "@/lib/track";

// Sağ-alt köşedeki WhatsApp butonu.
// Tıklayınca önce iki satırlık mini form açılır (ad + telefon) — bilgi CRM'e
// "whatsapp" kaynağıyla düşer, sonra sohbet açılır. Form doldurmak istemeyen
// için altta "doğrudan geç" bağlantısı var; onlar kayıt bırakmaz.
export function WhatsAppButton({
  phone,
  message,
  locale,
  extra,
}: {
  phone: string;
  message: string;
  locale: string;
  extra: Dict["formExtra"];
}) {
  const href = `${waLink(phone)}?text=${encodeURIComponent(message)}`;
  const en = locale === "en";

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", kvkk: false });
  const [err, setErr] = useState("");

  const t = en
    ? {
        title: "Before we connect you",
        sub: "Leave your name and number so our sales team can reach you even if the chat drops.",
        name: "Your name",
        phone: "Your phone",
        open: "Open WhatsApp",
        skip: "Skip and go straight to WhatsApp",
        errName: "Please enter your name and phone number.",
        errPhone: "Please enter a valid phone number.",
      }
    : {
        title: "Sizi bağlamadan önce",
        sub: "Adınızı ve numaranızı bırakın; sohbet yarıda kalsa bile satış ekibimiz size ulaşsın.",
        name: "Adınız",
        phone: "Telefonunuz",
        open: "WhatsApp'ı Aç",
        skip: "Doğrudan WhatsApp'a geç",
        errName: "Lütfen adınızı ve telefon numaranızı yazın.",
        errPhone: "Telefon numarası geçerli görünmüyor.",
      };

  // "WhatsApp'ı Aç" tıklaması: kayıt eksikse bağlantıyı durdur, tamsa kaydı
  // arka planda yolla ve sohbeti aç. Kayıt beklenmez — tarayıcı, kullanıcı
  // tıklamasından kopan pencere açma isteklerini engelliyor.
  function submit(e: React.MouseEvent) {
    if (!form.name.trim() || !form.phone.trim()) {
      e.preventDefault();
      setErr(t.errName);
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      e.preventDefault();
      setErr(t.errPhone);
      return;
    }
    if (!form.kvkk) {
      e.preventDefault();
      setErr(extra.kvkkRequired);
      return;
    }
    // keepalive: sayfa WhatsApp'a giderken bile istek tamamlanır
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        source: "whatsapp",
      }),
      keepalive: true,
    }).catch(() => {});
    trackLead();
    // Panel HEMEN kapatılmaz: bağlantı bu tıklamayla WhatsApp'ı açıyor, öğe
    // aynı anda DOM'dan silinirse tarayıcı açılışı iptal edebiliyor.
    setTimeout(() => {
      setOpen(false);
      setForm({ name: "", phone: "", kvkk: false });
    }, 600);
  }

  return (
    <>
      <button
        onClick={() => {
          setErr("");
          setOpen(true);
        }}
        aria-label={en ? "Write on WhatsApp" : "WhatsApp ile yazın"}
        className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-black/25 transition hover:scale-105"
      >
        {/* Dikkat çeken nabız halkası */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="relative h-7 w-7 text-white"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-xs rounded-lg border border-white/10 bg-ink p-6 shadow-2xl shadow-black/40"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-3 text-xl leading-none text-white/50 transition hover:text-white"
                aria-label={en ? "Close" : "Kapat"}
              >
                ×
              </button>

              <div className="mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#25D366]" />
                <span className="kicker text-[#25D366]">WhatsApp</span>
              </div>
              <h3 className="font-display text-lg font-light text-white">{t.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/55">{t.sub}</p>

              <div className="mt-5 flex flex-col gap-3">
                <input
                  autoFocus
                  placeholder={t.name}
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    setErr("");
                  }}
                  className="rounded-sm border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-[#25D366]"
                />
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder={t.phone}
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    setErr("");
                  }}
                  className="rounded-sm border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-[#25D366]"
                />

                <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-relaxed text-white/55">
                  <input
                    type="checkbox"
                    checked={form.kvkk}
                    onChange={(e) => {
                      setForm({ ...form, kvkk: e.target.checked });
                      setErr("");
                    }}
                    className="mt-0.5 accent-[#25D366]"
                  />
                  <span>
                    {extra.kvkkText}{" "}
                    <Link
                      href={`/${en ? "en" : "tr"}/kvkk`}
                      target="_blank"
                      className="underline underline-offset-2 transition hover:text-white"
                    >
                      {extra.kvkkLink}
                    </Link>
                  </span>
                </label>

                {err && <p className="text-xs text-red-400">{err}</p>}

                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={submit}
                  className="rounded-full bg-[#25D366] px-6 py-3 text-center text-sm font-semibold text-ink transition hover:brightness-110"
                >
                  {t.open}
                </a>

                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setTimeout(() => setOpen(false), 600)}
                  className="text-center text-[11px] text-white/40 underline underline-offset-2 transition hover:text-white/70"
                >
                  {t.skip}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
