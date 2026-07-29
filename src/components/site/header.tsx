"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { SEGMENTS, type Dict } from "@/lib/dict";
import { path, type Locale } from "@/lib/i18n";

export function Header({
  dict,
  locale,
}: {
  dict: Dict["nav"];
  locale: Locale;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { label: dict.home, href: path(locale) },
    { label: dict.about, href: path(locale, SEGMENTS.about) },
    { label: dict.projects, href: path(locale, SEGMENTS.projects) },
    { label: dict.services, href: path(locale, SEGMENTS.services) },
    { label: dict.blog, href: path(locale, SEGMENTS.blog) },
    { label: dict.contact, href: path(locale, SEGMENTS.contact) },
  ];

  // Mevcut sayfada dili değiştir: /tr/about -> /en/about
  const swap = (l: Locale) => {
    const rest = pathname.replace(/^\/(tr|en)/, "");
    return `/${l}${rest}`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-line bg-paper/92 py-3 backdrop-blur"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href={path(locale)} aria-label="Camsan Koparan Group">
          <Logo light={!scrolled} />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`group relative text-sm font-medium tracking-wide transition ${scrolled ? "text-base/80 hover:text-base" : "text-white/80 hover:text-white"}`}
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-bronze transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle scrolled={scrolled} label={locale === "en" ? "Toggle theme" : "Tema değiştir"} />
          <div className={`hidden items-center text-xs font-semibold tracking-widest sm:flex ${scrolled ? "text-base/70" : "text-white/70"}`}>
            <Link href={swap("tr")} className={locale === "tr" ? "text-bronze" : scrolled ? "hover:text-base" : "hover:text-white"}>
              TR
            </Link>
            <span className={`mx-2 ${scrolled ? "text-base/30" : "text-white/30"}`}>|</span>
            <Link href={swap("en")} className={locale === "en" ? "text-bronze" : scrolled ? "hover:text-base" : "hover:text-white"}>
              EN
            </Link>
          </div>
          <Link
            href={path(locale, SEGMENTS.contact)}
            className="hidden rounded-full border border-bronze/60 px-5 py-2 text-sm font-medium text-bronze-pale transition hover:bg-bronze hover:text-onaccent lg:inline-block"
          >
            {dict.cta}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Menu"
          >
            <span className={`h-px w-6 transition ${scrolled ? "bg-base" : "bg-white"} ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-px w-6 transition ${scrolled ? "bg-base" : "bg-white"} ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-6 transition ${scrolled ? "bg-base" : "bg-white"} ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="mt-4 flex flex-col gap-1 border-t border-line bg-paper px-6 py-4 lg:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2 text-sm text-base/80 hover:text-bronze">
              {n.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-3 border-t border-line pt-3 text-xs font-semibold tracking-widest text-base/70">
            <Link href={swap("tr")} className={locale === "tr" ? "text-bronze" : ""}>TR</Link>
            <Link href={swap("en")} className={locale === "en" ? "text-bronze" : ""}>EN</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
