import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { appointmentData, clientEmail } = await request.json();

    if (!appointmentData) {
      return NextResponse.json({ error: 'Appointment data is required' }, { status: 400 });
    }

    console.log('Creating Google Calendar event for appointment:', appointmentData);

    // Get the access token from the request headers or from stored tokens
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Google access token is required' 
      }, { status: 401 });
    }

    // Calculate end time (1 hour duration)
    const [hours, minutes] = appointmentData.time.split(':');
    const endHour = parseInt(hours) + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:${minutes}`;

    // Create the event object for Google Calendar
    const event = {
      summary: `Limpeza - ${appointmentData.clientName}`,
      description: `Serviço: ${appointmentData.service}\nCliente: ${appointmentData.clientName}\nFuncionário: ${appointmentData.employeeName}\nPreço: R$ ${appointmentData.price}`,
      start: {
        dateTime: `${appointmentData.date}T${appointmentData.time}:00-03:00`,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: `${appointmentData.date}T${endTime}:00-03:00`,
        timeZone: 'America/Sao_Paulo',
      },
      attendees: clientEmail ? [{ email: clientEmail }] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    };

    // Create the event in Google Calendar
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Google Calendar API error:', result);
      return NextResponse.json({
        success: false,
        error: result.error?.message || 'Failed to create calendar event'
      }, { status: response.status });
    }

    console.log('Google Calendar event created successfully:', result.id);
    
    return NextResponse.json({
      success: true,
      eventId: result.id,
      message: 'Google Calendar event created successfully',
      eventUrl: result.htmlLink
    });

  } catch (error) {
    console.error('Google Calendar event creation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
