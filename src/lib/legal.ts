import type { Locale } from "./i18n";

/**
 * Yasal metinler — KVKK aydınlatma, gizlilik politikası, çerez politikası.
 * İçerik sitenin GERÇEK veri akışına göre yazıldı:
 *  - Form alanları: src/lib/leads.ts
 *  - Kayıt: Supabase (yurt dışı sunucu) — src/app/api/lead/route.ts
 *  - Meta CAPI + Lead Ads: src/app/api/lead/route.ts, src/app/api/meta-lead/route.ts
 *  - Çerez/piksel: src/components/site/tracking-scripts.tsx
 * Bir alan değişirse bu metinler de güncellenmeli.
 */

export const LEGAL_UPDATED = "18 Ağustos 2026";
export const LEGAL_UPDATED_EN = "18 August 2026";

export type LegalSection = { h: string; p: string[]; list?: string[] };
export type LegalDoc = { kicker: string; title: string; intro: string; updated: string; sections: LegalSection[] };

const COMPANY_TR =
  "Camsan Koparan Group A.Ş. (“Şirket”, “biz”), Dokuz Eylül Mahallesi, 694. Sokak No: 5, 35410 Gaziemir / İzmir";
const COMPANY_EN =
  "Camsan Koparan Group Inc. (“the Company”, “we”), Dokuz Eylül Mahallesi, 694. Sokak No: 5, 35410 Gaziemir / Izmir, Türkiye";

/* ------------------------------------------------------------------ TÜRKÇE */

const kvkkTr: LegalDoc = {
  kicker: "KVKK",
  title: "Kişisel Verilerin Korunması Aydınlatma Metni",
  intro:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi uyarınca, kişisel verilerinizi hangi amaçla işlediğimizi, kimlere aktardığımızı ve haklarınızı açıklamak üzere hazırlanmıştır.",
  updated: LEGAL_UPDATED,
  sections: [
    {
      h: "1. Veri Sorumlusu",
      p: [
        `${COMPANY_TR} adresinde faaliyet gösteren veri sorumlusudur.`,
        "İletişim: info@camsankoparan.com · 0232 237 72 37",
      ],
    },
    {
      h: "2. İşlenen Kişisel Verileriniz",
      p: ["camsankoparan.com üzerindeki formları doldurduğunuzda veya bizimle iletişime geçtiğinizde aşağıdaki veriler işlenir:"],
      list: [
        "Kimlik bilgisi: ad ve soyad",
        "İletişim bilgisi: telefon numarası, e-posta adresi (isteğe bağlı)",
        "Müşteri işlem bilgisi: ilgilendiğiniz daire tipi, bütçe / ödeme tercihi, formda ilettiğiniz serbest mesaj",
        "Pazarlama bilgisi: talebin hangi kanaldan geldiği (web sitesi, Instagram/Meta reklamı veya telefonla alınıp elle girilen kayıt)",
        "İşlem güvenliği ve kullanım bilgisi: IP adresi, tarayıcı ve cihaz bilgisi, site içi gezinme verileri (çerezler aracılığıyla)",
      ],
    },
    {
      h: "3. İşleme Amaçlarımız",
      p: ["Kişisel verileriniz yalnızca aşağıdaki amaçlarla işlenir:"],
      list: [
        "Talebiniz üzerine sizinle telefon, e-posta veya WhatsApp yoluyla iletişime geçmek",
        "Loft 777 projesi hakkında bilgi, fiyat ve ödeme seçenekleri sunmak",
        "Proje alanında tanıtım ve satış görüşmesi planlamak",
        "Taleplerinizi kayıt altına almak ve satış sürecini takip etmek",
        "Reklam ve tanıtım çalışmalarımızın performansını ölçmek, hizmetlerimizi geliştirmek",
        "Hukuki yükümlülüklerimizi yerine getirmek",
      ],
    },
    {
      h: "4. Hukuki Sebep",
      p: [
        "Verileriniz, Kanun'un 5. maddesinde yer alan “ilgili kişinin açık rızasının bulunması” hukuki sebebine dayanarak işlenir. Formu gönderirken işaretlediğiniz onay kutusu bu açık rızayı oluşturur.",
        "Bunun yanında, bir sözleşme kurulması veya ifasıyla doğrudan ilgili olması ile şirketimizin meşru menfaatleri hukuki sebeplerine dayanılabilir. Hukuki yükümlülüklerimiz kapsamında işlenmesi gereken veriler için ayrıca rıza aranmaz.",
      ],
    },
    {
      h: "5. Toplama Yöntemi",
      p: [
        "Kişisel verileriniz; camsankoparan.com üzerindeki iletişim ve “Sizi Arayalım” formları, Instagram ve Facebook (Meta) reklamlarındaki potansiyel müşteri formları ile telefon görüşmelerinde tarafımıza ilettiğiniz bilgiler üzerinden elektronik ortamda toplanır.",
      ],
    },
    {
      h: "6. Aktarılan Taraflar ve Yurt Dışına Aktarım",
      p: [
        "Kişisel verileriniz satılmaz ve pazarlama amacıyla üçüncü kişilere devredilmez. Yalnızca hizmetin yürütülmesi için gerekli olan aşağıdaki tedarikçilere aktarılır:",
      ],
      list: [
        "Web sitesi barındırma ve altyapı hizmeti sağlayıcısı (Vercel Inc. — ABD)",
        "Veri tabanı ve kayıt altyapısı sağlayıcısı (Supabase Inc. — sunucular yurt dışında)",
        "E-posta gönderim altyapısı (Hostinger)",
        "Reklam ve ölçümleme platformları (Meta Platforms Inc., Google LLC)",
        "Yasal olarak yetkili kamu kurum ve kuruluşları ile hukuki danışmanlarımız",
      ],
    },
    {
      h: "7. Meta ve Google'a İletilen Ölçümleme Verisi",
      p: [
        "Reklam performansını ölçmek amacıyla, form gönderimi gerçekleştiğinde Meta'nın Dönüşüm API'sine bir olay bildirimi gönderilir. Bu bildirimde telefon numaranız açık halde değil, geri döndürülemez şekilde şifrelenmiş (SHA-256) olarak iletilir; Meta bu değeri yalnızca eşleştirme amacıyla kullanır.",
        "Google Analytics üzerinden toplanan veriler ise kimliğinizi doğrudan belirlemeye yönelik olmayıp, sitenin nasıl kullanıldığını anlamaya yöneliktir.",
        "Bu aktarımlar yurt dışına yapılmakta olup, form üzerindeki açık rızanız bu aktarımı da kapsar.",
      ],
    },
    {
      h: "8. Saklama Süresi",
      p: [
        "Verileriniz, işlenme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı süreleri boyunca saklanır. Satış süreci sonuçlanmayan taleplere ait kayıtlar en fazla 2 yıl saklanır; sözleşmeye dönüşen ilişkilerde mevzuatın öngördüğü saklama süreleri uygulanır. Süre dolduğunda verileriniz silinir, yok edilir veya anonim hale getirilir.",
      ],
    },
    {
      h: "9. Haklarınız",
      p: ["Kanun'un 11. maddesi uyarınca şu haklara sahipsiniz:"],
      list: [
        "Kişisel verinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme",
        "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
        "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
        "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
        "Kanun'daki şartlar çerçevesinde silinmesini veya yok edilmesini isteme",
        "Düzeltme, silme ve yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme",
        "Otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç doğmasına itiraz etme",
        "Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
        "Verdiğiniz açık rızayı dilediğiniz zaman geri alma",
      ],
    },
    {
      h: "10. Başvuru",
      p: [
        "Haklarınıza ilişkin taleplerinizi info@camsankoparan.com adresine e-posta ile veya Dokuz Eylül Mahallesi, 694. Sokak No: 5, 35410 Gaziemir / İzmir adresine yazılı olarak iletebilirsiniz.",
        "Başvurunuz, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ uyarınca en geç 30 gün içinde sonuçlandırılır. Başvurunuzda kimliğinizi tevsik edici bilgilerin ve talebinizin açıkça belirtilmesi gerekir.",
      ],
    },
  ],
};

const privacyTr: LegalDoc = {
  kicker: "Gizlilik",
  title: "Gizlilik Politikası",
  intro:
    "camsankoparan.com'u ziyaret ettiğinizde hangi bilgileri topladığımızı, bunları nasıl kullandığımızı ve nasıl koruduğumuzu açıklar.",
  updated: LEGAL_UPDATED,
  sections: [
    {
      h: "1. Kapsam",
      p: [
        `Bu politika, ${COMPANY_TR} tarafından işletilen camsankoparan.com alan adlı web sitesi ve buradaki formlar için geçerlidir. Siteden bağlantı verilen üçüncü taraf sitelerin gizlilik uygulamalarından sorumlu değiliz.`,
      ],
    },
    {
      h: "2. Topladığımız Bilgiler",
      p: ["İki tür bilgi toplarız:"],
      list: [
        "Sizin verdiğiniz bilgiler: form doldurduğunuzda ilettiğiniz ad soyad, telefon, e-posta, daire tipi tercihi, bütçe / ödeme tercihi ve mesajınız.",
        "Otomatik toplanan bilgiler: IP adresi, tarayıcı ve cihaz türü, siteye hangi sayfadan geldiğiniz, hangi sayfaları görüntülediğiniz ve ne kadar süre kaldığınız. Bunlar çerezler aracılığıyla toplanır.",
      ],
    },
    {
      h: "3. Bilgileri Neden Kullanıyoruz",
      p: [
        "Sizinle iletişime geçmek, proje hakkında bilgi vermek, randevu planlamak, taleplerinizi kayıt altına almak ve reklam çalışmalarımızın etkisini ölçmek için kullanıyoruz. Bilgilerinizi satmıyoruz ve pazarlama amacıyla üçüncü kişilere devretmiyoruz.",
      ],
    },
    {
      h: "4. Bilgilerin Paylaşıldığı Taraflar",
      p: [
        "Verileriniz; web sitesi barındırma (Vercel), veri tabanı (Supabase), e-posta gönderimi (Hostinger) ve reklam ölçümleme (Meta, Google) hizmet sağlayıcılarımızın altyapılarında işlenir. Bu sağlayıcıların sunucuları yurt dışında bulunmaktadır. Ayrıntılı bilgi KVKK Aydınlatma Metni'ndedir.",
      ],
    },
    {
      h: "5. Güvenlik",
      p: [
        "Site tümüyle şifreli bağlantı (HTTPS) üzerinden yayınlanır. Form kayıtlarına yalnızca yetkilendirilmiş şirket personeli, parola korumalı yönetim paneli üzerinden erişebilir. Veri tabanı erişimi satır düzeyinde kısıtlanmıştır.",
        "Hiçbir aktarım yönteminin %100 güvenli olmadığını belirtmek isteriz; bu nedenle formlar üzerinden kimlik numarası, banka veya kart bilgisi gibi hassas veriler istenmez, göndermenizi de önermeyiz.",
      ],
    },
    {
      h: "6. Çocukların Verileri",
      p: [
        "Site 18 yaşın altındaki kişilere yönelik değildir; bilerek 18 yaş altı kişilerden veri toplamayız. Böyle bir kaydın tarafımıza ulaştığını fark edersek siler ve talep hâlinde derhal kaldırırız.",
      ],
    },
    {
      h: "7. Haklarınız ve İletişim",
      p: [
        "Verilerinize erişme, düzeltme, silme ve rızanızı geri çekme haklarınız vardır. Talepleriniz için info@camsankoparan.com adresine yazabilirsiniz. Ayrıntılı açıklama KVKK Aydınlatma Metni'ndedir.",
      ],
    },
    {
      h: "8. Değişiklikler",
      p: [
        "Bu politikayı zaman zaman güncelleyebiliriz. Güncel sürüm her zaman bu sayfada yayınlanır ve yukarıda son güncelleme tarihi belirtilir.",
      ],
    },
  ],
};

const cookiesTr: LegalDoc = {
  kicker: "Çerezler",
  title: "Çerez Politikası",
  intro:
    "Çerezler, ziyaret ettiğiniz sitelerin cihazınıza kaydettiği küçük metin dosyalarıdır. Bu sayfada hangi çerezleri neden kullandığımızı ve nasıl kapatabileceğinizi açıklıyoruz.",
  updated: LEGAL_UPDATED,
  sections: [
    {
      h: "1. Zorunlu Çerezler",
      p: [
        "Sitenin çalışması için gereklidir ve kapatılamaz. Yönetim paneline ve iş programı modülüne giriş yapıldığında oturumu açık tutan çerezler bu gruptadır. Bu çerezler pazarlama amacıyla kullanılmaz ve üçüncü taraflarla paylaşılmaz.",
      ],
    },
    {
      h: "2. Analitik Çerezler",
      p: [
        "Google Analytics 4 (ölçüm kimliği G-KEEVRE0YYF) kullanıyoruz. Hangi sayfaların görüntülendiğini, ziyaretçilerin siteye nereden geldiğini ve ne kadar süre kaldığını anlamak için kullanılır. Amaç sitenin içeriğini geliştirmektir; kimliğinizi doğrudan belirlemeye yönelik değildir.",
      ],
    },
    {
      h: "3. Pazarlama ve Ölçümleme Çerezleri",
      p: ["Reklamlarımızın kime ulaştığını ve sonuç verip vermediğini ölçmek için:"],
      list: [
        "Meta Pixel (kimlik 1445225590694714) — Facebook ve Instagram reklam ölçümü",
        "Google Ads dönüşüm etiketi — Google reklamları yayına alındığında etkin olur",
        "Meta Dönüşüm API'si — sunucu taraflı çalışır; telefon numarası şifrelenmiş (SHA-256) olarak iletilir, açık halde gönderilmez",
      ],
    },
    {
      h: "4. Çerezleri Nasıl Kapatabilirsiniz",
      p: [
        "Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Chrome'da Ayarlar → Gizlilik ve güvenlik → Üçüncü taraf çerezler; Safari'de Ayarlar → Safari → Tüm Çerezleri Engelle; Firefox'ta Ayarlar → Gizlilik ve Güvenlik yolunu izleyin.",
        "Google Analytics ölçümünü tüm sitelerde kapatmak için Google'ın resmî tarayıcı eklentisini kullanabilirsiniz. Meta reklam tercihlerinizi Facebook veya Instagram hesabınızın reklam ayarları bölümünden yönetebilirsiniz.",
        "Zorunlu çerezleri engellemeniz hâlinde yönetim paneline giriş gibi bazı işlevler çalışmayabilir.",
      ],
    },
    {
      h: "5. Sorularınız",
      p: ["Çerez kullanımımıza ilişkin sorularınız için info@camsankoparan.com adresine yazabilirsiniz."],
    },
  ],
};

/* ----------------------------------------------------------------- ENGLISH */

const kvkkEn: LegalDoc = {
  kicker: "Data Protection",
  title: "Personal Data Protection Notice",
  intro:
    "Prepared under Article 10 of Turkish Law No. 6698 on the Protection of Personal Data, explaining why we process your personal data, whom we share it with, and what your rights are.",
  updated: LEGAL_UPDATED_EN,
  sections: [
    {
      h: "1. Data Controller",
      p: [`${COMPANY_EN} is the data controller.`, "Contact: info@camsankoparan.com · +90 232 237 72 37"],
    },
    {
      h: "2. Personal Data We Process",
      p: ["When you complete a form on camsankoparan.com or contact us, the following data is processed:"],
      list: [
        "Identity data: first and last name",
        "Contact data: phone number, email address (optional)",
        "Customer transaction data: apartment type of interest, budget / payment preference, any free-text message",
        "Marketing data: the channel your enquiry came from (website, Instagram/Meta advertising, or a record entered manually after a phone call)",
        "Security and usage data: IP address, browser and device information, on-site browsing data (via cookies)",
      ],
    },
    {
      h: "3. Purposes of Processing",
      p: ["Your data is processed solely for the following purposes:"],
      list: [
        "Contacting you by phone, email or WhatsApp at your request",
        "Providing information, pricing and payment options for the Loft 777 project",
        "Arranging a viewing or sales meeting on site",
        "Recording your enquiry and following the sales process",
        "Measuring the performance of our advertising and improving our services",
        "Fulfilling our legal obligations",
      ],
    },
    {
      h: "4. Legal Basis",
      p: [
        "Your data is processed on the basis of your explicit consent under Article 5 of the Law. The consent box you tick when submitting the form constitutes that explicit consent.",
        "In addition, processing may rely on the necessity for the establishment or performance of a contract, and on our legitimate interests. Consent is not required for data we must process to meet legal obligations.",
      ],
    },
    {
      h: "5. Method of Collection",
      p: [
        "Data is collected electronically through the contact and “Request a call” forms on camsankoparan.com, lead forms in Instagram and Facebook (Meta) advertising, and information you provide during phone calls.",
      ],
    },
    {
      h: "6. Recipients and International Transfer",
      p: ["We do not sell your data or transfer it to third parties for their own marketing. It is shared only with suppliers necessary to deliver the service:"],
      list: [
        "Website hosting and infrastructure provider (Vercel Inc. — USA)",
        "Database and records infrastructure (Supabase Inc. — servers located outside Türkiye)",
        "Email delivery infrastructure (Hostinger)",
        "Advertising and measurement platforms (Meta Platforms Inc., Google LLC)",
        "Legally authorised public authorities and our legal advisers",
      ],
    },
    {
      h: "7. Measurement Data Sent to Meta and Google",
      p: [
        "To measure advertising performance, an event is sent to Meta's Conversions API when a form is submitted. Your phone number is not sent in the clear: it is transmitted irreversibly hashed (SHA-256) and Meta uses it only for matching.",
        "Data collected through Google Analytics is not intended to identify you directly; it helps us understand how the site is used.",
        "These transfers are made outside Türkiye, and your explicit consent given on the form covers them.",
      ],
    },
    {
      h: "8. Retention Period",
      p: [
        "Data is retained for as long as the purpose requires and for the limitation periods set out in applicable legislation. Records of enquiries that do not result in a sale are kept for a maximum of 2 years; where a contract is concluded, statutory retention periods apply. Once the period expires, data is deleted, destroyed or anonymised.",
      ],
    },
    {
      h: "9. Your Rights",
      p: ["Under Article 11 of the Law you have the right to:"],
      list: [
        "Learn whether your data is processed and request information about it",
        "Learn the purpose of processing and whether it is used accordingly",
        "Know the third parties to whom it is transferred, in Türkiye or abroad",
        "Request correction if it is incomplete or inaccurate",
        "Request erasure or destruction within the conditions of the Law",
        "Request that corrections and erasures be notified to third parties",
        "Object to an adverse outcome arising from automated analysis",
        "Claim compensation for damage caused by unlawful processing",
        "Withdraw your explicit consent at any time",
      ],
    },
    {
      h: "10. How to Apply",
      p: [
        "Send requests to info@camsankoparan.com, or in writing to Dokuz Eylül Mahallesi, 694. Sokak No: 5, 35410 Gaziemir / Izmir, Türkiye.",
        "Applications are concluded within 30 days at the latest, in line with the Communiqué on Application Procedures to the Data Controller. Your application must clearly state your request and include information verifying your identity.",
      ],
    },
  ],
};

const privacyEn: LegalDoc = {
  kicker: "Privacy",
  title: "Privacy Policy",
  intro:
    "Explains what information we collect when you visit camsankoparan.com, how we use it and how we protect it.",
  updated: LEGAL_UPDATED_EN,
  sections: [
    {
      h: "1. Scope",
      p: [
        `This policy applies to the camsankoparan.com website operated by ${COMPANY_EN} and to the forms on it. We are not responsible for the privacy practices of third-party sites we link to.`,
      ],
    },
    {
      h: "2. Information We Collect",
      p: ["We collect two kinds of information:"],
      list: [
        "Information you give us: name, phone, email, apartment type preference, budget / payment preference and your message, when you submit a form.",
        "Information collected automatically: IP address, browser and device type, the page you arrived from, which pages you viewed and how long you stayed. This is collected via cookies.",
      ],
    },
    {
      h: "3. Why We Use It",
      p: [
        "To contact you, provide project information, arrange appointments, record your enquiry and measure the effect of our advertising. We do not sell your information or pass it to third parties for their own marketing.",
      ],
    },
    {
      h: "4. Who We Share It With",
      p: [
        "Your data is processed on the infrastructure of our service providers: website hosting (Vercel), database (Supabase), email delivery (Hostinger) and advertising measurement (Meta, Google). Their servers are located outside Türkiye. Full detail is in the Personal Data Protection Notice.",
      ],
    },
    {
      h: "5. Security",
      p: [
        "The site is served entirely over an encrypted connection (HTTPS). Form records are accessible only to authorised company staff through a password-protected admin panel, and database access is restricted at row level.",
        "No transmission method is 100% secure. For that reason our forms never ask for sensitive data such as identity numbers or bank and card details, and we advise you not to send them.",
      ],
    },
    {
      h: "6. Children's Data",
      p: [
        "The site is not directed at people under 18 and we do not knowingly collect their data. If we become aware of such a record we delete it, and we remove it immediately on request.",
      ],
    },
    {
      h: "7. Your Rights and Contact",
      p: [
        "You have the right to access, correct and erase your data and to withdraw your consent. Write to info@camsankoparan.com. Full detail is in the Personal Data Protection Notice.",
      ],
    },
    {
      h: "8. Changes",
      p: [
        "We may update this policy from time to time. The current version is always published on this page with the last-updated date shown above.",
      ],
    },
  ],
};

const cookiesEn: LegalDoc = {
  kicker: "Cookies",
  title: "Cookie Policy",
  intro:
    "Cookies are small text files that sites store on your device. This page explains which cookies we use, why, and how you can turn them off.",
  updated: LEGAL_UPDATED_EN,
  sections: [
    {
      h: "1. Strictly Necessary Cookies",
      p: [
        "Required for the site to function and cannot be disabled. They include the cookies that keep you signed in to the admin panel and the construction schedule module. They are not used for marketing and are not shared with third parties.",
      ],
    },
    {
      h: "2. Analytics Cookies",
      p: [
        "We use Google Analytics 4 (measurement ID G-KEEVRE0YYF) to understand which pages are viewed, where visitors arrive from and how long they stay. The purpose is to improve the site; it is not intended to identify you directly.",
      ],
    },
    {
      h: "3. Marketing and Measurement Cookies",
      p: ["To measure who our advertising reaches and whether it works:"],
      list: [
        "Meta Pixel (ID 1445225590694714) — Facebook and Instagram ad measurement",
        "Google Ads conversion tag — becomes active once Google campaigns go live",
        "Meta Conversions API — server-side; the phone number is transmitted hashed (SHA-256), never in the clear",
      ],
    },
    {
      h: "4. How to Turn Cookies Off",
      p: [
        "You can delete or block cookies in your browser settings. In Chrome: Settings → Privacy and security → Third-party cookies. In Safari: Settings → Safari → Block All Cookies. In Firefox: Settings → Privacy & Security.",
        "To opt out of Google Analytics across all sites you can install Google's official browser add-on. You can manage your Meta advertising preferences in the ad settings of your Facebook or Instagram account.",
        "If you block strictly necessary cookies, some functions such as signing in to the admin panel may not work.",
      ],
    },
    {
      h: "5. Questions",
      p: ["For questions about our use of cookies, write to info@camsankoparan.com."],
    },
  ],
};

/* ------------------------------------------------------------------ EXPORT */

export type LegalKey = "kvkk" | "privacy" | "cookies";

const DOCS = {
  tr: { kvkk: kvkkTr, privacy: privacyTr, cookies: cookiesTr },
  en: { kvkk: kvkkEn, privacy: privacyEn, cookies: cookiesEn },
} as const;

export function getLegal(locale: Locale, key: LegalKey): LegalDoc {
  return DOCS[locale][key];
}

// Sayfa yolları — TR ve EN aynı segmenti kullanır (mevcut SEGMENTS mantığıyla uyumlu)
export const LEGAL_SEGMENTS: Record<LegalKey, string> = {
  kvkk: "kvkk",
  privacy: "gizlilik",
  cookies: "cerez-politikasi",
};
