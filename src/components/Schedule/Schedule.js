import React from 'react';
import { Plus, Edit3, Trash2, Clock } from 'lucide-react';

const Schedule = ({ 
  appointments, 
  openModal, 
  deleteItem,
  getClientName,
  getEmployeeName 
}) => (
  <div className="p-6 pb-24">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Agenda</h2>
      <button
        onClick={() => openModal('appointment')}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
      >
        <Plus size={20} />
        <span>Novo Agendamento</span>
      </button>
    </div>
    
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
                    onClick={() => openModal('appointment', appointment)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteItem('appointment', appointment.id)}
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
            <button onClick={() => openModal('appointment', appointment)} className="px-3 py-2 text-sm rounded bg-blue-50 text-blue-700 flex items-center gap-1">
              <Edit3 size={14} /> Editar
            </button>
            <button onClick={() => deleteItem('appointment', appointment.id)} className="px-3 py-2 text-sm rounded bg-red-50 text-red-700 flex items-center gap-1">
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Schedule;