import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Clock, Calendar, Mail } from 'lucide-react';
import googleCalendarService from '../../services/googleCalendar';
import emailService from '../../services/emailService';
import { supabase } from '../../utils/supabaseClient';

const Schedule = ({ 
  appointments, 
  openModal, 
  deleteItem,
  getClientName,
  getEmployeeName 
}) => {
  const [userId, setUserId] = useState(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState(false);

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user?.id || null);
    };
    loadUser();
  }, []);

  // Check if Google Calendar is configured
  useEffect(() => {
    const checkGoogleConfig = () => {
      const hasGoogleConfig = !!(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
      );
      setGoogleConnected(hasGoogleConfig);
    };
    checkGoogleConfig();
  }, []);

  // Check if email service is configured
  useEffect(() => {
    const checkEmailConfig = () => {
      const hasEmailConfig = !!(
        process.env.SENDGRID_API_KEY &&
        process.env.SENDGRID_FROM_EMAIL
      );
      setEmailConfigured(hasEmailConfig);
    };
    checkEmailConfig();
  }, []);

  // Create Google Calendar event
  const createGoogleCalendarEvent = async (appointment, clientEmail) => {
    if (!googleConnected || !userId) return null;

    try {
      // Get user's Google access token (this would come from OAuth flow)
      const { data: session } = await supabase.auth.getSession();
      const accessToken = session?.session?.provider_token; // This would be set during Google OAuth

      if (!accessToken) {
        console.log('No Google access token available');
        return null;
      }

      // Initialize Google Calendar service
      googleCalendarService.initialize(accessToken);

      // Prepare event details
      const startDateTime = new Date(`${appointment.date}T${appointment.time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

      const eventDetails = {
        title: `${appointment.service} - ${getClientName(appointment.clientId)}`,
        description: `Serviço: ${appointment.service}\nCliente: ${getClientName(appointment.clientId)}\nFuncionário: ${getEmployeeName(appointment.employeeId)}\nValor: $${appointment.price}`,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        attendees: clientEmail ? [{ email: clientEmail }] : []
      };

      const result = await googleCalendarService.createEvent(eventDetails);
      
      if (result.success) {
        console.log('Google Calendar event created:', result.eventId);
        return result.eventId;
      } else {
        console.error('Failed to create Google Calendar event:', result.error);
        return null;
      }
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      return null;
    }
  };

  // Send email notification
  const sendEmailNotification = async (appointment, clientEmail, type = 'confirmation') => {
    if (!emailConfigured || !clientEmail) return false;

    try {
      const appointmentData = {
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        price: appointment.price,
        status: appointment.status,
        clientName: getClientName(appointment.clientId),
        employeeName: getEmployeeName(appointment.employeeId)
      };

      let result;
      switch (type) {
        case 'confirmation':
          result = await emailService.sendAppointmentConfirmation(appointmentData, clientEmail);
          break;
        case 'reminder':
          result = await emailService.sendAppointmentReminder(appointmentData, clientEmail);
          break;
        case 'cancellation':
          result = await emailService.sendAppointmentCancellation(appointmentData, clientEmail);
          break;
        default:
          result = await emailService.sendAppointmentConfirmation(appointmentData, clientEmail);
      }

      if (result.success) {
        console.log('Email sent successfully:', result.messageId);
        return true;
      } else {
        console.error('Failed to send email:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };

  // Handle appointment creation with Google Calendar and email
  const handleAppointmentCreate = async (appointment, clientEmail) => {
    const results = {
      googleCalendar: false,
      email: false
    };

    // Create Google Calendar event
    if (googleConnected) {
      const googleEventId = await createGoogleCalendarEvent(appointment, clientEmail);
      results.googleCalendar = !!googleEventId;
    }

    // Send email notification
    if (emailConfigured && clientEmail) {
      results.email = await sendEmailNotification(appointment, clientEmail, 'confirmation');
    }

    return results;
  };

  // Handle appointment update with Google Calendar and email
  const handleAppointmentUpdate = async (appointment, clientEmail, googleEventId) => {
    const results = {
      googleCalendar: false,
      email: false
    };

    // Update Google Calendar event
    if (googleConnected && googleEventId) {
      try {
        const { data: session } = await supabase.auth.getSession();
        const accessToken = session?.session?.provider_token;

        if (accessToken) {
          googleCalendarService.initialize(accessToken);
          
          const startDateTime = new Date(`${appointment.date}T${appointment.time}:00`);
          const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

          const eventDetails = {
            title: `${appointment.service} - ${getClientName(appointment.clientId)}`,
            description: `Serviço: ${appointment.service}\nCliente: ${getClientName(appointment.clientId)}\nFuncionário: ${getEmployeeName(appointment.employeeId)}\nValor: $${appointment.price}`,
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            attendees: clientEmail ? [{ email: clientEmail }] : []
          };

          const result = await googleCalendarService.updateEvent(googleEventId, eventDetails);
          results.googleCalendar = result.success;
        }
      } catch (error) {
        console.error('Error updating Google Calendar event:', error);
      }
    }

    // Send email notification
    if (emailConfigured && clientEmail) {
      results.email = await sendEmailNotification(appointment, clientEmail, 'confirmation');
    }

    return results;
  };

  // Handle appointment deletion with Google Calendar and email
  const handleAppointmentDelete = async (appointment, clientEmail, googleEventId) => {
    const results = {
      googleCalendar: false,
      email: false
    };

    // Delete Google Calendar event
    if (googleConnected && googleEventId) {
      try {
        const { data: session } = await supabase.auth.getSession();
        const accessToken = session?.session?.provider_token;

        if (accessToken) {
          googleCalendarService.initialize(accessToken);
          const result = await googleCalendarService.deleteEvent(googleEventId);
          results.googleCalendar = result.success;
        }
      } catch (error) {
        console.error('Error deleting Google Calendar event:', error);
      }
    }

    // Send cancellation email
    if (emailConfigured && clientEmail) {
      results.email = await sendEmailNotification(appointment, clientEmail, 'cancellation');
    }

    return results;
  };

  return (
    <div className="p-6 pb-28 min-h-screen">
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

      {/* Integration Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Status das Integrações:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className={googleConnected ? 'text-green-600' : 'text-gray-400'} />
            <span className={googleConnected ? 'text-green-600' : 'text-gray-500'}>
              Google Calendar {googleConnected ? 'Configurado' : 'Não configurado'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={16} className={emailConfigured ? 'text-green-600' : 'text-gray-400'} />
            <span className={emailConfigured ? 'text-green-600' : 'text-gray-500'}>
              Email {emailConfigured ? 'Configurado' : 'Não configurado'}
            </span>
          </div>
        </div>
        {(!googleConnected || !emailConfigured) && (
          <p className="text-xs text-gray-500 mt-2">
            Configure as variáveis de ambiente para ativar as integrações.
          </p>
        )}
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
};

export default Schedule;