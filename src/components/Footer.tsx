import Link from "next/link";
import { company, contact } from "@/data/content";

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold text-white">Çevikeller</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            {company.legalName}
          </p>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-wide text-aqua">
            Konumumuz
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <span className="text-white/50">{company.warehouse.label}: </span>
              {company.warehouse.location}
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-wide text-aqua">
            İletişim
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{contact.phonePlaceholder}</li>
            <li>{contact.emailPlaceholder}</li>
            <li>
              <Link href="/iletisim" className="underline hover:text-white">
                İletişim sayfasına git
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Çevikeller Plastik ve Havuz Ekipmanları San. ve Tic. Ltd. Şti.
      </div>
    </footer>
  );
}
