# Google Calendar + Email Integration Setup

## 1. Google Cloud Console Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Name it "CleanBiz Calendar Integration"

### Step 2: Enable Google Calendar API
1. Go to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click "Enable"

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/google-calendar/auth` (development)
   - `https://your-vercel-app.vercel.app/api/google-calendar/auth` (production)

### Step 4: Get Credentials
Copy the Client ID and Client Secret

## 2. SendGrid Setup

### Step 1: Create SendGrid Account
1. Go to [SendGrid](https://sendgrid.com)
2. Sign up for free account
3. Verify your email

### Step 2: Create API Key
1. Go to "Settings" > "API Keys"
2. Click "Create API Key"
3. Choose "Restricted Access"
4. Give it "Mail Send" permissions
5. Copy the API key

### Step 3: Verify Sender
1. Go to "Settings" > "Sender Authentication"
2. Verify a single sender email (e.g., noreply@cleanbiz360.com)

## 3. Environment Variables

Add these to your `.env.local` file:

```env
# Google Calendar API
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-calendar/auth

# SendGrid Email
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@cleanbiz360.com
```

## 4. Vercel Environment Variables

Add the same variables to Vercel:
1. Go to your Vercel project dashboard
2. Go to "Settings" > "Environment Variables"
3. Add each variable with the production values

## 5. Supabase Database Updates

Run this SQL in Supabase to add Google Calendar integration:

```sql
-- Add Google Calendar fields to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS google_event_id TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS client_email TEXT;

-- Add Google tokens to user metadata (this will be handled by Supabase Auth)
-- No additional tables needed as tokens are stored in user metadata
```

## 6. How It Works

### Google Calendar Integration:
1. User clicks "Connect Google Calendar" button
2. Redirects to Google OAuth consent screen
3. User authorizes the app
4. Google redirects back with authorization code
5. App exchanges code for access token
6. Token stored in user metadata
7. App can now create/update/delete calendar events

### Email Integration:
1. When appointment is created/updated/deleted
2. App calls SendGrid API
3. Email sent to client with appointment details
4. Templates include confirmation, reminder, and cancellation emails

### Automatic Workflow:
1. **Create Appointment**: Creates Google Calendar event + sends confirmation email
2. **Update Appointment**: Updates Google Calendar event + sends update email
3. **Delete Appointment**: Deletes Google Calendar event + sends cancellation email

## 7. Testing

### Local Testing:
1. Start development server: `npm run dev`
2. Go to Schedule page
3. Check integration status indicators
4. Create test appointment
5. Verify Google Calendar event created
6. Check email sent

### Production Testing:
1. Deploy to Vercel
2. Test with real Google account
3. Verify emails are delivered
4. Check Google Calendar events

## 8. Troubleshooting

### Common Issues:
- **Google Calendar not connecting**: Check OAuth redirect URI matches exactly
- **Emails not sending**: Verify SendGrid API key and sender authentication
- **Events not creating**: Check Google Calendar API is enabled
- **Token expired**: Implement refresh token logic

### Debug Steps:
1. Check browser console for errors
2. Check Vercel function logs
3. Verify environment variables are set
4. Test API endpoints individually

## 9. Security Notes

- Never expose client secrets in frontend code
- Use environment variables for all sensitive data
- Implement proper error handling
- Validate all user inputs
- Use HTTPS in production
- Regularly rotate API keys

## 10. Next Steps

After setup:
1. Test the complete flow
2. Add error handling for edge cases
3. Implement refresh token logic
4. Add bulk operations for multiple appointments
5. Consider adding calendar sync for existing events
