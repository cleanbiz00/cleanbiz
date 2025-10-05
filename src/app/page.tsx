'use client'

import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
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

  const handleSave = () => {
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
      if (editingItem) {
        setAppointments(appointments.map(a => a.id === editingItem.id ? { ...formData, id: editingItem.id } : a));
      } else {
        setAppointments([...appointments, { ...formData, id: Date.now() }]);
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <div className="flex-1 overflow-auto">
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