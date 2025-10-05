import React from 'react';
import { Plus, Edit3, Trash2, Phone, Mail } from 'lucide-react';

const Employees = ({ 
  employees, 
  openModal, 
  deleteItem 
}) => (
  <div className="p-6 pb-24">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Funcionários</h2>
      <button
        onClick={() => openModal('employee')}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
      >
        <Plus size={20} />
        <span>Novo Funcionário</span>
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map(employee => (
        <div key={employee.id} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{employee.name}</h3>
              <p className="text-blue-600">{employee.role}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openModal('employee', employee)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => deleteItem('employee', employee.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="flex items-center">
              <Phone size={14} className="mr-2" />
              {employee.phone}
            </p>
            <p className="flex items-center">
              <Mail size={14} className="mr-2" />
              {employee.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Employees;
