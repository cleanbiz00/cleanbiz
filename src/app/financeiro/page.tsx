'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { Plus, Edit3, Trash2, DollarSign } from 'lucide-react'

const CATEGORIES = [
  'Equipamentos', 'Produtos de Limpeza', 'Transporte', 'Salários',
  'Marketing', 'Manutenção', 'Seguros', 'Outros'
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
        {data.map((item, index) => {
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
        })}
      </svg>
      
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
            <span className="text-gray-700">{item.label}</span>
            <span className="font-semibold ml-auto">${item.value.toFixed(2)}</span>
          </div>
        ))}
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
  const [chartPeriod, setChartPeriod] = useState('mes_atual') // mes_atual, ultimos_3_meses, ano
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
    <div className="p-6 pb-28 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Financeiro</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Nova Despesa</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Receita (Mês)</p>
              <p className="text-2xl font-bold text-green-600">${monthlyRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{allAppointments.filter(a => {
                const d = new Date(a.date)
                const now = new Date()
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && a.status !== 'Cancelado'
              }).length} serviços</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Despesas (Mês)</p>
              <p className="text-2xl font-bold text-red-600">${monthlyExpenses.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{expenses.filter(e => {
                const d = new Date(e.date)
                const now = new Date()
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
              }).length} registros</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Lucro (Mês)</p>
              <p className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${monthlyProfit.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Margem: {monthlyRevenue > 0 ? ((monthlyProfit / monthlyRevenue) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Lucro (Total)</p>
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                ${totalProfit.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Todos os períodos</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Despesas Registradas</h3>
        </div>
        
        {expenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Nenhuma despesa registrada ainda.</p>
            <p className="text-sm">Clique em "Nova Despesa" para começar.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {expenses.map(expense => (
              <div key={expense.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {expense.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        expense.type === 'Fixa' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expense.type}
                      </span>
                    </div>
                    <h4 className="text-lg font-medium mt-2">{expense.description}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(expense.date).toLocaleDateString('pt-BR')} • {expense.frequency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-600">${parseFloat(expense.amount).toFixed(2)}</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => openModal(expense)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteItem(expense.id)}
                        className="text-red-600 hover:text-red-800"
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

      {/* Financial Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Despesas por Categoria - GRÁFICO DE PIZZA */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
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

        {/* Evolução Temporal - GRÁFICO DE LINHA */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h3 className="text-lg font-semibold">Evolução no Tempo</h3>
            <div className="flex gap-2 flex-wrap">
              <select 
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value)}
                className="text-sm border rounded px-3 py-1"
              >
                <option value="mes_atual">Mês Atual</option>
                <option value="ultimos_3_meses">Últimos 3 Meses</option>
                <option value="ano">Ano Atual</option>
              </select>
              
              <select
                value={chartMetric}
                onChange={(e) => setChartMetric(e.target.value)}
                className="text-sm border rounded px-3 py-1"
              >
                <option value="lucro">Lucro</option>
                <option value="despesas">Despesas</option>
              </select>
            </div>
          </div>
          
          <LineChart 
            data={(() => {
              const now = new Date()
              let months: string[] = []
              
              if (chartPeriod === 'mes_atual') {
                // Mês atual - por dia
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
                const days = []
                
                for (let day = 1; day <= daysInMonth; day++) {
                  const dayDate = new Date(now.getFullYear(), now.getMonth(), day)
                  const nextDay = new Date(now.getFullYear(), now.getMonth(), day + 1)
                  
                  const dayRevenue = allAppointments
                    .filter(a => {
                      const d = new Date(a.date)
                      return a.status !== 'Cancelado' && d >= dayDate && d < nextDay
                    })
                    .reduce((sum, a) => sum + Number(a.price || 0), 0)
                  
                  const dayExpenses = expenses
                    .filter(e => {
                      const d = new Date(e.date)
                      return d >= dayDate && d < nextDay
                    })
                    .reduce((sum, e) => sum + Number(e.amount || 0), 0)
                  
                  days.push({
                    label: String(day),
                    value: chartMetric === 'lucro' ? (dayRevenue - dayExpenses) : dayExpenses
                  })
                }
                
                return days
              } else if (chartPeriod === 'ultimos_3_meses') {
                // Últimos 3 meses - por dia (últimos 90 dias)
                const days = []
                
                for (let i = 89; i >= 0; i--) {
                  const dayDate = new Date(now)
                  dayDate.setDate(now.getDate() - i)
                  dayDate.setHours(0, 0, 0, 0)
                  
                  const nextDay = new Date(dayDate)
                  nextDay.setDate(dayDate.getDate() + 1)
                  
                  const dayRevenue = allAppointments
                    .filter(a => {
                      const d = new Date(a.date)
                      return a.status !== 'Cancelado' && d >= dayDate && d < nextDay
                    })
                    .reduce((sum, a) => sum + Number(a.price || 0), 0)
                  
                  const dayExpenses = expenses
                    .filter(e => {
                      const d = new Date(e.date)
                      return d >= dayDate && d < nextDay
                    })
                    .reduce((sum, e) => sum + Number(e.amount || 0), 0)
                  
                  // Mostrar apenas alguns labels para não ficar muito poluído
                  const label = (i % 7 === 0) ? `${dayDate.getDate()}/${dayDate.getMonth() + 1}` : ''
                  
                  days.push({
                    label,
                    value: chartMetric === 'lucro' ? (dayRevenue - dayExpenses) : dayExpenses
                  })
                }
                
                return days
              } else {
                // Ano - 12 meses
                months = []
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
              }
            })()}
            label={chartMetric === 'lucro' ? 'Lucro' : 'Despesas'}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Despesa' : 'Nova Despesa'}
            </h3>
            
            <div className="space-y-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 border rounded-lg"
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
                className="w-full p-3 border rounded-lg"
              />
              
              <input
                type="number"
                placeholder="Valor"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="Fixa">Fixa</option>
                <option value="Variável">Variável</option>
              </select>
              
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="Única">Única</option>
                <option value="Mensal">Mensal</option>
                <option value="Semanal">Semanal</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Salvar
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
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
