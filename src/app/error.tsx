'use client'

import React, { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // log client-side for debugging
    // console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Ocorreu um erro</h2>
        <p className="text-sm text-gray-700 mb-4">Tente novamente. Se persistir, recarregue a página.</p>
        <button onClick={() => reset()} className="bg-blue-600 text-white px-4 py-2 rounded">Tentar de novo</button>
      </div>
    </div>
  )
}


