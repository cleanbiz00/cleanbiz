import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state'); // user_id passed as state

  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.cleanbiz360.com'}/agenda?error=oauth_error`);
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.cleanbiz360.com'}/agenda?error=no_code`);
  }

  if (!state) {
    console.error('No user_id (state) received');
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.cleanbiz360.com'}/agenda?error=no_user_id`);
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
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.cleanbiz360.com'}/api/google-calendar/auth`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.cleanbiz360.com'}/agenda?error=token_failed`);
    }

    // Calculate token expiration time (default is 3600 seconds = 1 hour)
    const expiresIn = tokenData.expires_in || 3600;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // Save tokens to Supabase
    const { error: dbError } = await supabase
      .from('app_users')
      .update({
        google_access_token: tokenData.access_token,
        google_refresh_token: tokenData.refresh_token || null,
        google_token_expires_at: expiresAt.toISOString(),
        google_connected_at: new Date().toISOString(),
      })
      .eq('id', state);

    if (dbError) {
      console.error('Failed to save tokens to database:', dbError);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.cleanbiz360.com'}/agenda?error=db_error`);
    }

    console.log('✅ Tokens salvos no banco de dados com sucesso para user:', state);
    
    // Redirect to agenda with success message
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.cleanbiz360.com'}/agenda?google_connected=success`;
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth flow error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.cleanbiz360.com'}/agenda?error=oauth_error`);
  }
}