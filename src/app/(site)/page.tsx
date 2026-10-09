import Link from "next/link";
import { company, productCategories } from "@/data/content";
import { ICONS_BY_SLUG } from "@/components/ProductIcon";
import WaveDivider from "@/components/WaveDivider";
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
  return (
    <>
      <HeroCarousel />

      {/* Hero */}
      <section className="bg-water-light relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-28">
          <p className="font-display text-sm uppercase tracking-wide text-teal-deep">
            {company.foundedText} sektörde
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.08] text-navy-deep sm:text-6xl">
            Havuz ekipmanlarında imalattan{" "}
            <span className="text-sun-deep">toptan satışa</span> tek adres
          </h1>
          <p className="mt-6 max-w-lg text-lg text-ink/70">
            {company.legalName}, {company.city}&apos;de {company.clientCount} firmaya
            havuz ızgarası, köşe parçası, savak profili, LED havuz aydınlatması ve
            kimyasal bidon çözümleri sunuyor.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/urunler"
              className="rounded-full bg-sun px-7 py-3.5 font-display text-sm uppercase tracking-wide text-navy-deep shadow-lg shadow-sun/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Ürünlerimizi İnceleyin
            </Link>
            <Link
              href="/iletisim"
              className="rounded-full border border-navy/20 bg-white/60 px-7 py-3.5 font-display text-sm uppercase tracking-wide text-navy-deep backdrop-blur-sm transition hover:border-navy/40 hover:bg-white"
            >
              Bize Ulaşın
            </Link>
          </div>

          {/* İstatistik şeridi */}
          <div className="mt-16 grid max-w-xl grid-cols-3 gap-6 border-t border-navy/10 pt-8">
            <div>
              <p className="font-display text-3xl font-bold text-navy sm:text-4xl">25+</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">Yıl Tecrübe</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-navy sm:text-4xl">200+</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">Firma</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-navy sm:text-4xl">2</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">Bayilik</p>
            </div>
          </div>
        </div>

        <WaveDivider className="absolute bottom-0 left-0 h-14 w-full" fill="var(--color-surface)" />
      </section>

      {/* Biz Kimiz özet */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="font-display text-sm uppercase tracking-wide text-teal">
              Biz Kimiz
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
              {company.foundedText} deneyim
            </h2>
            <div className="mt-6 h-1.5 w-16 rounded-full bg-sun" />
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-ink/75">
            <p>
              {company.legalName}, {company.foundedText} havuz ekipmanları imalatı
              ve toptan satışında faaliyet göstermektedir.
            </p>
            
            <p>
  İzmir Bornova&apos;daki{" "}
  <strong className="text-navy">Işıkkent Küçük Sanayi Sitesi</strong>&apos;nde
  bulunan depo ve imalathanemizle müşterilerimize hizmet veriyoruz.
</p>
            <Link
              href="/hakkimizda"
              className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-wide text-teal transition hover:text-teal-deep"
            >
              Hakkımızda sayfasına git
              <span aria-hidden>›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* İmalatlarımız */}
      <section className="relative overflow-hidden bg-surface-raised py-24">
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="font-display text-sm uppercase tracking-wide text-teal">
            İmalatlarımız
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-navy sm:text-4xl">
            Üretimden sahaya, tüm havuz parçaları
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
       {productCategories.map((cat) => {
  const Icon = ICONS_BY_SLUG[cat.slug];
  return (
    <Link
      key={cat.slug}
      href={`/urunler#${cat.slug}`}
      className="card-lift rounded-2xl border border-line bg-white p-7"
    >
      {Icon && (
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-aqua/25 text-teal-deep">
          <Icon className="h-7 w-7" />
        </span>
      )}
      <h3 className="mt-5 font-display text-lg font-bold text-navy">
        {cat.name}
      </h3>
      <p className="mt-2 text-sm text-ink/65">{cat.description}</p>
    </Link>
  );
})}
          </div>

          <Link
            href="/urunler"
            className="mt-10 inline-flex items-center gap-2 font-display text-sm uppercase tracking-wide text-navy transition hover:text-teal"
          >
            Tüm ürünleri görüntüle
            <span aria-hidden>›</span>
          </Link>
        </div>
      </section>

      {/* Bayilikler */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="font-display text-sm uppercase tracking-wide text-teal">
          Yetkili Bayilikler
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {company.dealerships.map((d) => (
            <div
              key={d.brand}
              className="card-lift rounded-2xl border border-line bg-white p-8"
            >
              <p className="font-display text-2xl font-bold text-navy">{d.brand}</p>
              <p className="mt-2 text-sm text-ink/65">{d.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA şeridi */}
      <section className="bg-hero-gradient relative overflow-hidden py-16 text-center text-white">
        <div className="relative">
          <p className="font-display text-2xl font-bold sm:text-3xl">
            {company.clientCount} seçkin firma arasına siz de katılın
          </p>
          <Link
            href="/iletisim"
            className="mt-6 inline-block rounded-full bg-sun px-8 py-3.5 font-display text-sm uppercase tracking-wide text-navy-deep shadow-lg shadow-sun/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Bizi Arayın
          </Link>
        </div>
      </section>
    </>
  );
}