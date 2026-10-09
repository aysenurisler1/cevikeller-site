"use client";


import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Anasayfa" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-deep text-white shadow-lg shadow-black/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
               <Link href="/" className="group flex items-center">
          <Image
            src="/logo.png"
            alt="Çevikeller"
            width={200}
            height={96}
            priority
            className="h-11 w-auto sm:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-display text-sm uppercase tracking-wide transition-colors ${
                  active ? "text-sun" : "text-white/80 hover:text-aqua"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-sun" />
                )}
              </Link>
            );
          })}
          <Link
            href="/iletisim"
            className="rounded-full bg-sun px-5 py-2 font-display text-sm uppercase tracking-wide text-navy-deep shadow-md shadow-sun/30 transition hover:bg-aqua"
          >
            Teklif Al
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Menüyü aç/kapat"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className="block h-[2px] w-6 bg-white" />
          <span className="block h-[2px] w-6 bg-white" />
          <span className="block h-[2px] w-6 bg-white" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-white/10 px-6 py-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 font-display text-sm uppercase tracking-wide text-white/90 first:pt-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}