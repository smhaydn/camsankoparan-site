"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readConsent, CONSENT_EVENT, type Consent } from "@/lib/consent";

// Reklam takip kodlarını (Meta Pixel + Google) siteye ekler.
// ID'ler boşsa hiçbir şey eklenmez (panelden doldurulunca devreye girer).
//
// ⚠️ ONAY KURALI: Analitik ve pazarlama kodları, ziyaretçi onay VERMEDEN yüklenmez.
// Karar verilmemişse (consent === null) hiçbiri basılmaz. Onay sonradan verilirse
// CONSENT_EVENT ile burada yeniden render olur ve kodlar o an yüklenir —
// sayfayı yenilemeye gerek yok.
export function TrackingScripts({
  metaPixelId,
  ga4Id,
  googleAdsId,
  googleAdsLabel,
}: {
  metaPixelId?: string;
  ga4Id?: string;
  googleAdsId?: string;
  googleAdsLabel?: string;
}) {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const onChange = (e: Event) => setConsent((e as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  const analytics = consent?.analytics === true;
  const marketing = consent?.marketing === true;

  // GA4 analitik, Google Ads pazarlama sayılır — ayrı onaylara bağlı
  const wantGa4 = analytics && !!ga4Id;
  const wantAds = marketing && !!googleAdsId;
  const gtagId = wantGa4 ? ga4Id : wantAds ? googleAdsId : undefined;

  return (
    <>
      {/* Form olaylarının kullanması için herkese açık ID'ler.
          Yalnızca pazarlama onayı varsa dolu gider; yoksa trackLead sessiz kalır. */}
      <Script id="loft-track-cfg" strategy="afterInteractive">
        {`window.__LOFT_TRACK={adsId:${JSON.stringify(
          wantAds ? googleAdsId || "" : "",
        )},label:${JSON.stringify(wantAds ? googleAdsLabel || "" : "")}};`}
      </Script>

      {/* Meta Pixel — pazarlama onayı gerekir */}
      {marketing && metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}

      {/* Google — GA4 analitik onayına, Ads pazarlama onayına bağlı */}
      {gtagId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${
              wantGa4 ? `gtag('config','${ga4Id}');` : ""
            }${wantAds ? `gtag('config','${googleAdsId}');` : ""}`}
          </Script>
        </>
      )}
    </>
  );
}
