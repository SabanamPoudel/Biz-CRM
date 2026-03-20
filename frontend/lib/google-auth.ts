// Google OAuth configuration and utilities

// You'll need to get these from Google Cloud Console
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// Validate that required environment variables are set
if (!GOOGLE_CLIENT_ID) {
  console.warn('⚠️ Google Client ID not found. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local');
}

// Google OAuth URLs
export const GOOGLE_OAUTH_URL = 'https://accounts.google.com/oauth/authorize';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

// Scopes we need
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
].join(' ');

// Generate Google OAuth URL
export function getGoogleOAuthURL(state: 'signup' | 'login') {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google Client ID not configured. Please check your environment variables.');
  }

  const rootUrl = GOOGLE_OAUTH_URL;
  const redirectUri = `${window.location.origin}/api/auth/google/callback`;
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    state: state // 'signup' or 'login'
  });

  return `${rootUrl}?${params.toString()}`;
}

// Handle Google OAuth flow
export async function handleGoogleAuth(code: string, state: 'signup' | 'login') {
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('/api/auth/google/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    return tokenData;
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
}

// Initiate Google OAuth flow
export function initiateGoogleOAuth(type: 'signup' | 'login') {
  try {
    const authUrl = getGoogleOAuthURL(type);
    window.location.href = authUrl;
  } catch (error) {
    console.error('Failed to initiate Google OAuth:', error);
    throw error;
  }
}