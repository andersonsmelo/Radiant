import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radiant Editorial",
  description: "Painel editorial do Radiant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-950 text-gray-100 min-h-screen font-mono">
        <nav className="border-b border-gray-800 px-6 py-3 flex gap-6 text-sm">
          <a href="/" className="text-indigo-400 hover:text-indigo-300">Status</a>
          <a href="/bundles" className="text-indigo-400 hover:text-indigo-300">Bundles</a>
          <a href="/graph" className="text-indigo-400 hover:text-indigo-300">Grafo</a>
          <a href="/promote" className="text-indigo-400 hover:text-indigo-300">Promover</a>
        </nav>
        <main className="px-6 py-6 max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
