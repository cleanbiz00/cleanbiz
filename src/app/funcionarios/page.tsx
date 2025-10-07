'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Phone, Mail } from 'lucide-react'
import { supabase } from '../../utils/supabaseClient'

export default function FuncionariosPage() {
  const [employees, setEmployees] = useState([])
  const [userId, setUserId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})

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

  return (
    <div className="p-6 pb-28 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Funcionários</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Novo Funcionário</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(employee => (
          <div key={employee.id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{employee.name}</h3>
                <p className="text-blue-600">{employee.role}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(employee)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => deleteItem(employee.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center">
                <Phone size={14} className="mr-2" />
                {employee.phone}
              </p>
              <p className="flex items-center">
                <Mail size={14} className="mr-2" />
                {employee.email}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Funcionário' : 'Novo Funcionário'}
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <select
                value={formData.role || ''}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Selecione o cargo</option>
                <option value="Supervisora">Supervisora</option>
                <option value="Faxineiro">Faxineiro</option>
                <option value="Assistente">Assistente</option>
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
