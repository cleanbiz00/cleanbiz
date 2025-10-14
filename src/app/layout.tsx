import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "../components/AppLayout";

export const metadata: Metadata = {
  title: "CleanBiz360 - Sistema Premium de Gerenciamento",
  description: "Sistema premium de gerenciamento para empresas de limpeza e serviços",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
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