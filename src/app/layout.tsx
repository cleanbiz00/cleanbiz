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
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#14b8a6" />
      </head>
      <body className="antialiased min-h-screen bg-white">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}