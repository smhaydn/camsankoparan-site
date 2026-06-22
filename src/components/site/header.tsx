"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { useCatalog } from "./catalog-provider";
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
  const { open: openCatalog } = useCatalog();

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
          ? "bg-ink/95 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href={path(locale)} aria-label="Camsan Koparan Group">
          <Logo light />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="group relative text-sm font-medium tracking-wide text-white/80 transition hover:text-white"
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-bronze transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <button
            onClick={openCatalog}
            className="group relative flex items-center gap-1.5 text-sm font-medium tracking-wide text-bronze-pale transition hover:text-bronze"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
            {dict.catalog}
            <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-bronze transition-all duration-300 group-hover:w-full" />
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden items-center text-xs font-semibold tracking-widest text-white/70 sm:flex">
            <Link href={swap("tr")} className={locale === "tr" ? "text-bronze" : "hover:text-white"}>
              TR
            </Link>
            <span className="mx-2 text-white/30">|</span>
            <Link href={swap("en")} className={locale === "en" ? "text-bronze" : "hover:text-white"}>
              EN
            </Link>
          </div>
          <Link
            href={path(locale, SEGMENTS.contact)}
            className="hidden rounded-full border border-bronze/60 px-5 py-2 text-sm font-medium text-bronze-pale transition hover:bg-bronze hover:text-ink lg:inline-block"
          >
            {dict.cta}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Menu"
          >
            <span className={`h-px w-6 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-6 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="mt-4 flex flex-col gap-1 border-t border-white/10 bg-ink/95 px-6 py-4 lg:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2 text-sm text-white/80">
              {n.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              openCatalog();
            }}
            className="flex items-center gap-2 py-2 text-left text-sm font-medium text-bronze-pale"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
            {dict.catalog}
          </button>
          <div className="mt-2 flex gap-3 border-t border-white/10 pt-3 text-xs font-semibold tracking-widest text-white/70">
            <Link href={swap("tr")} className={locale === "tr" ? "text-bronze" : ""}>TR</Link>
            <Link href={swap("en")} className={locale === "en" ? "text-bronze" : ""}>EN</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
