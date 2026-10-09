import { defineField, defineType } from "sanity";

// Ana sayfadaki sabit kategorilerle eşleşmesi için — src/data/content.ts'teki
// slug'larla birebir aynı olmalı.
const CATEGORY_OPTIONS = [
  { title: "Havuz Kimyasalları", value: "havuz-kimyasallari" },
  { title: "Havuz Temizleme Robotu", value: "havuz-temizleme-robotu" },
  { title: "Tuzlu Havuz Sistemleri", value: "tuzlu-havuz-sistemleri" },
  { title: "Havuz Aydınlatma", value: "havuz-aydinlatma" },
  { title: "Havuz Pompaları", value: "havuz-pompalari" },
  { title: "Havuz Ekipmanları", value: "havuz-ekipmanlari" },
];

const WIZARD_ROLE_OPTIONS = [
  { title: "Sihirbazda kullanılmıyor", value: "none" },
  { title: "Filtre", value: "filtre" },
  { title: "Pompa", value: "pompa" },
  { title: "Tuzlu Sistem", value: "tuz" },
  { title: "Temizleme Robotu", value: "robot" },
  { title: "Aydınlatma", value: "aydinlatma" },
  { title: "Kimyasal Paket", value: "kimyasal" },
];

export const productType = defineType({
  name: "product",
  title: "Ürün",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Ürün Adı",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL için)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categorySlug",
      title: "Kategori",
      type: "string",
      options: { list: CATEGORY_OPTIONS },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Açıklama",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Fotoğraf",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "variants",
      title: "Varyantlar (ör. ölçü, hacim)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "colors",
      title: "Renkler",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "price",
      title: "Fiyat (opsiyonel)",
      type: "string",
    }),
    defineField({
      name: "inStock",
      title: "Stokta",
      type: "boolean",
      initialValue: true,
    }),

        defineField({
      name: "wizardRole",
      title: "Sihirbazdaki Rolü",
      type: "string",
      options: { list: WIZARD_ROLE_OPTIONS, layout: "dropdown" },
      initialValue: "none",
    }),
    defineField({
      name: "flowRate",
      title: "Debi (m³/saat)",
      description: "Filtre için maksimum debi, pompa için sağladığı debi.",
      type: "number",
      validation: (rule) => rule.min(0),
      hidden: ({ document }) =>
        !["filtre", "pompa"].includes(document?.wizardRole as string),
    }),
    defineField({
      name: "maxVolume",
      title: "Maksimum Havuz Hacmi (m³)",
      description: "Bu ürünün uygun olduğu en büyük havuz hacmi.",
      type: "number",
      validation: (rule) => rule.min(0),
      hidden: ({ document }) =>
        !["tuz", "robot"].includes(document?.wizardRole as string),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "categorySlug", media: "image" },
  },
});