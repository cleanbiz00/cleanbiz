'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Clock, Calendar, Mail, Grid3X3, List } from 'lucide-react'
import { supabase } from '../../utils/supabaseClient'
import CalendarView from '../../components/Schedule/CalendarView'

export default function AgendaPage() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      clientId: 1,
      employeeId: 1,
      date: '2024-08-18',
      time: '09:00',
      status: 'Agendado',
      service: 'Limpeza Completa',
      price: 120
    },
    {
      id: 2,
      clientId: 2,
      employeeId: 2,
      date: '2024-08-19',
      time: '14:00',
      status: 'Confirmado',
      service: 'Limpeza Escritório',
      price: 200
    }
  ])

  const [userId, setUserId] = useState<string | null>(null)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [emailConfigured, setEmailConfigured] = useState(false)
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState('calendar')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})

  const clients = [
    { id: 1, name: 'Maria Johnson', email: 'maria.johnson@email.com' },
    { id: 2, name: 'Robert Smith', email: 'robert.smith@email.com' }
  ]

  const employees = [
    { id: 1, name: 'Ana Silva' },
    { id: 2, name: 'Carlos Santos' }
  ]

  // Check for Google OAuth token on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const googleToken = urlParams.get('google_token')
    const refreshToken = urlParams.get('refresh_token')
    const error = urlParams.get('error')

    if (error) {
      console.error('Google OAuth error:', error)
      alert('Erro na autenticação do Google: ' + error)
    } else if (googleToken) {
      console.log('Google token received:', googleToken)
      setGoogleAccessToken(googleToken)
      setGoogleConnected(true)
      
      localStorage.setItem('google_access_token', googleToken)
      if (refreshToken) {
        localStorage.setItem('google_refresh_token', refreshToken)
      }
      
      window.history.replaceState({}, document.title, window.location.pathname)
    } else {
      const storedToken = localStorage.getItem('google_access_token')
      if (storedToken) {
        setGoogleAccessToken(storedToken)
        setGoogleConnected(true)
      } else {
        setGoogleConnected(false)
      }
    }
  }, [])

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUserId(data.session?.user?.id || null)
    }
    loadUser()
  }, [])

  // Check if Google Calendar is configured and connected
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const response = await fetch('/api/check-config')
        const result = await response.json()
        
        if (result.success) {
          setEmailConfigured(result.config.email)
          
          const storedToken = localStorage.getItem('google_access_token')
          setGoogleConnected(!!storedToken)
        }
      } catch (error) {
        console.error('Error checking config:', error)
      }
    }
    checkConfig()
  }, [])

  const handleGoogleAuth = async () => {
    // Force usar o subdomínio correto
    const baseUrl = 'https://app.cleanbiz360.com'
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirectUri = `${baseUrl}/api/google-calendar/auth`
    const scope = 'https://www.googleapis.com/auth/calendar'

    if (!clientId) {
      alert('Erro: Client ID do Google não configurado. Verifique as variáveis de ambiente.')
      return
    }

    // Obter userId atual para enviar como state
    const { data } = await supabase.auth.getSession()
    const currentUserId = data.session?.user?.id
    if (!currentUserId) {
      alert('Erro: Usuário não identificado. Faça login novamente.')
      return
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${encodeURIComponent(currentUserId)}`

    window.location.href = authUrl
  }

  const handleGoogleDisconnect = () => {
    localStorage.removeItem('google_access_token')
    localStorage.removeItem('google_refresh_token')
    setGoogleAccessToken(null)
    setGoogleConnected(false)
    console.log('Google Calendar disconnected')
  }

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId)
    return client ? client.name : 'Cliente não encontrado'
  }

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(e => e.id === employeeId)
    return employee ? employee.name : 'Funcionário não encontrado'
  }

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
    if (editingItem) {
      setAppointments(appointments.map(a => a.id === editingItem.id ? { ...formData, id: editingItem.id } as any : a))
    } else {
      const newAppointment = { ...formData, id: Date.now() } as any
      setAppointments([...appointments, newAppointment])
      
      // Send email notification for new appointments
      if (formData.clientEmail) {
        try {
          const client = clients.find(c => c.id === formData.clientId)
          const response = await fetch('/api/email/send-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              appointmentData: {
                service: formData.service,
                date: formData.date,
                time: formData.time,
                price: formData.price,
                status: formData.status,
                clientName: getClientName(formData.clientId),
                employeeName: getEmployeeName(formData.employeeId)
              },
              clientEmail: formData.clientEmail
            }),
          })
          
          const result = await response.json()
          if (result.success) {
            console.log('Email sent successfully:', result.messageId)
          } else {
            console.error('Failed to send email:', result.error)
          }
        } catch (error) {
          console.error('Error sending email:', error)
        }
      }

      // Create Google Calendar event
      try {
        // Get current user ID
        const { data } = await supabase.auth.getSession()
        const currentUserId = data.session?.user?.id
        
        if (currentUserId) {
          const calendarResponse = await fetch('/api/google-calendar/create-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: currentUserId,
              appointmentData: {
                service: formData.service,
                date: formData.date,
                time: formData.time,
                price: formData.price,
                status: formData.status,
                clientId: formData.clientId,
                employeeId: formData.employeeId,
                clientName: getClientName(formData.clientId),
                employeeName: getEmployeeName(formData.employeeId)
              },
              clientEmail: formData.clientEmail
            }),
          })
        
          const calendarResult = await calendarResponse.json()
          if (calendarResult.success) {
            console.log('Google Calendar event created:', calendarResult.eventId)
            alert(`Evento criado no Google Calendar! Link: ${calendarResult.eventUrl}`)
          } else {
            console.log('Google Calendar not connected or failed:', calendarResult.error)
            alert('Erro ao criar evento no Google Calendar: ' + calendarResult.error)
          }
        } else {
          console.log('Google access token not found')
        }
      } catch (error) {
        console.error('Error creating Google Calendar event:', error)
        alert('Erro ao criar evento no Google Calendar: ' + (error instanceof Error ? error.message : String(error)))
      }
    }
    closeModal()
  }

  const deleteItem = (id: number) => {
    setAppointments(appointments.filter(a => a.id !== id))
  }

  return (
    <div className="p-6 pb-28 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Agenda</h2>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded flex items-center space-x-2 transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid3X3 size={16} />
              <span className="hidden sm:inline">Calendário</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded flex items-center space-x-2 transition-colors ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List size={16} />
              <span className="hidden sm:inline">Lista</span>
            </button>
          </div>
          
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Novo Agendamento</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </div>
      
      {/* Integration Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Status das Integrações:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className={googleConnected ? 'text-green-600' : 'text-gray-400'} />
            <span className={googleConnected ? 'text-green-600' : 'text-gray-500'}>
              Google Calendar {googleConnected ? 'Configurado' : 'Não configurado'}
            </span>
            {!googleConnected ? (
              <button
                onClick={handleGoogleAuth}
                className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Conectar
              </button>
            ) : (
              <button
                onClick={handleGoogleDisconnect}
                className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Desconectar
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={16} className={emailConfigured ? 'text-green-600' : 'text-gray-400'} />
            <span className={emailConfigured ? 'text-green-600' : 'text-gray-500'}>
              Email {emailConfigured ? 'Configurado' : 'Não configurado'}
            </span>
          </div>
        </div>
        {(!googleConnected || !emailConfigured) && (
          <p className="text-xs text-gray-500 mt-2">
            {!googleConnected ? 'Clique em "Conectar" para sincronizar com seu Google Calendar.' : 'Configure as variáveis de ambiente para ativar as integrações.'}
          </p>
        )}
      </div>
      
      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <CalendarView
          appointments={appointments}
          openModal={openModal}
          deleteItem={deleteItem}
          getClientName={getClientName}
          getEmployeeName={getEmployeeName}
        />
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <>
          {/* Desktop table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hidden lg:block">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Funcionário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-gray-600">{appointment.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getClientName(appointment.clientId)}</td>
                    <td className="px-6 py-4">{getEmployeeName(appointment.employeeId)}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p>{appointment.service}</p>
                        <p className="text-sm text-green-600 font-semibold">${appointment.price}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 
                        appointment.status === 'Agendado' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(appointment)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => deleteItem(appointment.id)}
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
            {appointments.map(appointment => (
              <div key={appointment.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-gray-600">{appointment.date} • {appointment.time}</div>
                    <div className="font-medium">{getClientName(appointment.clientId)}</div>
                    <div className="text-sm text-gray-600">{getEmployeeName(appointment.employeeId)}</div>
                  </div>
                  <div className="text-green-600 font-semibold">${appointment.price}</div>
                </div>
                <div className="mt-1 text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    appointment.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 
                    appointment.status === 'Agendado' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>{appointment.status}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openModal(appointment)} className="px-3 py-2 text-sm rounded bg-blue-50 text-blue-700 flex items-center gap-1">
                    <Edit3 size={14} /> Editar
                  </button>
                  <button onClick={() => deleteItem(appointment.id)} className="px-3 py-2 text-sm rounded bg-red-50 text-red-700 flex items-center gap-1">
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Agendamento' : 'Novo Agendamento'}
            </h3>
            
            <div className="space-y-4">
              <select
                value={formData.clientId || ''}
                onChange={(e) => setFormData({...formData, clientId: e.target.value ? parseInt(e.target.value) : ''})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Selecione o cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
              <select
                value={formData.employeeId || ''}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value ? parseInt(e.target.value) : ''})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Selecione o funcionário</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="time"
                value={formData.time || ''}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Serviço"
                value={formData.service || ''}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Valor"
                value={formData.price || ''}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full p-3 border rounded-lg"
              />
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Selecione o status</option>
                <option value="Agendado">Agendado</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
              <input
                type="email"
                placeholder="Email do cliente (para notificações)"
                value={formData.clientEmail || ''}
                onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
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