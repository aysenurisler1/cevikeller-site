"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

// Fotoğraflar public/ klasöründe. Slayt eklemek ya da değiştirmek için bu listeyi düzenle.
const SLIDES = [
  {
    eyebrow: "Atlaspool Ege Bölge Bayisi",
    title: "Havuzunuz İçin Tüm Ekipmanlar Tek Adreste",
    description: "Filtreden pompaya, aydınlatmadan tesisata kadar ihtiyacınız olan her şey.",
    image: "/hero-sonsuzluk-havuzu.webp",
    cta: { label: "Ürünlerimizi İnceleyin", href: "/urunler" },
  },
  {
    eyebrow: "Sezon Fırsatı",
    title: "Havuz Ekipmanlarında Toptan Fiyat Avantajı",
    description: "200'ü aşkın firmaya sunduğumuz aynı kaliteyi sizin işletmenize de taşıyoruz.",
    image: "/hero-hamak-havuz.webp",
    cta: { label: "Ürünlerimizi İnceleyin", href: "/urunler" },
  },
  {
    eyebrow: "Kendi İmalatımız",
    title: "Havuz Izgaraları ve Köşe Parçaları",
    description: "Dayanıklı, kaymaz, standart ölçülerde — stoktan hızlı teslim.",
    image: "/hero-merdiven-2.webp",
    cta: { label: "Izgaraları İnceleyin", href: "/urunler/havuz-izgara-malzemeleri" },
  },
  {
    eyebrow: "Paslanmaz Çelik",
    title: "Havuz Merdivenleri",
    description: "AISI 304 ve 316 paslanmaz çelik, 2–5 basamaklı standart ve muro seriler.",
    image: "/hero-merdiven-1.webp",
    cta: { label: "Merdivenleri İnceleyin", href: "/urunler/havuz-merdiveni" },
  },
  {
    eyebrow: "Atlaspool Ege Bölge Bayisi",
    title: "LED Havuz Aydınlatma Çözümleri",
    description: "Sıva altı ve sıva üstü seçenekleriyle, projenize uygun aydınlatma.",
    image: "/hero-villa-gunbatimi.webp",
    cta: { label: "Aydınlatmayı İnceleyin", href: "/urunler#havuz-aydinlatma" },
  },
  {
    eyebrow: "Berrak Su İçin",
    title: "Havuz Kimyasalları",
    description: "Klor, pH düzenleyici ve bakım kimyasallarıyla suyunuz her zaman berrak.",
    image: "/hero-su-ustten.webp",
    cta: { label: "Kimyasalları İnceleyin", href: "/urunler#havuz-kimyasallari" },
  },
];

const INTERVAL_MS = 6000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDES.length);
  }, []);

  const prev = () => {
    setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  };

  // Her slayt değişiminde sayaç baştan başlar; elle geçince hemen tekrar kaymaz.
  useEffect(() => {
    const timer = setTimeout(next, INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [index, next]);

  const slide = SLIDES[index];

  return (
    <section className="relative flex min-h-[calc(100svh-6rem)] items-center overflow-hidden bg-navy-deep">
      {/* Tüm arka planlar üst üste; sadece aktif olan görünür (yumuşak geçiş) */}
      {SLIDES.map((s, i) => (
        <div
          key={s.image}
          aria-hidden="true"
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}

      {/* Metnin okunurluğu için koyu degrade katman */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/40 to-navy-deep/10" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-20">
        <div className="max-w-xl rounded-2xl bg-navy-deep/40 p-8 backdrop-blur-sm">
          <p className="font-display text-xs uppercase tracking-wide text-aqua sm:text-sm">
            {slide.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            {slide.title}
          </h1>
          <p className="mt-4 text-sm text-white/85 sm:text-base">{slide.description}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={slide.cta.href}
              className="rounded-full bg-sun px-7 py-3 font-display text-sm uppercase tracking-wide text-navy-deep shadow-lg shadow-sun/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              {slide.cta.label}
            </Link>
          </div>
        </div>
      </div>

      <button type="button" onClick={prev}
        aria-label="Önceki"
        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-md transition hover:bg-white sm:left-8"
      >
        ‹
      </button>
      <button type="button" onClick={next}
        aria-label="Sonraki"
        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-md transition hover:bg-white sm:right-8"
      >
        ›
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button type="button" key={s.image} onClick={() => setIndex(i)}
            aria-label={`${i + 1}. görsele git`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-sun" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}