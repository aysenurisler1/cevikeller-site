type Option = { label: string; value: string; hint?: string };

export const LADDER_STEPS: Option[] = [
  { label: "3 basamak", value: "3" },
  { label: "4 basamak", value: "4" },
  { label: "5 basamak", value: "5" },
];

export const LADDER_TYPES: Option[] = [
  { label: "Muro", value: "muro" },
  { label: "Standart", value: "standart" },
];

export const STAINLESS_GRADES: Option[] = [
  { label: "304 paslanmaz", value: "304" },
  { label: "316 paslanmaz", value: "316", hint: "Tuzlu su ve deniz kenarı için daha dayanıklı" },
];

export const PUMP_PHASES: Option[] = [
  { label: "Monofaze", value: "monofaze", hint: "220 V" },
  { label: "Trifaze", value: "trifaze", hint: "380 V" },
];

export const YES_NO: Option[] = [
  { label: "Evet", value: "evet" },
  { label: "Hayır", value: "hayir" },
];

// Şelale ölçüsüne göre eklenecek pompa gücü
export const WATERFALLS: (Option & { pump: string })[] = [
  { label: "40 × 60 cm", value: "40x60", pump: "1 HP" },
  { label: "40 × 80 cm", value: "40x80", pump: "2 HP" },
  { label: "35 cm mini", value: "mini-35", pump: "0,75 HP" },
];