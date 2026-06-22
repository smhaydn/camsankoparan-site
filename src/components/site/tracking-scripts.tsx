"use client";

import Script from "next/script";

// Reklam takip kodlarını (Meta Pixel + Google) siteye ekler.
// ID'ler boşsa hiçbir şey eklenmez (panelden doldurulunca devreye girer).
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
  const gtagId = ga4Id || googleAdsId;

  return (
    <>
      {/* Form olaylarının kullanması için herkese açık ID'ler */}
      <Script id="loft-track-cfg" strategy="afterInteractive">
        {`window.__LOFT_TRACK={adsId:${JSON.stringify(googleAdsId || "")},label:${JSON.stringify(
          googleAdsLabel || "",
        )}};`}
      </Script>

      {/* Meta Pixel */}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}

      {/* Google (GA4 ve/veya Ads) */}
      {gtagId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${
              ga4Id ? `gtag('config','${ga4Id}');` : ""
            }${googleAdsId ? `gtag('config','${googleAdsId}');` : ""}`}
          </Script>
        </>
      )}
    </>
  );
}
