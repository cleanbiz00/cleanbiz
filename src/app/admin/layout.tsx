'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabaseClient'

// Lista de emails autorizados para acessar o painel admin
const ADMIN_EMAILS = [
  'arthurperon01@gmail.com', // Seu email principal
  'arthur@cleanbiz360.com', // Email alternativo
  'arthur@gmail.com', // Email alternativo
  // Adicione outros emails de admin aqui se necessário
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.replace('/login')
          return
        }

        const userEmail = session.user.email
        
        console.log('Email do usuário:', userEmail)
        console.log('Emails autorizados:', ADMIN_EMAILS)
        console.log('Email está na lista?', userEmail ? ADMIN_EMAILS.includes(userEmail.toLowerCase()) : false)
        
        if (!userEmail || !ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
          console.log('Acesso negado para:', userEmail)
          // Não autorizado - redirecionar para dashboard
          router.replace('/dashboard')
          return
        }
        
        console.log('Acesso autorizado para:', userEmail)

        // Autorizado
        setIsAuthorized(true)
      } catch (error) {
        console.error('Erro ao verificar acesso admin:', error)
        router.replace('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Acesso Negado
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Você não tem permissão para acessar esta área administrativa.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
