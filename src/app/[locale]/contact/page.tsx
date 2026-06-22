import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/site/contact-form";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getContent(locale);
  const c = d.contactPage;

  const info = [
    { t: c.addressT, v: c.address },
    { t: c.phoneT, v: c.phone },
    { t: c.mailT, v: c.mail },
  ];

  return (
    <main>
      <PageHero
        kicker={c.kicker}
        title={c.title}
        intro={c.intro}
        image="/renders/carsi-cephe.jpg"
      />
      <section className="bg-surface py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:px-10">
          {/* Bilgiler */}
          <div className="flex flex-col gap-7">
            {info.map((i, idx) => (
              <Reveal key={i.t} delay={idx * 0.08}>
                <div className="border-b border-line pb-6">
                  <div className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">
                    {i.t}
                  </div>
                  <div className="mt-2 text-lg text-base">{i.v}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Form — talepleri Supabase'e kaydeder */}
          <Reveal delay={0.1}>
            <ContactForm t={c} fb={d.callForm} extra={d.formExtra} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
