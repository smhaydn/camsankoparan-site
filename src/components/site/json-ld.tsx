// Yapısal veri (schema.org JSON-LD) — Google'a firma + proje bilgisini makine diliyle anlatır.
const BASE = "https://camsankoparan.com";

export function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Camsan Koparan Group A.Ş.",
    url: BASE,
    logo: `${BASE}/icon.png`,
    telephone: "+902322377237",
    email: "info@camsankoparan.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dokuz Eylül Mah. 694 Sok. No:5",
      addressLocality: "Gaziemir",
      addressRegion: "İzmir",
      addressCountry: "TR",
    },
  };

  const project = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: "Loft 777",
    description:
      "İzmir Gaziemir'de çarşısı, yüzme havuzu ve modern 1+1 daireleriyle yeni nesil karma yaşam projesi.",
    url: BASE,
    image: `${BASE}/opengraph-image.png`,
    numberOfAccommodationUnits: 238,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dokuz Eylül Mah. 694 Sok. No:5",
      addressLocality: "Gaziemir",
      addressRegion: "İzmir",
      addressCountry: "TR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(project) }}
      />
    </>
  );
}
