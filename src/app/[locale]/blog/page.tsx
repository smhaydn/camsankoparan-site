import { SEGMENTS } from "@/lib/dict";
import { isLocale, path, type Locale } from "@/lib/i18n";
import { getBlogPosts, getBlogUI } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { CoverImage } from "@/components/site/cover-image";
import type { Metadata } from "next";

const BASE = "https://camsankoparan.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = getBlogUI(locale);
  const seg = `/${SEGMENTS.blog}`;
  return {
    title: { absolute: `${ui.title} | Loft 777` },
    description: ui.intro,
    alternates: {
      canonical: `/${locale}${seg}`,
      languages: { tr: `/tr${seg}`, en: `/en${seg}`, "x-default": `/tr${seg}` },
    },
    openGraph: {
      type: "website",
      siteName: "Loft 777",
      url: `${BASE}/${locale}${seg}`,
      title: ui.title,
      description: ui.intro,
      locale: locale === "tr" ? "tr_TR" : "en_US",
    },
  };
}

// Tarihi okunur biçime çevir (TR/EN)
function fmtDate(iso: string, locale: Locale) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ui = getBlogUI(locale);
  const posts = getBlogPosts(locale);

  return (
    <main>
      <PageHero
        kicker={ui.kicker}
        title={ui.title}
        intro={ui.intro}
        image="/renders/dis-cephe-gunbatimi.jpg"
      />

      <section className="paper bg-paper py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => {
              const href = path(locale, `${SEGMENTS.blog}/${post.slug}`);
              return (
                <Reveal key={post.slug} delay={i * 0.08}>
                  <Link
                    href={href}
                    className="group flex h-full flex-col overflow-hidden border border-line bg-card transition-colors duration-500 hover:bg-sand"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <CoverImage
                        src={post.hero}
                        alt={post.title}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-bronze/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-onaccent">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <div className="mb-3 flex items-center gap-3 text-xs text-muted">
                        <span>{fmtDate(post.date, locale)}</span>
                        <span className="h-1 w-1 rounded-full bg-bronze" />
                        <span>
                          {post.readingMin} {ui.readSuffix}
                        </span>
                      </div>
                      <h2 className="font-display text-xl font-medium leading-snug text-base transition group-hover:text-bronze lg:text-2xl">
                        {post.title}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                        {post.excerpt}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-bronze transition-all group-hover:gap-3">
                        {locale === "tr" ? "Okumaya başla" : "Read article"}{" "}
                        <span>→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
