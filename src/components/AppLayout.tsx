'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../utils/supabaseClient'
import { Menu, Home, Users, Calendar, DollarSign, LogOut, Briefcase } from 'lucide-react'

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
    { path: '/dashboard', label: 'Dashboard', icon: Home, gradient: 'from-cyan-400 to-blue-500' },
    { path: '/clientes', label: 'Clientes', icon: Users, gradient: 'from-teal-400 to-cyan-500' },
    { path: '/funcionarios', label: 'Funcionários', icon: Briefcase, gradient: 'from-cyan-500 to-blue-600' },
    { path: '/agenda', label: 'Agenda', icon: Calendar, gradient: 'from-blue-500 to-indigo-600' },
    { path: '/financeiro', label: 'Financeiro', icon: DollarSign, gradient: 'from-indigo-500 to-purple-600' },
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  // Renderizar layout completo
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      {/* Desktop Sidebar Premium */}
      <div className="hidden lg:block">
        <div className="w-72 h-screen sticky top-0 bg-gradient-to-b from-slate-100 via-cyan-50 to-blue-100 text-slate-800 p-6 shadow-2xl border-r border-slate-200">
          {/* Logo Premium */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cleanbiz-gradient rounded-lg shadow-md">
                <img src="/favicon.png" alt="CleanBiz360" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">CleanBiz360</h1>
                <p className="text-slate-600 text-xs">Sistema Premium</p>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`group w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/80 backdrop-blur-xl border border-cleanbiz-200 shadow-lg' 
                      : 'hover:bg-white/60 hover:translate-x-1'
                  }`}
                >
                  <div className={`p-2 bg-gradient-to-br ${item.gradient} rounded-lg shadow-md ${isActive ? 'shadow-lg' : 'group-hover:shadow-lg'} transition-shadow`}>
                    <Icon size={18} />
                  </div>
                  <span className={`font-medium ${isActive ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'} transition-colors`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-8 bg-cleanbiz-gradient rounded-full"></div>
                  )}
                </button>
              )
            })}
            
            {/* Botão Sair */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 mt-8"
            >
              <div className="p-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-lg shadow-md">
                <LogOut size={18} />
              </div>
              <span className="font-medium text-red-600">Sair</span>
            </button>
          </nav>
          
          {/* Badge Premium no fundo */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/80 backdrop-blur-lg border border-slate-200 rounded-xl p-3 text-center">
              <p className="text-slate-600 text-xs flex items-center justify-center gap-2">
                <img src="/favicon.png" alt="CleanBiz360" className="h-3 w-3" />
                Premium Edition
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Premium */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-slate-100 via-cyan-50 to-blue-100 text-slate-800 p-6 shadow-2xl border-r border-slate-200">
            {/* Logo Premium */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-cleanbiz-gradient rounded-lg shadow-md">
                  <img src="/favicon.png" alt="CleanBiz360" className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">CleanBiz360</h1>
                  <p className="text-slate-600 text-xs">Sistema Premium</p>
                </div>
              </div>
            </div>
            
            {/* Menu Items */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`group w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/80 backdrop-blur-xl border border-cleanbiz-200 shadow-lg' 
                        : 'hover:bg-white/60 hover:translate-x-1'
                    }`}
                  >
                    <div className={`p-2 bg-gradient-to-br ${item.gradient} rounded-lg shadow-md ${isActive ? 'shadow-lg' : 'group-hover:shadow-lg'} transition-shadow`}>
                      <Icon size={18} />
                    </div>
                    <span className={`font-medium ${isActive ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'} transition-colors`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-8 bg-cleanbiz-gradient rounded-full"></div>
                    )}
                  </button>
                )
              })}
              
              {/* Botão Sair */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 mt-8"
              >
                <div className="p-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-lg shadow-md">
                  <LogOut size={18} />
                </div>
                <span className="font-medium text-red-600">Sair</span>
              </button>
            </nav>
            
            {/* Badge Premium no fundo */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/80 backdrop-blur-lg border border-slate-200 rounded-xl p-3 text-center">
                <p className="text-slate-600 text-xs flex items-center justify-center gap-2">
                  <img src="/favicon.png" alt="CleanBiz360" className="h-3 w-3" />
                  Premium Edition
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-screen overflow-y-auto">
        {/* Mobile Header Premium */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/20 p-4 flex items-center justify-between shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 rounded-xl hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 active:scale-95 transition-all"
          >
            <Menu size={22} className="text-cyan-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <img src="/favicon.png" alt="CleanBiz360" className="h-5 w-5" />
            </div>
            <span className="font-bold text-slate-800">
              CleanBiz360
            </span>
          </div>
          <span className="w-10" />
        </div>

        {children}
      </div>
    </div>
  )
}
