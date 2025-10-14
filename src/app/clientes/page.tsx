'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Phone, Mail, MapPin, Search, Users } from 'lucide-react'
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
    <div className="p-4 md:p-6 pb-28 min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Premium */}
      <div className="relative mb-8 p-6 md:p-8 rounded-3xl overflow-hidden" style={{
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        boxShadow: '0 20px 60px rgba(168, 85, 247, 0.3)'
      }}>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-7 w-7 text-white" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Clientes</h2>
            </div>
            <p className="text-white/80 text-sm">Gerencie sua base de clientes</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-white/20 backdrop-blur-lg border border-white/30 text-white px-4 md:px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Novo Cliente</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Campo de busca Premium */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, email, telefone, endereço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-purple-200/50 dark:border-slate-600/50 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-lg transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2 ml-1 flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full font-medium">
              {filteredClients.length} {filteredClients.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
            </span>
          </p>
        )}
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hidden lg:block">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Contato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tipo de Serviço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredClients.map(client => (
              <tr key={client.id}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{client.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {client.address}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="flex items-center text-gray-900 dark:text-gray-100">
                      <Phone size={14} className="mr-1" />
                      {client.phone}
                    </p>
                    <p className="flex items-center text-gray-600 dark:text-gray-400">
                      <Mail size={14} className="mr-1" />
                      {client.email}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-900 dark:text-gray-100">{client.serviceType}</p>
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

      {/* Mobile cards Premium */}
      <div className="lg:hidden space-y-4">
        {filteredClients.map(client => (
          <div key={client.id} className="group relative bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-800 dark:to-purple-900/20 backdrop-blur-xl p-5 rounded-2xl border border-purple-100/50 dark:border-slate-600/50 hover:border-purple-300/50 dark:hover:border-purple-500/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{client.name}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">{client.serviceType}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin size={14} className="text-purple-400" />
                {client.address}
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone size={14} className="text-purple-400" />
                {client.phone}
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail size={14} className="text-purple-400" />
                {client.email}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => openModal(client)} 
                className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center gap-2 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
              >
                <Edit3 size={14} /> Editar
              </button>
              <button 
                onClick={() => deleteItem(client.id)} 
                className="px-4 py-2.5 text-sm rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white flex items-center gap-2 hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg transition-all"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
            {/* Barra decorativa no hover */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>

      {/* Modal Premium com Glassmorphism */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-white/20 dark:border-slate-600/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {editingItem ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome completo"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-purple-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-purple-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 border border-purple-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Endereço completo"
                value={formData.address || ''}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-3 border border-purple-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <select
                value={formData.serviceType || ''}
                onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                className="w-full p-3 border border-purple-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Selecione o tipo de serviço</option>
                <option value="Limpeza Residencial">Limpeza Residencial</option>
                <option value="Limpeza Comercial">Limpeza Comercial</option>
                <option value="Limpeza Pós-Obra">Limpeza Pós-Obra</option>
              </select>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Salvar
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-all font-medium"
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
