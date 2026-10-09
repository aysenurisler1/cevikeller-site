import type { Metadata } from "next";
import { company, contact } from "@/data/content";
import ContactForm from "@/components/ContactForm";
import Blob from "@/components/Blob";
import WaveDivider from "@/components/WaveDivider";

export const metadata: Metadata = {
  title: "İletişim | Çevikeller",
};

const INFO_ROWS = [
  { label: "Depo / İmalathane", value: contact.addressWarehousePlaceholder },
  { label: "Telefon", value: contact.phonePlaceholder },
  { label: "E-posta", value: contact.emailPlaceholder },
  { label: "Çalışma Saatleri", value: contact.workingHoursPlaceholder },
];

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100002.24409191794!2d27.15525045820311!3d38.43984909999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b96328c4a05df5%3A0xe2fe09fff9c121df!2s%C3%87evikeller!5e0!3m2!1str!2str!4v1790673255578!5m2!1str!2str";
export default function IletisimPage() {
  return (
    <div>
      <section className="bg-hero-gradient relative overflow-hidden text-white">
        <Blob className="-top-20 -left-16" color="var(--color-sun)" size={300} />
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
          <p className="font-display text-sm uppercase tracking-wide text-aqua">
            İletişim
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Bize ulaşın
          </h1>
          <p className="mt-4 text-white/75">
            Ürün ve fiyat bilgisi için bizimle iletişime geçebilirsiniz.
          </p>
        </div>
        <WaveDivider className="absolute bottom-0 left-0 h-12 w-full" />
      </section>

      <div className="mx-auto max-w-6xl px-6 py-20">
        {/* Bilgi kartı + Harita */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold text-navy">
              İletişim Bilgileri
            </h2>
            <dl className="mt-6 divide-y divide-line">
              {INFO_ROWS.map((row) => (
                <div key={row.label} className="grid grid-cols-3 gap-4 py-4">
                  <dt className="font-display text-sm font-bold text-navy">
                    {row.label}
                  </dt>
                  <dd className="col-span-2 text-sm text-ink/75">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line shadow-sm">
            <iframe
              title="Çevikeller konum haritası"
src={MAP_EMBED_URL}
              className="h-full min-h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form */}
        <div className="mt-16 rounded-2xl border border-line bg-white p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold text-navy">
            Mesaj Gönderin
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Formu doldurun, en kısa sürede size dönüş yapalım.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}