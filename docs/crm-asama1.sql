-- ============================================================
-- CRM 1. Aşama — Aktivite geçmişi + Takip hatırlatması
-- Camsankoparan / Loft 777 paneli
-- ------------------------------------------------------------
-- Bu betik MEVCUT VERİYE DOKUNMAZ. Sadece:
--   1) loft777_leads tablosuna "follow_up_at" (sonraki arama tarihi) kolonu ekler
--   2) lead_activities (aday görüşme geçmişi) tablosunu oluşturur
-- Supabase → SQL Editor'e yapıştırıp "Run" de. Bir kez çalıştırılır.
-- ============================================================

-- 1) Takip tarihi kolonu (varsa dokunma)
ALTER TABLE public.loft777_leads
  ADD COLUMN IF NOT EXISTS follow_up_at timestamptz;

-- 2) Aktivite geçmişi tablosu
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     uuid NOT NULL REFERENCES public.loft777_leads(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  kind        text NOT NULL DEFAULT 'note',   -- note | call | whatsapp | appointment | status | followup
  body        text
);

-- Bir adayın geçmişini hızlı çekmek için indeks
CREATE INDEX IF NOT EXISTS lead_activities_lead_idx
  ON public.lead_activities (lead_id, created_at DESC);

-- Güvenlik: RLS açık kalsın; tabloya sadece sunucu (service_role) erişir.
-- service_role RLS'i zaten aşar, anon anahtar erişemez.
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
