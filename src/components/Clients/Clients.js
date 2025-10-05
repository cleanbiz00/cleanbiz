import React from 'react';
import { Plus, Edit3, Trash2, Phone, Mail, MapPin } from 'lucide-react';

const Clients = ({ 
  clients, 
  openModal, 
  deleteItem 
}) => (
  <div className="p-6 pb-28 min-h-screen">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Clientes</h2>
      <button
        onClick={() => openModal('client')}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
      >
        <Plus size={20} />
        <span>Novo Cliente</span>
      </button>
    </div>
    
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hidden lg:block">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {clients.map(client => (
            <tr key={client.id}>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {client.address}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <p className="flex items-center">
                    <Phone size={14} className="mr-1" />
                    {client.phone}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Mail size={14} className="mr-1" />
                    {client.email}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p>{client.serviceType}</p>
                  <p className="text-sm text-gray-600">{client.frequency}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-green-600 font-semibold">${client.price}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal('client', client)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteItem('client', client.id)}
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
      {clients.map(client => (
        <div key={client.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin size={14} className="mr-1" />
                {client.address}
              </p>
              <p className="text-sm flex items-center mt-1">
                <Phone size={14} className="mr-1" /> {client.phone}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Mail size={14} className="mr-1" /> {client.email}
              </p>
            </div>
            <span className="text-green-600 font-semibold">${client.price}</span>
          </div>
          <div className="text-sm text-gray-700 mt-2">{client.serviceType}</div>
          <div className="text-xs text-gray-500">{client.frequency}</div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => openModal('client', client)} className="px-3 py-2 text-sm rounded bg-blue-50 text-blue-700 flex items-center gap-1">
              <Edit3 size={14} /> Editar
            </button>
            <button onClick={() => deleteItem('client', client.id)} className="px-3 py-2 text-sm rounded bg-red-50 text-red-700 flex items-center gap-1">
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Clients;
