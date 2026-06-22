// İç sayfaların üst başlık bandı (koyu, üst menüyle uyumlu)
export function PageHero({
  kicker,
  title,
  intro,
  image = "/renders/dis-cephe-genel.jpg",
}: {
  kicker: string;
  title: string;
  intro?: string;
  image?: string;
}) {
  return (
    <section className="relative flex min-h-[52vh] items-end overflow-hidden bg-ink pb-14 pt-40">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/55" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="mb-4 flex items-center gap-4">
          <span className="h-px w-10 bg-bronze" />
          <span className="kicker text-bronze-pale">{kicker}</span>
        </div>
        <h1 className="font-display text-4xl font-light text-white lg:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-white/65">{intro}</p>}
      </div>
    </section>
  );
}
