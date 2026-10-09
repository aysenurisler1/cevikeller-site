import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Çevikeller | Plastik ve Havuz Ekipmanları",
  description:
    "Çevikeller Plastik ve Havuz Ekipmanları San. ve Tic. Ltd. Şti. — 25 yılı aşkın süredir havuz ekipmanları imalatı ve toptan satışı. İzmir.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}