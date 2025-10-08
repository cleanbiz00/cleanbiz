import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "../components/AppLayout";

export const metadata: Metadata = {
  title: "CleanBiz - Sistema de Gerenciamento",
  description: "Sistema de gerenciamento para empresas de limpeza",
};

// Force rebuild - v3.0

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen bg-white">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}