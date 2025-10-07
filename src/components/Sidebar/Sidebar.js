import React from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Home, Users, Calendar, DollarSign } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => (
 <div className="w-64 bg-blue-900 text-white h-full p-4">
  <div className="mb-8">
    <h1 className="text-xl font-bold">CleanBizz</h1>
    <p className="text-blue-200 text-sm">Gestão de Limpeza</p>
  </div>
   
   <nav className="space-y-2">
     <button
       onClick={() => setActiveTab('dashboard')}
       className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
         activeTab === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-800'
       }`}
     >
       <Home size={20} />
       <span>Dashboard</span>
     </button>
     
     <button
       onClick={() => setActiveTab('clients')}
       className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
         activeTab === 'clients' ? 'bg-blue-700' : 'hover:bg-blue-800'
       }`}
     >
       <Users size={20} />
       <span>Clientes</span>
     </button>
     
     <button
       onClick={() => setActiveTab('employees')}
       className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
         activeTab === 'employees' ? 'bg-blue-700' : 'hover:bg-blue-800'
       }`}
     >
       <Users size={20} />
       <span>Funcionários</span>
     </button>
     
     <button
       onClick={() => setActiveTab('schedule')}
       className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
         activeTab === 'schedule' ? 'bg-blue-700' : 'hover:bg-blue-800'
       }`}
     >
       <Calendar size={20} />
       <span>Agenda</span>
     </button>
     
     <button
       onClick={() => setActiveTab('financial')}
       className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
         activeTab === 'financial' ? 'bg-blue-700' : 'hover:bg-blue-800'
       }`}
     >
       <DollarSign size={20} />
       <span>Financeiro</span>
     </button>
    
    <button
      onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login'; }}
      className="w-full flex items-center justify-center p-3 rounded-lg transition-colors bg-blue-800 hover:bg-blue-700 mt-6"
    >
      Sair
    </button>
   </nav>
 </div>
);

export default Sidebar;
