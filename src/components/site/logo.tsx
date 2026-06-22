// CK monogram logosu — markanın resmi yazımına (CAMSAN, C ile) uygun
export function Logo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const main = light ? "text-white" : "text-ink";
  const accent = "text-bronze";
  return (
    <div className={`flex flex-col items-start leading-none ${className}`}>
      <div className={`flex items-center font-display font-extralight ${main}`}>
        <span className="text-2xl tracking-[0.15em]">C</span>
        <span className={`mx-1 h-6 w-px ${light ? "bg-bronze-light" : "bg-bronze"}`} />
        <span className="text-2xl tracking-[0.15em]">K</span>
      </div>
      <div className="mt-1 flex flex-col">
        <span
          className={`font-display text-[11px] font-bold tracking-[0.34em] ${main}`}
        >
          CAMSAN KOPARAN
        </span>
        <span className={`text-[8px] font-medium tracking-[0.4em] ${accent}`}>
          GROUP A.Ş.
        </span>
      </div>
    </div>
  );
}
