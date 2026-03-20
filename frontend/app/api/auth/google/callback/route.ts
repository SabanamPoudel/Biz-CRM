import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // 'signup' or 'login'
  const error = searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    console.error('Google OAuth error:', error);
    const redirectUrl = state === 'signup' ? '/signup' : '/login';
    return NextResponse.redirect(new URL(`${redirectUrl}?error=oauth_error`, request.url));
  }

  // Handle missing code
  if (!code) {
    console.error('No authorization code received');
    const redirectUrl = state === 'signup' ? '/signup' : '/login';
    return NextResponse.redirect(new URL(`${redirectUrl}?error=no_code`, request.url));
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userData = await userResponse.json();

    // Now send user data to your backend
    const backendUrl = state === 'signup' 
      ? 'http://localhost:3000/auth/google/signup'
      : 'http://localhost:3000/auth/google/login';

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        googleId: userData.id,
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message || 'Backend authentication failed');
    }

    const backendData = await backendResponse.json();

    // Create response with redirect - signup goes to onboarding, login goes to dashboard
    const redirectUrl = state === 'signup' ? '/onboarding/country' : '/dashboard';
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));

    // Set authentication token as cookie
    response.cookies.set('token', backendData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Also set it in localStorage by redirecting to a page that sets it
    const successUrl = new URL('/auth/google/success', request.url);
    successUrl.searchParams.set('token', backendData.access_token);
    successUrl.searchParams.set('redirect', redirectUrl);

    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    const redirectUrl = state === 'signup' ? '/signup' : '/login';
    return NextResponse.redirect(new URL(`${redirectUrl}?error=auth_failed`, request.url));
  }
}