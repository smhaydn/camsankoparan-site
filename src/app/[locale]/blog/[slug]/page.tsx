// 20 Agu 2026: sayfa ISR ile onbellege alinir.
// Vercel ucretsiz islemci kotasi doldu; asilirsa TUM projeler duraklatiliyor
// (pixra.co dahil, ayni hesapta). Bu site kotanin %14unu yiyordu ve sebebi
// trafik degildi: her ziyarette sayfa sifirdan uretiliyordu (canlida olculdu,
// x-vercel-cache uc kez ust uste MISS).
// Icerik ve ayarlar artik etiketli onbellekten okunuyor; panelden kayit
// yapilinca revalidateTag ANINDA tazeliyor (bkz. api/admin/content ve
// api/admin/settings). Yani "panelde degisince aninda yansisin" davranisi
// korunuyor, bedeli her ziyaretciye odetilmiyor.
export const revalidate = 3600;

import { SEGMENTS } from "@/lib/dict";
import { isLocale, path, locales, type Locale } from "@/lib/i18n";
import {
  getBlogPost,
  getBlogPosts,
  getBlogUI,
  getAuthor,
  allBlogSlugs,
  type BlogBlock,
} from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { CoverImage } from "@/components/site/cover-image";
import type { Metadata } from "next";

const BASE = "https://camsankoparan.com";

// Statik üretim — tüm dil × slug kombinasyonları
export function generateStaticParams() {
  const out: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of allBlogSlugs()) out.push({ locale, slug });
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = getBlogPost(locale, slug);
  if (!post) return {};
  const seg = `/${SEGMENTS.blog}/${slug}`;
  return {
    title: { absolute: post.title },
    description: post.description,
    alternates: {
      canonical: `/${locale}${seg}`,
      languages: { tr: `/tr${seg}`, en: `/en${seg}`, "x-default": `/tr${seg}` },
    },
    openGraph: {
      type: "article",
      siteName: "Loft 777",
      url: `${BASE}/${locale}${seg}`,
      title: post.title,
      description: post.description,
      images: [{ url: `${BASE}${post.hero}` }],
      locale: locale === "tr" ? "tr_TR" : "en_US",
      publishedTime: post.date,
    },
  };
}

function fmtDate(iso: string, locale: Locale) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Tek içerik bloğunu render eder
function Block({ b }: { b: BlogBlock }) {
  switch (b.type) {
    case "h2":
      return (
        <h2 className="mt-14 mb-5 font-display text-2xl font-medium text-base lg:text-3xl">
          {b.text}
        </h2>
      );
    case "p":
      return <p className="mt-5 text-lg leading-relaxed text-muted">{b.text}</p>;
    case "list":
      return (
        <ul className="mt-6 space-y-3">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-lg leading-relaxed text-muted">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "image":
      return (
        <figure className="mt-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
            <CoverImage src={b.src} alt={b.alt} sizes="(max-width: 768px) 100vw, 768px" />
          </div>
          {b.caption && (
            <figcaption className="mt-3 text-center text-sm text-muted">
              {b.caption}
            </figcaption>
          )}
        </figure>
      );
    case "quote":
      return (
        <blockquote className="my-12 border-l-2 border-bronze pl-6">
          <p className="font-display text-xl font-light italic leading-relaxed text-base lg:text-2xl">
            {b.text}
          </p>
        </blockquote>
      );
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = getBlogPost(locale, slug);
  if (!post) notFound();
  const ui = getBlogUI(locale);

  const author = getAuthor(locale);
  const related = getBlogPosts(locale)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const pageUrl = `${BASE}/${locale}/${SEGMENTS.blog}/${slug}`;

  // JSON-LD (Article) — Google zengin sonuç + E-E-A-T sinyalleri
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${BASE}${post.hero}`,
    datePublished: post.date,
    dateModified: post.updated,
    author: {
      "@type": "Organization",
      name: author.name,
      description: author.bio,
      url: `${BASE}/${locale}/${SEGMENTS.about}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Camsan Koparan Group",
      logo: { "@type": "ImageObject", url: `${BASE}/renders/dis-cephe-genel.jpg` },
    },
    mainEntityOfPage: pageUrl,
    inLanguage: locale,
  };

  // JSON-LD (FAQPage) — GEO / AI arama ve featured snippet için kritik
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Kapak */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-ink pb-14 pt-40">
        <div className="absolute inset-0">
          <CoverImage src={post.hero} alt={post.title} priority sizes="100vw" className="kenburns" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/45" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 lg:px-10">
          <Link
            href={path(locale, SEGMENTS.blog)}
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-bronze"
          >
            {ui.backToBlog}
          </Link>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-bronze px-3 py-1 text-[11px] font-semibold tracking-wide text-onaccent">
              {post.category}
            </span>
            <span className="text-xs text-white/70">
              {fmtDate(post.date, locale)} · {post.readingMin} {ui.readSuffix}
            </span>
          </div>
          <h1 className="font-display text-3xl font-light leading-tight text-white lg:text-5xl">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Gövde */}
      <section className="bg-surface py-16 lg:py-20">
        <article className="mx-auto max-w-3xl px-6 lg:px-10">
          <p className="border-b border-line pb-8 text-xl font-light leading-relaxed text-base">
            {post.excerpt}
          </p>
          {post.blocks.map((b, i) => (
            <Block key={i} b={b} />
          ))}

          {/* SSS — Google'ın sorduğu sorulara net cevaplar (FAQPage schema ile eşleşir) */}
          {post.faq.length > 0 && (
            <div className="mt-16 border-t border-line pt-12">
              <h2 className="mb-8 font-display text-2xl font-medium text-base lg:text-3xl">
                {ui.faqTitle}
              </h2>
              <div className="divide-y divide-line">
                {post.faq.map((f, i) => (
                  <details key={i} className="group py-5" open={i === 0}>
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-medium text-base marker:content-none">
                      {f.q}
                      <span className="shrink-0 text-bronze transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Yazar / yayıncı — E-E-A-T otorite sinyali */}
          <div className="mt-14 flex gap-5 rounded-sm border border-line bg-surface-2 p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-bronze font-display text-lg font-semibold text-onaccent">
              CK
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-bronze">
                {ui.aboutAuthor}
              </div>
              <div className="mt-1 font-display text-lg font-medium text-base">
                {author.name}
              </div>
              <div className="text-sm text-muted">{author.role}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{author.bio}</p>
              <Link
                href={path(locale, SEGMENTS.projects)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-bronze transition hover:gap-2"
              >
                {ui.projectLink}
              </Link>
            </div>
          </div>
        </article>
      </section>

      {/* CTA — projeye yönlendir */}
      <section className="paper bg-sand py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Reveal>
            <div className="mb-4 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-bronze" />
              <span className="kicker text-bronze">Loft 777</span>
              <span className="h-px w-10 bg-bronze" />
            </div>
            <h2 className="font-display text-3xl font-light text-base lg:text-4xl">
              {ui.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{ui.ctaText}</p>
            <Link
              href={path(locale, SEGMENTS.contact)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-bronze px-8 py-3 text-sm font-semibold text-onaccent transition hover:gap-3"
            >
              {ui.ctaButton} <span>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* İlgili yazılar */}
      {related.length > 0 && (
        <section className="bg-surface-2 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-10 flex items-center gap-4">
              <span className="h-px w-10 bg-bronze" />
              <span className="kicker text-bronze">{ui.related}</span>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {related.map((rp, i) => (
                <Reveal key={rp.slug} delay={i * 0.08}>
                  <Link
                    href={path(locale, `${SEGMENTS.blog}/${rp.slug}`)}
                    className="group flex overflow-hidden border border-line bg-card transition-colors duration-500 hover:bg-sand"
                  >
                    <div className="relative aspect-square w-32 shrink-0 overflow-hidden sm:w-44">
                      <CoverImage
                        src={rp.hero}
                        alt={rp.title}
                        sizes="(max-width: 640px) 128px, 176px"
                        className="transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-5">
                      <span className="text-xs text-bronze">{rp.category}</span>
                      <h3 className="mt-2 font-display text-lg font-medium leading-snug text-base transition group-hover:text-bronze">
                        {rp.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
