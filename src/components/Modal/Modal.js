import React from 'react';

const Modal = ({ 
  showModal, 
  modalType, 
  editingItem, 
  formData, 
  setFormData, 
  clients, 
  employees, 
  handleSave, 
  closeModal 
}) => {
  if (!showModal) return null;

  const getModalTitle = () => {
    const titles = {
      client: editingItem ? 'Editar Cliente' : 'Novo Cliente',
      employee: editingItem ? 'Editar Funcionário' : 'Novo Funcionário',
      appointment: editingItem ? 'Editar Agendamento' : 'Novo Agendamento'
    };
    return titles[modalType];
  };

  const renderForm = () => {
    if (modalType === 'client') {
      return (
        <div>
          <input
            type="text"
            placeholder="Nome"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <input
            type="text"
            placeholder="Endereço"
            value={formData.address || ''}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <select
            value={formData.serviceType || ''}
            onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          >
            <option value="">Selecione o tipo de serviço</option>
            <option value="Limpeza Residencial">Limpeza Residencial</option>
            <option value="Limpeza Comercial">Limpeza Comercial</option>
            <option value="Limpeza Pós-Obra">Limpeza Pós-Obra</option>
          </select>
          <input
            type="number"
            placeholder="Valor do Serviço"
            value={formData.price || ''}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <select
            value={formData.frequency || ''}
            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          >
            <option value="">Selecione a frequência</option>
            <option value="Semanal">Semanal</option>
            <option value="Quinzenal">Quinzenal</option>
            <option value="Mensal">Mensal</option>
          </select>
        </div>
      );
    }
    
    if (modalType === 'employee') {
      return (
        <div>
          <input
            type="text"
            placeholder="Nome"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <select
            value={formData.role || ''}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          >
            <option value="">Selecione o cargo</option>
            <option value="Supervisora">Supervisora</option>
            <option value="Faxineiro">Faxineiro</option>
            <option value="Assistente">Assistente</option>
          </select>
        </div>
      );
    }
    
    if (modalType === 'appointment') {
      return (
        <div>
          <select
            value={formData.clientId || ''}
            onChange={(e) => setFormData({...formData, clientId: e.target.value ? parseInt(e.target.value) : ''})}
            className="w-full p-3 border rounded-lg mb-4"
          >
            <option value="">Selecione o cliente</option>
            {clients && clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <select
            value={formData.employeeId || ''}
            onChange={(e) => setFormData({...formData, employeeId: e.target.value ? parseInt(e.target.value) : ''})}
            className="w-full p-3 border rounded-lg mb-4"
          >
            <option value="">Selecione o funcionário</option>
            {employees && employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={formData.date || ''}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <input
            type="time"
            value={formData.time || ''}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <input
            type="text"
            placeholder="Serviço"
            value={formData.service || ''}
            onChange={(e) => setFormData({...formData, service: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <input
            type="number"
            placeholder="Valor"
            value={formData.price || ''}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <select
            value={formData.status || ''}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full p-3 border rounded-lg mb-4"
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
            className="w-full p-3 border rounded-lg mb-4"
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4">{getModalTitle()}</h3>
        {renderForm()}
        <div className="flex space-x-4">
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
  );
};


export default Modal;
