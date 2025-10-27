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
  
  // Detectar ambiente
  const origin = request.headers.get('origin') || request.headers.get('host')
  const isLocal = origin?.includes('localhost') || request.headers.get('host')?.includes('localhost')
  const baseUrl = isLocal ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_BASE_URL || 'https://app.cleanbiz360.com')

  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${baseUrl}/agenda?error=oauth_error`);
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(`${baseUrl}/agenda?error=no_code`);
  }

  if (!state) {
    console.error('No user_id (state) received');
    return NextResponse.redirect(`${baseUrl}/agenda?error=no_user_id`);
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
        redirect_uri: `${baseUrl}/api/google-calendar/auth`,
        access_type: 'offline',
        prompt: 'consent'
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

    // Save tokens to Supabase using auth_user_id
    // Try update first (will update if record exists with matching auth_user_id OR id)
    let { error: dbError, data: updateData } = await supabase
      .from('app_users')
      .update({
        google_access_token: tokenData.access_token,
        google_refresh_token: tokenData.refresh_token || null,
        google_token_expires_at: expiresAt.toISOString(),
        google_connected_at: new Date().toISOString(),
      })
      .or(`auth_user_id.eq.${state},id.eq.${state}`)
      .select();

    console.log('📊 Update result:', { 
      rowsUpdated: updateData?.length || 0, 
      dbError, 
      userId: state 
    });

    // If no rows were updated (user doesn't exist in app_users), try insert
    if (!dbError && (!updateData || updateData.length === 0)) {
      console.log('📝 No existing record, trying insert with id and auth_user_id...');
      
      const { error: insertErr } = await supabase
        .from('app_users')
        .insert([
          {
            id: state,
            auth_user_id: state,
            google_access_token: tokenData.access_token,
            google_refresh_token: tokenData.refresh_token || null,
            google_token_expires_at: expiresAt.toISOString(),
            google_connected_at: new Date().toISOString(),
          },
        ]);
      
      if (insertErr) {
        console.error('❌ Insert error:', insertErr);
        dbError = insertErr;
      } else {
        console.log('✅ New user record created');
      }
    } else if (updateData && updateData.length > 0) {
      console.log('✅ Existing record updated successfully');
    }

    if (dbError) {
      console.error('Failed to save tokens to database:', {
        error: dbError,
        userId: state,
        supabaseUrl: supabaseUrl,
        hasServiceKey: !!supabaseServiceKey
      });
      return NextResponse.redirect(`${baseUrl}/agenda?error=db_error`);
    }

    console.log('✅ Tokens salvos no banco de dados com sucesso para user:', state);
    
    // Redirect to agenda with success message
    const redirectUrl = `${baseUrl}/agenda?google_connected=success`;
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth flow error:', error);
    return NextResponse.redirect(`${baseUrl}/agenda?error=oauth_error`);
  }
}