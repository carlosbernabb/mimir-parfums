import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIMIR Parfums — Fragancias de Élite",
  description: "Perfumes de lujo con esencia árabe. Colección exclusiva de fragancias únicas.",
  openGraph: {
    title: "MIMIR Parfums",
    description: "Fragancias de élite con alma árabe",
    images: ["/MIMIR_LOGO.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#080808",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full">{children}<Analytics /></body>
    </html>
  );
}
