type Option = { label: string; value: string; hint?: string };

export const PIPE_SIZE_OPTIONS: Option[] = [
  { label: "50 mm", value: "50" },
  { label: "63 mm", value: "63" },
];

// 620 mm'ye kadar olan filtrelerde 50/63 seçilebilir, üstünde sadece 63 mm.
export function plumbingSizeChoices(filterSize: number): number[] {
  return filterSize <= 620 ? [50, 63] : [63];
}

// Şelale varsa ana tesisat malzemeleri bu oranda artırılır.
export const WATERFALL_MARGIN = 0.1;

export type PlumbingItem = {
  name: (size: number) => string;
  unit: string;
  base: number; // standart adet / metre
  waterfallExtra: number; // şelale varsa ayrıca eklenecek miktar
};

export const PLUMBING_ITEMS: PlumbingItem[] = [
  { name: (d) => `${d} mm boru`, unit: "m", base: 36, waterfallExtra: 12 },
  { name: (d) => `${d}x90 dirsek`, unit: "adet", base: 30, waterfallExtra: 10 },
  { name: (d) => `${d} mm te`, unit: "adet", base: 10, waterfallExtra: 5 },
  { name: (d) => `${d} mm körtapa`, unit: "adet", base: 6, waterfallExtra: 0 },
  { name: (d) => `${d} mm manşon`, unit: "adet", base: 6, waterfallExtra: 0 },
  { name: () => "Yapıştırıcı", unit: "adet", base: 1, waterfallExtra: 1 },
  { name: (d) => `${d} mm vana`, unit: "adet", base: 7, waterfallExtra: 1 },
  { name: (d) => `${d} mm çekvalf`, unit: "adet", base: 2, waterfallExtra: 1 },
  { name: (d) => `${d} mm kelepçe`, unit: "adet", base: 6, waterfallExtra: 2 },
];

// Şelale yoksa standart miktar; varsa %10 fazlası (yukarı yuvarlanır) + şelale ek malzemesi.
export function plumbingQuantity(item: PlumbingItem, hasWaterfall: boolean): number {
  if (!hasWaterfall) return item.base;
  return Math.ceil(item.base * (1 + WATERFALL_MARGIN)) + item.waterfallExtra;
}

// Taban tesisatı: filtre çapına göre nozul ve dip emiş adedi
export function floorFittings(filterSize: number) {
  if (filterSize <= 620) return { nozzles: 7, mainDrains: 1 };
  return { nozzles: 12, mainDrains: 2 }; // 760 ve 920 mm
}