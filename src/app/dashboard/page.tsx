'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { DollarSign } from 'lucide-react'

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Receita Mensal</p>
              <p className="text-2xl font-bold text-green-600">${financialData.revenue}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Despesas</p>
              <p className="text-2xl font-bold text-red-600">${financialData.expenses}</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Lucro Líquido</p>
              <p className="text-2xl font-bold text-blue-600">${financialData.profit}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Crescimento</p>
              <p className="text-2xl font-bold text-purple-600">+{financialData.monthlyGrowth}%</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Próximos Agendamentos</h3>
          <div className="space-y-3">
            {appointments.length > 0 ? (
              appointments.map(appointment => (
                <div key={appointment.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{getClientName(appointment.clientId)}</p>
                    <p className="text-sm text-gray-600">{appointment.date} - {appointment.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    appointment.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum agendamento futuro</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Clientes Ativos</h3>
          <div className="space-y-3">
            {clients.length > 0 ? (
              clients.map(client => (
                <div key={client.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.serviceType}</p>
                  </div>
                  <p className="font-semibold text-green-600">${client.price}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum cliente cadastrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
