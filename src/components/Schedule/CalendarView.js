import React, { useState, useMemo } from 'react';
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
  getEmployeeName 
}) => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  // Convert appointments to calendar events
  const events = useMemo(() => {
    return appointments.map(appointment => {
      const startDate = new Date(`${appointment.date}T${appointment.time}:00`);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
      
      return {
        id: appointment.id,
        title: `${appointment.service} - ${getClientName(appointment.clientId)}`,
        start: startDate,
        end: endDate,
        resource: appointment,
        status: appointment.status,
        client: getClientName(appointment.clientId),
        employee: getEmployeeName(appointment.employeeId),
        price: appointment.price
      };
    });
  }, [appointments, getClientName, getEmployeeName]);

  // Custom event component
  const EventComponent = ({ event }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Confirmado': return 'bg-green-500';
        case 'Agendado': return 'bg-yellow-500';
        case 'Cancelado': return 'bg-red-500';
        case 'Concluído': return 'bg-blue-500';
        default: return 'bg-gray-500';
      }
    };

    return (
      <div className={`${getStatusColor(event.status)} text-white p-1 rounded text-xs cursor-pointer hover:opacity-80`}>
        <div className="font-medium truncate">{event.title}</div>
        <div className="text-xs opacity-90">${event.price}</div>
      </div>
    );
  };

  // Handle event selection
  const handleSelectEvent = (event) => {
    // Show event details modal
    openModal('appointment', event.resource);
  };

  // Handle date/time selection for new events
  const handleSelectSlot = ({ start, end }) => {
    const newAppointment = {
      date: start.toISOString().split('T')[0],
      time: start.toTimeString().slice(0, 5),
      status: 'Agendado'
    };
    openModal('appointment', newAppointment);
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
            onClick={() => openModal('appointment')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Novo</span>
          </button>
        </div>
      </div>
    );
  };

  // Custom styles for the calendar
  const customStyles = {
    event: (event) => ({
      backgroundColor: event.status === 'Confirmado' ? '#10b981' : 
                     event.status === 'Agendado' ? '#f59e0b' :
                     event.status === 'Cancelado' ? '#ef4444' :
                     event.status === 'Concluído' ? '#3b82f6' : '#6b7280',
      borderRadius: '4px',
      border: 'none',
      color: 'white',
      padding: '2px 6px',
      fontSize: '12px',
      fontWeight: '500'
    }),
    day: {
      borderLeft: '1px solid #e5e7eb'
    },
    today: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={view}
        views={['month', 'week', 'day', 'agenda']}
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
        eventPropGetter={(event) => ({
          style: customStyles.event(event)
        })}
        dayPropGetter={(date) => ({
          style: date.toDateString() === new Date().toDateString() ? customStyles.today : {}
        })}
      />
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Confirmado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Agendado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Cancelado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Concluído</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
