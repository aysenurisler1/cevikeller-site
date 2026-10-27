type Option = { label: string; value: string; hint?: string };

export const ELECTRIC_PANELS: Option[] = [
  { label: "Himmel", value: "himmel", hint: "Kaçak akımlı, timer ve sigortalı" },
  { label: "Siemens", value: "siemens", hint: "Kaçak akımlı, timer, sigortalı ve kontaktörlü" },
];

export const MACHINE_ROOM_COVERS: Option[] = [
  { label: "Sıva üstü", value: "siva-ustu" },
  { label: "Sıva altı", value: "siva-alti" },
  { label: "Sıfır zemin", value: "sifir-zemin" },
];

// Filtre çapına göre kuvars kum miktarı (kg)
const SAND_BY_FILTER: Record<number, number> = {
  500: 75,
  600: 125,
  620: 125,
  760: 300,
  920: 450,
};

export function sandFor(filterSize: number): number | undefined {
  return SAND_BY_FILTER[filterSize];
}

export const EXTRAS: Option[] = [
  { label: "Havuz robotu", value: "robot", hint: "Aiper Scuba S1" },
  { label: "Tuz klor cihazı", value: "tuz", hint: "BSPool tuz klor + pH sistemi" },
  { label: "İkisi de", value: "ikisi" },
  { label: "Hayır, teşekkürler", value: "hayir" },
];

export const ROBOT = {
  name: "Aiper Scuba S1 havuz robotu",
  description:
    "Kablosuz Aiper Scuba S1, 150 m²'ye kadar havuzlarda zemini, duvarları ve su hattını temizler. " +
    "Paletli yapısı sayesinde 105°'ye kadar eğimli duvarlara tırmanabilir. " +
    "Dört farklı temizlik modu ve kolay temizlenen, üstten açılan bir filtre sepeti vardır.",
};

export const SALT_SYSTEM = {
  name: "BSPool tuz klor + pH sistemi",
};