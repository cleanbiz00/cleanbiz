'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Clock, Calendar, Mail, Grid3X3, List } from 'lucide-react'
import { supabase } from '../../utils/supabaseClient'
import CalendarView from '../../components/Schedule/CalendarView'

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [emailConfigured, setEmailConfigured] = useState(false)
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState('calendar')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})

  // Check Google connection on load (via Supabase) and handle OAuth return
  useEffect(() => {
    const check = async () => {
      const params = new URLSearchParams(window.location.search)
      const oauthOk = params.get('google_connected') === 'success'
      const err = params.get('error')

      if (err) {
        console.error('Google OAuth error:', err)
        alert('Erro na autenticação do Google: ' + err)
        window.history.replaceState({}, document.title, window.location.pathname)
      }

      // Ensure we have user
      const { data } = await supabase.auth.getSession()
      const uid = data.session?.user?.id || null
      setUserId(uid)

      if (!uid) {
        setGoogleConnected(false)
        return
      }

      // Query app_users for token
      try {
        const { data: row, error: qerr } = await supabase
          .from('app_users')
          .select('google_access_token')
          .or(`id.eq.${uid},auth_user_id.eq.${uid}`)
          .limit(1)
          .maybeSingle()

        if (qerr) {
          console.error('Erro ao consultar conexão do Google:', qerr)
          setGoogleConnected(false)
        } else {
          const connected = !!row?.google_access_token
          setGoogleConnected(connected)
          if (oauthOk) {
            if (connected) alert('Google Calendar conectado com sucesso! ✅')
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        }
      } catch (e) {
        console.error('Erro inesperado ao verificar conexão Google:', e)
        setGoogleConnected(false)
      }
    }
    check()
  }, [])

  // Load current user
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
            email: c.email
          }))
          setClients(formattedClients)
          console.log('✅ Clientes carregados:', formattedClients.length)
        }
      } catch (error) {
        console.error('Erro ao carregar clientes:', error)
      }
    }

    loadClients()
  }, [userId])

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
          const formattedEmployees = data.map(e => ({
            id: e.id,
            name: e.name
          }))
          setEmployees(formattedEmployees)
          console.log('✅ Funcionários carregados:', formattedEmployees.length)
        }
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error)
      }
    }

    loadEmployees()
  }, [userId])

  // Load appointments from database when userId changes
  useEffect(() => {
    const loadAppointments = async () => {
      if (!userId) return

      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: true })

        if (error) {
          console.error('Erro ao carregar agendamentos:', error)
          return
        }

        if (data) {
          // Convert database format to app format
          const formattedAppointments = data.map(apt => ({
            id: apt.id,
            clientId: apt.client_id,
            employeeId: apt.employee_id,
            date: apt.date,
            time: apt.time,
            status: apt.status,
            service: apt.service,
            price: apt.price,
            clientEmail: apt.client_email,
            googleEventId: apt.google_event_id
          }))
          setAppointments(formattedAppointments)
          console.log('✅ Agendamentos carregados:', formattedAppointments.length)
        }
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error)
      }
    }

    loadAppointments()
  }, [userId])

  // Check only email integration flag
  useEffect(() => {
    const checkEmail = async () => {
      try {
        const response = await fetch('/api/check-config')
        const result = await response.json()
        if (result.success) setEmailConfigured(result.config.email)
      } catch (error) {
        console.error('Error checking config:', error)
      }
    }
    checkEmail()
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
    if (!userId) {
      alert('Erro: Usuário não identificado. Faça login novamente.')
      return
    }

    if (editingItem) {
      // Update existing appointment in database
      const { error } = await supabase
        .from('appointments')
        .update({
          client_id: formData.clientId,
          employee_id: formData.employeeId,
          date: formData.date,
          time: formData.time,
          status: formData.status,
          service: formData.service,
          price: formData.price,
          client_email: formData.clientEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id)
        .eq('user_id', userId)

      if (error) {
        console.error('Erro ao atualizar agendamento:', error)
        alert('Erro ao atualizar agendamento')
        return
      }

      // Update local state
      setAppointments(appointments.map(a => a.id === editingItem.id ? { ...formData, id: editingItem.id } as any : a))
    } else {
      let googleEventId = null
      
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
        const calendarResponse = await fetch('/api/google-calendar/create-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
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
          googleEventId = calendarResult.eventId
        } else {
          console.log('Google Calendar not connected or failed:', calendarResult.error)
        }
      } catch (error) {
        console.error('Error creating Google Calendar event:', error)
      }

      // Save appointment to database
      const { data: newApt, error } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: userId,
            client_id: formData.clientId,
            employee_id: formData.employeeId,
            date: formData.date,
            time: formData.time,
            status: formData.status || 'Agendado',
            service: formData.service,
            price: formData.price,
            client_email: formData.clientEmail,
            google_event_id: googleEventId
          }
        ])
        .select()

      if (error) {
        console.error('Erro ao salvar agendamento:', error)
        alert('Erro ao salvar agendamento no banco de dados')
        return
      }

      if (newApt && newApt.length > 0) {
        // Add to local state
        const formattedApt = {
          id: newApt[0].id,
          clientId: newApt[0].client_id,
          employeeId: newApt[0].employee_id,
          date: newApt[0].date,
          time: newApt[0].time,
          status: newApt[0].status,
          service: newApt[0].service,
          price: newApt[0].price,
          clientEmail: newApt[0].client_email,
          googleEventId: newApt[0].google_event_id
        }
        setAppointments([...appointments, formattedApt])
        alert('✅ Agendamento criado com sucesso!')
      }
    }
    closeModal()
  }

  const deleteItem = async (id: string) => {
    if (!userId) return

    // Delete from database
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Erro ao deletar agendamento:', error)
      alert('Erro ao deletar agendamento')
      return
    }

    // Remove from local state
    setAppointments(appointments.filter(a => a.id !== id))
    console.log('✅ Agendamento deletado')
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
              {clients.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  ⚠️ Você ainda não cadastrou nenhum cliente. Vá em <strong>Clientes</strong> para adicionar.
                </div>
              )}
              <select
                value={formData.clientId || ''}
                onChange={(e) => setFormData({...formData, clientId: e.target.value ? parseInt(e.target.value) : ''})}
                className="w-full p-3 border rounded-lg"
                disabled={clients.length === 0}
              >
                <option value="">Selecione o cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
              
              {employees.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  ⚠️ Você ainda não cadastrou nenhum funcionário. Vá em <strong>Funcionários</strong> para adicionar.
                </div>
              )}
              <select
                value={formData.employeeId || ''}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value ? parseInt(e.target.value) : ''})}
                className="w-full p-3 border rounded-lg"
                disabled={employees.length === 0}
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