-- ============================================================
--  İŞ PROGRAMI — Supabase kurulum SQL'i
--  Supabase panelinde:  SQL Editor  →  bu dosyanın tamamını yapıştır  →  Run
--  (Yalnızca BİR KEZ çalıştırılır. Tekrar çalıştırmak veriyi silmez.)
-- ============================================================

-- 1) İşler tablosu
create table if not exists isprogrami_isler (
  id          uuid primary key default gen_random_uuid(),
  sira        integer not null default 0,
  ana_kalemi  text,
  imalat      text,
  blok        text,
  kat         text,
  aciklama1   text,
  aciklama2   text,
  metraj      numeric,
  birim       text,
  gerc_yuzde  numeric default 0,
  gun         integer,
  baslangic   date,
  bitis       date,
  durum       text default 'Başlanmadı',
  ekip        text,
  bagli_is_1  text,
  bagli_is_2  text,
  bagli_is_3  text,
  oncelik     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  text,
  updated_by  text
);

-- 2) Değişiklik geçmişi (kim, ne zaman, neyi değiştirdi)
create table if not exists isprogrami_log (
  id            bigint generated always as identity primary key,
  at            timestamptz not null default now(),
  kullanici     text,
  islem         text,          -- ekle / güncelle / sil
  is_id         uuid,
  is_ozet       text,
  degisiklikler jsonb
);

-- 3) Kullanıcılar (giriş yapan 3 kişi)
create table if not exists isprogrami_kullanicilar (
  id            uuid primary key default gen_random_uuid(),
  kullanici_adi text unique not null,
  ad            text not null,
  sifre         text not null,
  aktif         boolean not null default true,
  created_at    timestamptz not null default now()
);

-- 4) Güvenlik: RLS açık — anon/tarayıcı erişemez.
--    Uygulama sunucu tarafında SERVICE_ROLE anahtarıyla eriştiği için
--    ayrıca policy tanımlamaya gerek yoktur.
alter table isprogrami_isler        enable row level security;
alter table isprogrami_log          enable row level security;
alter table isprogrami_kullanicilar enable row level security;

-- 5) Hız için indeksler
create index if not exists idx_isprogrami_isler_sira   on isprogrami_isler (sira);
create index if not exists idx_isprogrami_isler_blok   on isprogrami_isler (blok);
create index if not exists idx_isprogrami_log_at        on isprogrami_log (at desc);

-- 6) Başlangıç kullanıcıları — ŞİFRELERİ MUTLAKA DEĞİŞTİRİN!
--    (kullanici_adi ile giriş yapılır; "ad" geçmişte görünen isimdir.)
insert into isprogrami_kullanicilar (kullanici_adi, ad, sifre) values
  ('sef',      'Şantiye Şefi', 'degistir-1'),
  ('muhendis', 'Saha Mühendisi', 'degistir-2'),
  ('patron',   'Semih',        'degistir-3')
on conflict (kullanici_adi) do nothing;

-- Şifre/isim değiştirmek için örnek:
--   update isprogrami_kullanicilar set sifre = 'yeni-sifre', ad = 'Tolga' where kullanici_adi = 'sef';
