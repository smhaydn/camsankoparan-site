import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { isLocale, locales } from "@/lib/i18n";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Intro } from "@/components/site/intro";
import { CallForm } from "@/components/site/call-form";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { CatalogProvider } from "@/components/site/catalog-provider";
import { PresencePinger } from "@/components/site/presence-pinger";
import { TrackingScripts } from "@/components/site/tracking-scripts";
import { getSettings } from "@/lib/supabase-admin";
import { JsonLd } from "@/components/site/json-ld";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getContent(locale);
  const settings = await getSettings();
  const waMessage =
    locale === "en"
      ? "Hello, I'd like information about Loft 777."
      : "Merhaba, Loft 777 hakkında bilgi almak istiyorum.";
  return (
    <div className="overflow-x-hidden">
      <JsonLd />
      <TrackingScripts
        metaPixelId={settings.meta_pixel_id}
        ga4Id={settings.ga4_id}
        googleAdsId={settings.google_ads_id}
        googleAdsLabel={settings.google_ads_label}
      />
      <PresencePinger />
      <Intro />
      <CatalogProvider dict={d.catalog}>
        <Header dict={d.nav} locale={locale} />
        {children}
        <CallForm t={d.callForm} extra={d.formExtra} />
      </CatalogProvider>
      <Footer t={d.footer} />
      <WhatsAppButton phone={d.contactPage.phone} message={waMessage} />
    </div>
  );
}
