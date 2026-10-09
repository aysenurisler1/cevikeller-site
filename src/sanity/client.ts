import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { apiVersion, dataset, projectId, isSanityConfigured } from "./env";

export const client = createClient({
  // Sanity projesi henüz bağlanmadıysa geçerli bir string vermemiz gerekiyor
  // (aksi halde createClient hata fırlatır); queries.ts zaten isSanityConfigured
  // false iken gerçek bir istek atmıyor.
  projectId: isSanityConfigured ? projectId : "placeholder",
  dataset,
  apiVersion,
  useCdn: true, // yayınlanmış (published) içerik için — hızlı, önbellekli okuma
});

const builder = createImageUrlBuilder(client);

export function urlForImage(source: Image) {
  return builder.image(source);
}