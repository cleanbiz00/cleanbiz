'use client'

import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar/Sidebar';
import Dashboard from '../components/Dashboard/Dashboard';
import Clients from '../components/Clients/Clients';
import Employees from '../components/Employees/Employees';
import Schedule from '../components/Schedule/Schedule';
import Financial from '../components/Financial/Financial';
import Modal from '../components/Modal/Modal';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Estados dos dados
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
  ]);

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
  ]);

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
  ]);

  const [financialData] = useState({
    revenue: 5420,
    expenses: 1230,
    profit: 4190,
    monthlyGrowth: 12.5
  });

  // Proteção de rota simples: redireciona para /login se não autenticado
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = '/login';
        return;
      }
      setCheckingAuth(false);
    };
    checkSession();
  }, []);

  // Estados do modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Funções principais
  const openModal = (type: string, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setEditingItem(null);
  };

  const handleSave = async () => {
    if (modalType === 'client') {
      if (editingItem) {
        setClients(clients.map(c => c.id === editingItem.id ? { ...formData, id: editingItem.id } : c));
      } else {
        setClients([...clients, { ...formData, id: Date.now() }]);
      }
    } else if (modalType === 'employee') {
      if (editingItem) {
        setEmployees(employees.map(e => e.id === editingItem.id ? { ...formData, id: editingItem.id } : e));
      } else {
        setEmployees([...employees, { ...formData, id: Date.now() }]);
      }
    } else if (modalType === 'appointment') {
      // Validate required fields
      if (!formData.clientId || !formData.employeeId || !formData.date || !formData.time || !formData.service || !formData.price) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }
      
      const newAppointment = { ...formData, id: Date.now() };
      
      console.log('Creating appointment with data:', formData);
      console.log('New appointment:', newAppointment);
      
      if (editingItem) {
        setAppointments(appointments.map(a => a.id === editingItem.id ? { ...formData, id: editingItem.id } : a));
        console.log('Updated appointment:', editingItem.id);
      } else {
        const updatedAppointments = [...appointments, newAppointment];
        setAppointments(updatedAppointments);
        console.log('Added new appointment. Total appointments:', updatedAppointments.length);
        
        // Send email notification for new appointments
        if (formData.clientEmail) {
          try {
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
            });
            
            const result = await response.json();
            if (result.success) {
              console.log('Email sent successfully:', result.messageId);
            } else {
              console.error('Failed to send email:', result.error);
            }
          } catch (error) {
            console.error('Error sending email:', error);
          }
        }

        // Create Google Calendar event
        try {
          const googleAccessToken = localStorage.getItem('google_access_token');
          if (googleAccessToken) {
            const calendarResponse = await fetch('/api/google-calendar/create-event', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${googleAccessToken}`,
              },
              body: JSON.stringify({
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
            });
          
            const calendarResult = await calendarResponse.json();
            if (calendarResult.success) {
              console.log('Google Calendar event created:', calendarResult.eventId);
              alert(`Evento criado no Google Calendar! Link: ${calendarResult.eventUrl}`);
            } else {
              console.log('Google Calendar not connected or failed:', calendarResult.error);
              alert('Erro ao criar evento no Google Calendar: ' + calendarResult.error);
            }
          } else {
            console.log('Google access token not found');
          }
        } catch (error) {
          console.error('Error creating Google Calendar event:', error);
          alert('Erro ao criar evento no Google Calendar: ' + (error instanceof Error ? error.message : String(error)));
        }
      }
    }
    closeModal();
  };

  const deleteItem = (type: string, id: number) => {
    if (type === 'client') {
      setClients(clients.filter(c => c.id !== id));
    } else if (type === 'employee') {
      setEmployees(employees.filter(e => e.id !== id));
    } else if (type === 'appointment') {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  // Funções utilitárias
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Funcionário não encontrado';
  };

  // Renderizar conteúdo baseado na aba ativa
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            financialData={financialData}
            appointments={appointments}
            clients={clients}
            getClientName={getClientName}
          />
        );
      case 'clients':
        return (
          <Clients 
            clients={clients}
            openModal={openModal}
            deleteItem={deleteItem}
          />
        );
      case 'employees':
        return (
          <Employees 
            employees={employees}
            openModal={openModal}
            deleteItem={deleteItem}
          />
        );
      case 'schedule':
        return (
          <Schedule 
            appointments={appointments}
            openModal={openModal}
            deleteItem={deleteItem}
            getClientName={getClientName}
            getEmployeeName={getEmployeeName}
          />
        );
      case 'financial':
        return (
          <Financial 
            financialData={financialData}
            clients={clients}
          />
        );
      default:
        return (
          <Dashboard 
            financialData={financialData}
            appointments={appointments}
            clients={clients}
            getClientName={getClientName}
          />
        );
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-700">Carregando...</div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab: string) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
        />
      </div>

      {/* Mobile drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={(tab: string) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
            />
          </div>
        </div>
      )}

      <div className="flex-1 min-h-screen overflow-y-auto">
        {/* Top bar (mobile) */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b p-3 flex items-center justify-between">
          <button aria-label="Abrir menu" onClick={() => setIsSidebarOpen(true)} className="p-2 rounded hover:bg-gray-100 active:bg-gray-200">
            <Menu size={22} />
          </button>
          <span className="font-semibold">CleanBizz</span>
          <span className="w-6" />
        </div>

        {renderContent()}
      </div>

      <Modal 
        showModal={showModal}
        modalType={modalType}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        clients={clients}
        employees={employees}
        handleSave={handleSave}
        closeModal={closeModal}
      />
    </div>
  );
}