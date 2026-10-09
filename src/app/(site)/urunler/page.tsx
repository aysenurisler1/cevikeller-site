import type { Metadata } from "next";
import Image from "next/image";
import { productCategories } from "@/data/content";
import { ICONS_BY_SLUG } from "@/components/ProductIcon";
import { getProducts } from "@/sanity/queries";
import { urlForImage } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import Blob from "@/components/Blob";
import WaveDivider from "@/components/WaveDivider";

export const metadata: Metadata = {
  title: "Ürünler | Çevikeller",
};

export default async function UrunlerPage() {
  const products = await getProducts();

  return (
    <div>
      <section className="bg-hero-gradient relative overflow-hidden text-white">
        <Blob className="-top-20 -right-20" color="var(--color-sun)" size={320} />
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24">
          <p className="font-display text-sm uppercase tracking-wide text-aqua">
            Ürünlerimiz
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
            İmalattan tesisatına, tüm havuz parçaları
          </h1>
          <p className="mt-4 max-w-xl text-white/75">
            Aşağıdaki kategoriler kendi imalatımız ve toptan satışımızda yer alan
            ürün gruplarını gösteriyor. Detaylı ölçü, fiyat ve stok bilgisi için
            bizimle iletişime geçebilirsiniz.
          </p>
        </div>
        <WaveDivider className="absolute bottom-0 left-0 h-12 w-full" />
      </section>

      <div className="mx-auto max-w-6xl px-6 py-20">
        {!isSanityConfigured && (
          <div className="mb-12 rounded-2xl border border-sun/30 bg-sun/10 p-5 text-sm text-sun-deep">
            Ürün yönetim paneli henüz bağlanmadı — aşağıda kategori bazlı genel
            bilgiler gösteriliyor. Panel bağlandığında burada gerçek ürünler ve
            fotoğrafları listelenecek.
          </div>
        )}

        {productCategories.map((cat) => {
          const Icon = ICONS_BY_SLUG[cat.slug];
          const catProducts = products.filter((p) => p.categorySlug === cat.slug);

          return (
<section key={cat.slug} id={cat.slug} className="mb-16 scroll-mt-24">              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-aqua/25 text-teal-deep">
                  {Icon && <Icon className="h-6 w-6" />}
                </span>
                <div>
                  <h2 className="font-display text-2xl font-bold text-navy">{cat.name}</h2>
                  <p className="text-sm text-ink/60">{cat.description}</p>
                </div>
              </div>

              {catProducts.length > 0 ? (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {catProducts.map((p) => (
                    <div
                      key={p._id}
                      className="card-lift overflow-hidden rounded-2xl border border-line bg-white"
                    >
                      <div className="relative h-44 w-full bg-surface">
                        {p.image ? (
                          <Image
                            src={urlForImage(p.image).width(600).height(450).fit("crop").url()}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-ink/40">
                            Fotoğraf yok
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-lg font-bold text-navy">{p.name}</h3>
                        {p.description && (
                          <p className="mt-1 text-sm text-ink/65">{p.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.variants?.map((v) => (
                            <span key={v} className="rounded-full bg-teal/10 px-2.5 py-1 text-xs font-medium text-teal-deep">
                              {v}
                            </span>
                          ))}
                          {p.colors?.map((c) => (
                            <span key={c} className="rounded-full bg-sun/15 px-2.5 py-1 text-xs font-medium text-sun-deep">
                              {c}
                            </span>
                          ))}
                        </div>
                        {p.price && (
                          <p className="mt-3 font-display text-navy">{p.price}</p>
                        )}
                        {p.inStock === false && (
                          <p className="mt-2 text-xs font-medium text-red-500">Stokta yok</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-line px-5 py-4 text-sm text-ink/50">
                  Bu kategoride henüz ürün eklenmedi.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}