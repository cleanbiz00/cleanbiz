'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Clock, Calendar, Mail, Grid3X3, List } from 'lucide-react'
import { supabase } from '../../utils/supabaseClient'
import CalendarView from '../../components/Schedule/CalendarView'
import { to12Hour, to24Hour } from '../../utils/timeFormat'

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
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
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
            email: c.email,
            phone: c.phone,
            address: c.address,
            serviceType: c.service_type
          }))
          setClients(formattedClients)
          console.log('✅ Clientes carregados com todos os campos:', formattedClients)
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
          // Para cada agendamento, carregar os funcionários relacionados
          const appointmentsWithEmployees = await Promise.all(
            data.map(async (apt) => {
              // Buscar funcionários relacionados na tabela appointment_employees
              const { data: empRelations } = await supabase
                .from('appointment_employees')
                .select('employee_id')
                .eq('appointment_id', apt.id)
              
              const employeeIds = empRelations?.map(rel => rel.employee_id) || []
              
              // Se não tem na nova tabela, usar o employee_id antigo para compatibilidade
              if (employeeIds.length === 0 && apt.employee_id) {
                employeeIds.push(apt.employee_id)
              }

              return {
            id: apt.id,
            clientId: apt.client_id,
                employeeId: apt.employee_id, // Manter para compatibilidade
                employeeIds: employeeIds, // Array de IDs
            date: apt.date,
            time: apt.time,
            status: apt.status,
            service: apt.service,
            price: apt.price,
            clientEmail: apt.client_email,
            googleEventId: apt.google_event_id
              }
            })
          )
          
          setAppointments(appointmentsWithEmployees)
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

  const getEmployeeNames = (employeeIds: string[]) => {
    if (!employeeIds || employeeIds.length === 0) return 'Nenhum funcionário'
    return employeeIds
      .map(id => {
        const emp = employees.find(e => e.id === id)
        return emp ? emp.name : null
      })
      .filter(Boolean)
      .join(', ')
  }

  const openModal = (item: any = null, forceEdit: boolean = false) => {
    console.log('🔵 openModal chamado com:', item, 'forceEdit:', forceEdit)
    
    if (item && item.id && !forceEdit) {
      // Se tem ID e NÃO é forceEdit, abrir modal de detalhes
      console.log('✅ Abrindo modal de detalhes')
      setSelectedAppointment(item)
      setShowDetailsModal(true)
    } else if (item) {
      // Editar agendamento existente ou novo com dados pré-preenchidos
      console.log('✅ Abrindo modal de edição')
      const hour24 = item.time ? parseInt(item.time.split(':')[0]) : 9
      const timePeriod = hour24 >= 12 ? 'PM' : 'AM'
      
      const formattedItem = {
        clientId: item.clientId,
        employeeId: item.employeeId, // Manter para compatibilidade
        employeeIds: item.employeeIds || (item.employeeId ? [item.employeeId] : []), // Array
        date: item.date,
        time: item.time,
        timePeriod: timePeriod,
        status: item.status,
        service: item.service,
        price: item.price,
        clientEmail: item.clientEmail || ''
      }
      setFormData(formattedItem)
    setEditingItem(item)
      setShowModal(true)
    } else {
      // Novo agendamento
      console.log('✅ Abrindo modal de novo agendamento')
      setFormData({timePeriod: 'AM', employeeIds: []})
      setEditingItem(null)
    setShowModal(true)
    }
  }

  const openEditFromDetails = () => {
    if (selectedAppointment) {
      setShowDetailsModal(false)
      // Forçar abertura do modal de edição
      openModal(selectedAppointment, true)
    }
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedAppointment(null)
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

    // Validação detalhada
    const missing = []
    if (!formData.clientId || formData.clientId === 'undefined') missing.push('Cliente')
    if (!formData.employeeIds || formData.employeeIds.length === 0) missing.push('Funcionário')
    if (!formData.date) missing.push('Data')
    if (!formData.time) missing.push('Hora')
    if (!formData.service) missing.push('Serviço')
    if (!formData.status) missing.push('Status')
    
    if (missing.length > 0) {
      alert(`Por favor, preencha os campos obrigatórios: ${missing.join(', ')}`)
      console.error('Campos faltando:', missing)
      console.error('FormData atual:', formData)
      return
    }

    if (editingItem) {
      // Update existing appointment in database
      // Só inclui campos que têm valores válidos
      const updateData: any = {
          date: formData.date,
          time: formData.time,
        status: formData.status || 'Agendado',
          service: formData.service,
        price: Number(formData.price) || 0,
          updated_at: new Date().toISOString()
      }
      
      // Adiciona IDs apenas se forem válidos (não undefined, não null, não string vazia)
      if (formData.clientId && formData.clientId !== 'undefined') {
        updateData.client_id = formData.clientId
      }
      // Manter compatibilidade: salvar primeiro funcionário em employee_id
      if (formData.employeeIds && formData.employeeIds.length > 0) {
        updateData.employee_id = formData.employeeIds[0]
      }
      if (formData.clientEmail) {
        updateData.client_email = formData.clientEmail
      }

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', editingItem.id)
        .eq('user_id', userId)

      if (error) {
        console.error('Erro ao atualizar agendamento:', error)
        alert(`Erro ao atualizar agendamento: ${error.message}`)
        return
      }

      // Atualizar relacionamentos de funcionários
      // 1. Deletar relacionamentos antigos
      await supabase
        .from('appointment_employees')
        .delete()
        .eq('appointment_id', editingItem.id)
      
      // 2. Inserir novos relacionamentos
      if (formData.employeeIds && formData.employeeIds.length > 0) {
        const employeeRelations = formData.employeeIds.map((empId: string) => ({
          appointment_id: editingItem.id,
          employee_id: empId
        }))
        
        const { error: relError } = await supabase
          .from('appointment_employees')
          .insert(employeeRelations)
        
        if (relError) {
          console.error('Erro ao salvar funcionários:', relError)
        }
      }

      // Reload appointments from database (agora usando a mesma lógica de load)
      const { data: updatedAppointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true })
      
      if (updatedAppointments) {
        const appointmentsWithEmployees = await Promise.all(
          updatedAppointments.map(async (apt: any) => {
            const { data: empRelations } = await supabase
              .from('appointment_employees')
              .select('employee_id')
              .eq('appointment_id', apt.id)
            
            const employeeIds = empRelations?.map(rel => rel.employee_id) || []
            if (employeeIds.length === 0 && apt.employee_id) {
              employeeIds.push(apt.employee_id)
            }

            return {
              id: apt.id,
              clientId: apt.client_id,
              employeeId: apt.employee_id,
              employeeIds: employeeIds,
              date: apt.date,
              time: apt.time,
              status: apt.status,
              service: apt.service,
              price: apt.price,
              clientEmail: apt.client_email,
              googleEventId: apt.google_event_id
            }
          })
        )
        setAppointments(appointmentsWithEmployees)
      }

      alert('✅ Agendamento atualizado com sucesso!')
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
      const insertData = {
            user_id: userId,
            client_id: formData.clientId,
        employee_id: formData.employeeIds[0], // Primeiro funcionário para compatibilidade
            date: formData.date,
            time: formData.time,
            status: formData.status || 'Agendado',
            service: formData.service,
        price: Number(formData.price) || 0,
        client_email: formData.clientEmail || null,
        google_event_id: googleEventId || null
      }
      
      console.log('📝 Salvando agendamento:', insertData)
      
      const { data: newApt, error } = await supabase
        .from('appointments')
        .insert([insertData])
        .select()

      if (error) {
        console.error('Erro ao salvar agendamento:', error)
        alert(`Erro ao salvar agendamento: ${error.message}`)
        return
      }

      if (newApt && newApt.length > 0) {
        // Salvar relacionamentos de funcionários
        const employeeRelations = formData.employeeIds.map((empId: string) => ({
          appointment_id: newApt[0].id,
          employee_id: empId
        }))
        
        const { error: relError } = await supabase
          .from('appointment_employees')
          .insert(employeeRelations)
        
        if (relError) {
          console.error('Erro ao salvar funcionários:', relError)
        }
        
        // Add to local state
        const formattedApt = {
          id: newApt[0].id,
          clientId: newApt[0].client_id,
          employeeId: newApt[0].employee_id,
          employeeIds: formData.employeeIds,
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
      
      {/* Employee Color Legend */}
      {viewMode === 'calendar' && employees.length > 0 && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold mb-2">Legenda de Funcionários:</h3>
          <div className="flex flex-wrap gap-3">
            {employees.map(employee => {
              // Mesma lógica de hash do CalendarView
              const hash = employee.id.toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
              const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#6366f1']
              const color = colors[hash % colors.length]
              
              return (
                <div key={employee.id} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-700">{employee.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <CalendarView
          appointments={appointments}
          openModal={openModal}
          deleteItem={deleteItem}
          getClientName={getClientName}
          getEmployeeName={getEmployeeName}
          clients={clients as any}
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
                          <p className="text-sm text-gray-600">{to12Hour(appointment.time)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getClientName(appointment.clientId)}</td>
                    <td className="px-6 py-4">
                      {appointment.employeeIds && appointment.employeeIds.length > 0 
                        ? getEmployeeNames(appointment.employeeIds)
                        : getEmployeeName(appointment.employeeId)}
                    </td>
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
                    <div className="text-sm text-gray-600">{appointment.date} • {to12Hour(appointment.time)}</div>
                    <div className="font-medium">{getClientName(appointment.clientId)}</div>
                    <div className="text-sm text-gray-600">
                      {appointment.employeeIds && appointment.employeeIds.length > 0 
                        ? getEmployeeNames(appointment.employeeIds)
                        : getEmployeeName(appointment.employeeId)}
                    </div>
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

      {/* Details Modal - Ao clicar em um agendamento */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold">Detalhes do Agendamento</h3>
              <button onClick={closeDetailsModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações do Agendamento */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-600 mb-3">📅 Agendamento</h4>
                
                <div>
                  <p className="text-sm text-gray-600">Serviço</p>
                  <p className="font-medium text-lg">{selectedAppointment.service}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Data e Hora</p>
                  <p className="font-medium">{selectedAppointment.date} às {to12Hour(selectedAppointment.time)}</p>
                  <p className="text-xs text-gray-500">Duração: 4 horas</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedAppointment.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 
                    selectedAppointment.status === 'Agendado' ? 'bg-yellow-100 text-yellow-800' :
                    selectedAppointment.status === 'Concluído' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Valor</p>
                  <p className="font-bold text-2xl text-green-600">${selectedAppointment.price}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Funcionário(s) Responsável(is)</p>
                  <p className="font-medium">
                    {selectedAppointment.employeeIds && selectedAppointment.employeeIds.length > 0 
                      ? getEmployeeNames(selectedAppointment.employeeIds)
                      : getEmployeeName(selectedAppointment.employeeId)}
                  </p>
                </div>
              </div>
              
              {/* Informações do Cliente */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-600 mb-3">👤 Cliente</h4>
                
                {(() => {
                  const client = clients.find(c => c.id === selectedAppointment.clientId)
                  if (!client) return <p className="text-gray-500">Cliente não encontrado</p>
                  
                  return (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Nome</p>
                        <p className="font-medium text-lg">{client.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Endereço</p>
                        <p className="font-medium">📍 {client.address}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Telefone</p>
                        <p className="font-medium">📞 {client.phone}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">📧 {client.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Tipo de Serviço</p>
                        <p className="font-medium">{client.serviceType}</p>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={openEditFromDetails}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Edit3 size={18} />
                Editar Agendamento
              </button>
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir este agendamento?')) {
                    deleteItem(selectedAppointment.id)
                    closeDetailsModal()
                  }
                }}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                onChange={(e) => {
                  const value = e.target.value
                  setFormData({...formData, clientId: value || null})
                }}
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
              
              {/* Multi-seleção de funcionários com checkboxes */}
              <div className="w-full p-4 border rounded-lg bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funcionários (selecione um ou mais):
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {employees.length > 0 ? (
                    employees.map(employee => (
                      <label key={employee.id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.employeeIds?.includes(employee.id) || false}
                          onChange={(e) => {
                            const currentIds = formData.employeeIds || []
                            if (e.target.checked) {
                              // Adicionar funcionário
                              setFormData({...formData, employeeIds: [...currentIds, employee.id]})
                            } else {
                              // Remover funcionário
                              setFormData({...formData, employeeIds: currentIds.filter((id: string) => id !== employee.id)})
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{employee.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum funcionário disponível</p>
                  )}
                </div>
                {formData.employeeIds && formData.employeeIds.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    {formData.employeeIds.length} funcionário(s) selecionado(s)
                  </p>
                )}
              </div>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={(() => {
                    if (!formData.time) return ''
                    const hour24 = parseInt(formData.time.split(':')[0])
                    if (hour24 === 0) return '12' // Midnight
                    if (hour24 > 12) return String(hour24 - 12)
                    return String(hour24)
                  })()}
                  onChange={(e) => {
                    const hour12 = parseInt(e.target.value)
                    const minute = formData.time ? formData.time.split(':')[1] : '00'
                    const period = formData.timePeriod || 'AM'
                    
                    // Convert to 24h
                    let hour24 = hour12
                    if (period === 'PM' && hour12 !== 12) {
                      hour24 = hour12 + 12
                    } else if (period === 'AM' && hour12 === 12) {
                      hour24 = 0
                    }
                    
                    setFormData({...formData, time: `${hour24.toString().padStart(2, '0')}:${minute}`})
                  }}
                className="w-full p-3 border rounded-lg"
                >
                  <option value="">Hora</option>
                  {Array.from({length: 12}, (_, i) => i + 1).map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
                
                <select
                  value={formData.time ? formData.time.split(':')[1] : ''}
                  onChange={(e) => {
                    const hour = formData.time ? formData.time.split(':')[0] : '09'
                    const minute = e.target.value
                    setFormData({...formData, time: `${hour}:${minute}`})
                  }}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Min</option>
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
                
                <select
                  value={formData.timePeriod || 'AM'}
                  onChange={(e) => {
                    const period = e.target.value
                    
                    if (formData.time) {
                      const [hourStr, minute] = formData.time.split(':')
                      let hour24 = parseInt(hourStr)
                      let hour12 = hour24
                      
                      // Convert current 24h to 12h
                      if (hour24 === 0) hour12 = 12
                      else if (hour24 > 12) hour12 = hour24 - 12
                      
                      // Now convert back to 24h with new period
                      if (period === 'PM' && hour12 !== 12) {
                        hour24 = hour12 + 12
                      } else if (period === 'AM' && hour12 === 12) {
                        hour24 = 0
                      } else {
                        hour24 = hour12
                      }
                      
                      setFormData({...formData, time: `${hour24.toString().padStart(2, '0')}:${minute}`, timePeriod: period})
                    } else {
                      setFormData({...formData, timePeriod: period})
                    }
                  }}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
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