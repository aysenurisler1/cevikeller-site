type Option = { label: string; value: string; hint?: string };

export const OVERFLOW_TYPES: Option[] = [
  { label: "Izgaralı (taşmalı) havuz", value: "izgara" },
  { label: "Skimmerli havuz", value: "skimmer" },
  { label: "Gizli savaklı havuz", value: "gizli", hint: "Savak betonarme olarak sizin tarafınızdan yapılır" },
];

export const GRATING_WIDTHS: Option[] = [
  { label: "15 cm", value: "15" },
  { label: "20 cm", value: "20" },
  { label: "25 cm", value: "25" },
];

export const GRATING_TYPES: Option[] = [
  { label: "Tek", value: "tek" },
  { label: "Çift", value: "cift" },
];

export const POOL_STRUCTURES: Option[] = [
  { label: "Liner", value: "liner" },
  { label: "Beton", value: "beton", hint: "En yaygın tercih" },
];

export const SKIMMERS: Record<string, Option[]> = {
  liner: [
    { label: "Kare kapak liner skimmer", value: "kare-kapak-liner" },
    { label: "İnce dar ağız liner skimmer", value: "ince-dar-agiz-liner" },
  ],
  beton: [
    { label: "Kare kapak betonarme skimmer", value: "kare-kapak-beton" },
    { label: "Geniş dar ağız betonarme skimmer", value: "genis-dar-agiz-beton" },
    { label: "Geniş skimmer", value: "genis" },
  ],
};

// Izgara uzunluğu: havuz çevresi = 2 × (uzunluk + genişlik), metre cinsinden.
export function gratingLength(length: number, width: number): number {
  return 2 * (length + width);
}