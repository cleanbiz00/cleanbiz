import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CleanBiz360 - Transforme sua empresa de limpeza',
  description: 'O #1 SaaS para empresas de limpeza no mercado brasileiro nos EUA. Gerencie clientes, funcionários, agenda e financeiro em português.',
  keywords: 'empresa limpeza, house cleaning, SaaS, gestão, clientes, funcionários, agenda, financeiro, brasileiros EUA',
  authors: [{ name: 'CleanBiz360' }],
  openGraph: {
    title: 'CleanBiz360 - Transforme sua empresa de limpeza',
    description: 'O #1 SaaS para empresas de limpeza no mercado brasileiro nos EUA.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CleanBiz360 - Transforme sua empresa de limpeza',
    description: 'O #1 SaaS para empresas de limpeza no mercado brasileiro nos EUA.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#14b8a6" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
