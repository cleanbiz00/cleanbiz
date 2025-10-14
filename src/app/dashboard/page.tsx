'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { DollarSign, TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [clients, setClients] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [allAppointments, setAllAppointments] = useState<any[]>([])

  const monthRange = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const toISO = (d: Date) => d.toISOString().slice(0, 10)
    return { start: toISO(start), end: toISO(end) }
  }, [])

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUserId(data.session?.user?.id || null)
    }
    loadUser()
  }, [])

  useEffect(() => {
    const loadMonthlyExpenses = async () => {
      if (!userId) return
      const { data, error } = await supabase
        .from('expenses')
        .select('amount, date')
        .eq('user_id', userId)
        .gte('date', monthRange.start)
        .lte('date', monthRange.end)
      if (!error && data) {
        const total = data.reduce((s, x) => s + Number(x.amount || 0), 0)
        setMonthlyExpenses(total)
      }
    }
    loadMonthlyExpenses()
  }, [monthRange, userId])

  // Carregar clientes do banco
  useEffect(() => {
    const loadClients = async () => {
      if (!userId) return
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', userId)
          .order('name', { ascending: true })
          .limit(3)
        
        if (!error && data) {
          setClients(data.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            address: c.address,
            serviceType: c.service_type,
            price: c.price,
            frequency: c.frequency
          })))
        }
      } catch (error) {
        console.error('Erro ao carregar clientes:', error)
      }
    }
    loadClients()
  }, [userId])

  // Carregar próximos agendamentos (para exibir na lista)
  useEffect(() => {
    const loadAppointments = async () => {
      if (!userId) return
      try {
        const today = new Date().toISOString().slice(0, 10)
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', userId)
          .gte('date', today)
          .order('date', { ascending: true })
          .order('time', { ascending: true })
          .limit(3)
        
        if (!error && data) {
          setAppointments(data.map((a: any) => ({
            id: a.id,
            clientId: a.client_id,
            employeeId: a.employee_id,
            date: a.date,
            time: a.time,
            status: a.status,
            service: a.service,
            price: a.price
          })))
        }
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error)
      }
    }
    loadAppointments()
  }, [userId])

  // Carregar TODOS os agendamentos para calcular receita mensal
  useEffect(() => {
    const loadAllAppointments = async () => {
      if (!userId) return
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', userId)
        
        if (!error && data) {
          setAllAppointments(data)
        }
      } catch (error) {
        console.error('Erro ao carregar todos agendamentos:', error)
      }
    }
    loadAllAppointments()
  }, [userId])

  // Calcular receita mensal baseada nos agendamentos (excluindo cancelados)
  const monthlyRevenue = useMemo(() => {
    return allAppointments
      .filter(apt => {
        if (apt.status === 'Cancelado') return false
        const aptDate = new Date(apt.date)
        const now = new Date()
        return aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum, apt) => sum + Number(apt.price || 0), 0)
  }, [allAppointments])

  const financialData = {
    revenue: monthlyRevenue,
    expenses: monthlyExpenses,
    profit: monthlyRevenue - monthlyExpenses,
    monthlyGrowth: 0 // Pode ser calculado comparando com mês anterior
  }

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId)
    return client ? client.name : 'Cliente não encontrado'
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      {/* Header Premium com Glassmorphism */}
      <div className="relative mb-8 p-8 rounded-3xl overflow-hidden bg-cleanbiz-gradient shadow-2xl" style={{
        boxShadow: '0 20px 60px rgba(6, 182, 212, 0.3)'
      }}>
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl shadow-lg">
              <img src="/favicon.svg" alt="CleanBiz360" className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Dashboard</h2>
              <p className="text-white/80 text-sm">Visão geral do seu negócio</p>
            </div>
          </div>
        </div>
        {/* Efeito de brilho */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Métricas Premium com Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Receita */}
        <div className="group relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Receita Mensal</p>
              </div>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ${financialData.revenue.toLocaleString('pt-BR')}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500 font-medium">Este mês</span>
            </div>
          </div>
        </div>
        
        {/* Card 2: Despesas */}
        <div className="group relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl shadow-lg">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Despesas</p>
              </div>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              ${financialData.expenses.toLocaleString('pt-BR')}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-500 font-medium">Este mês</span>
            </div>
          </div>
        </div>
        
        {/* Card 3: Lucro */}
        <div className="group relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Lucro Líquido</p>
              </div>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ${financialData.profit.toLocaleString('pt-BR')}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-blue-500 font-medium">Margem líquida</span>
            </div>
          </div>
        </div>
        
        {/* Card 4: Clientes */}
        <div className="group relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Clientes Ativos</p>
              </div>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {clients.length}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-purple-500 font-medium">Total cadastrados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seções de Listas com Visual Premium */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Agendamentos */}
        <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Próximos Agendamentos
            </h3>
          </div>
          <div className="space-y-3">
            {appointments.length > 0 ? (
              appointments.map(appointment => (
                <div key={appointment.id} className="group relative bg-gradient-to-r from-white to-blue-50/30 p-4 rounded-xl border border-blue-100/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex justify-between items-center">
                <div>
                      <p className="font-semibold text-gray-800">{getClientName(appointment.clientId)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <p className="text-sm text-gray-600">{appointment.date} • {appointment.time}</p>
                      </div>
                </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'Confirmado' 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-sm' 
                        : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-sm'
                }`}>
                  {appointment.status}
                </span>
              </div>
                  {/* Barra de progresso decorativa */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">Nenhum agendamento futuro</p>
              </div>
            )}
          </div>
        </div>

        {/* Clientes Ativos */}
        <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Clientes Ativos
            </h3>
          </div>
          <div className="space-y-3">
            {clients.length > 0 ? (
              clients.map(client => (
                <div key={client.id} className="group relative bg-gradient-to-r from-white to-purple-50/30 p-4 rounded-xl border border-purple-100/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex justify-between items-center">
                <div>
                      <p className="font-semibold text-gray-800">{client.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{client.serviceType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${client.price}
                      </p>
                      <p className="text-xs text-gray-500">{client.frequency}</p>
                    </div>
                  </div>
                  {/* Barra de progresso decorativa */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">Nenhum cliente cadastrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
