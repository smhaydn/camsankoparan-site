import { notFound } from "next/navigation";
import { FONT_SINIFLARI } from "../layout";
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
import { CookieConsent } from "@/components/site/cookie-consent";
import { getSettings } from "@/lib/supabase-admin";

// 20 Agu 2026: layout da ISR olmali. Layout HER sayfada calisir ve icerik +
// ayarlari cekiyor; layout dinamik kalirsa altindaki TUM sayfalar dinamik
// kalir — sayfalara tek tek revalidate eklemek yetmedi, olcumle gorundu.
export const revalidate = 3600;

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
    // 20 Agu 2026: <html>/<body> kok layout'tan BURAYA tasindi.
    // Sebep: kok layout dili istek basligindan (headers()) okuyordu ve bu
    // DINAMIK API tum siteyi istek aninda uretmeye zorluyordu. Burada
    // `locale` zaten rota parametresi olarak var — basliga gerek yok,
    // site statiklesebiliyor. lang degeri aynen korunuyor.
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={FONT_SINIFLARI}
    >
      <body className="bg-surface text-base antialiased">
    {/* overflow-x: clip → yatay taşmayı keser AMA kaydırma kabı OLUŞTURMAZ.
        (overflow-x: hidden, overflow-y'yi auto'ya zorlayıp position:sticky'yi bozuyordu.) */}
    <div className="overflow-x-clip">
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
      <Footer t={d.footer} locale={locale} />
      <WhatsAppButton phone={d.contactPage.phone} message={waMessage} />
      <CookieConsent t={d.cookieBanner} locale={locale} />
    </div>
      </body>
    </html>
  );
}
