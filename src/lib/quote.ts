import type { WizardProduct, WizardSettings } from "@/sanity/queries";

export type PoolInput = {
  poolType: "ozel" | "ticari";
  length: number;
  width: number;
  shallowDepth: number;
  deepDepth: number;
};

export type QuoteResult = {
  volume: number;          // m³
  surfaceArea: number;     // m²
  turnoverHours: number;   // saat
  requiredFlow: number;    // m³/saat
  filter: WizardProduct | null;
  pump: WizardProduct | null;
  light: WizardProduct | null;
  lightCount: number;
  salt: WizardProduct | null;
  robot: WizardProduct | null;
  chemicals: WizardProduct[];
};

function byRole(products: WizardProduct[], role: WizardProduct["wizardRole"]) {
  return products.filter((p) => p.wizardRole === role);
}

// Değere göre küçükten büyüğe sıralayıp ihtiyacı karşılayan İLK (en küçük) ürünü seçer.
function smallestFitting(
  products: WizardProduct[],
  field: "flowRate" | "maxVolume",
  needed: number,
  upperLimit = Infinity
) {
  return (
    [...products]
      .filter((p) => typeof p[field] === "number")
      .sort((a, b) => (a[field] as number) - (b[field] as number))
      .find((p) => (p[field] as number) >= needed && (p[field] as number) <= upperLimit) ?? null
  );
}

export function calculateQuote(
  input: PoolInput,
  products: WizardProduct[],
  settings: WizardSettings
): QuoteResult {
  const surfaceArea = input.length * input.width;
  const volume = (surfaceArea * (input.shallowDepth + input.deepDepth)) / 2;

  const turnoverHours =
    input.poolType === "ticari"
      ? settings.commercialTurnoverHours
      : settings.privateTurnoverHours;

  const requiredFlow = volume / turnoverHours;

  const filter = smallestFitting(byRole(products, "filtre"), "flowRate", requiredFlow);

  // Pompa debisi ihtiyacı karşılamalı ama filtrenin kaldırabileceği debiyi aşmamalı.
  const pumps = byRole(products, "pompa");
  const pump =
    smallestFitting(pumps, "flowRate", requiredFlow, filter?.flowRate ?? Infinity) ??
    smallestFitting(pumps, "flowRate", requiredFlow);

  const lightCount = Math.max(1, Math.ceil(surfaceArea / settings.lightAreaPerUnit));

  return {
    volume,
    surfaceArea,
    turnoverHours,
    requiredFlow,
    filter,
    pump,
    light: byRole(products, "aydinlatma")[0] ?? null,
    lightCount,
    salt: smallestFitting(byRole(products, "tuz"), "maxVolume", volume),
    robot: smallestFitting(byRole(products, "robot"), "maxVolume", volume),
    chemicals: byRole(products, "kimyasal"),
  };
}
