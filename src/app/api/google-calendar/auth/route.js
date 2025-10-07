import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://cleanbiz360.com'}?error=oauth_error`);
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://cleanbiz360.com'}?error=no_code`);
  }

  try {
    // Debug: Log environment variables
    console.log('Debug OAuth - Environment variables:');
    console.log('CLIENT_ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
    console.log('CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');
    console.log('BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || 'cleanbiz360.com');
    console.log('CODE:', code ? 'RECEIVED' : 'NOT RECEIVED');
    
    // Exchange authorization code for access token
    const requestBody = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://cleanbiz360.com'}/api/google-calendar/auth`,
    });
    
    console.log('Debug OAuth - Request body:', requestBody.toString());
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    });

    const tokenData = await tokenResponse.json();
    
    console.log('Debug OAuth - Response status:', tokenResponse.status);
    console.log('Debug OAuth - Response data:', tokenData);

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://cleanbiz360.com'}?error=token_failed&details=${encodeURIComponent(JSON.stringify(tokenData))}`);
    }

    // Store the access token (in a real app, you'd store this in a database)
    // For now, we'll store it in localStorage via a redirect with the token
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://cleanbiz360.com'}?google_token=${encodeURIComponent(tokenData.access_token)}&refresh_token=${encodeURIComponent(tokenData.refresh_token || '')}`;
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth flow error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://cleanbiz360.com'}?error=oauth_error`);
  }
}
