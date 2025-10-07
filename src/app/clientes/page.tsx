'use client'

import React, { useState } from 'react'
import { Plus, Edit3, Trash2, Phone, Mail, MapPin } from 'lucide-react'

export default function ClientesPage() {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Maria Johnson',
      email: 'maria.johnson@email.com',
      phone: '(555) 123-4567',
      address: '123 Oak Street, Austin, TX',
      serviceType: 'Limpeza Residencial',
      price: 120,
      frequency: 'Semanal'
    },
    {
      id: 2,
      name: 'Robert Smith',
      email: 'robert.smith@email.com',
      phone: '(555) 987-6543',
      address: '456 Pine Avenue, Austin, TX',
      serviceType: 'Limpeza Comercial',
      price: 200,
      frequency: 'Quinzenal'
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
      setClients(clients.map(c => c.id === editingItem.id ? { ...formData, id: editingItem.id } as any : c))
    } else {
      setClients([...clients, { ...formData, id: Date.now() } as any])
    }
    closeModal()
  }

  const deleteItem = (id: number) => {
    setClients(clients.filter(c => c.id !== id))
  }

  return (
    <div className="p-6 pb-28 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hidden lg:block">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map(client => (
              <tr key={client.id}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {client.address}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="flex items-center">
                      <Phone size={14} className="mr-1" />
                      {client.phone}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <Mail size={14} className="mr-1" />
                      {client.email}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p>{client.serviceType}</p>
                    <p className="text-sm text-gray-600">{client.frequency}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-green-600 font-semibold">${client.price}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(client)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteItem(client.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {clients.map(client => (
          <div key={client.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {client.address}
                </p>
                <p className="text-sm flex items-center mt-1">
                  <Phone size={14} className="mr-1" /> {client.phone}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Mail size={14} className="mr-1" /> {client.email}
                </p>
              </div>
              <span className="text-green-600 font-semibold">${client.price}</span>
            </div>
            <div className="text-sm text-gray-700 mt-2">{client.serviceType}</div>
            <div className="text-xs text-gray-500">{client.frequency}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => openModal(client)} className="px-3 py-2 text-sm rounded bg-blue-50 text-blue-700 flex items-center gap-1">
                <Edit3 size={14} /> Editar
              </button>
              <button onClick={() => deleteItem(client.id)} className="px-3 py-2 text-sm rounded bg-red-50 text-red-700 flex items-center gap-1">
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Cliente' : 'Novo Cliente'}
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
              <input
                type="text"
                placeholder="Endereço"
                value={formData.address || ''}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <select
                value={formData.serviceType || ''}
                onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Selecione o tipo de serviço</option>
                <option value="Limpeza Residencial">Limpeza Residencial</option>
                <option value="Limpeza Comercial">Limpeza Comercial</option>
                <option value="Limpeza Pós-Obra">Limpeza Pós-Obra</option>
              </select>
              <input
                type="number"
                placeholder="Valor do Serviço"
                value={formData.price || ''}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full p-3 border rounded-lg"
              />
              <select
                value={formData.frequency || ''}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Selecione a frequência</option>
                <option value="Semanal">Semanal</option>
                <option value="Quinzenal">Quinzenal</option>
                <option value="Mensal">Mensal</option>
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
