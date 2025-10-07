'use client'

import React, { useState } from 'react'
import { Plus, Edit3, Trash2, Phone, Mail } from 'lucide-react'

export default function FuncionariosPage() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      phone: '(555) 111-2222',
      role: 'Supervisora'
    },
    {
      id: 2,
      name: 'Carlos Santos',
      email: 'carlos.santos@email.com',
      phone: '(555) 333-4444',
      role: 'Faxineiro'
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})

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

  const handleSave = () => {
    if (editingItem) {
      setEmployees(employees.map(e => e.id === editingItem.id ? { ...formData, id: editingItem.id } as any : e))
    } else {
      setEmployees([...employees, { ...formData, id: Date.now() } as any])
    }
    closeModal()
  }

  const deleteItem = (id: number) => {
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
