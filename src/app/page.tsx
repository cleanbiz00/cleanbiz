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
  const [clients, setClients] = useState([]);

  const [employees, setEmployees] = useState([]);

  const [appointments, setAppointments] = useState([]);

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