"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { initiateGoogleOAuth } from "../../lib/google-auth";
import { API_URL } from "@/lib/api-config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle OAuth errors from URL params
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      switch (urlError) {
        case 'oauth_error':
          setError('Google authentication was cancelled or failed');
          break;
        case 'no_code':
          setError('Authentication failed - no authorization code received');
          break;
        case 'auth_failed':
          setError('Authentication failed - please try again');
          break;
        default:
          setError('An error occurred during authentication');
      }
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    
    try {
      initiateGoogleOAuth('login');
    } catch (error) {
      setError("Failed to initiate Google authentication");
      setGoogleLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setMagicLinkLoading(true);
    setError("");
    setMagicLinkSent(false);

    try {
      const response = await fetch(`${API_URL}/auth/magic-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMagicLinkSent(true);
      } else {
        setError(data.message || "Failed to send magic link");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setMagicLinkLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token || data.access_token;
        console.log('Login successful, token received:', !!token, 'length:', token?.length);
        localStorage.setItem("token", token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#e7edfc] to-[#d0ddfa] relative overflow-hidden">
        {/* BizzCRM Logo */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-[#003174]">
              <span className="text-[#c51111]">Bizz</span>
              <span>CRM</span>
            </div>
          </div>
        </div>

        {/* 3D Illustration */}
        <div className="flex items-center justify-center w-full h-full p-12">
          <div className="relative">
            {/* Main building structure */}
            <div className="relative">
              {/* Base platform */}
              <div className="w-64 h-8 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg transform perspective-1000 rotateX-10 shadow-lg"></div>
              
              {/* Building blocks */}
              <div className="absolute -top-32 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {/* Bottom block */}
                  <div className="w-32 h-24 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg shadow-xl transform perspective-1000 rotateY-12 rotateX-5"></div>
                  
                  {/* Middle blocks */}
                  <div className="absolute -top-16 -left-8 w-24 h-20 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg shadow-lg transform perspective-1000 rotateY-20 rotateX-10"></div>
                  <div className="absolute -top-12 left-16 w-20 h-16 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg shadow-lg transform perspective-1000 rotateY-15 rotateX-8"></div>
                  
                  {/* Top blocks */}
                  <div className="absolute -top-24 left-4 w-16 h-12 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-lg shadow-md transform perspective-1000 rotateY-10 rotateX-15"></div>
                  <div className="absolute -top-20 left-20 w-12 h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg shadow-md transform perspective-1000 rotateY-25 rotateX-12"></div>
                </div>
              </div>

              {/* Character with flag */}
              <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 -translate-x-8">
                <div className="relative">
                  {/* Flag pole */}
                  <div className="w-1 h-20 bg-gray-600 absolute left-1/2 transform -translate-x-1/2"></div>
                  {/* Flag */}
                  <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-r-lg absolute -top-2 left-1/2 shadow-md"></div>
                  {/* Character */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-[#003174] rounded-full"></div>
                    <div className="w-6 h-12 bg-blue-700 rounded-lg mx-auto"></div>
                    <div className="flex space-x-1 justify-center">
                      <div className="w-2 h-6 bg-blue-800 rounded"></div>
                      <div className="w-2 h-6 bg-blue-800 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-20 -right-12 w-8 h-8 bg-gradient-to-r from-cyan-200 to-cyan-300 rounded-lg shadow-md transform rotate-12"></div>
              <div className="absolute -top-16 -left-16 w-6 h-6 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg shadow-md transform -rotate-12"></div>
              <div className="absolute -top-8 right-8 w-4 h-4 bg-gradient-to-r from-indigo-200 to-indigo-300 rounded-lg shadow-sm transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="text-2xl font-bold text-[#003174]">
              <span className="text-[#c51111]">Bizz</span>
              <span>CRM</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#003174] mb-4">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-[#c51111] hover:text-[#a00e0e] font-semibold">
                Sign up
              </a>
            </p>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-[#e7edfc] rounded-lg shadow-sm bg-white text-[#003174] hover:bg-[#e7edfc] transition-all duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {googleLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting to Google...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {/* Magic Link Login Button */}
          <a
            href="/login/magic-link"
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-[#003174] rounded-lg shadow-sm bg-[#e7edfc] text-[#003174] hover:bg-[#d0ddfa] transition-all duration-200 mb-6 font-medium"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Login with magic link
          </a>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with password</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#003174] mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-[#003174] transition-all duration-200"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#003174] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-[#003174] transition-all duration-200 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#003174] focus:ring-[#003174] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="/forgot-password" className="text-[#003174] hover:text-[#0052b4] font-medium">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#003174] hover:bg-[#0052b4] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            BizzCRM © 2025 · Privacy · Terms
          </div>
        </div>
      </div>
    </div>
  );
}