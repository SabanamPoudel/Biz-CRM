# Google OAuth Setup Guide for BizzCRM

## 🚀 Quick Setup

To enable Google Sign-in/Sign-up functionality in your BizzCRM application, follow these steps:

### 1. **Google Cloud Console Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:3003/api/auth/google/callback`
     - Production: `https://yourdomain.com/api/auth/google/callback`

### 2. **Environment Variables**

Update your `.env.local` file in the frontend directory:

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
```

Replace the placeholder values with your actual credentials from Google Cloud Console.

### 3. **Test the Integration**

1. Start your backend server: `cd apps/backend && npm run start:dev`
2. Start your frontend server: `cd frontend && npm run dev`
3. Navigate to `http://localhost:3003/signup` or `http://localhost:3003/login`
4. Click "Sign up with Google" or "Sign in with Google"

## 🔧 **How It Works**

### Frontend Flow:
1. User clicks Google sign-in button
2. Redirects to Google OAuth consent screen
3. Google redirects back to `/api/auth/google/callback`
4. Frontend API route handles the OAuth flow
5. User data is sent to backend for authentication
6. JWT token is stored and user is redirected to dashboard

### Backend Endpoints:
- `POST /auth/google/signup` - Create new user with Google account
- `POST /auth/google/login` - Login existing user with Google account

### Database:
- Added `googleId` field to store Google user ID
- Added `picture` field to store profile image URL
- `passwordHash` can be empty for Google-only users

## 🛡️ **Security Features**

- ✅ OAuth 2.0 with PKCE flow
- ✅ State parameter to prevent CSRF attacks
- ✅ Secure JWT token storage
- ✅ Automatic user creation/linking
- ✅ Email verification through Google

## 🎯 **Features**

- **Seamless Registration**: New users can sign up instantly with Google
- **Quick Login**: Existing users can login with one click
- **Profile Sync**: Name and profile picture automatically synced
- **Fallback Support**: Users can still use email/password if preferred
- **Error Handling**: Comprehensive error messages and fallbacks

## 🔍 **Troubleshooting**

### Common Issues:

1. **"OAuth Error"**: Check your Google Cloud Console redirect URIs
2. **"Client ID not set"**: Verify environment variables are loaded
3. **"Backend authentication failed"**: Check backend server is running
4. **"Redirect URI mismatch"**: Ensure URIs match exactly in Google Console

### Debug Mode:
Check browser console and network tab for detailed error messages.

## 📝 **Production Checklist**

- [ ] Update redirect URIs for production domain
- [ ] Use environment variables (not hardcoded secrets)
- [ ] Enable HTTPS for production
- [ ] Set up proper error monitoring
- [ ] Test with multiple Google accounts

## 🎨 **UI/UX Features**

- **Loading States**: Spinner animations during OAuth flow
- **Error Messages**: User-friendly error handling
- **Responsive Design**: Works on mobile and desktop
- **BizzCRM Branding**: Consistent with your app design

---

**Ready to test!** 🚀 Your Google OAuth integration is now complete and ready for testing.