import { FILTER_MATERIALS, getPumpForFilter, recommendFilterSizes } from "./filterRules";
import {
  GRATING_TYPES,
  GRATING_WIDTHS,
  OVERFLOW_TYPES,
  POOL_STRUCTURES,
  SKIMMERS,
  gratingLength,
} from "./overflowRules";
import {
  LADDER_STEPS,
  LADDER_TYPES,
  PUMP_PHASES,
  STAINLESS_GRADES,
  WATERFALLS,
  YES_NO,
} from "./accessoryRules";
import {
  PIPE_SIZE_OPTIONS,
  PLUMBING_ITEMS,
  floorFittings,
  plumbingQuantity,
  plumbingSizeChoices,
} from "./plumbingRules";
import { LIGHT_TYPES, RECESSED_HOUSINGS, lightCountRange, transformerFor } from "./lightingRules";
import {
  ELECTRIC_PANELS,
  EXTRAS,
  MACHINE_ROOM_COVERS,
  ROBOT,
  SALT_SYSTEM,
  sandFor,
} from "./extraRules";

export type Option = { label: string; value: string; hint?: string };

export type Step = {
  key: string;
  question: string;
  kind: "choice" | "number";
  options?: Option[];
  unit?: string;
  min?: number;
  max?: number;
  placeholder?: string;
};

export type Answers = Record<string, string | number>;

export type ListItem = {
  name: string;
  quantity: string;
  note?: string;
  group?: "tesisat" | "aydinlatma" | "ekstra";
};

export const BASE_STEPS: Step[] = [
  {
    key: "poolType",
    question: "Havuzunuz ne amaçla kullanılacak?",
    kind: "choice",
    options: [
      { label: "Özel / Villa havuzu", value: "ozel" },
      { label: "Otel / Ticari havuz", value: "ticari" },
    ],
  },
  { key: "length", question: "Havuzunuzun uzunluğu kaç metre?", kind: "number", unit: "m", min: 1, max: 50 },
  { key: "width", question: "Genişliği kaç metre?", kind: "number", unit: "m", min: 1, max: 25 },
  { key: "shallowDepth", question: "En sığ noktasının derinliği kaç metre?", kind: "number", unit: "m", min: 0.3, max: 3 },
  { key: "deepDepth", question: "En derin noktasının derinliği kaç metre?", kind: "number", unit: "m", min: 0.3, max: 5 },
];

export function fmt(n: number) {
  return n.toLocaleString("tr-TR", { maximumFractionDigits: 1 });
}

function lower(text: string) {
  return text.toLocaleLowerCase("tr-TR");
}

function labelOf(options: Option[], value: string | number | undefined) {
  return options.find((o) => o.value === String(value))?.label ?? "";
}

export function getVolume(a: Answers): number | null {
  const keys = ["length", "width", "shallowDepth", "deepDepth"];
  if (keys.some((k) => a[k] === undefined)) return null;
  return (Number(a.length) * Number(a.width) * (Number(a.shallowDepth) + Number(a.deepDepth))) / 2;
}

// Hacme göre seçilen (ya da önerilen tek) filtre çapı. Hacim 130 tonun üstündeyse undefined döner.
export function getFilterSize(a: Answers): number | undefined {
  const volume = getVolume(a);
  if (volume === null) return undefined;
  const sizes = recommendFilterSizes(volume);
  if (sizes.length === 0) return undefined;
  return a.filterSize !== undefined ? Number(a.filterSize) : sizes[0];
}

// Seçilen ya da otomatik belirlenen tesisat çapı (mm)
export function getPipeSize(a: Answers): number | undefined {
  const filterSize = getFilterSize(a);
  if (filterSize === undefined) return undefined;
  const choices = plumbingSizeChoices(filterSize);
  if (choices.length === 1) return choices[0];
  return a.pipeSize !== undefined ? Number(a.pipeSize) : undefined;
}

// Önceki cevaplara göre sorulacak tüm adımlar
export function getSteps(a: Answers): Step[] {
  const volume = getVolume(a);
  if (volume === null) return BASE_STEPS;

  const sizes = recommendFilterSizes(volume);
  if (sizes.length === 0) return BASE_STEPS;

  const volumeText = `Havuzunuzun yaklaşık hacmi ${fmt(volume)} m³ (≈ ${Math.round(volume)} ton).`;
  const steps = [...BASE_STEPS];

  // Filtre
  if (sizes.length > 1) {
    steps.push({
      key: "filterSize",
      kind: "choice",
      question: `${volumeText} Bu hacim için ${sizes.map((s) => `${s} mm`).join(" veya ")} filtre uygundur. Hangisini tercih edersiniz?`,
      options: sizes.map((s) => ({ label: `${s} mm`, value: String(s) })),
    });
    steps.push({
      key: "filterMaterial",
      kind: "choice",
      question: "Filtre gövdesi hangi malzemeden olsun?",
      options: FILTER_MATERIALS,
    });
  } else {
    steps.push({
      key: "filterMaterial",
      kind: "choice",
      question: `${volumeText} Bu hacim için ${sizes[0]} mm filtre öneriyoruz. Filtre gövdesi hangi malzemeden olsun?`,
      options: FILTER_MATERIALS,
    });
  }

  // Filtre pompası
  const filterSize = getFilterSize(a);
  const pump = filterSize !== undefined ? getPumpForFilter(filterSize) : undefined;
  steps.push({
    key: "pumpPhase",
    kind: "choice",
    question: `Filtre pompanız ${pump ?? ""} olacak. Elektrik bağlantısı monofaze mi, trifaze mi?`,
    options: PUMP_PHASES,
  });

  // Taşma sistemi
  steps.push({
    key: "overflow",
    kind: "choice",
    question: "Havuzunuzda hangi taşma sistemi olacak?",
    options: OVERFLOW_TYPES,
  });

  if (a.overflow === "izgara") {
    const len = gratingLength(Number(a.length), Number(a.width));
    steps.push({
      key: "gratingWidth",
      kind: "choice",
      question: `Havuzunuzun çevresi için yaklaşık ${fmt(len)} metre ızgara gerekiyor. Izgara genişliği ne olsun?`,
      options: GRATING_WIDTHS,
    });
    steps.push({
      key: "gratingType",
      kind: "choice",
      question: "Izgara tek mi, çift mi olsun?",
      options: GRATING_TYPES,
    });
  }

  if (a.overflow === "skimmer") {
    steps.push({
      key: "poolStructure",
      kind: "choice",
      question: "Havuzunuz liner mı, beton mu?",
      options: POOL_STRUCTURES,
    });
    const skimmers = a.poolStructure !== undefined ? SKIMMERS[String(a.poolStructure)] : undefined;
    if (skimmers) {
      steps.push({
        key: "skimmer",
        kind: "choice",
        question: "Hangi skimmer tipini tercih edersiniz?",
        options: skimmers,
      });
    }
  }

  // Merdiven
  steps.push({ key: "ladderSteps", kind: "choice", question: "Havuz merdiveni kaç basamaklı olsun?", options: LADDER_STEPS });
  steps.push({ key: "ladderType", kind: "choice", question: "Merdiven muro mu, standart mı olsun?", options: LADDER_TYPES });
  steps.push({ key: "ladderGrade", kind: "choice", question: "Merdiven hangi paslanmaz çelikten olsun?", options: STAINLESS_GRADES });

  // Şelale
  steps.push({ key: "waterfall", kind: "choice", question: "Şelale için ek pompa kullanılacak mı?", options: YES_NO });

  if (a.waterfall === "evet") {
    steps.push({
      key: "waterfallSize",
      kind: "choice",
      question: "Şelale ölçüsü ne olsun?",
      options: WATERFALLS.map(({ label, value, pump }) => ({ label, value, hint: `${pump} ek pompa ile` })),
    });
    steps.push({
      key: "waterfallGrade",
      kind: "choice",
      question: "Şelale hangi paslanmaz çelikten olsun?",
      options: STAINLESS_GRADES,
    });
    const waterfall = WATERFALLS.find((w) => w.value === a.waterfallSize);
    steps.push({
      key: "waterfallPumpPhase",
      kind: "choice",
      question: `Şelale için ${waterfall?.pump ?? ""} ek pompa eklenecek. Monofaze mi, trifaze mi?`,
      options: PUMP_PHASES,
    });
  }

  // Tesisat (sadece 620 mm'ye kadar olan filtrelerde sorulur)
  if (filterSize !== undefined && plumbingSizeChoices(filterSize).length > 1) {
    steps.push({
      key: "pipeSize",
      kind: "choice",
      question: "Tesisatta 50 mm mi, 63 mm mi boru kullanacaksınız?",
      options: PIPE_SIZE_OPTIONS,
    });
  }

  if (filterSize !== undefined) {
    // Aydınlatma
    steps.push({
      key: "lightType",
      kind: "choice",
      question: "Havuz lambası tipi ne olsun?",
      options: LIGHT_TYPES,
    });
    if (a.lightType === "gomme") {
      steps.push({
        key: "lightHousing",
        kind: "choice",
        question: "Gömme lamba için hangi kovan tipini tercih edersiniz?",
        options: RECESSED_HOUSINGS,
      });
    }
    const [minLights, maxLights] = lightCountRange(filterSize);
    steps.push({
      key: "lightCount",
      kind: "choice",
      question: `Kaç adet lamba kullanılacak? (${minLights}–${maxLights} arası)`,
      options: Array.from({ length: maxLights - minLights + 1 }, (_, i) => {
        const n = minLights + i;
        return { label: `${n} lamba`, value: String(n) };
      }),
    });

    // Elektrik panosu
    const pumpCount = 1 + (a.waterfall === "evet" ? 1 : 0);
    steps.push({
      key: "panel",
      kind: "choice",
      question: `${pumpCount} pompalı elektrik panosu eklenecek. Hangi kalite seviyesini tercih edersiniz?`,
      options: ELECTRIC_PANELS,
    });

    // Makine dairesi kapağı
    steps.push({
      key: "coverType",
      kind: "choice",
      question: `Filtreniz ${filterSize} mm. Makine dairesi kapağı hangi tipte olsun?`,
      options: MACHINE_ROOM_COVERS,
    });
    steps.push({
      key: "coverWidth",
      kind: "number",
      question: "Makine dairesi kapağının eni kaç cm?",
      unit: "cm",
      min: 30,
      max: 300,
      placeholder: "Örn. 80",
    });
    steps.push({
      key: "coverLength",
      kind: "number",
      question: "Makine dairesi kapağının boyu kaç cm?",
      unit: "cm",
      min: 30,
      max: 300,
      placeholder: "Örn. 120",
    });

    // Ek ürünler
    steps.push({
      key: "extras",
      kind: "choice",
      question: "Listenizi tamamlamadan önce: havuzunuz için bir robot ya da tuz klor cihazı düşünür müsünüz?",
      options: EXTRAS,
    });
  }

  return steps;
}

// Cevaplardan arka planda malzeme listesi oluşturur
export function buildMaterialList(a: Answers): ListItem[] {
  const items: ListItem[] = [];
  const filterSize = getFilterSize(a);
  if (filterSize === undefined) return items;

  let pumpCount = 0;

  // Filtre, kum ve filtre pompası
  if (a.filterMaterial !== undefined) {
    const material = FILTER_MATERIALS.find((m) => m.value === a.filterMaterial);
    items.push({ name: `${filterSize} mm ${lower(material?.label ?? "")} filtre`, quantity: "1 adet", note: material?.hint });

    const sand = sandFor(filterSize);
    if (sand !== undefined) {
      items.push({ name: "Kuvars kum", quantity: `${sand} kg` });
    }
  }
  if (a.pumpPhase !== undefined) {
    items.push({
      name: `${getPumpForFilter(filterSize) ?? ""} ${lower(labelOf(PUMP_PHASES, a.pumpPhase))} filtre pompası`,
      quantity: "1 adet",
    });
    pumpCount++;
  }

  // Taşma sistemi
  if (a.overflow === "izgara" && a.gratingType !== undefined) {
    const len = gratingLength(Number(a.length), Number(a.width));
    items.push({
      name: `${a.gratingWidth} cm ${lower(labelOf(GRATING_TYPES, a.gratingType))} taşma ızgarası`,
      quantity: `${fmt(len)} m`,
    });
  }
  if (a.overflow === "skimmer" && a.skimmer !== undefined) {
    items.push({
      name: labelOf(SKIMMERS[String(a.poolStructure)] ?? [], a.skimmer),
      quantity: "Ekibimiz belirleyecek",
    });
  }
  if (a.overflow === "gizli") {
    items.push({ name: "Gizli savak", quantity: "—", note: "Betonarme olarak sizin tarafınızdan yapılacak" });
  }

  // Merdiven
  if (a.ladderGrade !== undefined) {
    items.push({
      name: `${a.ladderSteps} basamaklı ${lower(labelOf(LADDER_TYPES, a.ladderType))} merdiven (${a.ladderGrade})`,
      quantity: "1 adet",
    });
  }

  // Şelale ve ek pompası
  const waterfall = WATERFALLS.find((w) => w.value === a.waterfallSize);
  if (a.waterfall === "evet" && waterfall && a.waterfallPumpPhase !== undefined) {
    items.push({ name: `${waterfall.label} şelale (${a.waterfallGrade})`, quantity: "1 adet" });
    items.push({
      name: `${waterfall.pump} ${lower(labelOf(PUMP_PHASES, a.waterfallPumpPhase))} şelale pompası`,
      quantity: "1 adet",
    });
    pumpCount++;
  }

  // Her pompa için bir plastik sehpa
  if (pumpCount > 0) {
    items.push({ name: "Plastik pompa sehpası", quantity: `${pumpCount} adet` });
  }

  // Elektrik panosu
  if (a.panel !== undefined) {
    const panel = ELECTRIC_PANELS.find((p) => p.value === a.panel);
    items.push({
      name: `${pumpCount} pompalı elektrik panosu (${panel?.label ?? ""})`,
      quantity: "1 adet",
      note: panel?.hint,
    });
  }

  // Makine dairesi kapağı
  if (a.coverLength !== undefined) {
    items.push({
      name: `${labelOf(MACHINE_ROOM_COVERS, a.coverType)} makine dairesi kapağı`,
      quantity: "1 adet",
      note: `${fmt(Number(a.coverWidth))} × ${fmt(Number(a.coverLength))} cm`,
    });
  }

  // Tesisat ve taban tesisatı
  const pipeSize = getPipeSize(a);
  const waterfallDone = a.waterfall === "hayir" || a.waterfallPumpPhase !== undefined;
  if (pipeSize !== undefined && waterfallDone) {
    const hasWaterfall = a.waterfall === "evet";
    for (const item of PLUMBING_ITEMS) {
      items.push({
        name: item.name(pipeSize),
        quantity: `${plumbingQuantity(item, hasWaterfall)} ${item.unit}`,
        group: "tesisat",
      });
    }

    const floor = floorFittings(filterSize);
    items.push({ name: "63 mm nozul", quantity: `${floor.nozzles} adet`, group: "tesisat" });
    items.push({ name: "25x25 dip emiş", quantity: `${floor.mainDrains} adet`, group: "tesisat" });
  }

  // Aydınlatma
  if (a.lightCount !== undefined) {
    const count = Number(a.lightCount);
    const lampName =
      a.lightType === "gomme"
        ? `${labelOf(RECESSED_HOUSINGS, a.lightHousing)} gömme lamba`
        : "Sıva üstü lamba";
    items.push({ name: lampName, quantity: `${count} adet`, group: "aydinlatma" });

    const transformer = transformerFor(count);
    items.push({
      name: transformer ? `${transformer} trafo` : "Trafo",
      quantity: transformer ? "1 adet" : "Ekibimiz belirleyecek",
      group: "aydinlatma",
    });
  }

  // Ek ürünler
  if (a.extras === "robot" || a.extras === "ikisi") {
    items.push({ name: ROBOT.name, quantity: "1 adet", note: ROBOT.description, group: "ekstra" });
  }
  if (a.extras === "tuz" || a.extras === "ikisi") {
    const volume = getVolume(a);
    items.push({
      name: SALT_SYSTEM.name,
      quantity: "1 adet",
      note: volume !== null ? `Havuz hacmi: ${fmt(volume)} m³` : undefined,
      group: "ekstra",
    });
  }

  return items;
}

export function formatAnswer(step: Step, value: string | number) {
  if (step.kind === "choice") {
    return step.options?.find((o) => o.value === String(value))?.label ?? String(value);
  }
  return `${String(value).replace(".", ",")} ${step.unit ?? ""}`;
}