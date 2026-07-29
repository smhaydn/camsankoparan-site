import Image from "next/image";

// Arka plan görselleri için next/image sarmalayıcı.
// Eski `<div bg-cover style={backgroundImage}>` kullanımlarının yerine geçer:
// otomatik AVIF/WebP, responsive srcset, lazy-load ve zorunlu alt metin sağlar.
// Ebeveyn öğe `position: relative/absolute` ve boyutlu olmalıdır (fill gereği).
export function CoverImage({
  src,
  alt,
  priority = false,
  sizes = "100vw",
  className = "",
  quality = 82,
}: {
  src: string;
  alt: string;
  priority?: boolean; // LCP görseli için true (hero)
  sizes?: string;
  className?: string; // ek sınıflar (ör. kenburns animasyonu, object-position)
  quality?: number;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      quality={quality}
      className={`object-cover object-center ${className}`}
    />
  );
}
