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
        text: "İzmir Gaziemir'de yükselen Loft 777, adını tam da bu yaşam biçiminden alıyor. Projede zemin katların tamamı loft daire olarak tasarlandı: galeri boşluğu ile birlikte 5,6 metreye ulaşan tavan yüksekliği, açık plan yaşam alanı ve doğal ışığı içeri taşıyan geniş camlar. Merkezi sistem yerden ısıtma ve VRF klima, yüksek hacmin konforunu güvence altına alıyor. Çift cam Low-E argon dolgulu cam sistemi ve 5 cm taş yünü ısı yalıtımı, loft yaşamın en çok merak edilen konusu olan enerji verimliliğini çözüyor.",
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
        a: "Klasik dairelerde tavan yüksekliği genelde 2,7-3 metredir. Loft dairelerde ise galeri boşluğu ile birlikte bu yükseklik 5-6 metreye çıkabilir. Örneğin Loft 777 projesinde loft dairelerin tavan yüksekliği galeri boşluğuyla birlikte 5,6 metredir.",
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
      "Havalimanına 5 dakika, İzban'a yürüme mesafesi... Gaziemir'de satılık daire ararken bölgeyi, fiyatı ve yapıyı değerlendirmenin 10 yolu.",
    hero: "/renders/dis-cephe-cadde.jpg",
    date: "2026-07-28",
    updated: "2026-07-28",
    readingMin: 8,
    blocks: [
      {
        type: "p",
        text: "İzmir'de yatırım ya da oturum için bölge ararken Gaziemir son yılların öne çıkan adreslerinden biri. Havalimanına yakınlığı, İzban ulaşımı ve gelişen çevresiyle hem yatırımcının hem ailenin radarında. Bu yazıda, Gaziemir'de satılık daire ararken dikkat etmeniz gereken 10 başlığı dürüst bir gözle ele alıyoruz.",
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
      { type: "h2", text: "2. Ulaşım: Havalimanı ve İzban avantajı" },
      {
        type: "p",
        text: "Gaziemir'in en güçlü kozu ulaşım. Adnan Menderes Havalimanı arabayla yaklaşık 5 dakika; sık seyahat edenler ve gurbetçiler için bu mesafe paha biçilmez. İzban Sarnıç hattı bölgeyi İzmir merkeze demiryoluyla bağlıyor — İzban durağına yürüme mesafesindeki bir konut, günlük ulaşımı trafiğe bağımlı olmaktan çıkarıyor. Otoban çıkışına yakınlık da şehir dışı bağlantıyı kolaylaştırıyor.",
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
        text: "Gaziemir gibi gelişen bir bölgede yatırım getirisini iki kalemde düşünün: kira geliri ve değer artışı. Havalimanı ve İzban yakınlığı, kiralık talebini canlı tutar. Ön satışta alınan bir dairenin teslime kadar değer kazanması ise ikinci getiri kalemidir. Kompakt 1+1 ve loft daireler, giriş bütçesi düşük olduğu için kira/değer çarpanı açısından yatırımcıya avantaj sağlar.",
      },
      { type: "h2", text: "10. Loft 777: Bütün kriterleri bir arada" },
      {
        type: "p",
        text: "İzmir Gaziemir Dokuz Eylül Mahallesi'nde yükselen Loft 777, bu 10 başlığın hemen hepsini karşılayacak şekilde tasarlandı: Havalimanına 5 dakika, İzban Sarnıç durağına yürüme mesafesi. 5 blok, 237 bağımsız bölüm, 1+1 ve 1+1 loft daireler. Yüzme havuzu, fitness, site içi restoran, çocuk oyun alanı ve 4.200 m² yeşil alan. Güncel deprem yönetmeliğine tam uyum, merkezi sistem yerden ısıtma, VRF klima ve akıllı ev altyapısı. %35 peşin ve 18 ay faizsiz vade; peşin ödemede %15 indirim. Teslim tarihi Aralık 2027.",
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
        a: "Gaziemir, Adnan Menderes Havalimanı'na komşu ilçedir; havalimanına araçla yaklaşık 5 dakika mesafededir. Bu yakınlık, sık seyahat edenler ve yurt dışında yaşayan yatırımcılar için önemli bir avantaj sağlar.",
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
      "Five minutes to the airport, walking distance to the rail line. Ten ways to assess the area, the price and the build when buying in Gaziemir.",
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
        text: "Gaziemir's strongest card is transport. Adnan Menderes Airport is around 5 minutes by car; for frequent travellers and expatriates this distance is priceless. The İZBAN Sarnıç line connects the area to central Izmir by rail — a home within walking distance of the İZBAN stop takes daily commuting out of traffic dependence. Proximity to the motorway junction also eases intercity connections.",
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
        text: "Rising in Izmir Gaziemir, Dokuz Eylül district, Loft 777 is designed to meet almost all of these 10 points: 5 minutes to the airport, walking distance to the İZBAN Sarnıç stop. 5 blocks, 237 units, 1+1 and 1+1 loft apartments. A swimming pool, fitness, on-site restaurant, children's play area and 4,200 m² of green space. Full compliance with the current seismic code, central underfloor heating, VRF air conditioning and smart-home infrastructure. 35% down payment and 18 months interest-free instalments; 15% discount on full payment. Delivery in December 2027.",
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
        a: "Gaziemir is the district neighbouring Adnan Menderes Airport; the airport is about 5 minutes away by car. This proximity is a major advantage for frequent travellers and investors living abroad.",
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
