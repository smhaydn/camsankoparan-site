// İş Programı — veri modeli ve açılır menü listeleri.
// Listeler, şantiye şefinin Excel dosyasındaki "VERİ" sekmesinden birebir alınmıştır.
// Yeni seçenek gerekirse buraya ekleyin; tüm formlar otomatik günceller.

export type Is = {
  id: string;
  sira: number; // sıralama (Gantt/tablo düzeni)
  ana_kalemi: string | null; // Ana İnş. Kalemi (İMALATLAR)
  imalat: string | null; // İmalat kodu / adı
  blok: string | null;
  kat: string | null;
  aciklama1: string | null; // İmalat Detayları
  aciklama2: string | null; // Perde+Kolon / Kiriş+Döşeme
  metraj: number | null;
  birim: string | null;
  gerc_yuzde: number | null; // Gerçekleşme yüzdesi (0-100)
  gun: number | null; // Süre (gün)
  baslangic: string | null; // ISO tarih (YYYY-MM-DD)
  bitis: string | null; // ISO tarih (YYYY-MM-DD)
  durum: string | null;
  ekip: string | null;
  bagli_is_1: string | null;
  bagli_is_2: string | null;
  bagli_is_3: string | null;
  oncelik: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

// Yeni iş eklerken kullanılan alanlar (id/tarih/otomatik alanlar hariç)
export type IsGirdi = Omit<
  Is,
  "id" | "created_at" | "updated_at" | "created_by" | "updated_by"
>;

// ───────────── Açılır menü listeleri (VERİ sekmesi) ─────────────

export const ANA_KALEMLER = [
  "Kaba İmalatlar",
  "İnce İmalatlar",
  "Elektrik İmalatları",
  "Mekanik İmalatları",
  "Çatı",
  "Mobilya İmalatları",
  "Çelik Kapı",
  "Korkuluklar",
  "Alüminyum Doğramalar",
  "Ges Sistemi",
  "Ortak Alanlar",
  "Peyzaj",
  "Çevre Düzenlemesi",
  "Test Ve Devreye Alma",
  "Havuz İmalatları",
  "Hafriyat İmalatları",
] as const;

export const BLOKLAR = [
  "A. Blok",
  "B. Blok",
  "C. Blok",
  "D. Blok",
  "E. Blok",
] as const;

export const KATLAR = [
  "Temel",
  "2. Bodrum Kat",
  "1. Bodrum Kat",
  "Zemin Kat",
  "Asma Kat",
  "Normal Kat",
  "Çatı Kat",
  "Asansör Kuleleri",
] as const;

export const ACIKLAMA2 = ["Perde + Kolon", "Kiriş + Döşeme"] as const;

export const BIRIMLER = [
  "m",
  "m²",
  "m³",
  "kg",
  "ton",
  "adet",
  "gün",
  "ay",
  "lt",
  "set",
  "global",
] as const;

export const ANA_IS_GRUPLARI = [
  "Hazırlık",
  "Hafriyat",
  "Altyapı",
  "Temel",
  "Bodrum Betonarme",
  "Kat Betonarme",
  "Çatı",
  "Duvar",
  "Sıva-Şap",
  "Kaplama",
  "Boya",
  "Tavan",
  "Doğrama-Cam",
  "Cephe",
  "Su Yalıtımı",
  "Elektrik",
  "Mekanik",
  "Çevre Düzenleme",
  "Test-Kabul-Teslim",
] as const;

export const SORUMLULAR = [
  "Şantiye Şefi",
  "Saha Mühendisi",
  "Mimar",
  "Elektrik Ekibi",
  "Mekanik Ekibi",
  "Taşeron",
  "Satın Alma",
] as const;

export const EKIPLER = ["Kalıpçı", "Demirci", "Epoksi Ustası"] as const;

export const ONCELIKLER = ["Düşük", "Normal", "Yüksek", "Kritik"] as const;

// İmalat Detayları (Açıklama-1) — VERİ sekmesindeki 103 kalem
export const IMALAT_DETAYLARI = [
  "Delim + Filiz Ekimi",
  "Kalıp İmalatları",
  "Demir İmalatları",
  "Beton İmalatları",
  "Kalıp Sökümü",
  "Bölme Duvar İmalatları",
  "Buhar Kesici",
  "Isı Yalıtımı",
  "Su Yalıtımı",
  "Koruma Betonu",
  "Eğim Betonu",
  "Şap",
  "Kaplama",
  "Yağmur İnişleri",
  "Makine Sıvası",
  "El Sıvası",
  "Tesviye Şapı",
  "Islak Hacim Şapı",
  "Balkon Şapı",
  "Çatı Şapı",
  "Salon Seramiği",
  "Mutfak Seramiği",
  "Hol Seramiği",
  "Balkon Seramiği",
  "WC Seramiği",
  "Banyo Seramiği",
  "Mutfak Tezgahı Arası Seramiği",
  "Balkon Su Yalıtımı",
  "Teras Su Yalıtımı",
  "Banyo Su Yalıtımı",
  "WC Su Yalıtımı",
  "Temel Su Yalıtımı",
  "Perde Su Yalıtımı",
  "Asma Tavan",
  "Işık Bandı",
  "Bölme Duvar",
  "İç Cephe Astar",
  "İç Cephe Zımpara",
  "İç Cephe Son Kat Boya",
  "Dış Cephe Astar",
  "Dış Cephe Dış Cephe Boyası",
  "Mutfak Dolapları",
  "Kapılar",
  "Portmanto",
  "Daire Giriş Kapıları",
  "Balkon Korkulukları",
  "Daire Doğramaları",
  "Doğrama Camları",
  "Borulama",
  "Kablolama",
  "Zayıf Akım İnternet",
  "Zayıf Akım TV",
  "Zayıf Akım Telefon",
  "Yangın Algılama",
  "Kamera",
  "Aydınlatma",
  "Priz",
  "Panolar Ana Pano",
  "Panolar Kat Panoları",
  "Panolar Daire Panoları",
  "Sayaçlar",
  "Topraklama",
  "Güneş Enerji Sistemi",
  "Temiz Su",
  "Pis Su",
  "Havalandırma",
  "Klima ( Vrf ) Alt Yapı",
  "Sıcak Su Tesisatı",
  "Yangın Tesisatı",
  "Drenaj Sistemleri",
  "Merdiven Korkulukları",
  "Asansör Montajı",
  "Yangın Kapıları",
  "Acil Kaçış Yönlendirmeleri",
  "Beton Saksılar",
  "Yürüyüş Yolları",
  "Çim",
  "Bitkilendirme",
  "Sulama Sistemleri",
  "Çevre Duvarları",
  "Otopark Girişleri",
  "Bahçe Korkulukları",
  "Otopark Çizgileri",
  "Elektirk Test ve ölçümleri",
  "Su basıncı Testi",
  "Yangın Sistemi Devreye Alma",
  "Asansör Testleri",
  "Dalgıç Motor Testleri",
  "Havuz Betonarme",
  "Havuz Borulama",
  "Havuz İzolasyonu",
  "Sap İmalatları",
  "Sıva İmalatları",
  "Seramik İmalatları",
  "Makine Dairesi Kurulumu",
  "Taşma Savakları",
  "Elektrik İmalatları",
  "Havuz Cam Montajı",
  "Devreye Alma Ve Sızdırmazlık Testi",
  "Havuz Aydınlatma Montajı",
] as const;

// ───────────── Durum etiketleri (renk + emoji) ─────────────

export const DURUMLAR = [
  { value: "Başlanmadı", emoji: "⚪", color: "#94a3b8" },
  { value: "Beklemede", emoji: "⏸️", color: "#eab308" },
  { value: "Devam Ediyor", emoji: "🔨", color: "#3b82f6" },
  { value: "Gecikmede", emoji: "⚠️", color: "#ef4444" },
  { value: "Ertelendi", emoji: "⏭️", color: "#a855f7" },
  { value: "Tamamlandı", emoji: "✅", color: "#22c55e" },
] as const;

export function durumMeta(value: string | null) {
  return (
    DURUMLAR.find((d) => d.value === value) ?? {
      value: value ?? "—",
      emoji: "•",
      color: "#94a3b8",
    }
  );
}

// Bir işin insan-okur kısa özeti (log ve bağlı-iş seçiminde kullanılır)
export function isOzeti(is: Partial<Is>): string {
  const parcalar = [is.blok, is.kat, is.aciklama1 || is.imalat].filter(Boolean);
  return parcalar.join(" · ") || "İsimsiz iş";
}
