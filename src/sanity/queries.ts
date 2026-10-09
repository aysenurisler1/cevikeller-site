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

// ─── Teklif sihirbazı ────────────────────────────────────────────

export type WizardRole = "filtre" | "pompa" | "tuz" | "robot" | "aydinlatma" | "kimyasal";

export type WizardProduct = {
  _id: string;
  name: string;
  slug: string;
  wizardRole: WizardRole;
  flowRate?: number;
  maxVolume?: number;
  image?: Image;
};

export type WizardSettings = {
  privateTurnoverHours: number;
  commercialTurnoverHours: number;
  lightAreaPerUnit: number;
};

// Studio'da ayar dokümanı yoksa ya da bir alan boşsa bu değerler kullanılır.
const DEFAULT_WIZARD_SETTINGS: WizardSettings = {
  privateTurnoverHours: 6,
  commercialTurnoverHours: 4,
  lightAreaPerUnit: 15,
};

const WIZARD_DATA_QUERY = `{
  "products": *[_type == "product" && defined(wizardRole) && wizardRole != "none" && inStock != false]
    | order(coalesce(flowRate, maxVolume, 0) asc) {
      _id,
      name,
      "slug": slug.current,
      wizardRole,
      flowRate,
      maxVolume,
      image
    },
  "settings": *[_type == "wizardSettings"][0] {
    privateTurnoverHours,
    commercialTurnoverHours,
    lightAreaPerUnit
  }
}`;

export async function getWizardData(): Promise<{
  products: WizardProduct[];
  settings: WizardSettings;
}> {
  if (!isSanityConfigured) {
    return { products: [], settings: DEFAULT_WIZARD_SETTINGS };
  }

  try {
    const data = await client.fetch<{
      products: WizardProduct[] | null;
      settings: Partial<WizardSettings> | null;
    }>(WIZARD_DATA_QUERY, {}, { next: { revalidate: 60 } });

    const s = data.settings;
    return {
      products: data.products ?? [],
      settings: {
        privateTurnoverHours: s?.privateTurnoverHours ?? DEFAULT_WIZARD_SETTINGS.privateTurnoverHours,
        commercialTurnoverHours: s?.commercialTurnoverHours ?? DEFAULT_WIZARD_SETTINGS.commercialTurnoverHours,
        lightAreaPerUnit: s?.lightAreaPerUnit ?? DEFAULT_WIZARD_SETTINGS.lightAreaPerUnit,
      },
    };
  } catch (err) {
    console.error("Sihirbaz verileri çekilemedi:", err);
    return { products: [], settings: DEFAULT_WIZARD_SETTINGS };
  }
}