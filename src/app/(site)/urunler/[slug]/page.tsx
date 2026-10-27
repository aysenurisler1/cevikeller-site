import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productCategories } from "@/data/content";
import { getProductBySlug, type ProductOption } from "@/sanity/queries";
import { urlForImage } from "@/sanity/client";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name} | Çevikeller` : "Ürün bulunamadı | Çevikeller" };
}

// Çeşitleri gruplara ayırır; grupsuzlar en sonda "Diğer" altında toplanır.
function groupOptions(options: ProductOption[]) {
  const groups = new Map<string, ProductOption[]>();
  for (const option of options) {
    const key = option.group?.trim() || "Diğer";
    groups.set(key, [...(groups.get(key) ?? []), option]);
  }
  const entries = [...groups.entries()];
  return [...entries.filter(([k]) => k !== "Diğer"), ...entries.filter(([k]) => k === "Diğer")];
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = productCategories.find((c) => c.slug === product.categorySlug);
  const groups = groupOptions(product.options ?? []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href={`/urunler#${product.categorySlug}`}
        className="text-sm font-medium text-teal-deep hover:underline"
      >
        ← {category?.name ?? "Ürünler"}
      </Link>

      {/* Üst bölüm: fotoğraf ve bilgiler */}
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-line bg-white">
          {product.image ? (
            <Image
              src={urlForImage(product.image).width(1000).fit("max").url()}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain p-6"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-surface text-sm text-ink/40">
              Fotoğraf yok
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">{product.name}</h1>
          {product.description && (
            <p className="mt-4 leading-relaxed text-ink/75">{product.description}</p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {product.variants?.map((v) => (
              <span key={v} className="rounded-full bg-teal/10 px-3 py-1 text-sm font-medium text-teal-deep">
                {v}
              </span>
            ))}
            {product.colors?.map((c) => (
              <span key={c} className="rounded-full bg-sun/15 px-3 py-1 text-sm font-medium text-sun-deep">
                {c}
              </span>
            ))}
          </div>
          <Link href="/iletisim"
            className="mt-8 inline-flex rounded-full bg-sun px-6 py-3 font-display text-sm font-bold text-white"
          >
            Bilgi ve fiyat için iletişime geçin
          </Link>
        </div>
      </div>

      {/* Çeşitler */}
      {groups.length > 0 && (
        <div className="mt-16 space-y-12">
          {groups.map(([groupName, options]) => (
            <section key={groupName}>
              <h2 className="font-display text-xl font-bold text-navy">{groupName}</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {options.map((option) => (
                  <div key={option._key} className="overflow-hidden rounded-2xl border border-line bg-white">
                    <div className="relative h-44 w-full bg-white">
                      {option.image ? (
                        <Image
                          src={urlForImage(option.image).width(600).fit("max").url()}
                          alt={option.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-surface text-sm text-ink/40">
                          Fotoğraf yok
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-base font-bold text-navy">{option.name}</h3>
                      {option.description && (
                        <p className="mt-1 text-sm text-ink/65">{option.description}</p>
                      )}
                      {option.code && <p className="mt-2 text-xs text-ink/45">Kod: {option.code}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}