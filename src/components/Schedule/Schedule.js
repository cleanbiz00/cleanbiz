import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Clock, Calendar, Mail } from 'lucide-react';
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
  const [googleAccessToken, setGoogleAccessToken] = useState(null);

  // Debug: Log appointments
  useEffect(() => {
    console.log('Schedule received appointments:', appointments);
  }, [appointments]);

  // Check for Google OAuth token on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get('google_token');
    const refreshToken = urlParams.get('refresh_token');
    const error = urlParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      alert('Erro na autenticação do Google: ' + error);
    } else if (googleToken) {
      console.log('Google token received:', googleToken);
      setGoogleAccessToken(googleToken);
      setGoogleConnected(true);
      
      // Store tokens in localStorage
      localStorage.setItem('google_access_token', googleToken);
      if (refreshToken) {
        localStorage.setItem('google_refresh_token', refreshToken);
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check localStorage for existing token
      const storedToken = localStorage.getItem('google_access_token');
      if (storedToken) {
        setGoogleAccessToken(storedToken);
        setGoogleConnected(true);
      } else {
        setGoogleConnected(false);
      }
    }
  }, []);

  // Handle Google OAuth authentication
  const handleGoogleAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '62407212309-ecsjb31ajmhsm00lig6krhaauvff0bf8.apps.googleusercontent.com';
    const redirectUri = `${window.location.origin}/api/google-calendar/auth`;
    const scope = 'https://www.googleapis.com/auth/calendar';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    window.location.href = authUrl;
  };

  // Handle Google disconnect
  const handleGoogleDisconnect = () => {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    setGoogleAccessToken(null);
    setGoogleConnected(false);
    console.log('Google Calendar disconnected');
  };

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user?.id || null);
    };
    loadUser();
  }, []);

  // Check if Google Calendar is configured and connected
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const response = await fetch('/api/check-config');
        const result = await response.json();
        
        if (result.success) {
          setEmailConfigured(result.config.email);
          
          // Check if user has a valid Google token
          const storedToken = localStorage.getItem('google_access_token');
          setGoogleConnected(!!storedToken);
        }
      } catch (error) {
        console.error('Error checking config:', error);
      }
    };
    checkConfig();
  }, []);

  // Create Google Calendar event via API
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

      const response = await fetch('/api/google-calendar/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventDetails,
          accessToken
        }),
      });

      const result = await response.json();
      
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

  // Send email notification via API
  const sendEmailNotification = async (appointment, clientEmail, type = 'confirmation') => {
    if (!emailConfigured || !clientEmail) {
      console.log('Email not configured or no client email:', { emailConfigured, clientEmail });
      return false;
    }

    try {
      console.log('Attempting to send email:', { appointment, clientEmail, type });
      
      const appointmentData = {
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        price: appointment.price,
        status: appointment.status,
        clientName: getClientName(appointment.clientId),
        employeeName: getEmployeeName(appointment.employeeId)
      };

      const endpoint = type === 'confirmation' ? '/api/email/send-confirmation' :
                      type === 'reminder' ? '/api/email/send-reminder' :
                      '/api/email/send-cancellation';

      console.log('Sending request to:', endpoint, appointmentData);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentData,
          clientEmail
        }),
      });

      const result = await response.json();
      console.log('Email API response:', result);
      
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
          const startDateTime = new Date(`${appointment.date}T${appointment.time}:00`);
          const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

          const eventDetails = {
            title: `${appointment.service} - ${getClientName(appointment.clientId)}`,
            description: `Serviço: ${appointment.service}\nCliente: ${getClientName(appointment.clientId)}\nFuncionário: ${getEmployeeName(appointment.employeeId)}\nValor: $${appointment.price}`,
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            attendees: clientEmail ? [{ email: clientEmail }] : []
          };

          const response = await fetch('/api/google-calendar/update-event', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              eventId: googleEventId,
              eventDetails,
              accessToken
            }),
          });

          const result = await response.json();
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
          const response = await fetch(`/api/google-calendar/delete-event?eventId=${googleEventId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          const result = await response.json();
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
            {!googleConnected ? (
              <button
                onClick={handleGoogleAuth}
                className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Conectar
              </button>
            ) : (
              <button
                onClick={handleGoogleDisconnect}
                className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Desconectar
              </button>
            )}
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
            {!googleConnected ? 'Clique em "Conectar" para sincronizar com seu Google Calendar.' : 'Configure as variáveis de ambiente para ativar as integrações.'}
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