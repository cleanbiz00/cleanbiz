import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "../components/AppLayout";

export const metadata: Metadata = {
  title: "CleanBiz360 - Sistema Premium de Gerenciamento",
  description: "Sistema premium de gerenciamento para empresas de limpeza e serviços",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

// Force rebuild - v4.0 - Updated favicon and logo

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#14b8a6" />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
              } else {
                document.documentElement.classList.remove('dark')
              }
            } catch (_) {}
          `
        }} />
      </head>
      <body className="antialiased min-h-screen bg-white dark:bg-slate-900">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}