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

    // Get the user's Google access token from database using auth_user_id
    let { data: userData, error: userError } = await supabase
      .from('app_users')
      .select('id, auth_user_id, google_access_token, google_refresh_token, google_token_expires_at')
      .eq('auth_user_id', userId)
      .limit(1)
      .single();

    console.log('📊 Database query result:', { userData, userError, userId });

    // If user not found, they need to connect Google Calendar first
    if (userError && userError.code === 'PGRST116') {
      console.log('⚠️ User not found in app_users, needs to connect Google Calendar');
      return NextResponse.json({ 
        error: 'Google Calendar not connected. Please connect your Google Calendar first.' 
      }, { status: 401 });
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

    let accessToken = userData.google_access_token;
    
    // Verificar se o token expirou e renovar se necessário
    const tokenExpiresAt = userData.google_token_expires_at ? new Date(userData.google_token_expires_at) : null;
    const now = new Date();
    
    if (tokenExpiresAt && now >= tokenExpiresAt && userData.google_refresh_token) {
      console.log('🔄 Access token expirado, renovando...');
      
      // Renovar o token usando refresh_token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: userData.google_refresh_token,
          grant_type: 'refresh_token'
        })
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        console.error('❌ Erro ao renovar token:', tokenData);
        return NextResponse.json({ 
          error: 'Failed to refresh Google token. Please reconnect your Google Calendar.' 
        }, { status: 401 });
      }
      
      // Atualizar access token no banco
      accessToken = tokenData.access_token;
      const newExpiresAt = new Date(now.getTime() + (tokenData.expires_in * 1000));
      
      await supabase
        .from('app_users')
        .update({
          google_access_token: accessToken,
          google_token_expires_at: newExpiresAt.toISOString()
        })
        .eq('id', userData.id);
      
      console.log('✅ Token renovado com sucesso, expira em:', newExpiresAt);
    }

    // Calculate end time (4 hours duration)
    const [hours, minutes] = appointmentData.time.split(':');
    const endHour = parseInt(hours) + 4;
    const endTime = `${endHour.toString().padStart(2, '0')}:${minutes}`;

    // Create the event object for Google Calendar
    const event = {
      summary: `Limpeza - ${appointmentData.clientName}`,
      description: `Serviço: ${appointmentData.service}\n\n` +
                   `👤 Cliente: ${appointmentData.clientName}\n` +
                   `📍 Endereço: ${appointmentData.clientAddress || 'Não informado'}\n` +
                   `📞 Telefone: ${appointmentData.clientPhone || 'Não informado'}\n\n` +
                   `👷 Funcionário: ${appointmentData.employeeName}\n` +
                   `💰 Preço: R$ ${appointmentData.price}` +
                   (appointmentData.comments ? `\n\n📝 Comentários:\n${appointmentData.comments}` : ''),
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
