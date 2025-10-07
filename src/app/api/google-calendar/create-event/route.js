import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    const { appointmentData, clientEmail, userId } = await request.json();

    if (!appointmentData) {
      return NextResponse.json({ error: 'Appointment data is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log('Creating Google Calendar event for appointment:', appointmentData);
    console.log('User ID:', userId);

    // Get the user's Google access token from database (support id or user_id schemas)
    let { data: userData, error: userError } = await supabase
      .from('app_users')
      .select('id, user_id, auth_user_id, email, google_access_token, google_refresh_token, google_token_expires_at')
      .or(`id.eq.${userId},user_id.eq.${userId},auth_user_id.eq.${userId}`)
      .limit(1)
      .single();

    // Fallback: try finding by email from auth if nothing found
    if ((!userData || userError) && supabase.auth?.admin && typeof supabase.auth.admin.getUserById === 'function') {
      try {
        const { data: authUser } = await supabase.auth.admin.getUserById(userId);
        const email = authUser?.user?.email;
        if (email) {
          const byEmail = await supabase
            .from('app_users')
            .select('id, user_id, auth_user_id, email, google_access_token, google_refresh_token, google_token_expires_at')
            .ilike('email', email)
            .limit(1)
            .maybeSingle();
          if (byEmail.data) {
            userData = byEmail.data;
            userError = null;
          }
        }
      } catch (e) {
        // ignore, keep original error handling
      }
    }

    if (userError || !userData) {
      console.error('Failed to get user data:', { userError, userId });
      return NextResponse.json({ 
        error: 'Failed to get user data' 
      }, { status: 500 });
    }

    if (!userData.google_access_token) {
      return NextResponse.json({ 
        error: 'Google Calendar not connected. Please connect your Google Calendar first.' 
      }, { status: 401 });
    }

    const accessToken = userData.google_access_token;

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
