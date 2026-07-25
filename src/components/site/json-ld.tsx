// Yapısal veri (schema.org JSON-LD) — Google'a firma + proje + konum + SSS bilgisini makine diliyle anlatır.
const BASE = "https://camsankoparan.com";

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Dokuz Eylül Mah. 694 Sok. No:5",
  addressLocality: "Gaziemir",
  addressRegion: "İzmir",
  postalCode: "35410",
  addressCountry: "TR",
};

export function JsonLd({
  locale = "tr",
  faq,
}: {
  locale?: string;
  faq?: { q: string; a: string }[];
}) {
  const home = `${BASE}/${locale}`;
  const projectUrl = `${BASE}/${locale}/projects/loft-777`;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Camsan Koparan Group A.Ş.",
    url: BASE,
    logo: `${BASE}/icon.png`,
    telephone: "+902322377237",
    email: "info@camsankoparan.com",
    address: ADDRESS,
  };

  const project = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: "Loft 777",
    description:
      "İzmir Gaziemir'de çarşısı, açık yüzme havuzu ve modern 1+1 loft/dubleks daireleriyle yeni nesil karma yaşam projesi.",
    url: projectUrl,
    image: `${BASE}/opengraph-image.png`,
    numberOfAccommodationUnits: 237,
    address: ADDRESS,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.31779893739998,
      longitude: 27.144827354238817,
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "en" ? "Home" : "Ana Sayfa", item: home },
      { "@type": "ListItem", position: 2, name: "Loft 777", item: projectUrl },
    ],
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

  const blocks = [organization, project, breadcrumb, faqLd].filter(Boolean);

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
