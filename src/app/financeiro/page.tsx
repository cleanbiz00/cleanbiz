'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { Plus, Edit3, Trash2, DollarSign, TrendingUp, TrendingDown, Wallet, PieChart as PieChartIcon } from 'lucide-react'

const CATEGORIES = [
  'Despesas com Pessoal',
  'Materiais e Suprimentos',
  'Transporte/Veículos',
  'Despesas Administrativas',
  'Seguros e Licenças'
]

// Componente de Gráfico de Pizza
const PieChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) return <p className="text-gray-500 text-center py-8">Sem dados para exibir</p>
  
  let currentAngle = 0
  const radius = 80
  const centerX = 100
  const centerY = 100

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {data.length === 1 ? (
          // Se há apenas uma categoria, desenhar círculo completo
          <circle cx={centerX} cy={centerY} r={radius} fill={data[0].color} />
        ) : (
          // Se há múltiplas categorias, desenhar fatias
          data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const angle = (percentage / 100) * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle
            
            const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180)
            const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180)
            const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180)
            const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180)
            
            const largeArc = angle > 180 ? 1 : 0
            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
            
            currentAngle += angle
            
            return <path key={index} d={pathData} fill={item.color} />
          })
        )}
      </svg>
      
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-gray-700">{item.label}</span>
              <span className="font-semibold ml-auto">${item.value.toFixed(2)} ({percentage.toFixed(1)}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente de Gráfico de Linha
const LineChart = ({ data, label }: { data: { label: string, value: number }[], label: string }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const width = 600
  const height = 250
  const padding = 40

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => {
        const y = padding + (height - padding * 2) * (1 - percent)
        return (
          <g key={i}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={padding - 10} y={y + 4} fontSize="12" fill="#6b7280" textAnchor="end">
              ${(maxValue * percent).toFixed(0)}
            </text>
          </g>
        )
      })}
      
      {/* Line */}
      <polyline
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        points={data.map((point, index) => {
          const x = padding + ((width - padding * 2) / (data.length - 1 || 1)) * index
          const y = padding + (height - padding * 2) * (1 - point.value / maxValue)
          return `${x},${y}`
        }).join(' ')}
      />
      
      {/* Points */}
      {data.map((point, index) => {
        const x = padding + ((width - padding * 2) / (data.length - 1 || 1)) * index
        const y = padding + (height - padding * 2) * (1 - point.value / maxValue)
        return (
          <g key={index}>
            <circle cx={x} cy={y} r="5" fill="#3b82f6" />
            <text x={x} y={height - 10} fontSize="11" fill="#6b7280" textAnchor="middle">
              {point.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function FinanceiroPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [expenses, setExpenses] = useState<any[]>([])
  const [allAppointments, setAllAppointments] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [chartMetric, setChartMetric] = useState('lucro') // lucro, despesas
  const [formData, setFormData] = useState<any>({
    category: CATEGORIES[0],
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'Fixa',
    frequency: 'Única'
  })

  // Load current user id
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUserId(data.session?.user?.id || null)
    }
    getUser()
  }, [])

  // Load expenses from Supabase
  useEffect(() => {
    const loadExpenses = async () => {
      if (!userId) return
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
      if (!error && data) setExpenses(data)
    }
    loadExpenses()
  }, [userId])

  // Load appointments to calculate revenue
  useEffect(() => {
    const loadAppointments = async () => {
      if (!userId) return
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
      if (!error && data) setAllAppointments(data)
    }
    loadAppointments()
  }, [userId])


  const openModal = (item: any = null) => {
    setEditingItem(item)
    if (item) {
      setFormData({
        category: item.category,
        description: item.description,
        amount: item.amount,
        date: item.date,
        type: item.type,
        frequency: item.frequency
      })
    } else {
      setFormData({
        category: CATEGORIES[0],
        description: '',
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        type: 'Fixa',
        frequency: 'Única'
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const handleSave = async () => {
    if (!userId) return

    if (!formData.description || !formData.amount) {
      alert('Por favor, preencha descrição e valor')
      return
    }

    const expenseData = {
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      type: formData.type,
      frequency: formData.frequency,
      user_id: userId
    }

    if (editingItem) {
      const { error } = await supabase
        .from('expenses')
        .update(expenseData)
        .eq('id', editingItem.id)
        .eq('user_id', userId)
      
      if (error) {
        console.error('Erro ao atualizar despesa:', error)
        alert('Erro ao atualizar despesa')
        return
      }

      // Recarregar despesas
      const { data: reloadedExpenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
      
      if (reloadedExpenses) setExpenses(reloadedExpenses)
      alert('✅ Despesa atualizada!')
    } else {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select()
      
      if (error) {
        console.error('Erro ao salvar despesa:', error)
        alert('Erro ao salvar despesa')
        return
      }

      if (data) {
        // Recarregar despesas
        const { data: reloadedExpenses } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
        
        if (reloadedExpenses) setExpenses(reloadedExpenses)
        alert('✅ Despesa adicionada!')
      }
    }
    closeModal()
  }

  const deleteItem = async (id: number) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
    
    if (!error) {
      setExpenses(expenses.filter(e => e.id !== id))
    }
  }

  // Calcular receita (agendamentos excluindo cancelados)
  const totalRevenue = allAppointments
    .filter(apt => apt.status !== 'Cancelado')
    .reduce((sum, apt) => sum + parseFloat(apt.price || 0), 0)

  // Calcular receita deste mês
  const monthlyRevenue = allAppointments
    .filter(apt => {
      if (apt.status === 'Cancelado') return false
      const aptDate = new Date(apt.date)
      const now = new Date()
      return aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, apt) => sum + parseFloat(apt.price || 0), 0)

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0)

  // Despesas deste mês
  const monthlyExpenses = expenses
    .filter(e => {
      const expenseDate = new Date(e.date)
      const now = new Date()
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)

  const monthlyProfit = monthlyRevenue - monthlyExpenses
  const totalProfit = totalRevenue - totalExpenses

  return (
    <div className="p-4 md:p-6 pb-28 min-h-screen">
      {/* Header Premium */}
      <div className="relative mb-8 p-6 md:p-8 rounded-3xl overflow-hidden" style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
        boxShadow: '0 20px 60px rgba(245, 158, 11, 0.3)'
      }}>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="h-7 w-7 text-white" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Financeiro</h2>
            </div>
            <p className="text-white/80 text-sm">Controle completo das finanças</p>
          </div>
        <button
          onClick={() => openModal()}
            className="bg-white/20 backdrop-blur-lg border border-white/30 text-white px-4 md:px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Plus size={20} />
            <span className="hidden sm:inline">Nova Despesa</span>
            <span className="sm:hidden">Nova</span>
        </button>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Summary Cards Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Receita Mensal */}
        <div className="group relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Receita (Mês)</p>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ${monthlyRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">{allAppointments.filter(a => {
              const d = new Date(a.date)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && a.status !== 'Cancelado'
            }).length} serviços</p>
          </div>
        </div>
        
        {/* Despesas Mensais */}
        <div className="group relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl shadow-lg">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Despesas (Mês)</p>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              ${monthlyExpenses.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">{expenses.filter(e => {
              const d = new Date(e.date)
                  const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length} registros</p>
          </div>
        </div>
        
        {/* Lucro Mensal */}
        <div className="group relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Lucro (Mês)</p>
            </div>
            <p className={`text-3xl font-bold bg-gradient-to-r ${monthlyProfit >= 0 ? 'from-blue-600 to-indigo-600' : 'from-red-600 to-rose-600'} bg-clip-text text-transparent`}>
              ${monthlyProfit.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Margem: {monthlyRevenue > 0 ? ((monthlyProfit / monthlyRevenue) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
        
        {/* Lucro Total */}
        <div className="group relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Lucro (Total)</p>
            </div>
            <p className={`text-3xl font-bold bg-gradient-to-r ${totalProfit >= 0 ? 'from-purple-600 to-pink-600' : 'from-red-600 to-rose-600'} bg-clip-text text-transparent`}>
              ${totalProfit.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">Todos os períodos</p>
          </div>
        </div>
      </div>

      {/* Financial Reports Premium */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Despesas por Categoria - GRÁFICO DE PIZZA */}
        <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg">
              <PieChartIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Despesas por Categoria
            </h3>
          </div>
          <PieChart 
            data={CATEGORIES.map((category, index) => {
              const categoryTotal = expenses
                .filter(e => e.category === category)
                .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
              
              const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b']
              
              return {
                label: category,
                value: categoryTotal,
                color: colors[index % colors.length]
              }
            }).filter(item => item.value > 0)}
          />
        </div>

        {/* Evolução Anual - GRÁFICO DE LINHA */}
        <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg" style={{
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Evolução Anual
              </h3>
            </div>
            <select
              value={chartMetric}
              onChange={(e) => setChartMetric(e.target.value)}
              className="text-sm border border-blue-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="lucro">Lucro Total</option>
              <option value="despesas">Despesas</option>
            </select>
          </div>
          
          <LineChart 
            data={(() => {
              const now = new Date()
              const months: string[] = []
              
              // Últimos 12 meses
              for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
                months.push(date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''))
              }
              
              return months.map((month, index) => {
                const monthDate = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1)
                const nextMonth = new Date(now.getFullYear(), now.getMonth() - (11 - index) + 1, 1)
                
                const monthRevenue = allAppointments
                  .filter(a => {
                    const d = new Date(a.date)
                    return a.status !== 'Cancelado' && d >= monthDate && d < nextMonth
                  })
                  .reduce((sum, a) => sum + Number(a.price || 0), 0)
                
                const monthExpenses = expenses
                  .filter(e => {
                    const d = new Date(e.date)
                    return d >= monthDate && d < nextMonth
                  })
                  .reduce((sum, e) => sum + Number(e.amount || 0), 0)
                
                return {
                  label: month,
                  value: chartMetric === 'lucro' ? (monthRevenue - monthExpenses) : monthExpenses
                }
              })
            })()}
            label={chartMetric === 'lucro' ? 'Lucro' : 'Despesas'}
          />
        </div>
      </div>

      {/* Expenses List Premium */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden" style={{
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
      }}>
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
          <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Despesas Registradas
          </h3>
        </div>
        
        {expenses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl inline-block mb-4">
              <DollarSign size={48} className="text-orange-400" />
            </div>
            <p className="text-gray-600 font-medium">Nenhuma despesa registrada ainda.</p>
            <p className="text-sm text-gray-500 mt-1">Clique em "Nova Despesa" para começar.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {expenses.map(expense => (
              <div key={expense.id} className="group p-6 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-amber-50/50 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs rounded-full font-medium">
                        {expense.category}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        expense.type === 'Fixa' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                          : 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
                      }`}>
                        {expense.type}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">{expense.description}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(expense.date).toLocaleDateString('pt-BR')} • {expense.frequency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openModal(expense)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteItem(expense.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Premium com Glassmorphism */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {editingItem ? 'Editar Despesa' : 'Nova Despesa'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Descrição da despesa"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              />
              
              <input
                type="number"
                placeholder="Valor"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              />
              
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              />
              
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              >
                <option value="Fixa">Fixa</option>
                <option value="Variável">Variável</option>
              </select>
              
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                className="w-full p-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              >
                <option value="Única">Única</option>
                <option value="Mensal">Mensal</option>
                <option value="Semanal">Semanal</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Salvar
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-all font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
