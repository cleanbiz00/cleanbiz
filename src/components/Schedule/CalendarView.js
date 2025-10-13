import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus, Edit3, Trash2, Eye } from 'lucide-react';

// Configure moment for Portuguese
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const CalendarView = ({ 
  appointments, 
  openModal, 
  deleteItem,
  getClientName,
  getEmployeeName,
  clients = []
}) => {
  // Detectar se é mobile para definir visualização padrão
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind 'md' breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // View padrão: 'day' para mobile, 'month' para desktop
  const [view, setView] = useState(isMobile ? 'day' : 'month');
  const [date, setDate] = useState(new Date());
  
  // Atualizar view quando isMobile mudar
  useEffect(() => {
    setView(isMobile ? 'day' : 'month');
  }, [isMobile]);

  // Cores fixas para funcionários (cada funcionário sempre terá a mesma cor)
  const employeeColors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#06b6d4', // cyan
    '#6366f1', // indigo
  ];

  // Função para obter cor consistente por funcionário
  const getEmployeeColor = (employeeId) => {
    if (!employeeId) return employeeColors[0];
    
    // Gerar hash do employeeId para sempre ter a mesma cor
    const hash = employeeId.toString().split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return employeeColors[hash % employeeColors.length];
  };

  // Função para criar gradiente com múltiplas cores (listras)
  const getMultipleEmployeeColors = (employeeIds) => {
    if (!employeeIds || employeeIds.length === 0) return employeeColors[0];
    if (employeeIds.length === 1) return getEmployeeColor(employeeIds[0]);
    
    // Criar listras coloridas para múltiplos funcionários
    const colors = employeeIds.map(id => getEmployeeColor(id));
    const percentage = 100 / colors.length;
    
    const gradientStops = colors.map((color, index) => {
      const start = index * percentage;
      const end = (index + 1) * percentage;
      return `${color} ${start}%, ${color} ${end}%`;
    }).join(', ');
    
    return `linear-gradient(135deg, ${gradientStops})`;
  };

  // Convert appointments to calendar events
  const events = useMemo(() => {
    return appointments.map(appointment => {
      const startDate = new Date(`${appointment.date}T${appointment.time}:00`);
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours duration
      
      // Buscar endereço do cliente
      const client = clients.find(c => c.id === appointment.clientId);
      const address = client?.address || '';
      
      // Usar employeeIds se disponível, senão usar employeeId legado
      const employeeIds = appointment.employeeIds || (appointment.employeeId ? [appointment.employeeId] : []);
      
      return {
        id: appointment.id,
        title: `${appointment.service} - ${getClientName(appointment.clientId)}`,
        start: startDate,
        end: endDate,
        resource: appointment,
        status: appointment.status,
        client: getClientName(appointment.clientId),
        employee: getEmployeeName(appointment.employeeId),
        employeeId: appointment.employeeId, // Manter para compatibilidade
        employeeIds: employeeIds, // Array de IDs
        address: address,
        price: appointment.price
      };
    });
  }, [appointments, getClientName, getEmployeeName, clients]);

  // Event style getter - define cor de fundo por funcionário(s)
  const eventStyleGetter = (event) => {
    const opacity = event.status === 'Cancelado' ? 0.5 : 1;
    
    // Se tem múltiplos funcionários, usar gradiente listrado
    const background = event.employeeIds && event.employeeIds.length > 1
      ? getMultipleEmployeeColors(event.employeeIds)
      : getEmployeeColor(event.employeeId);
    
    return {
      style: {
        background: background, // Pode ser cor sólida ou gradiente
        opacity: opacity,
        border: 'none',
        borderRadius: '4px',
        color: 'white',
        fontSize: '0.75rem',
        padding: '2px 4px'
      }
    };
  };

  // Custom event component
  const EventComponent = ({ event }) => {
    return (
      <div className="cursor-pointer">
        <div className="font-medium truncate">{event.title}</div>
        <div className="text-xs opacity-90">{event.employee}</div>
        {event.address && <div className="text-xs opacity-80 truncate">📍 {event.address}</div>}
        <div className="text-xs opacity-90 font-semibold">${event.price}</div>
      </div>
    );
  };

  // Handle event selection
  const handleSelectEvent = (event) => {
    // Show event details modal - passar apenas o resource (appointment data)
    openModal(event.resource);
  };

  // Handle date/time selection for new events
  const handleSelectSlot = ({ start, end }) => {
    const newAppointment = {
      date: start.toISOString().split('T')[0],
      time: start.toTimeString().slice(0, 5),
      status: 'Agendado'
    };
    openModal(newAppointment);
  };

  // Custom toolbar component
  const CustomToolbar = ({ date, view, onView, onNavigate }) => {
    const goToBack = () => {
      onNavigate('PREV');
    };

    const goToNext = () => {
      onNavigate('NEXT');
    };

    const goToCurrent = () => {
      onNavigate('TODAY');
    };

    const label = () => {
      return moment(date).format('MMMM [de] YYYY');
    };

    return (
      <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ←
          </button>
          <button
            onClick={goToCurrent}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hoje
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            →
          </button>
          <h2 className="text-xl font-semibold text-gray-800">{label()}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onView('month')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                view === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => onView('week')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                view === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => onView('day')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                view === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => onView('agenda')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                view === 'agenda' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Agenda
            </button>
          </div>
          
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Novo</span>
          </button>
        </div>
      </div>
    );
  };

  // Custom styles for today
  const customStyles = {
    today: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 md:p-6">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: isMobile ? 500 : 600 }}
        view={view}
        views={isMobile ? ['day', 'agenda'] : ['month', 'week', 'day', 'agenda']}
        onView={setView}
        date={date}
        onNavigate={setDate}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        popup
        components={{
          event: EventComponent,
          toolbar: CustomToolbar
        }}
        messages={{
          next: 'Próximo',
          previous: 'Anterior',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          date: 'Data',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'Nenhum agendamento neste período',
          showMore: total => `+${total} mais`
        }}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={(date) => ({
          style: date.toDateString() === new Date().toDateString() ? customStyles.today : {}
        })}
      />
    </div>
  );
};

export default CalendarView;
