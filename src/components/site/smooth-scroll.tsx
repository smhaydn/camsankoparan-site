"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Yumuşak kaydırma (Lenis) — tekerlek kaydırmasına ağırlık/inerti verir.
// Dokunmatik ekranda dokunmaz (telefonun kendi kaydırması zaten doğal).
// Hareket azaltma tercihinde hiç başlamaz.
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    let raf = requestAnimationFrame(function tick(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    });

    // Modal/lightbox/intro gövdeyi "overflow:hidden" ile kilitler; Lenis bunu
    // kendiliğinden görmez → gövde stili değişince kaydırmayı durdur/başlat.
    const sync = () =>
      document.body.style.overflow === "hidden" ? lenis.stop() : lenis.start();
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
