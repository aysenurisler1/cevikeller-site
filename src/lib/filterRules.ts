// Havuz hacmine (m³ ≈ ton) göre önerilen filtre çapları.
// Kurallar sırayla kontrol edilir; hacmi karşılayan ilk satır kullanılır.
export const FILTER_RULES = [
  { maxVolume: 38, sizes: [500] },
  { maxVolume: 59, sizes: [600, 620] },
  { maxVolume: 84, sizes: [760] },
  { maxVolume: 129, sizes: [920] },
];

export const FILTER_MATERIALS = [
  { label: "Plastik", value: "plastik", hint: "2–3 yıl kullanım ömrü" },
  { label: "Polyester", value: "polyester", hint: "3–5 yıl kullanım ömrü" },
];

// Uygun filtre çaplarını döndürür. Hacim tüm aralıkların üstündeyse boş liste döner.
export function recommendFilterSizes(volume: number): number[] {
  return FILTER_RULES.find((rule) => volume <= rule.maxVolume)?.sizes ?? [];
}

// Filtre çapına göre önerilen pompa motoru gücü.
export const PUMP_BY_FILTER: Record<number, string> = {
  500: "0,75 HP",
  600: "1 HP",
  620: "1 HP",
  760: "1,5 HP",
  920: "2 HP",
};

export function getPumpForFilter(size: number): string | undefined {
  return PUMP_BY_FILTER[size];
}