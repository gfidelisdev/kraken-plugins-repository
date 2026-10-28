import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kraken Plugins Repository — Loja e Catálogo Oficial",
  description: "Repositório comunitário e oficial de plugins para Kraken Admin Tool hospedado no GitHub Pages.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
