'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabaseClient'

export default function HomePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        
        if (data.session) {
          // Usuário está logado, vai para dashboard
          router.replace('/dashboard')
        } else {
          // Usuário não está logado, vai para login
          router.replace('/login')
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
        router.replace('/login')
      }
    }
    
    checkAuth()
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center bg-white text-gray-700">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Carregando...</p>
      </div>
    </div>
  )
}