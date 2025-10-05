import { google } from 'googleapis';

class GoogleCalendarService {
  constructor() {
    this.oauth2Client = null;
    this.calendar = null;
  }

  // Initialize OAuth2 client with credentials
  initialize(accessToken) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    );

    this.oauth2Client.setCredentials({
      access_token: accessToken
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  // Create event in Google Calendar
  async createEvent(eventDetails) {
    try {
      if (!this.calendar) {
        throw new Error('Google Calendar not initialized');
      }

      const event = {
        summary: eventDetails.title,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.startDateTime,
          timeZone: 'America/New_York', // Adjust timezone as needed
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
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all', // Send email notifications to attendees
      });

      return {
        success: true,
        eventId: response.data.id,
        eventLink: response.data.htmlLink,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update event in Google Calendar
  async updateEvent(eventId, eventDetails) {
    try {
      if (!this.calendar) {
        throw new Error('Google Calendar not initialized');
      }

      const event = {
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
      };

      const response = await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
        sendUpdates: 'all',
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete event from Google Calendar
  async deleteEvent(eventId) {
    try {
      if (!this.calendar) {
        throw new Error('Google Calendar not initialized');
      }

      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all',
      });

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's calendar list
  async getCalendarList() {
    try {
      if (!this.calendar) {
        throw new Error('Google Calendar not initialized');
      }

      const response = await this.calendar.calendarList.list();
      return {
        success: true,
        calendars: response.data.items
      };
    } catch (error) {
      console.error('Error getting calendar list:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new GoogleCalendarService();
