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

// Teklif asistanındaki kartlar. Bir role atanan ürünün fotoğrafı,
// asistanda o karttaki ikonun yerine gösterilir.
const WIZARD_ROLE_OPTIONS = [
  { title: "Sihirbazda kullanılmıyor", value: "none" },
  { title: "Filtre", value: "filtre" },
  { title: "Kuvars kum", value: "kum" },
  { title: "Pompa", value: "pompa" },
  { title: "Pompa sehpası", value: "sehpa" },
  { title: "Taşma ızgarası", value: "izgara" },
  { title: "Skimmer", value: "skimmer" },
  { title: "Merdiven", value: "merdiven" },
  { title: "Şelale", value: "selale" },
  { title: "Elektrik panosu", value: "pano" },
  { title: "Makine dairesi kapağı", value: "kapak" },
  { title: "Gömme lamba", value: "lamba-gomme" },
  { title: "Sıva üstü lamba", value: "lamba-siva" },
  { title: "Trafo", value: "trafo" },
  { title: "Robot", value: "robot" },
  { title: "Tuz klor cihazı", value: "tuz" },
  { title: "Tesisat seti", value: "tesisat" },
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
      name: "options",
      title: "Çeşitler",
      description: "Ürün detay sayfasında fotoğraflı olarak listelenir (ör. fırça, kepçe, süpürge başlığı).",
      type: "array",
      of: [
        {
          type: "object",
          name: "productOption",
          title: "Çeşit",
          fields: [
            defineField({
              name: "name",
              title: "Çeşit Adı",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "group",
              title: "Grup",
              description:
                "Detay sayfasında bu başlık altında gösterilir (ör. Süpürgeler, Fırçalar). Aynı gruptakilere birebir aynı adı yaz.",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Fotoğraf",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "description",
              title: "Kısa Açıklama",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "code",
              title: "Ürün Kodu (opsiyonel)",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "group", media: "image" },
          },
        },
      ],
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
      title: "Teklif Asistanındaki Rolü",
      description: "Seçilirse bu ürünün fotoğrafı teklif asistanında ilgili kartta gösterilir.",
      type: "string",
      options: { list: WIZARD_ROLE_OPTIONS, layout: "dropdown" },
      initialValue: "none",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "categorySlug", media: "image" },
  },
});