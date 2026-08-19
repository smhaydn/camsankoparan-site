// Yapısal veri (schema.org JSON-LD) — Google'a ve yapay zekâ arama motorlarına
// firma + proje + konum + daire tipleri bilgisini makine diliyle anlatır.
//
// SAYFAYA ÖZEL: önceden her sayfa birebir aynı bloğu basıyordu; hiçbir sayfa
// kendini ayrıştıramıyordu. Artık her sayfa kendi yol izini ve kendi varlığını
// bildiriyor.
//
// ⚠️ SSS işaretlemesi YALNIZCA SSS'in ekranda göründüğü sayfada basılır.
// Google, görünmeyen içeriğin işaretlenmesini kural ihlali sayıyor.

const BASE = "https://camsankoparan.com";

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Dokuz Eylül Mah. 694 Sok. No:5",
  addressLocality: "Gaziemir",
  addressRegion: "İzmir",
  postalCode: "35410",
  addressCountry: "TR",
};

const GEO = {
  "@type": "GeoCoordinates",
  latitude: 38.31779893739998,
  longitude: 27.144827354238817,
};

export type JsonLdPage =
  | "home"
  | "about"
  | "projects"
  | "project"
  | "services"
  | "contact"
  | "legal";

const CRUMB: Record<Exclude<JsonLdPage, "home" | "legal">, { tr: string; en: string; path: string }> = {
  about: { tr: "Proje Hakkında", en: "About the Project", path: "/about" },
  projects: { tr: "Daireler", en: "Apartments", path: "/projects" },
  project: { tr: "Loft 777", en: "Loft 777", path: "/projects/loft-777" },
  services: { tr: "Neden Loft 777", en: "Why Loft 777", path: "/services" },
  contact: { tr: "İletişim", en: "Contact", path: "/contact" },
};

export function JsonLd({
  locale = "tr",
  page = "home",
  faq,
}: {
  locale?: string;
  /** Sayfa türü — hangi blokların basılacağını belirler */
  page?: JsonLdPage;
  /** SADECE SSS ekranda görünüyorsa gönderilmeli */
  faq?: { q: string; a: string }[];
}) {
  const en = locale === "en";
  const home = `${BASE}/${locale}`;
  const projectUrl = `${BASE}/${locale}/projects/loft-777`;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "Camsan Koparan Group A.Ş.",
    alternateName: "Camsan Koparan Group",
    url: BASE,
    logo: `${BASE}/icon.png`,
    image: `${BASE}/og/home.jpg`,
    telephone: "+902322377237",
    email: "info@camsankoparan.com",
    address: ADDRESS,
    areaServed: { "@type": "City", name: "İzmir" },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: "Loft 777",
    publisher: { "@id": `${BASE}/#organization` },
    inLanguage: en ? "en" : "tr",
  };

  const project = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    "@id": `${BASE}/#loft777`,
    name: "Loft 777",
    description: en
      ? "A new-generation mixed-use project in Izmir Gaziemir with a ground-floor arcade, outdoor pool and modern 1+1 loft/duplex apartments."
      : "İzmir Gaziemir'de çarşısı, açık yüzme havuzu ve modern 1+1 loft/dubleks daireleriyle yeni nesil karma yaşam projesi.",
    url: projectUrl,
    image: `${BASE}/og/home.jpg`,
    numberOfAccommodationUnits: 237,
    address: ADDRESS,
    geo: GEO,
    hasMap: `https://www.google.com/maps?q=${GEO.latitude},${GEO.longitude}`,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: en ? "Outdoor swimming pool" : "Açık yüzme havuzu", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "Fitness centre" : "Spor salonu", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "Covered car park" : "Kapalı otopark", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "24/7 security" : "7/24 güvenlik", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "On-site retail arcade" : "Site içi çarşı", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "Children's playground" : "Çocuk oyun alanı", value: true },
    ],
  };

  // Daire tipleri — gerçek ölçülerle. "82 m² loft daire" gibi sorgularda
  // ve yapay zekâ yanıtlarında bu blok okunur.
  const units = [
    {
      "@context": "https://schema.org",
      "@type": "Apartment",
      name: en ? "1+1 Loft — Loft 777" : "1+1 Loft — Loft 777",
      description: en
        ? "A 1+1 loft apartment with a 5.5 m double-height living room and a 19.02 m² void."
        : "Salonu 5,5 metre çift yükseklikte, 19,02 m² galeri boşluklu 1+1 loft daire.",
      url: `${BASE}/${locale}/projects`,
      numberOfRooms: 2,
      numberOfBathroomsTotal: 1,
      floorSize: { "@type": "QuantitativeValue", value: 82, unitCode: "MTK" },
      containedInPlace: { "@id": `${BASE}/#loft777` },
      address: ADDRESS,
    },
    {
      "@context": "https://schema.org",
      "@type": "Apartment",
      name: en ? "1+1 Duplex — Loft 777" : "1+1 Dubleks — Loft 777",
      description: en
        ? "A two-storey 1+1 duplex apartment with living areas and bedroom on separate floors."
        : "Yaşam alanı ve yatak odası ayrı katlarda olan iki katlı 1+1 dubleks daire.",
      url: `${BASE}/${locale}/projects`,
      numberOfRooms: 2,
      numberOfBathroomsTotal: 1,
      floorSize: { "@type": "QuantitativeValue", value: 49, unitCode: "MTK" },
      containedInPlace: { "@id": `${BASE}/#loft777` },
      address: ADDRESS,
    },
  ];

  // Satış noktası — çalışma saatleriyle. Yerel aramalarda ve harita
  // sonuçlarında işe yarar.
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${BASE}/#salesoffice`,
    name: "Camsan Koparan Group — Loft 777",
    url: `${BASE}/${locale}/contact`,
    image: `${BASE}/og/contact.jpg`,
    telephone: "+902322377237",
    email: "info@camsankoparan.com",
    address: ADDRESS,
    geo: GEO,
    hasMap: `https://www.google.com/maps?q=${GEO.latitude},${GEO.longitude}`,
    parentOrganization: { "@id": `${BASE}/#organization` },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
  };

  const crumbItems: Record<string, unknown>[] = [
    { "@type": "ListItem", position: 1, name: en ? "Home" : "Ana Sayfa", item: home },
  ];
  if (page !== "home" && page !== "legal") {
    const c = CRUMB[page];
    crumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: en ? c.en : c.tr,
      item: `${BASE}/${locale}${c.path}`,
    });
  }
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbItems,
  };

  const faqLd =
    faq && faq.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  // Sayfa türüne göre blok seçimi
  const blocks: unknown[] = [organization, website, breadcrumb];
  if (page === "home" || page === "about" || page === "services" || page === "project") {
    blocks.push(project);
  }
  if (page === "projects") {
    blocks.push(project, ...units);
  } else if (page === "project") {
    blocks.push(...units);
  }
  if (page === "contact") blocks.push(localBusiness);
  if (faqLd) blocks.push(faqLd);

  return (
    <>
      {blocks.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }}
        />
      ))}
    </>
  );
}
