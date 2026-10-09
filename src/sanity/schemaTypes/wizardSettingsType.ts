import { defineField, defineType } from "sanity";

export const wizardSettingsType = defineType({
  name: "wizardSettings",
  title: "Hesaplama Ayarları",
  type: "document",
  fields: [
    defineField({
      name: "privateTurnoverHours",
      title: "Devir Süresi – Özel/Villa Havuz (saat)",
      description: "Havuz suyunun tamamının filtreden kaç saatte bir geçmesi gerektiği.",
      type: "number",
      initialValue: 6,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "commercialTurnoverHours",
      title: "Devir Süresi – Otel/Ticari Havuz (saat)",
      type: "number",
      initialValue: 4,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "lightAreaPerUnit",
      title: "Aydınlatma – 1 lamba kaç m² su yüzeyine yeter",
      type: "number",
      initialValue: 15,
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Hesaplama Ayarları" }),
  },
});