'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    
    if (error) {
      setError(error.message)
      return
    }
    
    router.replace('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">CleanBiz</h1>
          <p className="text-gray-600">Sistema de Gerenciamento</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              type="password" 
              className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}