import type { Dict } from "@/lib/dict";

// Proje künye şeridi — gerçek proje bilgileri (sahte sayaç yok)
export function Stats({ labels }: { labels: Dict["stats"] }) {
  return (
    <section className="bg-ink py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-12 px-6 lg:grid-cols-4 lg:px-10">
        {labels.map((s, i) => (
          <div key={i} className="text-center">
            <div className="font-display text-4xl font-bold text-bronze lg:text-5xl">
              {s.big}
            </div>
            <div className="mt-3 text-xs font-medium tracking-[0.2em] text-white/55 uppercase">
              {s.small}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
