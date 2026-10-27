type Option = { label: string; value: string; hint?: string };

export const LIGHT_TYPES: Option[] = [
  { label: "Sıva üstü", value: "siva-ustu" },
  { label: "Gömme tip", value: "gomme" },
];

export const RECESSED_HOUSINGS: Option[] = [
  { label: "PAR56 LED kovanlı", value: "par56" },
  { label: "Slim kovanlı", value: "slim" },
];

// Filtre çapına göre seçilebilecek lamba adedi aralığı [en az, en çok]
export function lightCountRange(filterSize: number): [number, number] {
  return filterSize <= 620 ? [4, 6] : [6, 12];
}

// Lamba adedine göre trafo gücü (1 adet). 5–10 lamba için kural henüz belli değil.
export function transformerFor(count: number): string | undefined {
  if (count <= 4) return "100 W";
  if (count >= 11) return "300 W";
  return undefined;
}