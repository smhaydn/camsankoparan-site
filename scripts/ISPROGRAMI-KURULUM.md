# İş Programı — Kurulum Rehberi

`camsankoparan.com/isprogrami` adresindeki şantiye iş programı modülü.

## 1. Supabase tablolarını oluştur (bir kez)

1. [supabase.com](https://supabase.com) → proje → **SQL Editor**
2. `scripts/isprogrami-setup.sql` dosyasının **tamamını** yapıştır → **Run**
3. **Kullanıcı şifrelerini değiştir.** SQL sonunda 3 örnek kullanıcı eklenir:
   `sef`, `muhendis`, `patron`. Şifreleri (`degistir-1/2/3`) mutlaka değiştir:
   ```sql
   update isprogrami_kullanicilar set sifre = 'guclu-sifre', ad = 'Tolga' where kullanici_adi = 'sef';
   ```

## 2. Ortam değişkenleri (environment variables)

Site zaten Supabase kullandığı için `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY`
muhtemelen tanımlı. İş Programı için **tek yeni değişken** gerekir:

| Değişken     | Açıklama                                                        |
|--------------|----------------------------------------------------------------|
| `ISP_SECRET` | Oturum çerezini imzalar. Uzun, rastgele bir metin olmalı.      |

`ISP_SECRET` üretmek için (terminalde):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Yerelde:** proje kökünde `.env.local` dosyasına ekle:
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ....
ISP_SECRET=buraya-uretilen-rastgele-metin
ADMIN_SECRET=... (mevcut yönetim paneli için, zaten varsa dokunma)
```

**Canlıda (Vercel):** Project → Settings → **Environment Variables** → `ISP_SECRET` ekle → yeniden dağıt (redeploy).

## 3. Kullanım

- Adres: **`/isprogrami`** (giriş yapılmamışsa `/isprogrami/giris`'e yönlendirir)
- Giriş: SQL'de tanımladığın kullanıcı adı + şifre
- Özellikler: iş ekle/düzenle/sil, tablo ve **Zaman Çizelgesi (Gantt)** görünümü,
  blok/durum filtreleri, arama, hızlı durum değiştirme, **değişiklik geçmişi** (kim ne yaptı).

## Notlar

- Açılır menü listeleri (bloklar, katlar, imalat detayları, birimler…) Excel'deki
  **VERİ** sekmesinden alınmıştır: `src/lib/isprogrami-listeler.ts`. Yeni seçenek
  gerekirse bu dosyaya ekleyin.
- Metraj/Hakediş modülü v2'ye planlıdır (bu sürüm sadece İş Programı'dır).
