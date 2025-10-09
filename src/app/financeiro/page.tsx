'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { Plus, Edit3, Trash2, DollarSign } from 'lucide-react'

const CATEGORIES = [
  'Equipamentos', 'Produtos de Limpeza', 'Transporte', 'Salários',
  'Marketing', 'Manutenção', 'Seguros', 'Outros'
]

export default function FinanceiroPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [expenses, setExpenses] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
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
      if (!error && data) setAppointments(data)
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
      
      if (!error) {
        setExpenses(expenses.map(e => e.id === editingItem.id ? { ...editingItem, ...expenseData } : e))
      }
    } else {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select()
      
      if (!error && data) {
        setExpenses([data[0], ...expenses])
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
  const totalRevenue = appointments
    .filter(apt => apt.status !== 'Cancelado')
    .reduce((sum, apt) => sum + parseFloat(apt.price || 0), 0)

  // Calcular receita deste mês
  const monthlyRevenue = appointments
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
              <p className="text-xs text-gray-500 mt-1">{appointments.filter(a => {
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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
        {/* Despesas por Categoria */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
          <div className="space-y-3">
            {CATEGORIES.map(category => {
              const categoryTotal = expenses
                .filter(e => e.category === category)
                .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
              
              const percentage = totalExpenses > 0 ? (categoryTotal / totalExpenses) * 100 : 0
              
              if (categoryTotal === 0) return null
              
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{category}</span>
                    <span className="font-semibold">${categoryTotal.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {totalExpenses === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhuma despesa cadastrada</p>
            )}
          </div>
        </div>

        {/* Receita por Status */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Agendamentos por Status (Mês Atual)</h3>
          <div className="space-y-3">
            {['Agendado', 'Confirmado', 'Concluído', 'Cancelado'].map(status => {
              const statusAppointments = appointments.filter(a => {
                const d = new Date(a.date)
                const now = new Date()
                return a.status === status && 
                       d.getMonth() === now.getMonth() && 
                       d.getFullYear() === now.getFullYear()
              })
              const statusTotal = statusAppointments.reduce((sum, a) => sum + parseFloat(a.price || 0), 0)
              const count = statusAppointments.length
              
              if (count === 0) return null
              
              const colors = {
                'Agendado': 'bg-yellow-600',
                'Confirmado': 'bg-blue-600',
                'Concluído': 'bg-green-600',
                'Cancelado': 'bg-red-600'
              }
              
              return (
                <div key={status} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${colors[status]}`} />
                    <span className="font-medium">{status}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${statusTotal.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{count} agend.</p>
                  </div>
                </div>
              )
            })}
            {appointments.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum agendamento cadastrado</p>
            )}
          </div>
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
