import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMeta(locale, "contact", "/contact");
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getContent(locale);
  const c = d.contactPage;
  const l = d.location;

  const info = [
    { t: c.addressT, v: c.address },
    { t: c.phoneT, v: c.phone },
    { t: c.mailT, v: c.mail },
  ];

  // Gerçek koordinat — jenerik ilçe araması değil
  const mapSrc = `https://www.google.com/maps?q=${l.lat},${l.lng}&z=16&output=embed`;
  const mapLink = `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`;

  return (
    <>
      <JsonLd locale={locale} page="contact" />
    <main>
      <PageHero kicker={c.kicker} title={c.title} intro={c.intro} image="/renders/carsi-yaya.jpg" />

      {/* Bilgiler + form */}
      <section className="paper bg-paper py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div className="flex flex-col gap-7">
            {info.map((i, idx) => (
              <Reveal key={i.t} delay={idx * 0.08}>
                <div className="border-b border-line pb-6">
                  <div className="kicker text-accent">{i.t}</div>
                  <div className="mt-2.5 text-lg leading-snug text-base">{i.v}</div>
                </div>
              </Reveal>
            ))}

            {/* Çalışma saatleri — "gidince açık mı" sorusunun yanıtı */}
            <Reveal delay={0.24}>
              <div className="border-b border-line pb-6">
                <div className="kicker text-accent">{c.hoursT}</div>
                <dl className="mt-3 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[15px] text-base">{c.hoursWeek}</dt>
                    <dd className="data text-sm text-muted">{c.hoursWeekV}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[15px] text-base">{c.hoursSun}</dt>
                    <dd className="data text-sm text-muted">{c.hoursSunV}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>

          {/* Form — talepleri Supabase'e kaydeder */}
          <Reveal delay={0.1}>
            <ContactForm t={c} fb={d.callForm} extra={d.formExtra} />
          </Reveal>
        </div>
      </section>

      {/* ZİYARET & HARİTA — iletişim sayfasında harita yoktu, en temel eksik buydu */}
      <section className="paper bg-sand py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-accent" />
                  <span className="kicker text-accent">{c.visitKicker}</span>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 font-display text-3xl leading-tight font-light text-base lg:text-4xl">
                  {c.visitTitle}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-[46ch] leading-relaxed text-muted">{c.visitBody}</p>
              </Reveal>

              {/* Ulaşım süreleri — Google Maps verisiyle doğrulanmış */}
              <Reveal delay={0.15}>
                <dl className="mt-9 border-t border-line">
                  {l.points.map((p) => (
                    <div
                      key={p.t}
                      className="flex items-baseline justify-between gap-5 border-b border-line py-3"
                    >
                      <dt className="data text-[11px] tracking-[0.16em] text-muted uppercase">{p.t}</dt>
                      <dd className="text-right text-[15px] leading-snug text-base">{p.d}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={0.2}>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold tracking-wide text-accent transition hover:gap-3"
                >
                  {c.routeCta} <span aria-hidden="true">→</span>
                </a>
              </Reveal>
            </div>

            <Reveal delay={0.1} variant="mask">
              <div className="aspect-[4/3] w-full overflow-hidden border border-line lg:aspect-[3/2]">
                <iframe
                  src={mapSrc}
                  title={c.routeT}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full grayscale-[0.35] transition duration-700 hover:grayscale-0"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
