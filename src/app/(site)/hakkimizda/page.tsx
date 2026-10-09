import type { Metadata } from "next";
import { company } from "@/data/content";
import Blob from "@/components/Blob";
import WaveDivider from "@/components/WaveDivider";

export const metadata: Metadata = {
  title: "Hakkımızda | Çevikeller",
};

export default function HakkimizdaPage() {
  return (
    <div>
      <section className="bg-hero-gradient relative overflow-hidden text-white">
        <Blob className="-top-24 left-1/4" color="var(--color-aqua)" size={360} />
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24">
          <p className="font-display text-sm uppercase tracking-wide text-aqua">
            Hakkımızda
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
            {company.legalName}
          </h1>
        </div>
        <WaveDivider className="absolute bottom-0 left-0 h-12 w-full" />
      </section>

      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-ink/75">
            <p>
              Firmamız {company.foundedText} havuz ekipmanları imalatı ve toptan
              satışında faaliyet göstermektedir.
            </p>
            <p>
              İzmir Bornova&apos;daki{" "}
              <strong className="text-navy">Işıkkent Küçük Sanayi Sitesi</strong>&apos;nde
              bulunan depo ve imalathanemizle müşterilerimize hizmet veriyoruz.
            </p>
            <p>
              Hizmet verdiğimiz {company.clientCount} seçkin firma arasına katılmak
              için bizi arayabilirsiniz.
            </p>
          </div>

          <div className="space-y-4">
            <div className="card-lift rounded-2xl border border-line bg-white p-6">
              <p className="font-display text-sm uppercase tracking-wide text-teal">
                {company.warehouse.label}
              </p>
              <p className="mt-2 font-display text-lg text-navy">{company.warehouse.location}</p>
            </div>
            <div className="card-lift rounded-2xl border border-line bg-sun/10 p-6">
              <p className="font-display text-sm uppercase tracking-wide text-sun-deep">
                Hizmet Verdiğimiz Firma Sayısı
              </p>
              <p className="mt-2 font-display text-lg text-navy">{company.clientCount} firma</p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-line pt-16">
          <p className="font-display text-sm uppercase tracking-wide text-teal">
            Yetkili Bayilikler
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
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
        </div>
      </div>
    </div>
  );
}