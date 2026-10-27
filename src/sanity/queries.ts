import { client } from "./client";
import { isSanityConfigured } from "./env";
import type { Image } from "sanity";

export type SanityProduct = {
  _id: string;
  name: string;
  slug: string;
  categorySlug: string;
  description?: string;
  image?: Image;
  variants?: string[];
  colors?: string[];
  price?: string;
  inStock?: boolean;
};

const PRODUCTS_QUERY = `*[_type == "product"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  categorySlug,
  description,
  image,
  variants,
  colors,
  price,
  inStock
}`;

// Sanity projesi henüz bağlanmadıysa (env değişkenleri eksikse) boş liste
// döndürüyoruz — sayfa o zaman kategori kartlarını placeholder olarak gösteriyor.
export async function getProducts(): Promise<SanityProduct[]> {
  if (!isSanityConfigured) return [];

  try {
    return await client.fetch(PRODUCTS_QUERY, {}, { next: { revalidate: 60 } });
  } catch (err) {
    console.error("Sanity ürünleri çekilemedi:", err);
    return [];
  }
}
// ─── Ürün detay sayfası ──────────────────────────────────────────

export type ProductOption = {
  _key: string;
  name: string;
  group?: string;
  description?: string;
  code?: string;
  image?: Image;
};

export type SanityProductDetail = SanityProduct & { options?: ProductOption[] };

const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  categorySlug,
  description,
  image,
  variants,
  colors,
  price,
  inStock,
  options[] { _key, name, group, description, code, image }
}`;

export async function getProductBySlug(slug: string): Promise<SanityProductDetail | null> {
  if (!isSanityConfigured) return null;

  try {
    return await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } });
  } catch (err) {
    console.error("Sanity ürünü çekilemedi:", err);
    return null;
  }
}


// ─── Teklif asistanı ─────────────────────────────────────────────

export type WizardImage = { name: string; imageUrl: string };

// Rolü atanmış ve fotoğrafı olan ürünler
const WIZARD_IMAGES_QUERY = `*[_type == "product" && defined(wizardRole) && wizardRole != "none" && defined(image.asset)] {
  wizardRole,
  name,
  "imageUrl": image.asset->url
}`;

// Rol → fotoğraf eşlemesi döndürür. Örn. { filtre: { name, imageUrl }, pompa: {...} }
export async function getWizardImages(): Promise<Record<string, WizardImage>> {
  if (!isSanityConfigured) return {};

  try {
    const rows = await client.fetch<{ wizardRole: string; name: string; imageUrl: string }[]>(
      WIZARD_IMAGES_QUERY,
      {},
      { next: { revalidate: 60 } }
    );

    const images: Record<string, WizardImage> = {};
    for (const row of rows) {
      if (!images[row.wizardRole]) {
        images[row.wizardRole] = { name: row.name, imageUrl: row.imageUrl };
      }
    }
    return images;
  } catch (err) {
    console.error("Teklif asistanı fotoğrafları çekilemedi:", err);
    return {};
  }
}