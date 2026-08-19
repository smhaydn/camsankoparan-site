import type { Locale } from "./i18n";

// ══════════════════════════════════════════════════════════════
// LOFT 777 — BLOG VERİ KATMANI
// Statik içerik (SSG). SEO odaklı, DataForSEO canlı keyword verisine göre
// hedeflenmiş yazılar. Görseller /public/renders altından kullanılır.
// ══════════════════════════════════════════════════════════════

// İçerik blokları — detay sayfası bunları sırayla render eder
export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "quote"; text: string };

export type BlogFAQ = { q: string; a: string };

export type BlogPost = {
  slug: string; // URL (TR + EN aynı slug — kısa, SEO dostu)
  keyword: string; // hedef anahtar kelime (dahili not)
  category: string; // rozet
  title: string; // H1 + meta title
  description: string; // meta description (150-160 karakter)
  excerpt: string; // liste kartı özeti
  hero: string; // kapak görseli
  date: string; // ISO yayın tarihi
  updated: string; // ISO güncelleme tarihi (E-E-A-T tazelik sinyali)
  readingMin: number; // tahmini okuma süresi
  blocks: BlogBlock[]; // gövde
  faq: BlogFAQ[]; // Google PAA sorularına dayalı SSS (FAQPage schema + featured snippet)
};

// ── Yazar / yayıncı otoritesi (E-E-A-T) ─────────────────────────
// Google ve AI arama motorları "kim yazdı, uzman mı?" bakar.
export const AUTHOR = {
  tr: {
    name: "Camsan Koparan Group",
    role: "İnşaat ve Gayrimenkul Geliştirme",
    bio: "1998'den bu yana İzmir'de konut, ticari ve endüstriyel yapı geliştiren Camsan Koparan Group, Gaziemir'deki Loft 777 projesinin geliştiricisidir. Bu içerik firmanın proje ekibi tarafından hazırlanmıştır.",
    reviewedLabel: "Yayıncı",
  },
  en: {
    name: "Camsan Koparan Group",
    role: "Construction & Real Estate Development",
    bio: "Developing residential, commercial and industrial buildings in Izmir since 1998, Camsan Koparan Group is the developer of the Loft 777 project in Gaziemir. This content is prepared by the company's project team.",
    reviewedLabel: "Publisher",
  },
} as const;

export function getAuthor(locale: Locale) {
  return locale === "en" ? AUTHOR.en : AUTHOR.tr;
}

// ── Blog UI metinleri (liste sayfası, kart, detay) ──────────────
const UI = {
  tr: {
    kicker: "Blog",
    title: "Loft 777 Günlüğü",
    intro:
      "Loft yaşam, yatay mimari ve Gaziemir'de yatırım üzerine rehberler. Bilgi almak isteyenler için sade, dürüst yazılar.",
    readSuffix: "dk okuma",
    backToBlog: "← Tüm yazılar",
    related: "İlgili Yazılar",
    ctaTitle: "Loft 777'yi yakından tanıyın",
    ctaText:
      "Daire tipleri, fiyat listesi ve ödeme seçenekleri için bizimle iletişime geçin.",
    ctaButton: "Bilgi Al",
    published: "Yayın",
    updatedLabel: "Güncelleme",
    faqTitle: "Sıkça Sorulan Sorular",
    aboutAuthor: "Bu yazıyı hazırlayan",
    projectLink: "Loft 777 projesini inceleyin →",
  },
  en: {
    kicker: "Journal",
    title: "The Loft 777 Journal",
    intro:
      "Guides on loft living, horizontal architecture and investing in Gaziemir. Clear, honest writing for buyers who want to understand before they decide.",
    readSuffix: "min read",
    backToBlog: "← All articles",
    related: "Related Articles",
    ctaTitle: "Get to know Loft 777",
    ctaText:
      "Contact us for apartment types, the price list and payment options.",
    ctaButton: "Request Info",
    published: "Published",
    updatedLabel: "Updated",
    faqTitle: "Frequently Asked Questions",
    aboutAuthor: "About the author",
    projectLink: "Explore the Loft 777 project →",
  },
} as const;

export function getBlogUI(locale: Locale) {
  return locale === "en" ? UI.en : UI.tr;
}

// ══════════════════════════════════════════════════════════════
// TÜRKÇE YAZILAR
// ══════════════════════════════════════════════════════════════
const POSTS_TR: BlogPost[] = [
  // ── BLOG 1 — Loft Daire Nedir? (hedef: "loft daire nedir" — 1.000/ay, sıfır rekabet)
  {
    slug: "loft-daire-nedir",
    keyword: "loft daire nedir",
    category: "Loft Yaşam",
    title: "Loft Daire Nedir? Klasik Daireden 8 Farkı ve Kimler İçin Uygun",
    description:
      "Loft daire nedir, klasik daireden farkı ne, kimler için uygun? Yüksek tavan, açık plan ve galeri boşluğuyla loft yaşamın avantajlarını anlatan kapsamlı rehber.",
    excerpt:
      "Yüksek tavan, açık plan ve galeri boşluğu... Loft daire tam olarak nedir, klasik daireden nasıl ayrılır ve kime göre? Sade bir rehber.",
    hero: "/renders/loft-galeri-kanit.jpg",
    date: "2026-07-28",
    updated: "2026-07-28",
    readingMin: 7,
    blocks: [
      {
        type: "p",
        text: "Son yıllarda emlak ilanlarında sıkça karşınıza çıkan bir kelime var: loft. Peki loft daire nedir, klasik bir daireden gerçekten farklı mıdır, yoksa sadece bir pazarlama kelimesi mi? Bu yazıda loft kavramını sade bir dille açıklıyor, klasik daireden farklarını sıralıyor ve loft yaşamın kimlere uygun olduğunu dürüstçe ele alıyoruz.",
      },
      { type: "h2", text: "Loft nedir? Kısa bir tarihçe" },
      {
        type: "p",
        text: "Loft kelimesi İngilizcede \"çatı arası\" ya da \"yüksek tavanlı üst kat\" anlamına gelir. Kavram 1950'lerde New York'ta doğdu: sanatçılar, boşalan fabrika ve depo katlarını düşük kirayla kiralayıp hem atölye hem yaşam alanı olarak kullanmaya başladı. Yüksek tavanlar, geniş açık hacimler ve bölünmemiş planlar bu mekânların doğal özelliğiydi. Zamanla bu ham, endüstriyel estetik bir yaşam tarzına dönüştü ve bugün loft, dünyanın her yerinde \"yüksek tavanlı, açık planlı, ferah konut\" anlamında kullanılıyor.",
      },
      { type: "h2", text: "Loft dairenin klasik daireden 8 farkı" },
      {
        type: "list",
        items: [
          "Tavan yüksekliği: Klasik dairede tavan genelde 2,7-3 metredir. Loft dairede galeri boşluğu ile bu yükseklik 5-6 metreye kadar çıkar.",
          "Galeri boşluğu: Salonun üstünde asma kat kurmaya imkân veren çift yükseklikte boşluk, lofta özgü bir özelliktir.",
          "Açık plan: Salon, mutfak ve yaşam alanı çoğunlukla duvarsız, tek bir akışkan hacim olarak tasarlanır.",
          "Doğal ışık: Yüksek pencereler ve bölünmemiş hacim sayesinde ışık mekânın derinine ulaşır.",
          "Dikey kullanım: Metrekareyi yatayda değil, yükseklikte değerlendirirsiniz — altta yaşam, üstte çalışma ya da yatak.",
          "Esneklik: Aynı daireyi zamanla farklı kullanabilirsiniz; asma kat yatak odası, çalışma alanı ya da izleme köşesi olabilir.",
          "Algısal ferahlık: Aynı metrekare, yüksek tavan sayesinde çok daha geniş hissettirir.",
          "Karakter: Loft daireler standart kutu planlardan ayrışır; mekânın kendine ait bir kimliği vardır.",
        ],
      },
      {
        type: "image",
        src: "/renders/daire-salon-1.jpg",
        alt: "Loft daire açık plan salon ve mutfak — yüksek tavan",
        caption: "Açık plan: salon, mutfak ve yaşam alanı tek bir akışkan hacimde.",
      },
      { type: "h2", text: "Loft dairenin avantajları" },
      {
        type: "p",
        text: "Loft yaşamın en büyük getirisi ferahlık hissidir. Yüksek tavan ve açık plan, kompakt bir metrekareyi bile nefes alan bir mekâna çevirir. Doğal ışık gün boyu içeride gezinir; yapay aydınlatmaya bağımlılık azalır. Galeri boşluğu size ikinci bir kat armağan eder — üst katı yatak odası ya da çalışma alanı olarak kurabilir, alt katı tamamen sosyal yaşama ayırabilirsiniz. Özellikle evden çalışanlar için bu dikey ayrım, tek bir dairede iş ve yaşamı temiz biçimde bölme imkânı sunar.",
      },
      { type: "h2", text: "Loft dairenin dezavantajları — dürüst bakış" },
      {
        type: "p",
        text: "Her yaşam biçiminde olduğu gibi loftun da düşünülmesi gereken yanları var. Yüksek tavanlı hacimlerin ısıtma ve soğutması, iyi bir yalıtım ve doğru iklimlendirme sistemi gerektirir — bu yüzden loft dairelerde merkezi sistem ve kaliteli yalıtım önemlidir. Açık plan, sesin mekân içinde daha rahat yayılması demektir; kalabalık haneler için mahremiyet planlaması gerekir. Asma kata çıkan merdiven, küçük çocuklu ya da hareket kısıtı olan haneler için değerlendirilmelidir. Bu noktaların hepsi doğru tasarımla çözülebilir; önemli olan satın almadan önce bunları bilerek karar vermektir.",
      },
      { type: "h2", text: "Loft daire kimler için uygun?" },
      {
        type: "p",
        text: "Loft daireler; genç profesyoneller, çiftler, evden çalışanlar ve kompakt ama karakterli bir yaşam alanı arayan yatırımcılar için idealdir. Ferah bir stüdyo hissi isteyen ama standart bir daireye sıkışmak istemeyen herkes loft yaşamdan keyif alır. Yatırımcı gözüyle bakıldığında ise loft daireler, arz sınırlı olduğu için standart dairelerden ayrışır ve kira/değer tarafında niş bir talebe hitap eder.",
      },
      {
        type: "image",
        src: "/renders/daire-genel.jpg",
        alt: "Loft daire iç mekan — galeri boşluğu ve üst kat",
        caption: "Galeri boşluğu, salonun üstünde ikinci bir yaşam katı yaratır.",
      },
      { type: "h2", text: "Loft daire nasıl seçilir? Dikkat edilecekler" },
      {
        type: "list",
        items: [
          "Gerçek tavan yüksekliğini sorun — galeri boşluğu dahil net yükseklik kaç metre?",
          "Isıtma ve soğutma sistemini öğrenin — yüksek hacim için merkezi sistem ve yerden ısıtma önemli.",
          "Yalıtımı kontrol edin — ısı ve ses yalıtımı loft konforunun temelidir.",
          "Asma kat kullanımını netleştirin — yatak, çalışma ya da depolama; sizin yaşamınıza uyuyor mu?",
          "Pencere yönü ve ışık — doğal ışığın gün içinde nasıl geldiğine bakın.",
          "Yapı kalitesi ve deprem yönetmeliği uyumu — her konutta olduğu gibi loftta da önceliğiniz güvenlik olmalı.",
        ],
      },
      { type: "h2", text: "Loft 777'de loft yaşam" },
      {
        type: "p",
        text: "İzmir Gaziemir'de yükselen Loft 777, adını tam da bu yaşam biçiminden alıyor. Projede zemin katların tamamı loft daire olarak tasarlandı: galeri boşluğu ile birlikte 5,5 metreye ulaşan tavan yüksekliği, açık plan yaşam alanı ve doğal ışığı içeri taşıyan geniş camlar. Merkezi sistem yerden ısıtma ve VRF klima, yüksek hacmin konforunu güvence altına alıyor. Çift cam Low-E argon dolgulu cam sistemi ve 5 cm taş yünü ısı yalıtımı, loft yaşamın en çok merak edilen konusu olan enerji verimliliğini çözüyor.",
      },
      {
        type: "quote",
        text: "Loft, metrekareyi yatayda değil yükseklikte yaşamaktır. Aynı alan, doğru tasarımla iki kat daha fazlasını sunar.",
      },
      {
        type: "p",
        text: "Loft daire hakkında merak ettikleriniz ya da Loft 777'nin daire tipleri için satış ekibimizle iletişime geçebilirsiniz. Bir sonraki yazımızda, loft dairelerin karakterini belirleyen \"yatay mimari\" kavramını ele alıyoruz.",
      },
    ],
    faq: [
      {
        q: "Loft daire nedir kısaca?",
        a: "Loft daire, yüksek tavanlı, açık planlı ve genellikle galeri boşluğuna sahip konut tipidir. Salon, mutfak ve yaşam alanı çoğunlukla duvarsız tek bir hacim olarak tasarlanır; galeri boşluğu sayesinde tavan yüksekliği 5-6 metreye ulaşabilir ve üstte asma kat kurulabilir.",
      },
      {
        q: "Mimaride loft ne demek?",
        a: "Mimaride loft, aslen çatı arası ya da yüksek tavanlı üst kat anlamına gelir. Kavram 20. yüzyıl ortasında New York'ta, sanatçıların fabrika ve depo katlarını yaşam alanına çevirmesiyle doğmuştur. Bugün mimaride loft; yüksek tavan, açık plan ve endüstriyel-modern estetiği tanımlar.",
      },
      {
        q: "Loft daire ile dubleks arasındaki fark nedir?",
        a: "Dubleks, iki tam katın merdivenle birleştiği dairedir; her iki kat da tam tavan yüksekliğine sahiptir ve odalar duvarlarla ayrılır. Loft ise tek hacim üzerine kurulu, galeri boşluğu olan açık plandır; üst kat çoğunlukla asma kat şeklindedir ve alt hacme açıktır. Kısaca dubleks bölünmüş iki kat, loft ise açık ve akışkan tek hacimdir.",
      },
      {
        q: "Loft daire kimler için uygundur?",
        a: "Loft daireler; genç profesyoneller, çiftler, evden çalışanlar ve kompakt ama karakterli bir yaşam alanı arayan yatırımcılar için uygundur. Ferah bir stüdyo hissi isteyen, iş ve yaşamı dikey olarak ayırmak isteyen kullanıcılar loft yaşamdan verim alır.",
      },
      {
        q: "Loft dairelerde tavan yüksekliği kaç metredir?",
        a: "Klasik dairelerde tavan yüksekliği genelde 2,7-3 metredir. Loft dairelerde ise galeri boşluğu ile birlikte bu yükseklik 5-6 metreye çıkabilir. Örneğin Loft 777 projesinde loft dairelerin tavan yüksekliği galeri boşluğuyla birlikte 5,5 metredir.",
      },
    ],
  },

  // ── BLOG 2 — Yatay Mimari Nedir? (hedef: "yatay mimari" — 320/ay, sıfır rekabet)
  {
    slug: "yatay-mimari-nedir",
    keyword: "yatay mimari",
    category: "Mimari",
    title: "Yatay Mimari Nedir? Ege'de Neden Bu Kadar Popüler?",
    description:
      "Yatay mimari nedir, dikey (yüksek kat) mimariden farkı ne? Ege Bölgesi'nde neden tercih ediliyor? Avantajları, global örnekleri ve Loft 777'nin yaklaşımı.",
    excerpt:
      "Gökdelen değil, insana yakın ölçek. Yatay mimari nedir, neden Ege'de bu kadar seviliyor ve loft yaşamla nasıl birleşiyor?",
    hero: "/renders/hava-genel.jpg",
    date: "2026-07-28",
    updated: "2026-07-28",
    readingMin: 6,
    blocks: [
      {
        type: "p",
        text: "Bir yerleşimi ilk gördüğünüzde onu \"sıcak\" ya da \"soğuk\" bulmanızın arkasında çoğu zaman fark etmediğiniz bir tercih yatar: mimarinin yatay mı yoksa dikey mi kurgulandığı. Yatay mimari, son yıllarda özellikle Ege Bölgesi'nde giderek daha çok tercih edilen bir yaklaşım. Peki tam olarak nedir ve neden bu kadar seviliyor?",
      },
      { type: "h2", text: "Yatay mimari nedir?" },
      {
        type: "p",
        text: "Yatay mimari, yapıların yükseklik yerine genişlik boyunca kurgulandığı tasarım yaklaşımıdır. Onlarca katlı tek bir kule yerine, daha az katlı ve araziye yayılan bloklar tercih edilir. Bu yaklaşımda binalar insan ölçeğine yakın kalır; avlular, bahçeler ve ortak alanlar yapının merkezine yerleşir. Amaç, yoğunluğu yükseğe taşıyıp insanları birbirinden koparmak değil, yaşamı zemine ve birbirine yakın tutmaktır.",
      },
      {
        type: "image",
        src: "/renders/hava-tepeden.jpg",
        alt: "Yatay mimari — araziye yayılan alçak katlı bloklar, kuşbakışı",
        caption: "Yatay kurgu: yükseklik yerine araziye yayılan, insan ölçeğinde bloklar.",
      },
      { type: "h2", text: "Neden Ege'de bu kadar popüler?" },
      {
        type: "p",
        text: "Ege'nin iklimi ve yaşam kültürü yatay mimariyle doğal olarak örtüşür. Bol güneş ve ılıman hava, açık avluları, bahçeleri ve teras kullanımını yıl boyu mümkün kılar. Ege insanının sokakla, komşuyla ve doğayla kurduğu yakın ilişki, insanları zemine yakın tutan bir kurguyla güçlenir. Ayrıca deprem gerçeği olan bir coğrafyada, daha az katlı ve geniş tabana oturan yapılar psikolojik olarak da güven verir. Bütün bunlar, yatay mimariyi Ege için sadece estetik değil, kültürel bir tercih hâline getirir.",
      },
      { type: "h2", text: "Yatay ve dikey mimari — karşılaştırma" },
      {
        type: "list",
        items: [
          "Ölçek: Dikey mimari gökyüzüne uzanır; yatay mimari insan boyutunda kalır.",
          "Ortak yaşam: Yüksek kulelerde komşuluk asansörle sınırlanır; yatay kurguda avlu ve bahçe insanları buluşturur.",
          "Doğaya erişim: Yatay projelerde çoğu daire bahçeye, terasa ya da yeşile doğrudan açılır.",
          "Günlük konfor: Az katlı yapıda asansör bağımlılığı azalır, tahliye ve günlük sirkülasyon kolaylaşır.",
          "Işık ve hava: Araziye yayılan bloklar, dairelere daha dengeli gün ışığı ve hava sirkülasyonu sağlar.",
          "Aidiyet: İnsan ölçeğindeki bir yerleşim, sakinlerinde daha güçlü bir \"burası benim\" hissi yaratır.",
        ],
      },
      {
        type: "image",
        src: "/renders/teras-bahce.jpg",
        alt: "Yatay mimaride teras ve bahçe kullanımı",
        caption: "Yatay kurguda daireler doğrudan terasa ve yeşile açılır.",
      },
      { type: "h2", text: "Dünyadan yatay mimari örnekleri" },
      {
        type: "p",
        text: "Yatay mimarinin en bilinen örnekleri lüks tatil ve yaşam markalarında görülür. Aman Resorts, Six Senses gibi markalar; Bali, Akdeniz ve Ege kıyılarındaki yerleşimlerinde bilinçli olarak alçak, araziye yayılan yapılar tercih eder. Amaç, misafiri gökyüzüne değil, toprağa, suya ve bahçeye yakın tutmaktır. Bu yaklaşım, \"sessiz lüks\" olarak adlandırılan; gösterişten çok huzur ve ölçek üzerine kurulu bir estetiğin temelidir.",
      },
      { type: "h2", text: "Loft 777'nin yatay yaklaşımı" },
      {
        type: "p",
        text: "İzmir Gaziemir'de Loft 777, 8.879 m²'lik arsası üzerinde 5 blok halinde yatay bir kurguyla tasarlandı. Yüksek bir kule yerine, araziye yayılan ve 4.200 m² yeşil alanı içine alan bir yerleşim planlandı. Avluya bakan havuz, teraslara açılan daireler ve zemine yakın yaşam, Ege'nin yaşam kültürünü projeye taşıyor. Zemin katların loft olarak tasarlanması, yatay mimarinin ferahlığını daire içinde de sürdürüyor: dışarıda araziye yayılan ölçek, içeride yükselen tavan.",
      },
      {
        type: "quote",
        text: "Yatay mimari, yüksekliğe değil yakınlığa yatırım yapar — doğaya, komşuya ve zemine yakınlığa.",
      },
      {
        type: "p",
        text: "Bir sonraki yazımızda, bu mimarinin yükseldiği yeri ele alıyoruz: Gaziemir'de satılık daire ararken bilmeniz gereken her şey.",
      },
    ],
    faq: [
      {
        q: "Yatay mimari ne demek?",
        a: "Yatay mimari, yapıların yükseklik yerine genişlik boyunca kurgulandığı tasarım yaklaşımıdır. Çok katlı tek bir kule yerine, az katlı ve araziye yayılan bloklar tercih edilir. Amaç yoğunluğu yükseğe taşımak değil, yaşamı zemine ve doğaya yakın tutmaktır.",
      },
      {
        q: "Yatay mimari kaç katlı olur?",
        a: "Yatay mimaride kesin bir kat sınırı yoktur ama genellikle az katlı yapılar (zemin + birkaç kat) tercih edilir. Belirleyici olan kat sayısı değil, yapının yüksekliğe değil araziye yayılarak kurgulanması ve insan ölçeğinde kalmasıdır.",
      },
      {
        q: "Yatay mimarinin avantajları nelerdir?",
        a: "Başlıca avantajları: dairelerin bahçe, teras ve yeşile doğrudan açılması; asansör bağımlılığının azalması; daha dengeli gün ışığı ve hava sirkülasyonu; avlu ve ortak alanlar sayesinde güçlü komşuluk ilişkisi; ve insan ölçeğinden gelen güçlü bir aidiyet hissi.",
      },
      {
        q: "Yatay mimari mi dikey mimari mi daha iyi?",
        a: "İkisi de farklı ihtiyaçlara cevap verir. Dikey mimari, sınırlı arsada yüksek yoğunluk sağlar ve manzara sunar. Yatay mimari ise doğaya yakınlık, ortak yaşam ve insan ölçeği önceliğindedir. Ege'nin iklimi ve yaşam kültürü, açık avlu ve teras kullanımını yıl boyu mümkün kıldığı için yatay mimariyle daha çok örtüşür.",
      },
      {
        q: "Yatay mimari neden Ege'de tercih ediliyor?",
        a: "Ege'nin bol güneşli, ılıman iklimi açık avlu, bahçe ve teras kullanımını yıl boyu mümkün kılar. Bölgenin sokakla, komşuyla ve doğayla kurduğu yakın ilişki, insanları zemine yakın tutan bir kurguyla güçlenir. Bu nedenle yatay mimari Ege için hem estetik hem kültürel bir tercihtir.",
      },
    ],
  },

  // ── BLOG 3 — Gaziemir'de Satılık Daire Rehberi (hedef: "gaziemir satılık daire" — 4.400/ay)
  {
    slug: "gaziemir-satilik-daire-rehberi",
    keyword: "gaziemir satılık daire",
    category: "Bölge Rehberi",
    title: "Gaziemir'de Satılık Daire Ararken Bilmeniz Gereken 10 Şey",
    description:
      "Gaziemir'de satılık daire mi arıyorsunuz? Bölge avantajları, fiyat, ulaşım, yapı standartları ve ödeme koşulları — karar vermeden önce bilinmesi gereken 10 başlık.",
    excerpt:
      "Havalimanına 9 dakika, İZBAN Sarnıç durağına 800 metre... Gaziemir'de satılık daire ararken bölgeyi, fiyatı ve yapıyı değerlendirmenin 10 yolu.",
    hero: "/renders/dis-cephe-cadde.jpg",
    date: "2026-07-28",
    updated: "2026-07-28",
    readingMin: 8,
    blocks: [
      {
        type: "p",
        text: "İzmir'de yatırım ya da oturum için bölge ararken Gaziemir son yılların öne çıkan adreslerinden biri. Havalimanına yakınlığı, İZBAN ulaşımı ve gelişen çevresiyle hem yatırımcının hem ailenin radarında. Bu yazıda, Gaziemir'de satılık daire ararken dikkat etmeniz gereken 10 başlığı dürüst bir gözle ele alıyoruz.",
      },
      { type: "h2", text: "1. Neden Gaziemir? Bölgenin yükselen değeri" },
      {
        type: "p",
        text: "Gaziemir, İzmir'in güney-güneybatısında, Adnan Menderes Havalimanı'na komşu bir ilçedir. Batısında ve kuzeyinde Karabağlar, doğusunda Buca, güneyinde Menderes ilçeleriyle çevrilidir. Sanayi, ticaret ve konutun bir arada geliştiği, ulaşım omurgası güçlü bir bölgedir. Son yıllarda yeni konut projeleriyle çehresi değişiyor; havalimanı yakınlığı ve İZBAN hattı, bölgeyi hem yatırımcı hem de günlük yaşam için cazip kılıyor.",
      },
      {
        type: "image",
        src: "/renders/hava-carsi.jpg",
        alt: "Gaziemir konut projesi — çarşı ve sosyal alanlar kuşbakışı",
        caption: "Gaziemir: konut, ticaret ve sosyal yaşamın bir arada geliştiği bir bölge.",
      },
      { type: "h2", text: "2. Ulaşım: Havalimanı ve İZBAN avantajı" },
      {
        type: "p",
        text: "Gaziemir'in en güçlü kozu ulaşım. Adnan Menderes Havalimanı arabayla yaklaşık 9 dakika; sık seyahat edenler ve gurbetçiler için bu mesafe paha biçilmez. İZBAN Sarnıç hattı bölgeyi İzmir merkeze demiryoluyla bağlıyor — İZBAN durağına 800 metre mesafedeki bir konut, günlük ulaşımı trafiğe bağımlı olmaktan çıkarıyor. Otoban çıkışına yakınlık da şehir dışı bağlantıyı kolaylaştırıyor.",
      },
      { type: "h2", text: "3. Günlük yaşam: Alışveriş, sağlık, eğitim" },
      {
        type: "list",
        items: [
          "Alışveriş: Optimum Outlet ve büyük marketler dakikalar mesafesinde.",
          "Sağlık: Devlet hastanesi ve özel klinikler bölge içinde.",
          "Eğitim: Özel ve devlet okulları her seviyede mevcut.",
          "Doğa: Sarnıç Gölet piknik ve yürüyüş alanı yakın bir kaçış noktası.",
          "Sosyal: Sayısız kafe ve restoran gündelik yaşamı besliyor.",
        ],
      },
      { type: "h2", text: "4. Fiyat: Bütçenizi doğru konumlandırın" },
      {
        type: "p",
        text: "Gaziemir, İzmir'in merkez ilçelerine göre daha erişilebilir fiyatlar sunarken, gelişim potansiyeliyle değer artışı vadeder. Fiyat değerlendirirken sadece metrekare birim fiyatına değil; yapı kalitesine, sosyal donatılara, ödeme koşullarına ve teslim tarihine bütüncül bakmak gerekir. Ön satış aşamasındaki projeler genellikle teslim sonrasına göre daha avantajlı fiyat ve ödeme planı sunar.",
      },
      { type: "h2", text: "5. Yeni proje mi, ikinci el mi?" },
      {
        type: "p",
        text: "Yeni projeler; güncel deprem yönetmeliğine uyum, sıfır yıpranma, modern yalıtım ve akıllı ev gibi avantajlar sunar. İkinci el ise hemen taşınma imkânı verir ama yapı yaşı, yalıtım ve deprem dayanımı ayrı ayrı sorgulanmalıdır. Yatırım gözüyle bakıldığında, ön satış aşamasındaki yeni bir projeye girmek, teslime kadar geçen sürede değer kazanma potansiyeli taşır.",
      },
      {
        type: "image",
        src: "/renders/avlu-havuz.jpg",
        alt: "Yeni konut projesi — avlu ve havuz sosyal alanı",
        caption: "Yeni projelerde sosyal donatılar yaşam kalitesini doğrudan yükseltir.",
      },
      { type: "h2", text: "6. Yapı standartları: Güvenlik önce gelir" },
      {
        type: "list",
        items: [
          "Deprem yönetmeliği: Yapının güncel yönetmeliğe (TBDY) tam uyumlu olduğunu teyit edin.",
          "Yalıtım: Isı ve ses yalıtımı hem konfor hem fatura demektir.",
          "Isıtma/soğutma: Merkezi sistem, yerden ısıtma ve VRF klima uzun vadede tasarruf sağlar.",
          "Cam sistemi: Çift cam Low-E argon dolgu, enerji verimliliğinin temelidir.",
          "Cephe: Prekast ve cam giydirme cephe, hem estetik hem dayanıklılık sunar.",
        ],
      },
      { type: "h2", text: "7. Sosyal donatılar: Yaşam sadece daire değildir" },
      {
        type: "p",
        text: "Bir daire satın alırken, dört duvarın ötesine bakmak gerekir. Yüzme havuzu, fitness, çocuk oyun alanı, güvenlik, kapalı otopark ve yeşil alan; hem yaşam kalitesini hem de yeniden satış değerini doğrudan etkiler. Site içi restoran ve ticari alanlar, günlük ihtiyaçları siteden çıkmadan karşılama imkânı verir.",
      },
      { type: "h2", text: "8. Ödeme planı: Peşin, vade ve faiz" },
      {
        type: "p",
        text: "Ödeme koşulları, satın alma kararının en belirleyici kalemlerinden biri. Peşin ödemede indirim, faizsiz vade seçenekleri ve rezervasyon koşulları projeden projeye değişir. Faizsiz vade, bugünün kurunda daireyi sabitleyip enflasyona karşı korunmanın güçlü bir yoludur. Ödeme planını her zaman yazılı ve net biçimde talep edin.",
      },
      { type: "h2", text: "9. Yatırım getirisi: Kira ve değer artışı" },
      {
        type: "p",
        text: "Gaziemir gibi gelişen bir bölgede yatırım getirisini iki kalemde düşünün: kira geliri ve değer artışı. Havalimanı ve İZBAN yakınlığı, kiralık talebini canlı tutar. Ön satışta alınan bir dairenin teslime kadar değer kazanması ise ikinci getiri kalemidir. Kompakt 1+1 ve loft daireler, giriş bütçesi düşük olduğu için kira/değer çarpanı açısından yatırımcıya avantaj sağlar.",
      },
      { type: "h2", text: "10. Loft 777: Bütün kriterleri bir arada" },
      {
        type: "p",
        text: "İzmir Gaziemir Dokuz Eylül Mahallesi'nde yükselen Loft 777, bu 10 başlığın hemen hepsini karşılayacak şekilde tasarlandı: Havalimanına 9 dakika, İZBAN Sarnıç durağına 800 metre. 5 blok, 237 bağımsız bölüm; 1+1 loft ve 1+1 dubleks daireler. Yüzme havuzu, fitness, site içi restoran, çocuk oyun alanı ve 4.200 m² yeşil alan. Güncel deprem yönetmeliğine tam uyum, merkezi sistem yerden ısıtma, VRF klima ve akıllı ev altyapısı. %35 peşin ve 18 ay faizsiz vade; peşin ödemede %15 indirim. Teslim tarihi Aralık 2027.",
      },
      {
        type: "quote",
        text: "İyi bir daire, sadece bugünün ihtiyacını değil, yarının değerini de karşılar. Konum, yapı ve ödeme planı birlikte değerlendirilmelidir.",
      },
      {
        type: "p",
        text: "Gaziemir'de satılık daire ararken bu 10 başlığı bir kontrol listesi gibi kullanabilirsiniz. Loft 777'nin daire tipleri, güncel fiyat listesi ve ödeme seçenekleri için satış ekibimizle iletişime geçebilirsiniz.",
      },
    ],
    faq: [
      {
        q: "İzmir Gaziemir nasıl bir semt?",
        a: "Gaziemir, İzmir'in güney-güneybatısında, Adnan Menderes Havalimanı'na komşu bir ilçedir. Sanayi, ticaret ve konutun bir arada geliştiği, ulaşımı güçlü bir bölgedir. İZBAN hattı, Optimum Outlet, hastane, okullar ve Sarnıç Gölet gibi olanaklarıyla hem aileler hem yatırımcılar için tercih edilir.",
      },
      {
        q: "Gaziemir havalimanına ne kadar uzaklıkta?",
        a: "Gaziemir, Adnan Menderes Havalimanı'na komşu ilçedir; havalimanına araçla yaklaşık 9 dakika mesafededir. Bu yakınlık, sık seyahat edenler ve yurt dışında yaşayan yatırımcılar için önemli bir avantaj sağlar.",
      },
      {
        q: "Gaziemir denize yakın mı?",
        a: "Gaziemir bir iç ilçedir; deniz kıyısı araçla yaklaşık 20 dakika mesafededir. İlçenin güçlü yanı deniz kıyısı olması değil, havalimanı, İZBAN ve otoban bağlantılarıyla ulaşım kolaylığıdır.",
      },
      {
        q: "Gaziemir'de yeni proje mi ikinci el daire mi almalı?",
        a: "Yeni projeler güncel deprem yönetmeliğine uyum, sıfır yıpranma, modern yalıtım ve akıllı ev gibi avantajlar sunar. İkinci el hemen taşınma imkânı verir ama yapı yaşı ve deprem dayanımı ayrı sorgulanmalıdır. Yatırım açısından ön satış aşamasındaki yeni bir proje, teslime kadar değer kazanma potansiyeli taşır.",
      },
      {
        q: "Gaziemir'de daire alırken nelere dikkat etmeli?",
        a: "Öncelik güvenlik: yapının güncel deprem yönetmeliğine (TBDY 2018) uyumlu olduğunu teyit edin. Ardından konum (havalimanı, İZBAN, otoban yakınlığı), yapı kalitesi (yalıtım, ısıtma-soğutma sistemi, cephe), sosyal donatılar ve ödeme planını bütüncül değerlendirin. Ön satış projelerinde ödeme koşullarını her zaman yazılı isteyin.",
      },
    ],
  },

  // ── BLOG 4 — Gaziemir Yaşam Rehberi (hedef: "gaziemir" — 90.500/ay, şemsiye konu)
  {
    slug: "gaziemir-yasam-rehberi",
    keyword: "gaziemir",
    category: "Bölge Rehberi",
    title: "Gaziemir Yaşam Rehberi: İzmir'in Havalimanı İlçesinde Yaşamak",
    description:
      "Gaziemir nerede, nasıl bir yer, kimler için uygun? Ulaşım, alışveriş, doğa ve günlük hayat başlıklarıyla İzmir Gaziemir'de yaşamayı anlatan tarafsız rehber.",
    excerpt:
      "Havalimanı, serbest bölge, fuar alanı ve İZBAN aynı ilçede. Gaziemir'i İzmir'in diğer ilçelerinden ayıran şey ne, günlük hayat nasıl işliyor?",
    hero: "/renders/hava-carsi.jpg",
    date: "2026-08-19",
    updated: "2026-08-19",
    readingMin: 9,
    blocks: [
      {
        type: "p",
        text: "İzmir'de ev arayan çoğu kişi önce Karşıyaka, Bornova ya da Buca'ya bakar. Gaziemir genelde listenin biraz aşağısında kalır. Oysa İzmir'in havalimanı, serbest bölgesi ve fuar alanı bu ilçenin sınırları içinde. Bu yazıda Gaziemir'i abartmadan anlatıyoruz: ne sunuyor, neyi sunmuyor, kime göre bir yer.",
      },
      { type: "h2", text: "Gaziemir nerede, kısaca nasıl bir yer?" },
      {
        type: "p",
        text: "Gaziemir, İzmir'in güneyinde yer alan bir merkez ilçedir. 2024 nüfus sayımına göre nüfusu yaklaşık 136.930'dur. İlçe 1965 yılına kadar Seydiköy adıyla anılıyordu; bugün hâlâ bölgeyi eski adıyla anan yerliler vardır. Konak ve Alsancak gibi merkezlerden uzak sayılmaz ama kendi içinde çalışan, konut ve sanayinin iç içe geçtiği ayrı bir düzeni vardır.",
      },
      {
        type: "p",
        text: "Gaziemir'i İzmir'in diğer ilçelerinden ayıran en somut özellik şu: Adnan Menderes Havalimanı, Ege Serbest Bölgesi, Fuar İzmir ve hava eğitim üssü aynı ilçe sınırları içinde. Bu, bölgeye sürekli bir hareket ve istihdam getiriyor.",
      },
      { type: "h2", text: "Ulaşım: ilçenin en güçlü kozu" },
      {
        type: "p",
        text: "Gaziemir'de ulaşımı güçlü kılan şey, tek bir seçeneğe bağlı olmamanız. Hem raylı sistem, hem otoyol, hem havalimanı elinizin altında.",
      },
      {
        type: "list",
        items: [
          "İZBAN: Banliyö hattı ilçeden geçer. Sarnıç ve Gaziemir istasyonları, Alsancak ve Konak yönüne trafiğe girmeden ulaşım sağlar. Sabah saatlerinde araçla uzun süren yol, trenle daha öngörülebilir hâle gelir.",
          "Adnan Menderes Havalimanı: İlçe sınırları içinde. Sık uçan biri için bu, İzmir'in hiçbir yerinde bulunmayan bir avantaj.",
          "Otoyol bağlantısı: Aydın yönü ve İzmir çevre yolu bağlantıları yakın; şehir dışına çıkış hızlı.",
          "Ege Serbest Bölgesi ve sanayi: İlçede çalışan biri için evle iş arası mesafe çoğu zaman on dakikanın altında.",
        ],
      },
      {
        type: "quote",
        text: "Gaziemir'i tercih edenlerin çoğu, bir gün trafikte iki saat kaybettikten sonra karar veriyor.",
      },
      { type: "h2", text: "Alışveriş ve günlük hayat" },
      {
        type: "p",
        text: "Gaziemir günlük ihtiyaç açısından kendine yeter bir ilçe. Optimum Outlet Center ilçenin en bilinen alışveriş noktası; sinema, market ve yeme-içme bir arada. Akçay Caddesi çevresinde mobilya ve tekstil atölyeleri ile satış mağazaları yoğunlaşmıştır — İzmir'de mobilya arayanların bildiği bir adrestir.",
      },
      {
        type: "p",
        text: "Semt pazarları, market zincirleri, banka şubeleri ve sağlık kuruluşları ilçe içinde dağılmış durumda. Yani günlük hayat için şehir merkezine inme zorunluluğu yok.",
      },
      {
        type: "image",
        src: "/renders/carsi-yaya.jpg",
        alt: "Gaziemir'de site içi çarşı aksı — market, kafe ve mağazalar",
        caption: "Yeni nesil projelerde çarşı, sitenin içine taşınıyor: günlük ihtiyaç için araca binmek gerekmiyor.",
      },
      { type: "h2", text: "Doğa ve yeşil alan" },
      {
        type: "p",
        text: "Sarnıç mahallesinde çam ağaçlarıyla çevrili bir gölet bulunur; yürüyüş ve piknik için ilçe halkının kullandığı bir alandır. Gaziemir'in bu tarafı, sanayi imajının aksine sakin ve yeşildir. İlçenin güney ve batı kesimleri genel olarak daha düşük yoğunluklu, bahçeli yapılaşmaya sahiptir.",
      },
      { type: "h2", text: "Sarnıç: ilçenin gelişen tarafı" },
      {
        type: "p",
        text: "Sarnıç, Gaziemir'in son yıllarda en çok konut yatırımı çeken bölgesi. Sebebi basit: İZBAN istasyonu, havalimanı yakınlığı ve hâlâ gelişmeye açık arsa stoğu bir arada. Bölgede hem eski müstakil yapılar hem yeni konut projeleri yan yana duruyor. Bu geçiş dönemi alıcı için avantaj da olabilir dezavantaj da — inşaat yoğunluğu bir süre daha devam edecek.",
      },
      { type: "h2", text: "Gaziemir kimler için uygun?" },
      {
        type: "list",
        items: [
          "Sık seyahat edenler: Havalimanına dakikalarla ölçülen mesafe, uçağa yetişme stresini ortadan kaldırır.",
          "İlçede veya serbest bölgede çalışanlar: İş-ev mesafesi kısa, günlük yol maliyeti düşük.",
          "İlk evini alacaklar: İzmir'in merkez ilçelerine göre metrekare fiyatları daha erişilebilir seyreder.",
          "Raylı sistemi tercih edenler: İZBAN, trafiğe bağımlı olmayan bir günlük düzen kurmanızı sağlar.",
          "Sakinlik arayanlar: İlçenin Sarnıç tarafı, merkez ilçelerin yoğunluğundan uzaktır.",
        ],
      },
      { type: "h2", text: "Peki kimin için uygun değil?" },
      {
        type: "p",
        text: "Dürüst olalım: Alsancak'ın gece hayatını, Karşıyaka'nın sahil yürüyüşünü ya da Bornova'nın üniversite çevresini merkeze alan bir hayat kuruyorsanız Gaziemir size uzak gelir. İlçenin bir bölümünde sanayi dokusu hâkimdir ve bu herkesin isteyeceği bir komşuluk değildir. Ev bakarken hangi mahallede olduğunuza dikkat etmek gerekir.",
      },
      { type: "h2", text: "Gaziemir'de konut ararken nelere bakmalı?" },
      {
        type: "list",
        items: [
          "Mahalle farkı: Gaziemir tek tip değil. Sarnıç ile ilçe merkezi bambaşka iki karakter sunar. Sabah ve akşam ayrı ayrı gidip görün.",
          "İZBAN mesafesi: Yürüme mesafesi ile araçla on dakika arasındaki fark, günlük hayatta çok büyüktür.",
          "Yapı yılı ve deprem yönetmeliği: İzmir birinci derece deprem bölgesindedir. 2018 sonrası yönetmeliğe göre yapılmış olması önemlidir.",
          "Otopark: Bölgede sokak parkı sorun olabiliyor; kapalı otoparklı projeler uzun vadede rahat ettirir.",
          "Çevredeki inşaat yoğunluğu: Manzaranız ve gürültünüz birkaç yıl içinde değişebilir; çevre parsellerin durumunu sorun.",
        ],
      },
      { type: "h2", text: "Sonuç" },
      {
        type: "p",
        text: "Gaziemir gösterişli bir ilçe değil; güçlü tarafı pratikliği. Havalimanı, raylı sistem, otoyol ve istihdam aynı yerde toplanmış durumda. Günlük hayatı trafik üzerine kurmak istemeyen, işini ve seyahatini kolaylaştırmak isteyen biri için Gaziemir mantıklı bir tercih. Sarnıç tarafı ise ilçenin bu avantajlarını hâlâ erişilebilir fiyatlarla sunan bölgesi olarak öne çıkıyor.",
      },
      {
        type: "p",
        text: "Loft 777, Gaziemir Sarnıç'ta bu avantajların kesiştiği noktada yükseliyor: İZBAN Sarnıç durağına 800 metre, havalimanına araçla 9 dakika, zemin katında kendi çarşısıyla 237 bağımsız bölümlük bir karma yaşam projesi.",
      },
    ],
    faq: [
      {
        q: "Gaziemir nerede, İzmir'in neresine düşer?",
        a: "Gaziemir, İzmir'in güneyinde yer alan bir merkez ilçedir. Adnan Menderes Havalimanı, Ege Serbest Bölgesi ve Fuar İzmir ilçe sınırları içindedir. Konak ve Alsancak yönüne İZBAN banliyö hattıyla ya da karayoluyla ulaşılır.",
      },
      {
        q: "Gaziemir'in nüfusu ne kadar?",
        a: "2024 nüfus sayımına göre Gaziemir'in nüfusu yaklaşık 136.930'dur. İlçe 1965 yılına kadar Seydiköy adıyla anılıyordu.",
      },
      {
        q: "Gaziemir'de yaşamak mantıklı mı?",
        a: "Sık seyahat eden, ilçede veya serbest bölgede çalışan, raylı sistemle ulaşımı tercih eden ve merkez ilçelere göre daha erişilebilir fiyat arayanlar için mantıklıdır. Buna karşılık sahil ve gece hayatını merkeze alan bir yaşam kuruyorsanız Gaziemir uzak kalır.",
      },
      {
        q: "Gaziemir'den İzmir merkeze ulaşım nasıl?",
        a: "İZBAN banliyö hattı ilçeden geçer ve Alsancak yönüne trafiğe girmeden ulaşım sağlar. Karayoluyla İzmir merkezine (Konak) yaklaşık 22 dakika sürer; trafik yoğunluğuna göre bu süre uzayabilir.",
      },
      {
        q: "Sarnıç nasıl bir bölge?",
        a: "Sarnıç, Gaziemir'in son yıllarda en çok konut yatırımı çeken bölgesidir. İZBAN istasyonu, havalimanı yakınlığı ve gelişmeye açık arsa stoğu bir aradadır. Çam ağaçlarıyla çevrili göleti yürüyüş ve piknik için kullanılır. Bölgede inşaat yoğunluğu bir süre daha devam edecektir.",
      },
    ],
  },

  // ── BLOG 5 — İzmir'de Daire Alma Rehberi (hedef: "izmir konut projesi" — 720/ay, yüksek niyet)
  {
    slug: "izmir-yatirimlik-daire-rehberi",
    keyword: "izmir konut projesi",
    category: "Rehber",
    title: "İzmir'de Daire Alırken Kontrol Edilecek 9 Başlık",
    description:
      "İzmir'de konut projesinden daire alırken nelere bakmalı? Ruhsat, deprem yönetmeliği, teslim güvencesi, ödeme koşulları ve konum kriterlerini anlatan pratik kontrol listesi.",
    excerpt:
      "Projeden daire almak, bitmiş ev almaktan farklıdır. Kâğıt üzerindeki bir yapıyı değerlendirirken hangi 9 başlığı kontrol etmelisiniz?",
    hero: "/renders/dis-cephe-cadde.jpg",
    date: "2026-08-19",
    updated: "2026-08-19",
    readingMin: 8,
    blocks: [
      {
        type: "p",
        text: "Projeden daire almak, bitmiş bir evi gezip almaktan farklıdır. Elinizde henüz bina yok; bir vaat, bir çizim ve bir sözleşme var. Bu yüzden karar verirken bakacağınız şeyler de değişiyor. Aşağıdaki 9 başlık, İzmir'de bir konut projesini değerlendirirken sormanız gereken somut sorular.",
      },
      {
        type: "p",
        text: "Not: Bu yazı genel bir kontrol listesidir, yatırım tavsiyesi değildir. Nihai karardan önce sözleşmenizi bir avukata okutmanızı öneririz.",
      },
      { type: "h2", text: "1. Yapı ruhsatı var mı?" },
      {
        type: "p",
        text: "Sorulacak ilk soru budur. Yapı ruhsatı, projenin belediyeden izin almış olduğunu gösterir. Ruhsatsız satışa çıkmış projelerde teslim riski çok yüksektir. Ruhsat tarihini ve numarasını isteyin; belediyeden teyit edebilirsiniz.",
      },
      { type: "h2", text: "2. Hangi deprem yönetmeliğine göre yapılıyor?" },
      {
        type: "p",
        text: "İzmir birinci derece deprem bölgesindedir; 2020 depremi bunu acı biçimde hatırlattı. 2018'de yürürlüğe giren Türkiye Bina Deprem Yönetmeliği (TBDY 2018), öncekilere göre belirgin biçimde daha katı kurallar getirir. Projenin bu yönetmeliğe göre projelendirildiğini yazılı olarak teyit edin. Zemin etüt raporunu da isteyebilirsiniz.",
      },
      { type: "h2", text: "3. Net metrekare mi, brüt metrekare mi?" },
      {
        type: "p",
        text: "İlanlarda çoğunlukla brüt metrekare yazar; oysa yaşadığınız alan nettir. Aradaki fark yüzde yirmiye kadar çıkabilir. Kat planını isteyip mahal ölçülerine tek tek bakın. Bir de şunu sorun: verilen metrekareye balkon, galeri boşluğu veya ortak alan payı dahil mi?",
      },
      {
        type: "quote",
        text: "Aynı iki daireden biri 90 m², diğeri 82 m² yazıyorsa, gerçekte hangisinin daha ferah olduğunu sadece kat planı söyler.",
      },
      { type: "h2", text: "4. Teslim tarihi sözleşmede yazıyor mu?" },
      {
        type: "p",
        text: "Sözlü teslim tarihi hiçbir şey ifade etmez. Sözleşmede kesin bir tarih ve gecikme hâlinde uygulanacak yaptırım maddesi bulunmalıdır. Gecikme tazminatı olmayan bir sözleşme, alıcı için tek taraflı risk demektir.",
      },
      { type: "h2", text: "5. Ödeme koşulları gerçekten ne söylüyor?" },
      {
        type: "list",
        items: [
          "Peşinat oranı ve ne zaman ödeneceği net mi?",
          "Vade gerçekten faizsiz mi, yoksa fiyata gizlenmiş bir fark var mı? Peşin fiyatla vadeli toplam fiyatı yan yana isteyin.",
          "Peşin ödeme indirimi uygulanıyor mu, oranı ne?",
          "Fiyatta artış yapılabileceğine dair bir madde var mı?",
          "Ödeme planı inşaat aşamalarına mı bağlı, yoksa sabit tarihlere mi?",
        ],
      },
      { type: "h2", text: "6. Geliştirici firmanın geçmişi ne?" },
      {
        type: "p",
        text: "Firmanın daha önce tamamladığı projeleri sorun ve mümkünse gidip görün. Daha da iyisi: o projelerde oturanlarla konuşun. Teslim zamanında oldu mu, eksikler giderildi mi, yönetim devri düzgün yapıldı mı? Bu bilgiyi hiçbir broşür vermez.",
      },
      { type: "h2", text: "7. Konumu iki farklı saatte görün" },
      {
        type: "p",
        text: "Projeyi sadece hafta içi öğlen görmeyin. Sabah işe çıkış saatinde ve akşam eve dönüş saatinde de gidin. Trafik, gürültü ve otopark durumu o saatlerde ortaya çıkar. Ulaşım için verilen sürelerin gerçek olup olmadığını kendi aracınızla ölçün.",
      },
      { type: "h2", text: "8. Çevre parsellerde ne var, ne olacak?" },
      {
        type: "p",
        text: "Bugünkü manzaranız yarın olmayabilir. Komşu parsellerin imar durumunu belediyeden öğrenin. Özellikle gelişmekte olan bölgelerde, önünüzdeki boş arsaya birkaç yıl içinde bina yapılması olağandır.",
      },
      { type: "h2", text: "9. Ortak alanlar ve aidat" },
      {
        type: "p",
        text: "Havuz, spor salonu, güvenlik ve peyzaj güzel görünür; ancak hepsinin bir işletme maliyeti vardır ve bunu aidat olarak siz ödersiniz. Projenin tahmini aidatını sorun. Ayrıca ortak alanların yönetim planında nasıl tanımlandığına bakın: site içindeki ticari birimler aidata katılıyor mu?",
      },
      { type: "h2", text: "Kısa bir kontrol listesi" },
      {
        type: "list",
        items: [
          "Yapı ruhsatı numarası alındı mı?",
          "TBDY 2018 uyumu yazılı olarak teyit edildi mi?",
          "Kat planı ve net metrekare elde mi?",
          "Sözleşmede teslim tarihi ve gecikme yaptırımı var mı?",
          "Peşin ve vadeli toplam fiyat yan yana karşılaştırıldı mı?",
          "Firmanın önceki projeleri görüldü mü?",
          "Konum iki farklı saatte gezildi mi?",
          "Çevre parsellerin imar durumu soruldu mu?",
          "Tahmini aidat öğrenildi mi?",
        ],
      },
      { type: "h2", text: "Sonuç" },
      {
        type: "p",
        text: "Projeden daire almak, doğru sorular sorulduğunda yönetilebilir bir süreçtir. Riski azaltan şey iyi bir sezgi değil, yazılı belgedir: ruhsat, sözleşme, kat planı ve teknik şartname. Bunları görmeden imza atmayın.",
      },
      {
        type: "p",
        text: "Loft 777 için bu başlıkların yanıtlarını açıkça paylaşıyoruz: proje künyesi, daire tiplerinin gerçek mahal ölçüleri, yapı ve donanım detayları ile ödeme koşulları sitemizde yazılı olarak yer alıyor.",
      },
    ],
    faq: [
      {
        q: "Projeden daire alırken ilk olarak neye bakmalıyım?",
        a: "İlk bakılacak şey yapı ruhsatıdır. Ruhsat, projenin belediyeden izin aldığını gösterir ve teslim riskini belirgin biçimde azaltır. Ruhsat numarasını isteyip belediyeden teyit edebilirsiniz.",
      },
      {
        q: "TBDY 2018 nedir, neden önemli?",
        a: "TBDY 2018, 2018'de yürürlüğe giren Türkiye Bina Deprem Yönetmeliği'dir. Önceki yönetmeliklere göre daha katı tasarım ve hesap kuralları getirir. İzmir birinci derece deprem bölgesinde olduğu için, satın alınacak konutun bu yönetmeliğe göre projelendirilmiş olması önemlidir.",
      },
      {
        q: "Net metrekare ile brüt metrekare arasındaki fark nedir?",
        a: "Brüt metrekare duvarlar, balkon ve ortak alan paylarını içerir; net metrekare ise fiilen kullandığınız alandır. Aradaki fark yüzde yirmiye kadar çıkabilir. Karşılaştırma yaparken her iki projeden de aynı türde metrekare istemek gerekir.",
      },
      {
        q: "Vade gerçekten faizsiz mi, nasıl anlarım?",
        a: "Peşin fiyat ile vadeli toplam fiyatı yan yana isteyin. İkisi arasında fark varsa, o fark fiyata gizlenmiş bir vade maliyetidir. Faizsiz vade iddiasında peşin ve vadeli toplam tutarın aynı olması beklenir.",
      },
      {
        q: "Aidat hakkında ne sormalıyım?",
        a: "Projenin tahmini aylık aidatını, aidata hangi hizmetlerin dahil olduğunu ve site içindeki ticari birimlerin aidata katılıp katılmadığını sorun. Havuz, spor salonu ve güvenlik gibi imkânların işletme maliyeti aidata yansır.",
      },
    ],
  },

  // ── BLOG 6 — İZBAN Sarnıç (hedef: "izban sarnıç" + yerel ulaşım aramaları)
  {
    slug: "izban-sarnic-ulasim-rehberi",
    keyword: "izban sarnıç",
    category: "Ulaşım",
    title: "İZBAN Sarnıç İstasyonu: Gaziemir'den Şehre Trafiksiz Ulaşım",
    description:
      "İZBAN Sarnıç istasyonu nerede, hangi duraklar var, Alsancak'a kaç durak? Havalimanına tek durak mesafedeki Sarnıç'tan İzmir'e ulaşım rehberi.",
    excerpt:
      "Sarnıç, havalimanı istasyonunun bir önceki durağı. Alsancak'a dokuz durak, metroya iki ayrı aktarma noktası. Raylı sistemle yaşamak ne demek?",
    hero: "/renders/hava-carsi.jpg",
    date: "2026-08-19",
    updated: "2026-08-19",
    readingMin: 6,
    blocks: [
      {
        type: "p",
        text: "İzmir'de ev seçerken sorulması gereken sorulardan biri şu: işe giderken trafiğe mecbur musunuz? Cevap evetse, günlük hayatınızın bir bölümünü her sabah yeniden kumar oynayarak geçirirsiniz. Raylı sistem bu belirsizliği ortadan kaldırır — tren sabah da akşam da aynı süreyi alır. Bu yazıda Gaziemir Sarnıç'tan İZBAN ile ulaşımı anlatıyoruz.",
      },
      { type: "h2", text: "İZBAN nedir?" },
      {
        type: "p",
        text: "İZBAN, İzmir'in banliyö tren sistemidir. Kuzeyde Aliağa'dan güneyde Selçuk'a uzanan hat yaklaşık 136 kilometre uzunluğunda ve üzerinde 40 istasyon bulunuyor. Metro değil, banliyö hattıdır: durak aralıkları daha uzun, mesafeler daha büyüktür. İzmir'in bir ucundan diğerine trafiğe girmeden gitmenin en pratik yolu.",
      },
      { type: "h2", text: "Sarnıç istasyonu hattın neresinde?" },
      {
        type: "p",
        text: "Hattın güney kolunda, kuzeyden güneye doğru istasyonlar şöyle sıralanır: Şirinyer, Koşu, İnkılap, Semt Garajı, Esbaş, Gaziemir, Sarnıç, Adnan Menderes Havalimanı, Cumaovası, Develi, Tekeli...",
      },
      {
        type: "p",
        text: "Buradaki en dikkat çekici ayrıntı şu: Sarnıç, Adnan Menderes Havalimanı istasyonunun hemen bir önceki durağıdır. Yani Sarnıç'tan havalimanına trenle tek durak mesafedesiniz. Valizle taksiye binmek, otopark aramak ya da trafiğe takılmak zorunda değilsiniz.",
      },
      {
        type: "quote",
        text: "Sarnıç'tan havalimanına tek durak. İzmir'de bunu söyleyebilen çok az mahalle var.",
      },
      { type: "h2", text: "Sarnıç'tan şehir merkezine kaç durak?" },
      {
        type: "p",
        text: "Sarnıç'tan Alsancak'a doğru gidildiğinde sırasıyla Gaziemir, Esbaş, Semt Garajı, İnkılap, Koşu, Şirinyer, Kemer ve Hilal istasyonları geçilir; Alsancak dokuzuncu duraktır. Konak, Alsancak'a çok yakındır ve buradan yürüyerek ya da kısa bir aktarmayla ulaşılır.",
      },
      { type: "h2", text: "Metroya nereden aktarma yapılır?" },
      {
        type: "p",
        text: "İZBAN'dan İzmir Metrosu'na Halkapınar ve Hilal istasyonlarından aktarma yapılabilir. Bu, Bornova ve Fahrettin Altay yönüne giden bir yolcunun tek biletle şehri baştan başa geçebilmesi anlamına gelir.",
      },
      { type: "h2", text: "Sefer sıklığı ve saatler" },
      {
        type: "p",
        text: "Seferler gün boyunca düzenli aralıklarla yapılır; yoğun saatlerde sıklaşır. İlk seferler sabahın erken saatlerinde başlar, son seferler gece yarısına yakın tamamlanır. Sefer saatleri dönemsel olarak güncellendiği için, planlama yaparken İZBAN'ın resmî kaynaklarındaki güncel tarifeye bakmanızı öneririz — burada sabit bir saat vermek yanıltıcı olur.",
      },
      { type: "h2", text: "Kimin için gerçek bir fark yaratır?" },
      {
        type: "list",
        items: [
          "Şehir merkezinde çalışanlar: Sabah trafiğine girmeden, her gün aynı sürede işe varmak.",
          "Sık uçanlar: Havalimanına tek durak. Erken sabah uçuşlarında bu, uyku demektir.",
          "Öğrenciler: Metro aktarmasıyla Bornova yönündeki kampüslere raylı sistemle ulaşım.",
          "Tek araçlı aileler: Araç birinde kalırken diğeri trenle yoluna devam edebilir.",
          "Araç kullanmak istemeyenler: Otopark, yakıt ve trafik stresini denklemden çıkarmak.",
        ],
      },
      { type: "h2", text: "İstasyona yakın oturmanın anlamı" },
      {
        type: "p",
        text: "Raylı sistemin avantajı ancak istasyona kolay ulaşabiliyorsanız gerçektir. İstasyona araçla on dakika süren bir ev, pratikte treni kullanmanızı zorlaştırır: aracı bırakacak yer bulmanız, dönüşte almaya gitmeniz gerekir. Yürüme mesafesindeki bir ev ise treni günlük alışkanlık hâline getirir. Bu yüzden Gaziemir'de ev bakarken istasyona olan mesafeyi metreyle sormakta fayda var.",
      },
      {
        type: "p",
        text: "Loft 777, İZBAN Sarnıç istasyonuna 800 metre mesafededir. Havalimanı ise araçla dokuz dakika, trenle Sarnıç'tan tek durak uzaklıktadır.",
      },
    ],
    faq: [
      {
        q: "İZBAN Sarnıç istasyonu nerede?",
        a: "Sarnıç istasyonu, İzmir'in Gaziemir ilçesinde, İZBAN hattının güney kolunda yer alır. Kuzeyinde Gaziemir istasyonu, güneyinde Adnan Menderes Havalimanı istasyonu bulunur.",
      },
      {
        q: "Sarnıç'tan havalimanına nasıl gidilir?",
        a: "İZBAN ile tek durak. Sarnıç istasyonu, Adnan Menderes Havalimanı istasyonunun hemen bir önceki durağıdır; güney yönüne giden trenle bir istasyon sonra havalimanına ulaşırsınız.",
      },
      {
        q: "Sarnıç'tan Alsancak'a kaç durak var?",
        a: "Sarnıç'tan kuzeye doğru sırasıyla Gaziemir, Esbaş, Semt Garajı, İnkılap, Koşu, Şirinyer, Kemer ve Hilal geçilir; Alsancak dokuzuncu istasyondur.",
      },
      {
        q: "İZBAN'dan metroya nereden aktarma yapılır?",
        a: "İzmir Metrosu'na Halkapınar ve Hilal istasyonlarından aktarma yapılabilir.",
      },
      {
        q: "İZBAN hattı nereden nereye gidiyor?",
        a: "İZBAN, kuzeyde Aliağa'dan güneyde Selçuk'a uzanan yaklaşık 136 kilometrelik bir banliyö hattıdır ve üzerinde 40 istasyon bulunur.",
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════════
// İNGİLİZCE YAZILAR
// ══════════════════════════════════════════════════════════════
const POSTS_EN: BlogPost[] = [
  {
    slug: "loft-daire-nedir",
    keyword: "what is a loft apartment",
    category: "Loft Living",
    title: "What Is a Loft Apartment? 8 Differences From a Standard Flat",
    description:
      "What is a loft apartment and how does it differ from a standard flat? High ceilings, open plans and mezzanine voids — a clear guide to loft living and who it suits.",
    excerpt:
      "High ceilings, open plans and a mezzanine void. What exactly is a loft apartment, how does it differ from a standard flat, and who is it for?",
    hero: "/renders/loft-galeri-kanit.jpg",
    date: "2026-07-28",
    updated: "2026-07-28",
    readingMin: 7,
    blocks: [
      {
        type: "p",
        text: "A word keeps appearing in property listings: loft. But what is a loft apartment, is it really different from a standard flat, or is it just a marketing term? This guide explains the concept in plain language, lists the differences from a standard flat, and honestly covers who loft living suits.",
      },
      { type: "h2", text: "What is a loft? A short history" },
      {
        type: "p",
        text: "The word loft originally means an upper storey with a high ceiling. The concept was born in 1950s New York: artists rented empty factory and warehouse floors cheaply and used them as both studio and home. High ceilings, wide open volumes and undivided plans were the natural features of these spaces. Over time this raw, industrial aesthetic became a lifestyle, and today loft means a high-ceilinged, open-plan, spacious home all over the world.",
      },
      { type: "h2", text: "8 differences from a standard flat" },
      {
        type: "list",
        items: [
          "Ceiling height: A standard flat is usually 2.7-3 metres. With a mezzanine void, a loft reaches 5-6 metres.",
          "Mezzanine void: A double-height space above the living room, allowing a mezzanine floor — unique to lofts.",
          "Open plan: Living room, kitchen and living area are usually one flowing, wall-free volume.",
          "Natural light: High windows and undivided volume let light reach deep into the space.",
          "Vertical use: You use square metres in height, not width — living below, working or sleeping above.",
          "Flexibility: The same flat can be used differently over time; the mezzanine can be a bedroom, study or lounge.",
          "Perceived space: The same floor area feels far larger thanks to the high ceiling.",
          "Character: Lofts stand apart from standard box plans; the space has an identity of its own.",
        ],
      },
      {
        type: "image",
        src: "/renders/daire-salon-1.jpg",
        alt: "Loft apartment open-plan living room and kitchen — high ceiling",
        caption: "Open plan: living room, kitchen and living area in one flowing volume.",
      },
      { type: "h2", text: "The advantages of a loft" },
      {
        type: "p",
        text: "The greatest benefit of loft living is the sense of spaciousness. High ceilings and an open plan turn even a compact floor area into a space that breathes. Natural light travels inside all day, reducing dependence on artificial lighting. The mezzanine void gifts you a second floor — you can set up the upper level as a bedroom or study and dedicate the lower level entirely to social life. For those who work from home, this vertical split cleanly separates work and life within a single flat.",
      },
      { type: "h2", text: "The disadvantages — an honest look" },
      {
        type: "p",
        text: "As with any way of living, a loft has points to consider. Heating and cooling high-ceilinged volumes requires good insulation and the right climate system — which is why central systems and quality insulation matter in lofts. An open plan means sound travels more freely; larger households need to plan for privacy. The stairs to the mezzanine should be considered by households with small children or mobility needs. All of these can be solved with good design; what matters is deciding with full knowledge before you buy.",
      },
      { type: "h2", text: "Who is a loft apartment for?" },
      {
        type: "p",
        text: "Lofts are ideal for young professionals, couples, people who work from home, and investors seeking a compact but characterful living space. Anyone who wants a spacious studio feel without being boxed into a standard flat will enjoy loft living. From an investor's view, lofts stand apart because supply is limited, appealing to a niche demand on the rent and value side.",
      },
      {
        type: "image",
        src: "/renders/daire-genel.jpg",
        alt: "Loft apartment interior — mezzanine void and upper floor",
        caption: "The mezzanine void creates a second living level above the lounge.",
      },
      { type: "h2", text: "How to choose a loft — what to check" },
      {
        type: "list",
        items: [
          "Ask the real ceiling height — including the void, how many metres net?",
          "Learn the heating and cooling system — central systems and underfloor heating matter for high volumes.",
          "Check insulation — thermal and acoustic insulation are the foundation of loft comfort.",
          "Clarify the mezzanine use — bedroom, study or storage; does it fit your life?",
          "Window orientation and light — see how natural light arrives through the day.",
          "Build quality and seismic-code compliance — as with any home, safety comes first.",
        ],
      },
      { type: "h2", text: "Loft living at Loft 777" },
      {
        type: "p",
        text: "Rising in Izmir Gaziemir, Loft 777 takes its name from exactly this way of living. In the project, all ground floors are designed as loft apartments: ceiling heights reaching 5.6 metres with the mezzanine void, open-plan living areas and wide windows that draw in natural light. Central underfloor heating and VRF air conditioning secure the comfort of the high volume. A double-glazed Low-E argon glass system and 5 cm stone-wool thermal insulation solve the energy efficiency that buyers ask about most.",
      },
      {
        type: "quote",
        text: "A loft is living in height, not width. The same area, with the right design, offers twice as much.",
      },
      {
        type: "p",
        text: "For questions about loft apartments or the unit types at Loft 777, get in touch with our sales team. In our next article, we cover the concept that defines the character of lofts: horizontal architecture.",
      },
    ],
    faq: [
      {
        q: "What is a loft apartment in short?",
        a: "A loft apartment is a high-ceilinged, open-plan home usually with a mezzanine void. The living room, kitchen and living area are mostly one wall-free volume; thanks to the void, the ceiling can reach 5-6 metres and a mezzanine floor can be built above.",
      },
      {
        q: "What does loft mean in architecture?",
        a: "In architecture, loft originally means an attic or a high-ceilinged upper floor. The concept was born in mid-20th-century New York, when artists turned factory and warehouse floors into living spaces. Today loft describes high ceilings, open plans and an industrial-modern aesthetic.",
      },
      {
        q: "What is the difference between a loft and a duplex?",
        a: "A duplex joins two full floors with stairs; both floors have full ceiling height and rooms are separated by walls. A loft is built on a single volume with a mezzanine void; the upper level is usually a mezzanine open to the lower space. In short, a duplex is two divided floors, a loft is one open, flowing volume.",
      },
      {
        q: "Who is a loft apartment suitable for?",
        a: "Loft apartments suit young professionals, couples, people who work from home and investors seeking a compact but characterful space. Anyone who wants a spacious studio feel and to separate work and life vertically will benefit from loft living.",
      },
      {
        q: "How high are the ceilings in loft apartments?",
        a: "Standard flats usually have ceilings of 2.7-3 metres. In lofts, with the mezzanine void, this can rise to 5-6 metres. For example, in the Loft 777 project the loft apartments have a ceiling height of 5.6 metres including the void.",
      },
    ],
  },
  {
    slug: "yatay-mimari-nedir",
    keyword: "horizontal architecture",
    category: "Architecture",
    title: "What Is Horizontal Architecture? Why the Aegean Loves It",
    description:
      "What is horizontal architecture and how does it differ from vertical, high-rise design? Why is it preferred in the Aegean? Advantages, global examples and Loft 777's approach.",
    excerpt:
      "Not towers, but human scale. What is horizontal architecture, why is it so loved in the Aegean, and how does it meet loft living?",
    hero: "/renders/hava-genel.jpg",
    date: "2026-07-28",
    updated: "2026-07-28",
    readingMin: 6,
    blocks: [
      {
        type: "p",
        text: "When you first see a development and find it \"warm\" or \"cold\", there is often an unnoticed choice behind it: whether the architecture is horizontal or vertical. Horizontal architecture is increasingly preferred, especially in the Aegean region. So what exactly is it, and why is it so loved?",
      },
      { type: "h2", text: "What is horizontal architecture?" },
      {
        type: "p",
        text: "Horizontal architecture is a design approach where buildings are composed along width rather than height. Instead of a single tower with dozens of floors, lower blocks that spread across the land are preferred. In this approach, buildings stay close to human scale; courtyards, gardens and shared spaces sit at the heart of the structure. The aim is not to push density upward and separate people, but to keep life close to the ground and to one another.",
      },
      {
        type: "image",
        src: "/renders/hava-tepeden.jpg",
        alt: "Horizontal architecture — low-rise blocks spread across the land, aerial view",
        caption: "Horizontal composition: human-scale blocks that spread across the land instead of rising.",
      },
      { type: "h2", text: "Why so popular in the Aegean?" },
      {
        type: "p",
        text: "The Aegean's climate and way of life naturally align with horizontal architecture. Plenty of sun and mild weather make open courtyards, gardens and terraces usable year-round. The close relationship Aegean people have with the street, the neighbour and nature is strengthened by a layout that keeps people near the ground. And in a geography that lives with the reality of earthquakes, lower buildings on a wider base also feel psychologically reassuring. All of this makes horizontal architecture a cultural, not merely aesthetic, choice for the Aegean.",
      },
      { type: "h2", text: "Horizontal vs. vertical — a comparison" },
      {
        type: "list",
        items: [
          "Scale: Vertical architecture reaches for the sky; horizontal stays at human size.",
          "Shared life: In tall towers neighbourliness is limited to the lift; horizontally, courtyards and gardens bring people together.",
          "Access to nature: In horizontal projects most flats open directly onto a garden, terrace or green space.",
          "Daily comfort: In low-rise buildings, lift dependence drops and circulation is easier.",
          "Light and air: Blocks spread across the land give flats more balanced daylight and air flow.",
          "Belonging: A human-scale settlement creates a stronger sense of \"this is mine\" in its residents.",
        ],
      },
      {
        type: "image",
        src: "/renders/teras-bahce.jpg",
        alt: "Terrace and garden use in horizontal architecture",
        caption: "In a horizontal layout, flats open directly onto terraces and greenery.",
      },
      { type: "h2", text: "Global examples of horizontal architecture" },
      {
        type: "p",
        text: "The best-known examples of horizontal architecture appear in luxury resort and living brands. Brands like Aman Resorts and Six Senses deliberately choose low, land-spreading structures in their settlements along Bali, the Mediterranean and Aegean coasts. The aim is to keep the guest close to the earth, water and garden rather than the sky. This approach is the foundation of an aesthetic called \"quiet luxury\" — built on calm and scale rather than display.",
      },
      { type: "h2", text: "Loft 777's horizontal approach" },
      {
        type: "p",
        text: "In Izmir Gaziemir, Loft 777 is designed as a horizontal layout of 5 blocks on its 8,879 m² plot. Instead of a tall tower, a settlement that spreads across the land and embraces 4,200 m² of green space was planned. A pool facing the courtyard, flats opening onto terraces and life close to the ground bring the Aegean's living culture into the project. Designing the ground floors as lofts carries the spaciousness of horizontal architecture into the flat as well: scale that spreads across the land outside, a ceiling that rises inside.",
      },
      {
        type: "quote",
        text: "Horizontal architecture invests not in height but in closeness — to nature, to the neighbour, and to the ground.",
      },
      {
        type: "p",
        text: "In our next article, we cover the place where this architecture rises: everything you need to know when looking for an apartment for sale in Gaziemir.",
      },
    ],
    faq: [
      {
        q: "What does horizontal architecture mean?",
        a: "Horizontal architecture is a design approach where buildings are composed along width rather than height. Instead of a single high tower, lower blocks that spread across the land are preferred. The aim is not to push density upward but to keep life close to the ground and to nature.",
      },
      {
        q: "How many floors does horizontal architecture have?",
        a: "There is no strict floor limit in horizontal architecture, but low-rise structures (ground plus a few floors) are usually preferred. What matters is not the number of floors but that the building spreads across the land rather than rising, and stays at human scale.",
      },
      {
        q: "What are the advantages of horizontal architecture?",
        a: "Its main advantages: flats opening directly onto gardens, terraces and greenery; reduced lift dependence; more balanced daylight and air flow; strong neighbourly relations through courtyards and shared spaces; and a strong sense of belonging from the human scale.",
      },
      {
        q: "Horizontal or vertical architecture — which is better?",
        a: "Both answer different needs. Vertical architecture provides high density on limited land and offers views. Horizontal architecture prioritises closeness to nature, shared living and human scale. The Aegean's climate and lifestyle align more with horizontal architecture as it allows open courtyards and terraces year-round.",
      },
      {
        q: "Why is horizontal architecture preferred in the Aegean?",
        a: "The Aegean's sunny, mild climate makes open courtyards, gardens and terraces usable year-round. The region's close relationship with the street, the neighbour and nature is strengthened by a layout that keeps people near the ground. So horizontal architecture is both an aesthetic and a cultural choice for the Aegean.",
      },
    ],
  },
  {
    slug: "gaziemir-satilik-daire-rehberi",
    keyword: "apartment for sale in gaziemir",
    category: "Area Guide",
    title: "10 Things to Know When Buying an Apartment in Gaziemir",
    description:
      "Looking for an apartment for sale in Gaziemir, Izmir? Area advantages, price, transport, build standards and payment terms — 10 things to know before you decide.",
    excerpt:
      "Nine minutes to the airport, 800 m to the rail line. Ten ways to assess the area, the price and the build when buying in Gaziemir.",
    hero: "/renders/dis-cephe-cadde.jpg",
    date: "2026-07-28",
    updated: "2026-07-28",
    readingMin: 8,
    blocks: [
      {
        type: "p",
        text: "When choosing an area in Izmir for investment or living, Gaziemir has become one of the standout addresses of recent years. With its proximity to the airport, İZBAN rail transport and developing surroundings, it is on the radar of both investors and families. In this article, we honestly cover the 10 things to watch when looking for an apartment for sale in Gaziemir.",
      },
      { type: "h2", text: "1. Why Gaziemir? A rising area" },
      {
        type: "p",
        text: "Gaziemir is a district in the south-southwest of Izmir, neighbouring Adnan Menderes Airport. It is bordered by Karabağlar to the west and north, Buca to the east and Menderes to the south. It is an area with a strong transport backbone where industry, commerce and housing develop together. In recent years its face has been changing with new housing projects; its airport proximity and İZBAN line make it attractive for both investors and daily life.",
      },
      {
        type: "image",
        src: "/renders/hava-carsi.jpg",
        alt: "Gaziemir housing project — retail and social spaces, aerial view",
        caption: "Gaziemir: an area where housing, commerce and social life develop together.",
      },
      { type: "h2", text: "2. Transport: airport and rail advantage" },
      {
        type: "p",
        text: "Gaziemir's strongest card is transport. Adnan Menderes Airport is around 9 minutes by car; for frequent travellers and expatriates this distance is priceless. The İZBAN Sarnıç line connects the area to central Izmir by rail — a home 800 m from the İZBAN stop takes daily commuting out of traffic dependence. Proximity to the motorway junction also eases intercity connections.",
      },
      { type: "h2", text: "3. Daily life: shopping, health, education" },
      {
        type: "list",
        items: [
          "Shopping: Optimum Outlet and large supermarkets are minutes away.",
          "Health: A state hospital and private clinics are within the area.",
          "Education: Private and state schools at every level are available.",
          "Nature: The Sarnıç lakelet picnic and walking area is a nearby escape.",
          "Social: Countless cafés and restaurants feed daily life.",
        ],
      },
      { type: "h2", text: "4. Price: position your budget right" },
      {
        type: "p",
        text: "Gaziemir offers more accessible prices than Izmir's central districts, while its development potential promises value growth. When assessing price, look not only at the price per square metre but holistically at build quality, social amenities, payment terms and the delivery date. Projects in the pre-sale phase usually offer more favourable prices and payment plans than after delivery.",
      },
      { type: "h2", text: "5. New project or resale?" },
      {
        type: "p",
        text: "New projects offer advantages such as compliance with the current seismic code, zero wear, modern insulation and smart-home features. Resale allows immediate move-in but the building's age, insulation and seismic resilience must each be questioned. From an investment view, entering a new project in the pre-sale phase carries value-growth potential in the period until delivery.",
      },
      {
        type: "image",
        src: "/renders/avlu-havuz.jpg",
        alt: "New housing project — courtyard and pool social area",
        caption: "In new projects, social amenities directly raise quality of life.",
      },
      { type: "h2", text: "6. Build standards: safety comes first" },
      {
        type: "list",
        items: [
          "Seismic code: Confirm the building fully complies with the current code (TBDY).",
          "Insulation: Thermal and acoustic insulation mean both comfort and lower bills.",
          "Heating/cooling: Central systems, underfloor heating and VRF air conditioning save in the long run.",
          "Glazing: Double-glazed Low-E argon is the foundation of energy efficiency.",
          "Facade: Precast and curtain-wall facades offer both aesthetics and durability.",
        ],
      },
      { type: "h2", text: "7. Social amenities: life is more than the flat" },
      {
        type: "p",
        text: "When buying a flat, you must look beyond the four walls. A swimming pool, fitness, children's play area, security, indoor parking and green space directly affect both quality of life and resale value. An on-site restaurant and retail units let you meet daily needs without leaving the complex.",
      },
      { type: "h2", text: "8. Payment plan: deposit, instalments, interest" },
      {
        type: "p",
        text: "Payment terms are one of the most decisive items in a purchase decision. Down-payment discounts, interest-free instalment options and reservation terms vary from project to project. Interest-free instalments are a strong way to fix the flat at today's price and protect against inflation. Always request the payment plan in writing and in clear terms.",
      },
      { type: "h2", text: "9. Return on investment: rent and value growth" },
      {
        type: "p",
        text: "In a developing area like Gaziemir, think of return in two items: rental income and value growth. Airport and İZBAN proximity keep rental demand alive. A flat bought in pre-sale gaining value until delivery is the second return item. Compact 1+1 and loft apartments, with their lower entry budget, give investors an advantage in the rent/value multiple.",
      },
      { type: "h2", text: "10. Loft 777: all criteria in one" },
      {
        type: "p",
        text: "Rising in Izmir Gaziemir, Dokuz Eylül district, Loft 777 is designed to meet almost all of these 10 points: 9 minutes to the airport, 800 m to the İZBAN Sarnıç stop. 5 blocks, 237 units, 1+1 and 1+1 loft apartments. A swimming pool, fitness, on-site restaurant, children's play area and 4,200 m² of green space. Full compliance with the current seismic code, central underfloor heating, VRF air conditioning and smart-home infrastructure. 35% down payment and 18 months interest-free instalments; 15% discount on full payment. Delivery in December 2027.",
      },
      {
        type: "quote",
        text: "A good apartment meets not only today's need but tomorrow's value. Location, build and payment plan must be weighed together.",
      },
      {
        type: "p",
        text: "You can use these 10 headings as a checklist when looking for an apartment for sale in Gaziemir. For Loft 777's unit types, current price list and payment options, get in touch with our sales team.",
      },
    ],
    faq: [
      {
        q: "What kind of district is Gaziemir, Izmir?",
        a: "Gaziemir is a district in the south-southwest of Izmir, neighbouring Adnan Menderes Airport. It is an area where industry, commerce and housing develop together, with strong transport. With the İZBAN line, Optimum Outlet, a hospital, schools and the Sarnıç lakelet, it is preferred by both families and investors.",
      },
      {
        q: "How far is Gaziemir from the airport?",
        a: "Gaziemir is the district neighbouring Adnan Menderes Airport; the airport is about 9 minutes away by car. This proximity is a major advantage for frequent travellers and investors living abroad.",
      },
      {
        q: "Is Gaziemir close to the sea?",
        a: "Gaziemir is an inland district; the coast is about 20 minutes away by car. Its strength is not the seaside but the ease of transport through the airport, İZBAN and motorway connections.",
      },
      {
        q: "New project or resale apartment in Gaziemir?",
        a: "New projects offer compliance with the current seismic code, zero wear, modern insulation and smart-home features. Resale allows immediate move-in but building age and seismic resilience must be checked separately. For investment, a new project in pre-sale carries value-growth potential until delivery.",
      },
      {
        q: "What to look for when buying an apartment in Gaziemir?",
        a: "Safety first: confirm the building complies with the current seismic code (TBDY 2018). Then assess location (airport, İZBAN, motorway proximity), build quality (insulation, heating-cooling system, facade), social amenities and the payment plan holistically. In pre-sale projects, always request payment terms in writing.",
      },
    ],
  },

  {
    slug: "gaziemir-yasam-rehberi",
    keyword: "living in gaziemir izmir",
    category: "Area Guide",
    title: "Living in Gaziemir: A Guide to Izmir's Airport District",
    description:
      "Where is Gaziemir, what is it like and who does it suit? A straightforward guide to living in Gaziemir, Izmir — transport, shopping, nature and daily life.",
    excerpt:
      "The airport, the free zone, the fair grounds and the commuter rail are all in one district. What sets Gaziemir apart, and how does daily life actually work there?",
    hero: "/renders/hava-carsi.jpg",
    date: "2026-08-19",
    updated: "2026-08-19",
    readingMin: 9,
    blocks: [
      {
        type: "p",
        text: "Most people house-hunting in Izmir look at Karşıyaka, Bornova or Buca first. Gaziemir usually sits further down the list — even though Izmir's airport, its free zone and its fair grounds all lie within this district. This guide describes Gaziemir without overselling it: what it offers, what it does not, and who it suits.",
      },
      { type: "h2", text: "Where is Gaziemir and what is it like?" },
      {
        type: "p",
        text: "Gaziemir is a central district in the south of Izmir. Its population was about 136,930 at the 2024 census. Until 1965 the district was known as Seydiköy, a name locals still use. It is not far from Konak or Alsancak, yet it works as its own place, with housing and industry sitting side by side.",
      },
      {
        type: "p",
        text: "One concrete fact sets Gaziemir apart from other Izmir districts: Adnan Menderes Airport, the Aegean Free Zone, Fuar İzmir and an air training base all fall within its boundaries. That brings constant movement and employment to the area.",
      },
      { type: "h2", text: "Transport: the district's strongest card" },
      {
        type: "p",
        text: "What makes transport strong in Gaziemir is that you are not tied to a single option. Commuter rail, motorway and airport are all within reach.",
      },
      {
        type: "list",
        items: [
          "İZBAN: The commuter rail line runs through the district. Sarnıç and Gaziemir stations reach Alsancak and Konak without entering traffic, which makes the morning journey far more predictable than driving.",
          "Adnan Menderes Airport: Inside the district. For a frequent flyer this is an advantage no other part of Izmir offers.",
          "Motorway links: Connections towards Aydın and the Izmir ring road are close, so leaving the city is quick.",
          "Aegean Free Zone and industry: For someone working in the district, the commute is often under ten minutes.",
        ],
      },
      {
        type: "quote",
        text: "Most people who choose Gaziemir decide after losing two hours in traffic on a single day.",
      },
      { type: "h2", text: "Shopping and daily life" },
      {
        type: "p",
        text: "Gaziemir is largely self-sufficient for daily needs. Optimum Outlet Center is the best-known retail destination, combining cinema, supermarket and dining. Around Akçay Avenue, furniture and textile workshops and showrooms are concentrated — an address anyone shopping for furniture in Izmir knows.",
      },
      {
        type: "p",
        text: "Street markets, supermarket chains, bank branches and health facilities are spread across the district, so there is no need to travel into the city centre for everyday errands.",
      },
      {
        type: "image",
        src: "/renders/carsi-yaya.jpg",
        alt: "A pedestrian arcade in Gaziemir with a supermarket, café and shops",
        caption: "In newer projects the arcade moves inside the development: no car needed for daily needs.",
      },
      { type: "h2", text: "Nature and green space" },
      {
        type: "p",
        text: "In the Sarnıç neighbourhood there is a pond ringed by pine trees, used by residents for walking and picnicking. Contrary to the district's industrial image, this side of Gaziemir is quiet and green. The southern and western parts are generally lower-density, with gardens.",
      },
      { type: "h2", text: "Sarnıç: the growing side of the district" },
      {
        type: "p",
        text: "Sarnıç has drawn the most residential investment in Gaziemir in recent years. The reason is simple: an İZBAN station, proximity to the airport and land still available for development, all in one place. Older detached houses and new residential projects stand side by side. That transition can work for a buyer or against one — construction activity will continue in the area for some time.",
      },
      { type: "h2", text: "Who does Gaziemir suit?" },
      {
        type: "list",
        items: [
          "Frequent travellers: With the airport minutes away, catching a flight stops being stressful.",
          "People working in the district or the free zone: A short commute and low daily travel cost.",
          "First-time buyers: Prices per square metre tend to be more accessible than in Izmir's central districts.",
          "Rail commuters: İZBAN lets you build a daily routine that does not depend on traffic.",
          "Those seeking quiet: The Sarnıç side is away from the density of the central districts.",
        ],
      },
      { type: "h2", text: "And who does it not suit?" },
      {
        type: "p",
        text: "To be honest: if your life revolves around Alsancak's nightlife, Karşıyaka's seafront walks or Bornova's university scene, Gaziemir will feel far away. Part of the district has an industrial character, which is not a neighbourhood everyone wants. Which neighbourhood a home sits in matters a great deal here.",
      },
      { type: "h2", text: "What to check when looking for a home in Gaziemir" },
      {
        type: "list",
        items: [
          "Neighbourhood differences: Gaziemir is not uniform. Sarnıç and the district centre have very different characters. Visit both in the morning and in the evening.",
          "Distance to İZBAN: The gap between a walk and a ten-minute drive is a large one in daily life.",
          "Build year and seismic code: Izmir is a first-degree seismic zone. Compliance with the post-2018 code matters.",
          "Parking: On-street parking can be a problem; covered parking pays off over time.",
          "Surrounding construction: Your view and your noise level may change within a few years — ask about neighbouring plots.",
        ],
      },
      { type: "h2", text: "In summary" },
      {
        type: "p",
        text: "Gaziemir is not a showy district; its strength is practicality. Airport, rail, motorway and employment are gathered in one place. For someone who would rather not build daily life around traffic, Gaziemir is a sensible choice — and Sarnıç is where those advantages are still available at accessible prices.",
      },
      {
        type: "p",
        text: "Loft 777 rises where those advantages meet, in Gaziemir Sarnıç: 800 m from the İZBAN Sarnıç stop, nine minutes by car from the airport, a 237-unit mixed-use project with its own arcade on the ground floor.",
      },
    ],
    faq: [
      {
        q: "Where is Gaziemir in Izmir?",
        a: "Gaziemir is a central district in the south of Izmir. Adnan Menderes Airport, the Aegean Free Zone and Fuar İzmir all lie within its boundaries. Konak and Alsancak are reached by the İZBAN commuter rail line or by road.",
      },
      {
        q: "What is the population of Gaziemir?",
        a: "At the 2024 census the population of Gaziemir was about 136,930. Until 1965 the district was known as Seydiköy.",
      },
      {
        q: "Is Gaziemir a good place to live?",
        a: "It suits frequent travellers, people working in the district or the free zone, rail commuters, and buyers looking for more accessible prices than the central districts. If your life centres on the seafront and nightlife, however, Gaziemir will feel remote.",
      },
      {
        q: "How do you get from Gaziemir to central Izmir?",
        a: "The İZBAN commuter rail line runs through the district and reaches Alsancak without entering traffic. By road, central Izmir (Konak) is about 22 minutes away, longer in heavy traffic.",
      },
      {
        q: "What is Sarnıç like?",
        a: "Sarnıç has attracted the most residential investment in Gaziemir in recent years, combining an İZBAN station, airport proximity and land open to development. Its pine-ringed pond is used for walking and picnicking. Construction activity in the area will continue for some time.",
      },
    ],
  },

  {
    slug: "izmir-yatirimlik-daire-rehberi",
    keyword: "buying property izmir",
    category: "Guide",
    title: "Buying an Apartment in Izmir: 9 Things to Check",
    description:
      "What should you check when buying off-plan in Izmir? Building permit, seismic code, delivery guarantees, payment terms and location criteria — a practical checklist.",
    excerpt:
      "Buying off-plan is not the same as buying a finished home. Which nine points should you check when assessing a building that exists only on paper?",
    hero: "/renders/dis-cephe-cadde.jpg",
    date: "2026-08-19",
    updated: "2026-08-19",
    readingMin: 8,
    blocks: [
      {
        type: "p",
        text: "Buying off-plan is not the same as viewing a finished home and buying it. There is no building yet — only a promise, a drawing and a contract. That changes what you need to look at. The nine points below are the concrete questions to ask when assessing a residential project in Izmir.",
      },
      {
        type: "p",
        text: "Note: this is a general checklist, not investment advice. We recommend having your contract reviewed by a lawyer before you decide.",
      },
      { type: "h2", text: "1. Is there a building permit?" },
      {
        type: "p",
        text: "This is the first question. A building permit shows the project has municipal approval. Projects marketed without one carry a high delivery risk. Ask for the permit number and date; you can confirm it with the municipality.",
      },
      { type: "h2", text: "2. Which seismic code is it built to?" },
      {
        type: "p",
        text: "Izmir is a first-degree seismic zone, as the 2020 earthquake painfully reminded everyone. The Turkish Building Earthquake Code that came into force in 2018 (TBDY 2018) is markedly stricter than its predecessors. Get written confirmation that the project was designed to it, and ask to see the ground survey report.",
      },
      { type: "h2", text: "3. Net or gross square metres?" },
      {
        type: "p",
        text: "Listings usually quote gross area, but the space you live in is net. The gap can reach twenty per cent. Ask for the floor plan and check each room. Also ask whether the quoted area includes balconies, voids or a share of common areas.",
      },
      {
        type: "quote",
        text: "If one apartment says 90 m² and another says 82 m², only the floor plan will tell you which one actually feels larger.",
      },
      { type: "h2", text: "4. Is the delivery date in the contract?" },
      {
        type: "p",
        text: "A verbally promised date means nothing. The contract should carry a firm date and a penalty clause for delay. A contract without delay compensation puts the risk entirely on the buyer.",
      },
      { type: "h2", text: "5. What do the payment terms really say?" },
      {
        type: "list",
        items: [
          "Is the deposit amount and its due date clearly stated?",
          "Is the instalment plan genuinely interest-free, or is a cost built into the price? Ask for the cash price and the instalment total side by side.",
          "Is there a discount for paying in full, and at what rate?",
          "Is there any clause allowing the price to be increased?",
          "Is the payment schedule tied to construction milestones or to fixed dates?",
        ],
      },
      { type: "h2", text: "6. What is the developer's track record?" },
      {
        type: "p",
        text: "Ask about projects the company has completed, and go and see them if you can. Better still, talk to the people living there. Was delivery on time? Were defects fixed? Was the handover to the residents' management handled properly? No brochure will tell you this.",
      },
      { type: "h2", text: "7. Visit the location at two different times" },
      {
        type: "p",
        text: "Do not view the project only at midday on a weekday. Go at the morning rush and again in the evening. Traffic, noise and parking reveal themselves at those hours. Measure the quoted journey times in your own car.",
      },
      { type: "h2", text: "8. What is on the neighbouring plots — and what will be?" },
      {
        type: "p",
        text: "Today's view may not be tomorrow's. Check the zoning status of neighbouring plots with the municipality. In developing areas in particular, the empty lot in front of you may well be built on within a few years.",
      },
      { type: "h2", text: "9. Common areas and service charges" },
      {
        type: "p",
        text: "A pool, gym, security and landscaping all look good, and all cost money to run — money you pay through the monthly service charge. Ask for the estimated charge. Check too how common areas are defined in the management plan: do the commercial units on site contribute?",
      },
      { type: "h2", text: "A short checklist" },
      {
        type: "list",
        items: [
          "Have you obtained the building permit number?",
          "Is TBDY 2018 compliance confirmed in writing?",
          "Do you have the floor plan and net area?",
          "Does the contract state a delivery date and a delay penalty?",
          "Have you compared the cash and instalment totals side by side?",
          "Have you seen the developer's previous projects?",
          "Have you visited the location at two different times of day?",
          "Have you checked the zoning status of neighbouring plots?",
          "Do you know the estimated service charge?",
        ],
      },
      { type: "h2", text: "In summary" },
      {
        type: "p",
        text: "Buying off-plan is a manageable process when the right questions are asked. What reduces risk is not good instinct but written documents: the permit, the contract, the floor plan and the technical specification. Do not sign before you have seen them.",
      },
      {
        type: "p",
        text: "For Loft 777 we publish the answers openly: the project data sheet, the real room dimensions of each apartment type, the build and systems detail and the payment terms are all set out in writing on this site.",
      },
    ],
    faq: [
      {
        q: "What should I check first when buying off-plan?",
        a: "The building permit. It shows the project has municipal approval and materially reduces delivery risk. Ask for the permit number and confirm it with the municipality.",
      },
      {
        q: "What is TBDY 2018 and why does it matter?",
        a: "TBDY 2018 is the Turkish Building Earthquake Code that came into force in 2018. It sets stricter design and calculation rules than earlier codes. Because Izmir is a first-degree seismic zone, it matters that a home was designed to this code.",
      },
      {
        q: "What is the difference between net and gross square metres?",
        a: "Gross area includes walls, balconies and a share of common areas; net area is the space you actually use. The gap can reach twenty per cent. When comparing projects, ask each of them for the same measure.",
      },
      {
        q: "How do I know whether instalments are genuinely interest-free?",
        a: "Ask for the cash price and the instalment total side by side. Any difference between them is a financing cost built into the price. With a genuinely interest-free plan, the two totals should match.",
      },
      {
        q: "What should I ask about service charges?",
        a: "Ask for the estimated monthly charge, what it covers, and whether the commercial units on site contribute to it. Pools, gyms and security all carry running costs that feed into the charge.",
      },
    ],
  },

  {
    slug: "izban-sarnic-ulasim-rehberi",
    keyword: "izban sarnic station",
    category: "Transport",
    title: "İZBAN Sarnıç Station: Reaching Izmir From Gaziemir Without Traffic",
    description:
      "Where is İZBAN Sarnıç station, which stops are on the line and how far is Alsancak? A guide to commuting from Sarnıç — one stop from the airport.",
    excerpt:
      "Sarnıç is the stop before the airport station. Nine stops to Alsancak and two metro interchanges. What does living on a rail line actually mean?",
    hero: "/renders/hava-carsi.jpg",
    date: "2026-08-19",
    updated: "2026-08-19",
    readingMin: 6,
    blocks: [
      {
        type: "p",
        text: "One question worth asking when choosing a home in Izmir: will you be forced into traffic to get to work? If the answer is yes, part of your day becomes a gamble every morning. Rail removes that uncertainty — a train takes the same time at eight in the morning as it does at noon. This guide covers commuting from Gaziemir Sarnıç on the İZBAN line.",
      },
      { type: "h2", text: "What is İZBAN?" },
      {
        type: "p",
        text: "İZBAN is Izmir's commuter rail system. The line runs from Aliağa in the north to Selçuk in the south, is roughly 136 kilometres long and has 40 stations. It is not a metro but a suburban railway: stops are further apart and distances greater. It is the most practical way to cross Izmir without entering traffic.",
      },
      { type: "h2", text: "Where does Sarnıç sit on the line?" },
      {
        type: "p",
        text: "On the southern arm of the line, running from north to south, the stations are: Şirinyer, Koşu, İnkılap, Semt Garajı, Esbaş, Gaziemir, Sarnıç, Adnan Menderes Airport, Cumaovası, Develi, Tekeli and onward.",
      },
      {
        type: "p",
        text: "The detail worth noting: Sarnıç is the station immediately before Adnan Menderes Airport. From Sarnıç the airport is a single stop away by train — no taxi with luggage, no hunting for parking, no traffic.",
      },
      {
        type: "quote",
        text: "One stop from Sarnıç to the airport. Very few neighbourhoods in Izmir can say that.",
      },
      { type: "h2", text: "How many stops to the city centre?" },
      {
        type: "p",
        text: "Heading north from Sarnıç towards Alsancak you pass Gaziemir, Esbaş, Semt Garajı, İnkılap, Koşu, Şirinyer, Kemer and Hilal; Alsancak is the ninth station. Konak lies close to Alsancak and is reached on foot or with a short connection.",
      },
      { type: "h2", text: "Where do you change for the metro?" },
      {
        type: "p",
        text: "You can transfer to the Izmir Metro at Halkapınar and Hilal stations. That means a passenger heading towards Bornova or Fahrettin Altay can cross the city end to end on rail.",
      },
      { type: "h2", text: "Frequency and hours" },
      {
        type: "p",
        text: "Trains run at regular intervals through the day and more frequently at peak times. The first services start early in the morning and the last run close to midnight. Timetables are revised periodically, so check İZBAN's official sources for current times — quoting a fixed schedule here would be misleading.",
      },
      { type: "h2", text: "Who does it really help?" },
      {
        type: "list",
        items: [
          "People working in the city centre: the same journey time every day, without the morning traffic.",
          "Frequent flyers: one stop to the airport. On an early flight, that is sleep.",
          "Students: rail access to the Bornova campuses via the metro interchange.",
          "One-car households: one person keeps the car, the other takes the train.",
          "Anyone who would rather not drive: parking, fuel and traffic stress out of the equation.",
        ],
      },
      { type: "h2", text: "Why living near the station matters" },
      {
        type: "p",
        text: "Rail only helps if you can reach the station easily. A home ten minutes' drive from the station makes the train awkward in practice: you have to park, and collect the car later. A home within walking distance turns the train into a daily habit. So when looking at homes in Gaziemir, it is worth asking for the distance to the station in metres.",
      },
      {
        type: "p",
        text: "Loft 777 is 800 metres from İZBAN Sarnıç station. The airport is nine minutes away by car — and a single stop by train from Sarnıç.",
      },
    ],
    faq: [
      {
        q: "Where is İZBAN Sarnıç station?",
        a: "Sarnıç station is in the Gaziemir district of Izmir, on the southern arm of the İZBAN line. Gaziemir station lies to its north and Adnan Menderes Airport station to its south.",
      },
      {
        q: "How do you get from Sarnıç to the airport?",
        a: "One stop on İZBAN. Sarnıç is the station immediately before Adnan Menderes Airport, so a southbound train reaches the airport at the next station.",
      },
      {
        q: "How many stops from Sarnıç to Alsancak?",
        a: "Heading north from Sarnıç you pass Gaziemir, Esbaş, Semt Garajı, İnkılap, Koşu, Şirinyer, Kemer and Hilal; Alsancak is the ninth station.",
      },
      {
        q: "Where can you change from İZBAN to the metro?",
        a: "Transfers to the Izmir Metro are possible at Halkapınar and Hilal stations.",
      },
      {
        q: "Where does the İZBAN line run?",
        a: "İZBAN is a commuter rail line running about 136 kilometres from Aliağa in the north to Selçuk in the south, with 40 stations along the route.",
      },
    ],
  },
];

// ── Erişim yardımcıları ─────────────────────────────────────────
export function getBlogPosts(locale: Locale): BlogPost[] {
  return locale === "en" ? POSTS_EN : POSTS_TR;
}

export function getBlogPost(locale: Locale, slug: string): BlogPost | undefined {
  return getBlogPosts(locale).find((p) => p.slug === slug);
}

// Statik üretim için tüm slug'lar (dil bağımsız — aynı slug'lar)
export function allBlogSlugs(): string[] {
  return POSTS_TR.map((p) => p.slug);
}
