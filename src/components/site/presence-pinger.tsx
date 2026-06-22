"use client";

import { useEffect } from "react";

// Görünmez bileşen: ziyaretçinin "buradayım" sinyalini periyodik gönderir.
// Admin panelindeki canlı sayaç bu sinyalleri sayar.
export function PresencePinger() {
  useEffect(() => {
    let sid = "";
    try {
      sid = sessionStorage.getItem("loft_sid") || "";
      if (!sid) {
        sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem("loft_sid", sid);
      }
    } catch {
      sid = Math.random().toString(36).slice(2);
    }

    const ping = () => {
      fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sid }),
        keepalive: true,
      }).catch(() => {});
    };

    ping();
    const t = setInterval(ping, 15000); // her 15 sn
    return () => clearInterval(t);
  }, []);

  return null;
}
