'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../utils/supabaseClient'
import { Menu, Home, Users, Calendar, DollarSign, LogOut } from 'lucide-react'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Verificar autenticação apenas uma vez ao montar
  useEffect(() => {
    const checkAuth = async () => {
      // Se for página de login, apenas renderizar
      if (pathname === '/login') {
        setIsReady(true)
        return
      }

      try {
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
          router.replace('/login')
        } else {
          setIsReady(true)
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
        router.replace('/login')
      }
    }
    
    checkAuth()
  }, [pathname, router])

  // Fechar sidebar ao navegar
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      window.location.href = '/login'
    }
  }

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/clientes', label: 'Clientes', icon: Users },
    { path: '/funcionarios', label: 'Funcionários', icon: Users },
    { path: '/agenda', label: 'Agenda', icon: Calendar },
    { path: '/financeiro', label: 'Financeiro', icon: DollarSign },
  ]

  // Se for página de login, renderizar sem layout
  if (pathname === '/login') {
    return <>{children}</>
  }

  // Se ainda não verificou a autenticação, mostrar loading
  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  // Renderizar layout completo
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="w-64 bg-blue-900 text-white h-full p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold">CleanBiz</h1>
            <p className="text-blue-200 text-sm">Sistema de Gestão</p>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 rounded-lg transition-colors bg-blue-800 hover:bg-blue-700 mt-6"
            >
              <LogOut size={20} />
              <span className="ml-3">Sair</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-blue-900 text-white p-4">
            <div className="mb-8">
              <h1 className="text-xl font-bold">CleanBiz</h1>
              <p className="text-blue-200 text-sm">Sistema de Gestão</p>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-700' : 'hover:bg-blue-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-3 rounded-lg transition-colors bg-blue-800 hover:bg-blue-700 mt-6"
              >
                <LogOut size={20} />
                <span className="ml-3">Sair</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b p-3 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 rounded hover:bg-gray-100 active:bg-gray-200"
          >
            <Menu size={22} />
          </button>
          <span className="font-semibold">CleanBiz</span>
          <span className="w-6" />
        </div>

        {children}
      </div>
    </div>
  )
}
