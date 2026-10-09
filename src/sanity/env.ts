export const apiVersion = "2024-01-01";

// Gerçek Sanity projesi bağlanana kadar build'in kırılmaması için
// eksik ortam değişkenlerinde placeholder'a düşüyoruz; ürün verisi çekilirken
// (client.ts) bu durum ayrıca kontrol ediliyor.
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";

export const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);