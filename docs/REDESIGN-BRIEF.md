# Loft 777 / camsankoparan.com — Kapsamlı Revize Planı
**Hedef:** Awwwards SOTD + Developer Award alabilecek seviyede bir proje sitesi
**Hazırlayan:** Partum Ajans · **Tarih:** Temmuz 2026
**Mevcut stack:** Next.js (App Router), TR/EN i18n

---

## 0. CLAUDE CODE — ÖNCE BUNU OKU

Bu bir revizyon brief'idir, bir "yap-geç" listesi değil.

**Çalışma kuralları:**

1. **Önce Bölüm 2'yi oku.** Orada içerik çelişkileri var. Proje klasöründeki mevcut veri ile bu brief çelişiyorsa, **kendi kararını verme — bana sor.** Yanlış daire sayısıyla yayına giden bir gayrimenkul sitesi hukuki risk taşır.
2. **Önce Faz 1 (teknik hatalar) bitecek, sonra tasarıma geçilecek.** Tasarım güzelleşse bile canonical hatası duruyorsa site ödül alamaz, Google'da da görünmez.
3. **Her fazın sonunda dur, bana göster, onay al.** Tek seferde her şeyi değiştirme.
4. **Mevcut kodda çalışan bir şeyi bozma.** Değiştirmeden önce ne olduğunu anla; git branch aç (`feat/redesign-v2`).
5. **Tahmin edilen içerik yazma.** m², teslim tarihi, kat sayısı gibi veriler elinde yoksa placeholder bırakma — bana sor. Canlıda "— m²" görmek istemiyorum.
6. Bu dosyayı proje kökünde `docs/REDESIGN-BRIEF.md` olarak sakla ve ilerledikçe üstüne not düş.

---

## 1. MEVCUT DURUM DENETİMİ

### 1.1 Kritik teknik hatalar (ÖNCELİK: ACİL)

| # | Sorun | Kanıt | Etki |
|---|---|---|---|
| **T1** | **Canonical tüm sayfalarda ana sayfayı gösteriyor** | `/tr/projects/loft-777` sayfasında `canonical: https://camsankoparan.com/tr` | 🔴 Alt sayfalar Google'da indexlenmiyor olabilir. En ciddi hata. |
| **T2** | **Title ve meta description tüm sayfalarda aynı** | Proje detay sayfası ana sayfa ile birebir aynı meta veriyi kullanıyor | 🔴 Duplicate content sinyali, SEO kaybı |
| **T3** | **hreflang alternate etiketleri yok** | TR/EN sayfalar var, `<link rel="alternate" hreflang>` görünmüyor | 🟠 Çok dilli SEO çalışmıyor |
| **T4** | **Hero'daki sayaç boş render ediliyor** | "TOPLAM DAİRE" etiketi var, sayı yok (SSR çıktısında) | 🟠 CLS + JS kapalıysa boş görünüyor |
| **T5** | **Yayında placeholder veri** | "— m²", "Metrekare bilgileri yakında eklenecektir" | 🔴 Güven kaybı. Satış sitesinde kabul edilemez. |
| **T6** | **Boş bölüm canlıda** | "Haftalık Drone Görüntüleri → çok yakında paylaşılacak" | 🟠 Boş vaat, sayfayı zayıflatıyor |
| **T7** | **Harita generic** | Embed `q=Gaziemir, İzmir` — projenin pin'i yok | 🟠 Adres var ama harita onu göstermiyor |
| **T8** | **Structured data (JSON-LD) yok** | Schema.org işaretlemesi tespit edilmedi | 🟠 Google zengin sonuç veremiyor |
| **T9** | **Görsel alt metinleri jenerik** | "Dış cephe — gece", "Salon", "Mutfak" | 🟠 Erişilebilirlik + görsel SEO kaybı |
| **T10** | **"Dijital Katalog" linki hedefsiz** | Menüde ve hero'da var, gidilecek yer belirsiz | 🟠 Kırık kullanıcı yolculuğu |

### 1.2 Tasarım denetimi

**İyi olan:** İskelet doğru. Bölüm sırası mantıklı (hero → hakkında → proje → galeri → inşaat durumu → avantajlar → SSS → konum → iletişim). Karanlık tema (`#14110e`) doğru bir sezgi. WhatsApp CTA var. SSS var. İki dil var.

**Eksik olan:**

- **Ayırt edici hiçbir şey yok.** Bugünkü haliyle bu site, Türkiye'deki 500 konut projesi sitesinden biri. Hatırlanacak tek bir an yok.
- **Tipografi nötr.** Sistem fontu benzeri bir görünüm; başlıkların karakteri yok, ölçek hiyerarşisi zayıf.
- **Palet tanımsız.** Tek bir koyu ton + beyaz. Enerblock (SOTD, Mayıs 2026) tam 2 renk kullanıyor ama o iki rengi *seçmiş*. Sizde renk seçilmemiş, sadece koyu.
- **Numaralandırma dekoratif.** `01 / 02 / 03` markerleri var ama içerik bir sıra değil — bu, jenerik şablon işareti. Sıra bilgisi taşımayan yerden kaldırılmalı.
- **Hareket yok.** Menü geçişi, sayfa geçişi, scroll reveal, hover mikro-etkileşim — hiçbiri yok. Awwwards'ta "Animations/Transitions" ayrı puanlanan bir kalem.
- **Galeri sığ.** 17 görsel var, filtre var, ama sadece "büyütmek için tıklayın". Ödüllü sitelerde galeri bir deneyimdir.
- **Projenin asıl hikâyesi görselleştirilmemiş.** Site kendi metninde diyor ki: *"Altında canlı bir çarşı, üstünde modern daireler, ortasında havuzlu sosyal alan."* Bu **dikey bir kesit** — projenin tek gerçek farkı bu. Ve hiçbir yerde gösterilmiyor. En büyük kaçırılmış fırsat.
- **Marka kimliği belirsiz.** Domain firma adı (camsankoparan.com), içerik %100 tek proje (Loft 777). İkinci proje geldiğinde mimari çöker.

### 1.3 Awwwards puanlama sistemine göre mevcut tahmini durum

Awwwards SOTD ağırlıkları: **Tasarım %40 · Kullanılabilirlik %30 · Yaratıcılık %20 · İçerik %10**
(Referans: Enerblock SOTD 7.29/10 ile ödül aldı — eşik yaklaşık 6.5)

| Kriter | Tahmini mevcut | Hedef |
|---|---|---|
| Tasarım | ~5.0 | 7.5 |
| Kullanılabilirlik | ~6.0 | 7.5 |
| Yaratıcılık | ~4.0 | 7.5 |
| İçerik | ~5.5 | 7.5 |
| **Genel** | **~5.2** | **7.5** |

Developer Award kriterleri: Semantics/SEO · Animations · Accessibility · WPO · Responsive · Markup/Meta
Mevcut durumda **Semantics/SEO ve Markup kalemlerinden düşük puan alır** (T1–T3, T8).

---

## 2. ÇÖZÜLMESİ GEREKEN ÇELİŞKİLER — CLAUDE CODE BUNLARI SORACAK

Brief ile canlı site arasında **doğrulanmamış farklar** var. Bunlar netleşmeden ilgili bölümlere dokunma.

### 2.1 ÇÖZÜLDÜ — bu değerler kesindir, canlıdaki yanlış veriyi DÜZELT

| # | Konu | Sitede şu an YANLIŞ yazan | ✅ DOĞRUSU |
|---|---|---|---|
| **Ç1** | Toplam daire | 238 Daire (3 yerde) | **237 DAİRE** |
| **Ç2** | Otopark | "Açık Otopark" | **KAPALI OTOPARK** |
| **Ç3** | Spor salonu | Hiç geçmiyor | **VAR — eklenecek** |
| **Ç4** | Daire tipleri | "A Tipi / B Tipi" | **1+1 Dubleks** ve **1+1 Loft** |
| **Ç6** | Restoran | "Kafe & Restoran" | ✅ Doğru, kalsın |
| **Ç7** | Havuz | "Yüzme Havuzu" | **"Açık Yüzme Havuzu"** (kapalı havuz beklentisi yaratmamak için) |

> ⚠️ **Ç2 ACİL:** Canlı sitede şu anda "Açık Otopark" yazıyor ama proje kapalı otoparklı. Bu, satış görüşmesinde müşteriyi yanıltabilecek YANLIŞ BİLGİ. İlk düzeltilecek şeylerden biri.

### 2.2 LOFT DAİRE VERİSİ (C Blok kat planından doğrulandı)

Zemin + asma kat kurgusu, metal merdivenle bağlı:

| Mahal | Alan | Kat |
|---|---|---|
| Salon | **40.86 m²** | Zemin (çift yükseklik) |
| Mutfak | **9.75 m²** | Zemin |
| Yatak Odası | **27.58 m²** | Asma kat |
| Banyo / WC | **4.00 m²** | Asma kat |
| **Galeri Boşluğu** | **19.02 m²** | Salonun üstü — boşluk |
| **Toplam net (yaklaşık)** | **~82 m²** | (galeri boşluğu hariç) |

**Teknik detaylar:**
- Kat yüksekliği: **2.75 m** → galeri boşluğu sayesinde salon **~5.5 m çift yükseklik**
- Merdiven: **metal malzemeden imal**, 16 basamak, 27 cm rıht, 7.18 m uzunluk
- Mekanik havalandırma + mutfak bacası mevcut

> 🎯 **BU EN ÖNEMLİ BULGU. Claude Code, dikkat:**
> **Galeri boşluğu = projenin gerçek mimari farkı.** Salon çift yükseklikte (~5.5 m). Bu, "loft" isminin karşılığı ve rakip projelerin çoğunda olmayan bir özellik.
>
> Mevcut sitede bundan **tek kelime bahsedilmiyor** — sadece "modern 1+1 daireler" yazıyor, ki bu Türkiye'deki her projenin söylediği şey.
>
> Yeni sitede bu, daire bölümünün ana mesajı olacak. Örnek dil: *"Salonun üstünde tavan yok. 5.5 metre boşluk var."*
>
> Ve çift yükseklik **sadece kesitte anlaşılır** — planda görünmez, fotoğrafta zor anlaşılır. Bu, Bölüm 3.4'teki Kesit imza bölümünü sadece güzel bir fikir olmaktan çıkarıp **zorunlu** hale getiriyor.

### 2.3 HÂLÂ CEVAPLANMAMIŞ — Claude Code bunları sormalı

| # | Soru | Neden gerekli |
|---|---|---|
| **A1** | 1+1 Dubleks ve 1+1 Loft'un **her birinden kaç adet** var? (toplam 237) | Daireler sayfası |
| **A2** | **1+1 Dubleks'in planı** ayrıca var mı? Loft'tan farkı ne? | İki tip kartı |
| **A3** | Her tipin **brüt m²**'si (net ~82 m² biliniyor, brüt lazım) | Satış verisi |
| **A4** | **Spor salonu** m² ve içeriği (fitness / sauna / soyunma?) | Donatılar bölümü |
| **A5** | **Kapalı otopark kaç araçlık?** Daire başına 1 araç mı? | Donatılar bölümü |
| **A6** | **Kat sayısı ve blok sayısı** (planda "C Blok" geçiyor → en az 3 blok?) | Kesit bölümü + künye |
| **A7** | **Hedef teslim tarihi** (çeyrek bazında yeterli) | İnşaat durumu bölümü |
| **A8** | **Çarşıdaki dükkân sayısı**, satılık mı kiralık mı | Çarşı bölümü |
| **A9** | Havuz ölçüsü, çocuk havuzu var mı | Sosyal alan bölümü |

**Claude Code: A1–A3 cevaplanmadan Daireler bölümünü, A4–A5 cevaplanmadan Donatılar bölümünü yazma.**

---

## 3. TASARIM YÖNÜ

### 3.1 Tasarım tezi

> **Loft 777 dikey bir şehirdir.** Zeminde ticaret, ortada su ve yeşil, üstte yaşam.
> Site bu dikey istifi anlatmalı — çünkü projenin gerçek farkı bu, ve rakiplerin hiçbiri bunu göstermiyor.

Bu tez tüm kararları belirler: dikey kompozisyon, yukarıdan aşağı okuma, kat-kat açılan bölümler.

### 3.2 Renk paleti (5 renk, fazlası yok)

Mevcut `#14110e` sıcak-siyahı, `#15181B` soğuk grafite kaydırıyoruz — beton ve çelikle uyumlu, sıcak-kahve klişesinden uzak.

```css
:root {
  --l7-gece:    #15181B;  /* Ana zemin. Soğuk grafit. Beton + çelik. */
  --l7-alci:    #EDEAE4;  /* Açık zemin / metin. Sıcak alçı beyazı. */
  --l7-havuz:   #0E6B70;  /* AKSAN. Ege turkuazı — havuz, deniz, İzmir. */
  --l7-beton:   #8C8880;  /* Yardımcı. Etiket, caption, veri, çizgi. */
  --l7-gun:     #D8A03D;  /* MİKRO aksan. Sadece hover, rozet, aktif durum. */
}
```

**Kullanım oranı:** Gece %60 · Alçı %30 · Beton %7 · Havuz %2.5 · Gün %0.5

**Yasak:** Bu 5 rengin dışına çıkmak. Gradient kullanmak. Renkli gölge. Neon.

**Neden turkuaz:** Sektörde konut siteleri ya lacivert-altın (lüks klişesi) ya da bej-terrakota (AI klişesi) kullanıyor. Ege turkuazı hem projenin havuzuyla hem İzmir'le doğrudan bağlantılı, hem de kimse kullanmıyor.

### 3.3 Tipografi

| Rol | Font | Kaynak | Kullanım |
|---|---|---|---|
| **Display** | **Archivo Expanded** (variable) | Google Fonts | Sadece H1–H2. Geniş, mimari, kendinden emin. `letter-spacing: -0.02em` |
| **Gövde** | **Satoshi** | Fontshare (ücretsiz) | Paragraf, buton, menü |
| **Veri/Utility** | **JetBrains Mono** | Google Fonts | m², daire no, kat, tarih, koordinat, rozet |

**Alternatif (daha cesur istenirse):** Display'i **Bricolage Grotesque** ile değiştir.

> ⚠️ **KRİTİK — Claude Code bunu mutlaka doğrula:**
> Her fontu yüklemeden önce **Türkçe glif desteğini test et:** `ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü`
> Özellikle **noktasız ı** ve **noktalı İ** birçok display fontta yoktur veya bozuktur.
> Test etmeden hiçbir fontu commit etme. Eksikse alternatife geç ve bana haber ver.

**Tip ölçeği (clamp ile akışkan):**

```css
--fs-display: clamp(3rem, 9vw, 8.5rem);   /* H1 */
--fs-h2:      clamp(2rem, 4.5vw, 4rem);
--fs-h3:      clamp(1.25rem, 2vw, 1.75rem);
--fs-body:    clamp(1rem, 1.1vw, 1.125rem);
--fs-meta:    0.8125rem;  /* mono, uppercase, letter-spacing 0.08em */
```

**Kural:** H1 sadece hero'da bir kez. Her bölümde tek H2.

### 3.4 İMZA ELEMANI — "Kesit" (bunu unutma, sitenin tamamı bunun etrafında döner)

**Ne:** Scroll ile ilerledikçe binanın dikey kesitinin kat kat açıldığı, ekranı kaplayan bir bölüm.

**Nasıl çalışır:**

```
Scroll ilerledikçe (aşağıdan yukarı):

  ┌─────────────────────────┐
  │  ▲ 4  TERAS & DUBLEKS   │   ← Son reveal
  │      Çift kat, üst kot  │
  ├─────────────────────────┤
  │  ▲ 3  LOFT DAİRELER     │
  │      1+1 · 237 ünite    │
  ├─────────────────────────┤
  │  ▲ 2  SOSYAL KAT        │
  │      Havuz · Spor · Yeşil│
  ├─────────────────────────┤
  │  ▲ 1  ÇARŞI             │   ← İlk görünen
  │      Market·Kafe·Restoran│
  └─────────────────────────┘
       ↑ scroll progress
```

- Sol tarafta ince bir **dikey ilerleme çizgisi**, aktif kat turkuaz (`--l7-havuz`) ile işaretlenir.
- Her kat açıldığında sağda o katın **kısa metni + mono veri** (m², ünite sayısı) belirir.
- Kat görselleri: **çizgisel mimari kesit (SVG)** + o kata ait render fotoğrafı, maskeli geçişle.
- Mobilde: yatay kaydırma yerine **dikey stack**, aynı sıra, sadeleştirilmiş.

**Neden bu:** Projenin metninde zaten yazan hikâyeyi görselleştiriyor. 3D model gerektirmiyor. Türkiye'de hiçbir konut sitesinde yok. Awwwards "Yaratıcılık" (%20) kaleminin tamamını buradan alırsınız.

**✅ KAYNAK HAZIR:** Mimari kesit **DWG ve PDF olarak mevcut.** Bu bölümün en büyük riski kapandı.

**Teknik:**
1. DWG/PDF kesiti al → Illustrator veya `dwg2svg` ile **SVG'ye çevir**
2. Gereksiz katmanları temizle (ölçü çizgileri, tarama, yazı) — sadece kontur kalsın
3. Kat kat gruplara ayır: `#cat-carsi`, `#cat-sosyal`, `#cat-loft`, `#cat-teras`
4. GSAP ScrollTrigger + `pin` + timeline
5. SVG `stroke-dasharray` / `stroke-dashoffset` ile çizgi çizilme animasyonu
6. Her katın konturu çizildikten sonra o kata ait render fotoğrafı maskeli olarak belirir

---

### 3.4b İKİNCİ İMZA — "Galeri Boşluğu" (daire kesiti)

Yukarıdaki bina kesitinin küçük kardeşi. **Daireler sayfasında** yer alır.

Loft dairenin **kendi kesiti**: zemin kat (salon + mutfak) ve asma kat (yatak + banyo), aralarında metal merdiven, salonun üstünde **19.02 m² galeri boşluğu**.

```
   ┌───────────────────────────────┐
   │   ╲                           │  ← asma kat
   │    ╲  YATAK 27.58 m²   ░░░░░  │
   │     ╲                  ░░░░░  │  ░ = GALERİ BOŞLUĞU
   │      ╲ BANYO 4.00      ░░░░░  │      19.02 m²
   ├───────╲───────────────────────┤
   │ MUTFAK ╲                      │  ← zemin kat
   │ 9.75    ╲   SALON 40.86 m²    │
   │          ╲   ↕ ~5.5 m         │
   └───────────────────────────────┘
        metal merdiven, 16 basamak
```

**Etkileşim:** Scroll ya da hover ile mahaller sırayla vurgulanır, m² değerleri mono fontla belirir. Galeri boşluğu turkuaz (`--l7-havuz`) ile taranır ve **"5.5 m"** ölçü oku çizilir.

**Neden:** Çift yükseklik planda görünmez, fotoğrafta anlaşılmaz — **sadece kesitte okunur.** Projenin en güçlü satış argümanını göstermenin tek dürüst yolu bu. Ve rakiplerin hiçbiri daire kesiti yayınlamıyor.

**Kaynak:** C Blok kat planı PDF/DWG mevcut. Ek çizim gerekirse basit — 2 kat, 1 merdiven, 1 boşluk.

**İkincil imza:** `7` rakamı. Bölüm numaralarında, scroll progress göstergesinde ve 404 sayfasında motif olarak kullan. (Firmanın telefonu da 237 **7** 237 — sayı markanın parçası.)

### 3.5 Layout sistemi

- **Grid:** 12 kolon, `gap: clamp(16px, 2vw, 32px)`, max-width `1440px`, kenar boşluğu `clamp(20px, 5vw, 96px)`
- **Dikey ritim:** Bölüm arası `clamp(96px, 12vh, 200px)` — cömert boşluk, ödüllü sitelerin ortak özelliği
- **Köşe yarıçapı:** `2px` (neredeyse keskin — mimari dil). Butonlar `999px` DEĞİL.
- **Çizgi:** `1px solid rgba(237,234,228,0.12)` — hairline ayırıcılar
- **Görsel oranları:** Hero `21:9` · Galeri `4:5` ve `3:2` karışık · Kesit `full-bleed`

---

## 4. HAREKET (MOTION) SİSTEMİ

Awwwards Developer Award'da "Animations / Transitions" ayrı puanlanır. Ama **abartı = AI işi görünme riski.** Az ve orkestrasyonlu olacak.

### 4.1 Temel kurallar

```css
--ease-out:  cubic-bezier(0.16, 1, 0.3, 1);   /* Ana easing */
--ease-io:   cubic-bezier(0.65, 0, 0.35, 1);
--dur-fast:  200ms;   /* hover, buton */
--dur-base:  600ms;   /* reveal */
--dur-slow:  900ms;   /* sayfa geçişi, kesit */
```

### 4.2 Uygulanacak animasyonlar

| Yer | Ne | Süre |
|---|---|---|
| **Sayfa yüklenme** | Logo + H1 maskeli yukarı kayma, satır satır stagger 60ms | 900ms |
| **Sayfa geçişi** | View Transitions API (Next.js `next-view-transitions`) — turkuaz ince perde | 600ms |
| **Menü açılma** | Full-screen overlay, linkler stagger 50ms, arkada blur | 500ms |
| **Scroll reveal** | `clip-path: inset(100% 0 0 0)` → `inset(0)` + `translateY(24px)` | 600ms |
| **Kesit bölümü** | GSAP ScrollTrigger pin + kat kat reveal | scroll-bound |
| **Sayaç (237, 4 kat vb.)** | Sadece viewport'a girince bir kez, **SSR'da doğru sayı basılı olacak** | 1200ms |
| **Görsel hover** | `scale(1.03)` + overlay `opacity 0→0.15` | 300ms |
| **Buton hover** | Arka plan turkuaz doldurma (soldan sağa), metin rengi ters | 250ms |
| **Galeri lightbox** | Görselin kendi konumundan büyüme (FLIP tekniği) | 500ms |
| **Sticky header** | 80px scroll sonrası kompaktlaşma + blur backdrop | 300ms |

### 4.3 Yasaklar

- ❌ Otomatik oynayan sesli video
- ❌ Özel cursor (sadece galeri ve kesit üzerinde ok/artı ikonu — o kadar)
- ❌ Sayfa boyunca parallax "yağmuru"
- ❌ Loading ekranında sahte progress bar (gerçek yükleme yoksa)
- ❌ 3'ten fazla eşzamanlı animasyon

### 4.4 Zorunlu

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Ve GSAP tarafında `ScrollTrigger` timeline'ları bu tercihte tamamen devre dışı, içerik son haliyle görünür kalacak.

---

## 5. SAYFA SAYFA PLAN

### 5.1 Ana Sayfa (`/tr`)

| Sıra | Bölüm | Değişiklik |
|---|---|---|
| 1 | **Hero** | Full-viewport. H1 Archivo Expanded, 3 satır maskeli reveal. Arka planda **sessiz, loop, 8sn** dış cephe videosu (yoksa render + yavaş ken-burns). Altta 4 mono veri şeridi: `237 DAİRE` `2 TİP` `GAZİEMİR` `2026`. **Sayaç SSR'da dolu gelecek.** |
| 2 | **Tez cümlesi** | Yeni bölüm. Tek büyük cümle, sayfa ortasında: *"Zeminde çarşı. Ortada havuz. Üstte loft."* Sadece tipografi. |
| 3 | **KESİT** ⭐ | **İMZA BÖLÜM.** Bkz. 3.4. Sitenin kalbi. |
| 4 | **Daire tipleri** | 2 kart: 1+1 Dubleks / 1+1 Loft. Her birinde kat planı çizimi + m² (mono) + hover'da plan büyür. |
| 5 | **Yaşam & Donatılar** | Havuz, Spor Salonu, Çarşı, Restoran, Otopark, Peyzaj. Numaralandırma YOK (sıra değil). Grid + görsel + kısa metin. |
| 6 | **Galeri** | Kategori filtreli masonry. FLIP lightbox, klavye navigasyonu, sürükleme. |
| 7 | **İnşaat durumu** | 4 aşamalı yatay timeline, aktif aşama turkuaz. **Drone bölümü: içerik yoksa bölümü hiç gösterme** (boş vaat yasak). |
| 8 | **Konum** | Gerçek koordinatlı harita (koyu tema). Etrafta mesafe listesi: Havalimanı X km · İZBAN Y dk · Otoyol Z km — **gerçek rakamlarla.** |
| 9 | **SSS** | Accordion kalsın, animasyonu düzelt (height auto → grid-template-rows tekniği). |
| 10 | **İletişim / Lead** | Form + telefon + WhatsApp. Form validasyonu, başarı/hata durumları düzgün yazılmış. |
| 11 | **Footer** | Sadeleştir. Partum Ajans kredisi kalsın. |

### 5.2 Proje Hakkında (`/tr/about`)
Camsan Koparan Group hikâyesi + Loft 777 konsepti. **Güven bölümü ekle:** kuruluş yılı, tamamlanan proje sayısı, yapı ruhsatı bilgisi, referans projeler.

### 5.3 Daireler (`/tr/projects`)
Tip bazlı detay. Her tip için: kat planı (zoom'lanabilir), brüt/net m², oda dağılımı, cephe yönü, kat aralığı. Mümkünse **basit kat seçici** (kat → o kattaki tipler).

### 5.4 Neden Loft 777 (`/tr/services`)
Yatırım odaklı sayfa. Gaziemir bölge analizi, ulaşım, kira getirisi potansiyeli. **Rakam vaadi verirken dikkat** — "yatırım getirisi garantisi" gibi ifadeler hukuki risk. Sadece bölgesel veri sun.

### 5.5 İletişim (`/tr/contact`)
Form + harita + ofis bilgisi + satış ofisi çalışma saatleri.

### 5.6 Yeni: 404 sayfası
`7` motifi ile tasarlanmış özel 404. Awwwards jürisi bunu kontrol eder.

---

## 6. TEKNİK GEREKSİNİMLER (Developer Award 6 kriteri)

### 6.1 Semantics / SEO
- [ ] **T1 DÜZELT:** Her sayfa kendi canonical'ını üretecek (`generateMetadata` içinde dinamik)
- [ ] **T2 DÜZELT:** Her sayfa benzersiz `title` + `description`
- [ ] **T3 DÜZELT:** `hreflang` alternate (tr/en + `x-default`)
- [ ] Semantik HTML: `<header> <nav> <main> <section> <article> <footer>`
- [ ] Sayfa başına tek `<h1>`, hiyerarşi atlamasız
- [ ] `sitemap.xml` + `robots.txt` (Next.js `app/sitemap.ts`)

### 6.2 Markup / Meta-data
- [ ] **JSON-LD ekle:**
  - `Organization` (Camsan Koparan Group A.Ş.)
  - `ApartmentComplex` veya `Residence` (Loft 777)
  - `LocalBusiness` + `PostalAddress` + `GeoCoordinates`
  - `FAQPage` (mevcut SSS için — Google zengin sonuç verir)
  - `BreadcrumbList`
- [ ] OG görselleri sayfa bazlı (şu an hepsi aynı)

### 6.3 WPO (Performans) — Hedefler
| Metrik | Hedef |
|---|---|
| LCP | < 2.0s |
| CLS | < 0.05 |
| INP | < 200ms |
| Lighthouse Performance | ≥ 90 (mobil) |
| Toplam JS (gzip) | < 250 KB |

- [ ] Tüm görseller `next/image`, AVIF + WebP, doğru `sizes`
- [ ] Hero görseli `priority`, geri kalanı lazy
- [ ] Fontlar `next/font` ile self-host, `display: swap`, subset: `latin` + `latin-ext` (**Türkçe için latin-ext ŞART**)
- [ ] GSAP sadece ihtiyaç duyulan sayfada dinamik import
- [ ] Video: `poster` zorunlu, `preload="metadata"`, mobilde video yerine statik görsel

### 6.4 Accessibility (Hedef: Lighthouse 100)
- [ ] WCAG 2.1 AA — metin kontrastı ≥ 4.5:1 (turkuaz `#0E6B70` koyu zeminde kontrol edilecek, gerekirse açık varyant)
- [ ] Görünür focus halkası (turkuaz outline, 2px)
- [ ] Galeri lightbox: Esc kapatır, ok tuşları gezinir, focus trap
- [ ] Accordion: `aria-expanded`, `aria-controls`
- [ ] Skip-to-content linki
- [ ] **Tüm görsellere anlamlı alt metin** — "Dış cephe — gece" değil, "Loft 777 dış cephesi, akşam aydınlatması, Gaziemir İzmir"
- [ ] Form: `<label>` bağlantılı, hata mesajları `aria-live`
- [ ] `prefers-reduced-motion` desteği (Bölüm 4.4)

### 6.5 Responsive
- [ ] Breakpoint: 360 / 768 / 1024 / 1440 / 1920
- [ ] 360px'de yatay kaydırma OLMAYACAK
- [ ] Dokunma hedefleri ≥ 44×44px
- [ ] Kesit bölümünün mobil versiyonu ayrı tasarlanacak (pin yerine stack)
- [ ] Menü: mobilde full-screen overlay

### 6.6 Animations / Transitions
Bkz. Bölüm 4. Tamamı 60fps olacak — sadece `transform` ve `opacity` animasyonu, `width/height/top/left` animasyonu YASAK.

---

## 7. İÇERİK VE METİN

### 7.1 Ses tonu
Sakin, net, abartısız. Emlak jargonu yok ("eşsiz fırsat", "ayrıcalıklı yaşam", "prestijli" → hepsi çöp).
Somut ol: "237 daire" > "geniş bir yaşam alanı".

### 7.2 Yazılacak metinler
- [ ] Hero H1 (mevcut iyi, sadeleştirilecek)
- [ ] Tez cümlesi (yeni)
- [ ] Kesit bölümünün 4 kat metni (yeni)
- [ ] Her donatı için 1 cümle (spor salonu dahil — yeni)
- [ ] SSS: mevcut 6 soruya **"Ödeme planı nedir?"** ve **"Otopark dahil mi?"** eklenecek
- [ ] Form hata/başarı mesajları (şu an muhtemelen jenerik)
- [ ] 404 metni
- [ ] EN çevirilerin tamamı gözden geçirilecek (makine çevirisi kokmamalı)

---

## 8. FAZ PLANI

### FAZ 0 — Hazırlık (Claude Code: burada bana soru sor)
- Bölüm 2'deki Ç1–Ç5 çelişkilerini çöz
- Bölüm 11'deki soruları sor
- `feat/redesign-v2` branch aç
- Mevcut Lighthouse skorlarını kaydet (öncesi/sonrası karşılaştırma için)

### FAZ 1 — Teknik temizlik (tasarımdan ÖNCE)
T1, T2, T3, T4, T5, T7, T8, T9, T10 → hepsi kapanacak
**Çıktı:** SEO ve meta hataları sıfır. Lighthouse SEO 100.

### FAZ 2 — Tasarım sistemi
- Renk token'ları (`globals.css` / Tailwind config)
- Fontlar yüklenip **Türkçe glif testi**
- Tip ölçeği, spacing scale, grid
- Buton / kart / form bileşenleri
**Çıktı:** Storybook benzeri bir `/design-system` sayfası (dev only)

### FAZ 3 — Motion altyapısı
GSAP + ScrollTrigger kurulumu, reveal hook'u, sayfa geçişleri, reduced-motion
**Çıktı:** Tek bir bölümde çalışan demo

### FAZ 4 — Kesit bölümü (İMZA)
En çok zaman buraya. Desktop + mobil.
**Çıktı:** Tek başına gösterilebilir, etkileyici bir bölüm

### FAZ 5 — Sayfa sayfa uygulama
Ana sayfa → Daireler → Hakkında → Neden → İletişim → 404

### FAZ 6 — Galeri deneyimi
Masonry + FLIP lightbox + klavye + dokunma

### FAZ 7 — Performans ve erişilebilirlik geçişi
Bölüm 6'daki tüm hedefler tutturulana kadar

### FAZ 8 — İçerik doldurma + EN kontrolü + yayın

---

## 9. KABUL KRİTERLERİ (Definition of Done)

Site yayına girmeden önce hepsi ✅ olmalı:

- [ ] Lighthouse (mobil): Performance ≥ 90 · Accessibility 100 · Best Practices 100 · SEO 100
- [ ] Hiçbir sayfada placeholder metin/veri yok
- [ ] Hiçbir boş bölüm yok
- [ ] 360px'de yatay kaydırma yok
- [ ] Klavyeyle tüm site gezilebiliyor, focus her zaman görünür
- [ ] `prefers-reduced-motion` açıkken site tamamen kullanılabilir
- [ ] Her sayfa benzersiz title + description + canonical
- [ ] JSON-LD Google Rich Results Test'ten geçiyor
- [ ] TR ve EN içerik birebir eşleniyor
- [ ] Tüm görsellerde anlamlı alt metin
- [ ] Form gerçekten çalışıyor, lead bir yere düşüyor, test edildi
- [ ] Türkçe karakterler (ı İ ğ Ğ ş Ş) tüm fontlarda doğru
- [ ] 404 sayfası tasarlanmış
- [ ] Safari, Chrome, Firefox + iOS Safari + Android Chrome'da test edildi

---

## 10. REFERANS SİTELER (Claude Code: tasarım kararı verirken bunlara bak)

| Site | Ne için |
|---|---|
| `enerblock.net/en` | SOTD Mayıs 2026. 2 renkli disiplin, Astro+GSAP, sticky bölümler |
| `novobudowa.pl/en` | İnşaat sürecinin animasyonla anlatımı — Kesit bölümü için |
| `havenconstructions.com.au` | Butik müteahhit, sıcak ama modern |
| `spenceltd.co.uk` | Kurumsal inşaat tipografisi |
| `houseofhoney.com` | SOTD Temmuz 2026, üst düzey görsel dil |
| `zorge9.estate` | Konut projesi sitesi (HM Haziran 2026) |
| `areteimmobiliare.com` | Gayrimenkul, İtalyan zarafeti (HM Haziran 2026) |

---

## 11. SEMİH'İN CEVAPLAMASI GEREKENLER

### ✅ CEVAPLANDI — karar verildi, tekrar sorma

| Konu | Karar |
|---|---|
| Daire sayısı | **237** |
| Otopark | **Kapalı otopark** |
| Spor salonu | **Var** (detay bekleniyor) |
| Daire tipleri | **1+1 Dubleks** + **1+1 Loft** |
| Mimari kesit | **DWG + PDF mevcut** → Kesit bölümü yapılacak |
| Kat planı | **PDF mevcut** (C Blok, zemin+asma kat) |
| Marka mimarisi | **Tek proje sitesi.** Kurumsal/çoklu proje mimarisi KURULMAYACAK. İkinci proje gelirse o zaman değerlendirilir. |
| Render kalitesi | Mevcut render'lar Higgsfield ile ayrı bir hatta iyileştirilecek. **Claude Code bunu beklemeyecek** — geliştirme placeholder görsellerle ilerler, görseller sonradan değiştirilir. |

> **Claude Code için sonuç:** Görsel dosya isimlerini ve klasör yapısını **şimdiden nihai haliyle kur** (`/public/images/exterior-01.webp` gibi). Görseller sonradan aynı isimle üzerine yazılacak. Kod hiç değişmeyecek.

### ❓ HÂLÂ BEKLEYEN — Claude Code sorsun

**Proje verisi** (Bölüm 2.3'teki A1–A9 ile aynı, tekrar etme)

**İçerik varlıkları**
1. **Dijital Katalog** PDF'i hazır mı? Nereye link verilecek? (Menüde link var, hedefi belirsiz)
2. **Drone çekimi** yapılacak mı, hangi sıklıkta, kim yükleyecek?
3. **Gaziemir mesafe verileri:** Havalimanı kaç km, İZBAN kaç dakika, otoyol kaç km? Şu an sitede sadece "yakın" yazıyor — **rakamsız mesafe ifadesi zayıf ve ikna edici değil.**
4. Blok isimleri neler? (Planda "C Blok" geçiyor → A, B, C… kaç blok?)

**Teknik / operasyon**
5. **Fiyat gösterilecek mi?** Yoksa sadece lead formu mu?
6. **Lead'ler nereye düşecek?** (E-posta / Google Sheet / CRM / WhatsApp)
7. **CMS gerekli mi?** Drone görselleri haftalık güncellenecekse müşteri kendi yükleyebilmeli → **Sanity öneriliyor.** Güncellemeyi Partum yapacaksa CMS gereksiz, statik dosya yeter.
8. **Analytics:** GA4 + Meta Pixel kurulacak mı?
9. **Yasal:** KVKK aydınlatma metni, çerez politikası, gizlilik politikası var mı? **Form varsa KVKK metni yasal zorunluluk — formsuz yayına çıkılmaz.**

---

## 12. RİSKLER VE DÜRÜST UYARILAR

1. **Ödül potansiyeli görsel kalitesine bağlı — ve şu an en büyük risk bu.** Mevcut render'ların mimarisi doğru ama malzeme, doku ve renk kalitesi yetersiz. Bunlar Higgsfield ile ayrı bir hatta iyileştirilecek. **Claude Code bu işi beklemez** — placeholder görsellerle ilerler. Ama nihai değerlendirme, iyileştirilmiş görseller yerine konduktan sonra yapılmalı.
   > ⚖️ **Yasal not:** İyileştirilmiş görsellerde bina geometrisi (kat sayısı, pencere düzeni, balkon, cephe ritmi) **kesinlikle değişmemeli.** Sadece malzeme/ışık/atmosfer düzeltilecek. Teslim edilen bina tanıtım görseline uymazsa tüketici hakkı doğar. Her görselin altında "Görseller temsilidir" ibaresi bulunacak.

2. ~~Kesit bölümü kaynak riski~~ → **ÇÖZÜLDÜ.** DWG + PDF mevcut. Risk kalmadı, sadece SVG'ye çevirme ve temizleme emeği var.

3. **Kapsam kayması riski.** 8 faz var. Müşteriye teslim tarihi verirken Faz 1-2-5 çekirdek, Faz 4-6 "ilerlemiş seviye" olarak ayrılmalı. Kesit bölümü olmadan da yayınlanabilir bir site çıkmalı.

4. **Türkçe font sorunu gerçek bir risk.** Fontshare ve Google Fonts'taki birçok display fontta noktasız `ı` ya yok ya bozuk. Faz 2'de bu test edilmeden ilerlenmemeli.

5. **Awwwards'a gönderilmeyecek olsa bile** bu standart, Partum Ajans'ın portföyünde referans değeri yaratır. Ama süre ve maliyet normal bir kurumsal siteden 2-3 kat fazladır — bunu müşteri beklentisi olarak yönetin.

---

*Bu doküman Claude Code'un çalışma referansıdır. Proje ilerledikçe güncellenmelidir.*
