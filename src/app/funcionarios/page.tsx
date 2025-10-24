'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Phone, Mail, Search, Briefcase } from 'lucide-react'
import { supabase } from '../../utils/supabaseClient'

export default function FuncionariosPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [searchTerm, setSearchTerm] = useState('')

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUserId(data.session?.user?.id || null)
    }
    loadUser()
  }, [])

  // Load employees from database
  useEffect(() => {
    const loadEmployees = async () => {
      if (!userId) return

      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('user_id', userId)
          .order('name', { ascending: true })

        if (error) {
          console.error('Erro ao carregar funcionários:', error)
          return
        }

        if (data) {
          setEmployees(data)
        }
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error)
      }
    }

    loadEmployees()
  }, [userId])

  const openModal = (item: any = null) => {
    setEditingItem(item)
    setFormData(item || {})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setFormData({})
    setEditingItem(null)
  }

  const handleSave = async () => {
    if (!userId) {
      alert('Erro: Usuário não identificado. Faça login novamente.')
      return
    }

    if (editingItem) {
      // Update existing employee
      const { error } = await supabase
        .from('employees')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id)
        .eq('user_id', userId)

      if (error) {
        console.error('Erro ao atualizar funcionário:', error)
        alert('Erro ao atualizar funcionário')
        return
      }

      setEmployees(employees.map(e => e.id === editingItem.id ? { ...formData, id: editingItem.id } as any : e))
    } else {
      // Create new employee
      const { data: newEmployee, error } = await supabase
        .from('employees')
        .insert([
          {
            user_id: userId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role
          }
        ])
        .select()

      if (error) {
        console.error('Erro ao criar funcionário:', error)
        alert('Erro ao criar funcionário')
        return
      }

      if (newEmployee && newEmployee.length > 0) {
        setEmployees([...employees, newEmployee[0]])
      }
    }
    closeModal()
  }

  const deleteItem = async (id: number) => {
    if (!userId) return

    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Erro ao deletar funcionário:', error)
      alert('Erro ao deletar funcionário')
      return
    }

    setEmployees(employees.filter(e => e.id !== id))
  }

  // Filtrar funcionários baseado no termo de busca
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone.includes(searchTerm) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 pb-28 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Premium */}
      <div className="relative mb-8 p-6 md:p-8 rounded-3xl overflow-hidden" style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)'
      }}>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="h-7 w-7 text-white" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Funcionários</h2>
            </div>
            <p className="text-white/80 text-sm">Gerencie sua equipe</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-white/20 dark:bg-slate-800/20 backdrop-blur-lg border border-white/30 text-white px-4 md:px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Novo Funcionário</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white dark:bg-slate-800/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Campo de busca Premium */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, email, telefone, cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-green-200/50 dark:border-slate-600/50 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-lg transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 dark:text-gray-200 mt-2 ml-1 flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full font-medium">
              {filteredEmployees.length} {filteredEmployees.length === 1 ? 'funcionário encontrado' : 'funcionários encontrados'}
            </span>
          </p>
        )}
      </div>
      
      {/* Grid de Cards Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="group relative bg-gradient-to-br from-white to-green-50/30 dark:from-slate-800 dark:to-green-900/20 backdrop-blur-xl p-6 rounded-2xl border border-green-100/50 dark:border-slate-600/50 hover:border-green-300/50 dark:hover:border-green-500/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{employee.name}</h3>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                    <Briefcase size={12} />
                    {employee.role}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(employee)}
                    className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/70 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteItem(employee.id)}
                    className="p-2 rounded-lg bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/70 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                  <Phone size={14} className="text-green-500" />
                  {employee.phone}
                </p>
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                  <Mail size={14} className="text-green-500" />
                  {employee.email}
                </p>
              </div>
            </div>
            {/* Barra decorativa no hover */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>

      {/* Modal Premium com Glassmorphism */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {editingItem ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome completo"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-green-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-green-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 border border-green-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <select
                value={formData.role || ''}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-3 border border-green-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Selecione o cargo</option>
                <option value="Supervisora">Supervisora</option>
                <option value="Faxineiro">Faxineiro</option>
                <option value="Assistente">Assistente</option>
              </select>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Salvar
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl hover:bg-gray-300 transition-all font-medium"
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
