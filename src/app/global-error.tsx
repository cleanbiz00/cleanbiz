'use client'

import React from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Erro inesperado</h2>
            <p className="text-sm text-gray-700 mb-4">Clique para tentar novamente.</p>
            <button onClick={() => reset()} className="bg-blue-600 text-white px-4 py-2 rounded">Tentar de novo</button>
          </div>
        </div>
      </body>
    </html>
  )
}


