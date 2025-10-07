'use client'

import { useEffect, useState } from 'react'

export default function DebugOAuth() {
  const [info, setInfo] = useState<any>(null)

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.cleanbiz360.com'
    const redirectUri = `${baseUrl}/api/google-calendar/auth`
    const scope = 'https://www.googleapis.com/auth/calendar'
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`

    setInfo({
      clientId,
      baseUrl,
      redirectUri,
      authUrl,
      encodedRedirectUri: encodeURIComponent(redirectUri)
    })
  }, [])

  if (!info) return <div className="p-8">Carregando...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Google OAuth</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Client ID:</h2>
          <code className="text-sm break-all">{info.clientId}</code>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Base URL:</h2>
          <code className="text-sm">{info.baseUrl}</code>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Redirect URI (o que você deve adicionar no Google Console):</h2>
          <code className="text-sm break-all">{info.redirectUri}</code>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Redirect URI Encoded:</h2>
          <code className="text-sm break-all">{info.encodedRedirectUri}</code>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Full Auth URL:</h2>
          <code className="text-sm break-all">{info.authUrl}</code>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h2 className="font-semibold mb-2">⚠️ Instruções:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Copie exatamente o <strong>Redirect URI</strong> acima</li>
          <li>Vá para o Google Cloud Console</li>
          <li>APIs & Services → Credentials</li>
          <li>Clique no seu OAuth 2.0 Client ID</li>
          <li>Em "Authorized redirect URIs", adicione exatamente essa URL</li>
          <li>Salve e aguarde 5 minutos</li>
        </ol>
      </div>

      <div className="mt-4">
        <button
          onClick={() => window.location.href = info.authUrl}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Testar Google OAuth
        </button>
      </div>
    </div>
  )
}

