#!/bin/bash

# BizzCRM Google OAuth Setup Verification Script

echo "🔍 Checking BizzCRM Google OAuth Setup..."
echo "=========================================="

# Check if frontend .env.local exists
if [ -f "frontend/.env.local" ]; then
    echo "✅ Frontend .env.local file exists"
    
    # Check for Google Client ID
    if grep -q "NEXT_PUBLIC_GOOGLE_CLIENT_ID" frontend/.env.local; then
        echo "✅ Google Client ID variable found"
        if grep -q "your_google_client_id_here" frontend/.env.local; then
            echo "⚠️  Please replace placeholder Google Client ID with real value"
        else
            echo "✅ Google Client ID appears to be set"
        fi
    else
        echo "❌ Google Client ID variable missing"
    fi
    
    # Check for Google Client Secret
    if grep -q "GOOGLE_CLIENT_SECRET" frontend/.env.local; then
        echo "✅ Google Client Secret variable found"
        if grep -q "your_google_client_secret_here" frontend/.env.local; then
            echo "⚠️  Please replace placeholder Google Client Secret with real value"
        else
            echo "✅ Google Client Secret appears to be set"
        fi
    else
        echo "❌ Google Client Secret variable missing"
    fi
else
    echo "❌ Frontend .env.local file not found"
    echo "   Please create frontend/.env.local with Google OAuth credentials"
fi

echo ""
echo "📋 Setup Checklist:"
echo "==================="
echo "□ Get Google OAuth credentials from Google Cloud Console"
echo "□ Add credentials to frontend/.env.local"
echo "□ Set authorized redirect URI: http://localhost:3003/api/auth/google/callback"
echo "□ Start backend server: cd apps/backend && npm run start:dev"
echo "□ Start frontend server: cd frontend && npm run dev"
echo "□ Test Google sign-in at http://localhost:3003/signup"

echo ""
echo "🔗 Helpful Links:"
echo "=================="
echo "Google Cloud Console: https://console.cloud.google.com/"
echo "Setup Guide: See GOOGLE_OAUTH_SETUP.md"

echo ""
echo "🚀 Ready to test Google OAuth integration!"