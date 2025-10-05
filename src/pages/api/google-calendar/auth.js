// Google Calendar Integration API Routes

// pages/api/google-calendar/auth.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error || 'Failed to exchange code for token');
    }

    // Store tokens in Supabase (you might want to store these in a user_tokens table)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Update user metadata with Google tokens
      await supabase.auth.updateUser({
        data: {
          google_access_token: tokenData.access_token,
          google_refresh_token: tokenData.refresh_token,
          google_token_expires_at: Date.now() + (tokenData.expires_in * 1000),
        }
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Google Calendar connected successfully' 
    });
  } catch (error) {
    console.error('Google Calendar auth error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// pages/api/google-calendar/create-event.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventDetails } = req.body;

  if (!eventDetails) {
    return res.status(400).json({ error: 'Event details are required' });
  }

  try {
    // Get user's Google access token
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.user_metadata?.google_access_token) {
      return res.status(401).json({ error: 'Google Calendar not connected' });
    }

    const accessToken = user.user_metadata.google_access_token;

    // Create Google Calendar event
    const eventResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: eventDetails.title,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.startDateTime,
          timeZone: 'America/New_York',
        },
        end: {
          dateTime: eventDetails.endDateTime,
          timeZone: 'America/New_York',
        },
        attendees: eventDetails.attendees || [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
      }),
    });

    const eventData = await eventResponse.json();

    if (!eventResponse.ok) {
      throw new Error(eventData.error?.message || 'Failed to create calendar event');
    }

    res.status(200).json({ 
      success: true, 
      eventId: eventData.id,
      eventLink: eventData.htmlLink,
      data: eventData
    });
  } catch (error) {
    console.error('Google Calendar create event error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// pages/api/google-calendar/update-event.js
export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventId, eventDetails } = req.body;

  if (!eventId || !eventDetails) {
    return res.status(400).json({ error: 'Event ID and details are required' });
  }

  try {
    // Get user's Google access token
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.user_metadata?.google_access_token) {
      return res.status(401).json({ error: 'Google Calendar not connected' });
    }

    const accessToken = user.user_metadata.google_access_token;

    // Update Google Calendar event
    const eventResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: eventDetails.title,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.startDateTime,
          timeZone: 'America/New_York',
        },
        end: {
          dateTime: eventDetails.endDateTime,
          timeZone: 'America/New_York',
        },
        attendees: eventDetails.attendees || [],
      }),
    });

    const eventData = await eventResponse.json();

    if (!eventResponse.ok) {
      throw new Error(eventData.error?.message || 'Failed to update calendar event');
    }

    res.status(200).json({ 
      success: true, 
      data: eventData
    });
  } catch (error) {
    console.error('Google Calendar update event error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// pages/api/google-calendar/delete-event.js
export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventId } = req.query;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    // Get user's Google access token
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.user_metadata?.google_access_token) {
      return res.status(401).json({ error: 'Google Calendar not connected' });
    }

    const accessToken = user.user_metadata.google_access_token;

    // Delete Google Calendar event
    const eventResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!eventResponse.ok) {
      const errorData = await eventResponse.json();
      throw new Error(errorData.error?.message || 'Failed to delete calendar event');
    }

    res.status(200).json({ 
      success: true, 
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Google Calendar delete event error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
