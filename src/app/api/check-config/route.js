// app/api/check-config/route.js
export async function GET() {
  try {
    const config = {
      googleCalendar: !!(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.NEXT_PUBLIC_BASE_URL
      ),
      email: !!(
        process.env.SENDGRID_API_KEY &&
        process.env.SENDGRID_FROM_EMAIL
      ),
      supabase: !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    };

    return Response.json({ 
      success: true, 
      config 
    });
  } catch (error) {
    console.error('Config check error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
