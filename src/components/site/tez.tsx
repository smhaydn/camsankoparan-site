import { MaskLines } from "./reveal";
import type { Dict } from "@/lib/dict";

/**
 * TEZ CÜMLESİ — sayfanın nefes aldığı yer.
 * Görsel yok, süs yok; sadece tipografi ve boşluk.
 * Projenin tamamını üç satırda anlatır.
 */
export function Tez({ t }: { t: Dict["tez"] }) {
  return (
    <section className="paper bg-cream py-24 lg:py-36">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <MaskLines
          className="font-display text-4xl leading-[1.14] font-light text-base sm:text-5xl lg:text-7xl"
          lines={[t.l1, t.l2, <span key="l3" className="text-accent">{t.l3}</span>]}
        />
      </div>
    </section>
  );
}
