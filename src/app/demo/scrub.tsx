"use client";

import { useEffect, useRef, useState } from "react";

// Kaydırma / ok tuşu / dokunuş ile "projede gezme" demosu.
// Video yerine KARE DİZİSİ (frame sequence) kullanıyoruz: video sardırma
// mobil tarayıcılarda çalışmaz; kareleri canvas'a çizmek her cihazda çalışır.
const FRAME_COUNT = 96;
const framePath = (i: number) =>
  `/video/frames/f_${String(i + 1).padStart(3, "0")}.jpg`;

export default function Scrub() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const target = useRef(0); // hedef ilerleme 0..1
  const current = useRef(0); // yumuşatılmış ilerleme
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // Kareleri önceden yükle
  useEffect(() => {
    let done = 0;
    const arr: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = img.onerror = () => {
        done++;
        setLoaded(done);
        if (done === FRAME_COUNT) setReady(true);
      };
      arr[i] = img;
    }
    imgs.current = arr;
  }, []);

  // Canvas çizim + kaydırma/tuş döngüsü
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    fit();

    const draw = (idx: number) => {
      const img = imgs.current[idx];
      if (!img || !img.naturalWidth) return;
      const cw = canvas.width,
        ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    let raf = 0;
    const tick = () => {
      current.current += (target.current - current.current) * 0.12;
      const idx = Math.round(current.current * (FRAME_COUNT - 1));
      draw(idx);
      setProgress(current.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total);
      target.current = total > 0 ? scrolled / total : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onResize = () => {
      fit();
      draw(Math.round(current.current * (FRAME_COUNT - 1)));
    };
    window.addEventListener("resize", onResize);

    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        window.scrollBy({ top: 160, behavior: "smooth" });
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        window.scrollBy({ top: -160, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [ready]);

  return (
    <div ref={wrapRef} style={{ height: "400vh", position: "relative", background: "#0c0a08" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

        {/* Yükleme ekranı */}
        {!ready && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#fff",
              fontFamily: "system-ui, sans-serif",
              background: "#0c0a08",
            }}
          >
            <div style={{ letterSpacing: "0.3em", color: "#c08a4d", fontSize: 13 }}>LOFT 777</div>
            <div style={{ marginTop: 10, fontSize: 14, opacity: 0.7 }}>
              Yükleniyor… %{Math.round((loaded / FRAME_COUNT) * 100)}
            </div>
          </div>
        )}

        {/* Karartma + marka */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.65) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#fff",
            fontFamily: "Georgia, serif",
            pointerEvents: "none",
            opacity: 1 - Math.min(progress * 2.2, 1),
          }}
        >
          <div style={{ letterSpacing: "0.35em", fontSize: 13, color: "#c08a4d" }}>
            CAMSAN KOPARAN GROUP
          </div>
          <div style={{ fontSize: 44, fontWeight: 300, marginTop: 8 }}>LOFT 777</div>
        </div>

        {/* Gezinme ipucu */}
        <div
          style={{
            position: "absolute",
            bottom: "6%",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "rgba(255,255,255,0.85)",
            fontFamily: "system-ui, sans-serif",
            fontSize: 14,
            pointerEvents: "none",
            opacity: 1 - Math.min(progress * 3, 1),
          }}
        >
          ↓ Kaydır · ok tuşları · parmakla sürükle
        </div>

        {/* İlerleme çubuğu */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 3,
            width: `${progress * 100}%`,
            background: "#c08a4d",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
