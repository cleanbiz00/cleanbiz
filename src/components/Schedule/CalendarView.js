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
  // Estado para controlar quando o componente está pronto (evita SSR hydration mismatch)
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    // Marcar que estamos no cliente
    setIsClient(true);
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Atualizar view baseado no tamanho da tela
      setView(mobile ? 'day' : 'month');
    };
    
    // Checar imediatamente
    checkMobile();
    
    // Adicionar listener
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    // Validar se appointments existe e é um array
    if (!Array.isArray(appointments) || appointments.length === 0) {
      return [];
    }
    
    return appointments
      .filter(appointment => {
        // Filtrar apenas appointments válidos com dados necessários
        return appointment && 
               appointment.date && 
               appointment.time && 
               appointment.service &&
               appointment.clientId;
      })
      .map(appointment => {
        try {
          const startDate = new Date(`${appointment.date}T${appointment.time}:00`);
          const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours duration
          
          // Validar se as datas são válidas
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Data inválida no appointment:', appointment);
            return null;
          }
          
          // Buscar endereço do cliente
          const client = clients.find(c => c.id === appointment.clientId);
          const address = client?.address || '';
          
          // Usar employeeIds se disponível, senão usar employeeId legado
          const employeeIds = appointment.employeeIds || (appointment.employeeId ? [appointment.employeeId] : []);
          
          return {
            id: appointment.id || `temp-${Math.random()}`,
            title: `${appointment.service || 'Serviço'} - ${getClientName(appointment.clientId)}`,
            start: startDate,
            end: endDate,
            resource: appointment,
            status: appointment.status || 'Agendado',
            client: getClientName(appointment.clientId),
            employee: getEmployeeName(appointment.employeeId),
            employeeId: appointment.employeeId, // Manter para compatibilidade
            employeeIds: employeeIds, // Array de IDs
            address: address,
            price: appointment.price || 0
          };
        } catch (error) {
          console.error('Erro ao processar appointment:', appointment, error);
          return null;
        }
      })
      .filter(event => event !== null); // Remover eventos inválidos
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

  // Custom toolbar component - Responsivo para mobile
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

    // Views disponíveis baseado em mobile ou desktop
    const availableViews = isMobile 
      ? [{ key: 'day', label: 'Dia' }, { key: 'agenda', label: 'Lista' }]
      : [
          { key: 'month', label: 'Mês' },
          { key: 'week', label: 'Semana' },
          { key: 'day', label: 'Dia' },
          { key: 'agenda', label: 'Lista' }
        ];

    return (
      <div className="mb-4 p-3 md:p-4 bg-white rounded-lg shadow-sm space-y-3 md:space-y-0">
        {/* Linha 1: Título e Navegação */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              ←
            </button>
            <button
              onClick={goToCurrent}
              className="px-3 py-1 text-xs md:text-sm rounded-lg hover:bg-gray-100 transition-colors"
            >
              Hoje
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              →
            </button>
          </div>
          <h2 className="text-base md:text-xl font-semibold text-gray-800">{label()}</h2>
        </div>
        
        {/* Linha 2: Views e Novo botão */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {availableViews.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onView(key)}
                className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm transition-colors whitespace-nowrap ${
                  view === key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center space-x-1 md:space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span className="text-xs md:text-sm">Novo</span>
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

  // Mostrar loading enquanto não estiver pronto no cliente (evita SSR errors)
  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-2 md:p-6 flex items-center justify-center" style={{ height: 600 }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando calendário...</p>
        </div>
      </div>
    );
  }

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
