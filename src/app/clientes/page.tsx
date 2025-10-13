'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Phone, Mail, MapPin, Search } from 'lucide-react'
import { supabase } from '../../utils/supabaseClient'

export default function ClientesPage() {
  const [clients, setClients] = useState<any[]>([])
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

  // Load clients from database
  useEffect(() => {
    const loadClients = async () => {
      if (!userId) return

      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', userId)
          .order('name', { ascending: true })

        if (error) {
          console.error('Erro ao carregar clientes:', error)
          return
        }

        if (data) {
          const formattedClients = data.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            address: c.address,
            serviceType: c.service_type
          }))
          setClients(formattedClients)
        }
      } catch (error) {
        console.error('Erro ao carregar clientes:', error)
      }
    }

    loadClients()
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
      // Update existing client
      const { error } = await supabase
        .from('clients')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          service_type: formData.serviceType,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id)
        .eq('user_id', userId)

      if (error) {
        console.error('Erro ao atualizar cliente:', error)
        alert('Erro ao atualizar cliente')
        return
      }

      // Recarregar clientes
      const { data: reloadedClients } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true })
      
      if (reloadedClients) {
        setClients(reloadedClients.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          address: c.address,
          serviceType: c.service_type
        })))
      }
    } else {
      // Create new client
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert([
          {
            user_id: userId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            service_type: formData.serviceType
          }
        ])
        .select()

      if (error) {
        console.error('Erro ao criar cliente:', error)
        alert('Erro ao criar cliente')
        return
      }

      if (newClient && newClient.length > 0) {
        const formatted = {
          id: newClient[0].id,
          name: newClient[0].name,
          email: newClient[0].email,
          phone: newClient[0].phone,
          address: newClient[0].address,
          serviceType: newClient[0].service_type
        }
        setClients([...clients, formatted])
      }
    }
    closeModal()
  }

  const deleteItem = async (id: number) => {
    if (!userId) return

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Erro ao deletar cliente:', error)
      alert('Erro ao deletar cliente')
      return
    }

    setClients(clients.filter(c => c.id !== id))
  }

  // Filtrar clientes baseado no termo de busca
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      
      {/* Campo de busca */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, email, telefone, endereço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            {filteredClients.length} {filteredClients.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
          </p>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hidden lg:block">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Serviço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClients.map(client => (
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
                  <p>{client.serviceType}</p>
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
        {filteredClients.map(client => (
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
            </div>
            <div className="text-sm text-gray-700 mt-2">
              <span className="font-medium">Tipo:</span> {client.serviceType}
            </div>
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
