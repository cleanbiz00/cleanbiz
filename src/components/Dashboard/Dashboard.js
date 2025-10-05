import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { DollarSign } from 'lucide-react';

const Dashboard = ({ 
  financialData, 
  appointments, 
  clients, 
  getClientName 
}) => {
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const monthRange = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const toISO = (d) => d.toISOString().slice(0, 10);
    return { start: toISO(start), end: toISO(end) };
  }, []);

  useEffect(() => {
    const loadMonthlyExpenses = async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('amount, date')
        .gte('date', monthRange.start)
        .lte('date', monthRange.end);
      if (!error && data) {
        const total = data.reduce((s, x) => s + Number(x.amount || 0), 0);
        setMonthlyExpenses(total);
      }
    };
    loadMonthlyExpenses();
  }, [monthRange]);

  const revenue = financialData.revenue;
  const profit = revenue - monthlyExpenses;

  return (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Receita Mensal</p>
            <p className="text-2xl font-bold text-green-600">${revenue}</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Despesas</p>
            <p className="text-2xl font-bold text-red-600">${monthlyExpenses}</p>
          </div>
          <DollarSign className="h-8 w-8 text-red-600" />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Lucro Líquido</p>
            <p className="text-2xl font-bold text-blue-600">${profit}</p>
          </div>
          <DollarSign className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Crescimento</p>
            <p className="text-2xl font-bold text-purple-600">+{financialData.monthlyGrowth}%</p>
          </div>
          <DollarSign className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Próximos Agendamentos</h3>
        <div className="space-y-3">
          {appointments.slice(0, 3).map(appointment => (
            <div key={appointment.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">{getClientName(appointment.clientId)}</p>
                <p className="text-sm text-gray-600">{appointment.date} - {appointment.time}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                appointment.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Clientes Ativos</h3>
        <div className="space-y-3">
          {clients.slice(0, 3).map(client => (
            <div key={client.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-gray-600">{client.serviceType}</p>
              </div>
              <p className="font-semibold text-green-600">${client.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}

export default Dashboard;
