'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabaseClient'
import { Mail, Lock, LogIn } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 relative overflow-hidden">
      {/* Efeitos de fundo animados */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Card de Login Premium */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cleanbiz-gradient rounded-2xl shadow-2xl mb-4">
            <img src="/logo-icon.svg" alt="CleanBiz360" className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">CleanBiz360</h1>
          <p className="text-cyan-200">Sistema Premium de Gerenciamento</p>
        </div>
        
        {/* Form Card com Glassmorphism */}
        <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <input 
                  type="email" 
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:bg-white/20 transition-all" 
                  placeholder="seu@email.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            {/* Campo Senha */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <input 
                  type="password" 
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:bg-white/20 transition-all" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
            
            {/* Botão de Login */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-cleanbiz-gradient text-white py-3 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Entrar
                </>
              )}
            </button>
          </form>
          
          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-xs">
              Gestão profissional para seu negócio
            </p>
          </div>
        </div>
        
        {/* Badge de versão */}
        <div className="text-center mt-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-white/80 text-xs">
            <img src="/logo-icon.svg" alt="CleanBiz360" className="h-3 w-3" />
            Premium Edition
          </span>
        </div>
      </div>
    </div>
  )
}