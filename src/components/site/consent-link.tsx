"use client";

import { reopenConsent } from "@/lib/consent";

/** Footer'daki "Çerez Tercihleri" — kararı sonradan değiştirmenin yolu.
 *  Rızanın geri alınabilir olması KVKK gereği; kalıcı bir giriş noktası şart. */
export function ConsentLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={reopenConsent}
      className="text-left text-sm text-muted transition hover:text-bronze"
    >
      {label}
    </button>
  );
}
