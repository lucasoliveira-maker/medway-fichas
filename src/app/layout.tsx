import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medway Fichas - Gerador de Fichas Médicas",
  description: "Plataforma para gerar fichas de educação médica com Medway Design System",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
