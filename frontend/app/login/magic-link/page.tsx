'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MagicLinkLoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/auth/magic-link/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type: 'login' }),
      });

      const data = await response.json();

      if (response.ok) {
        setSent(true);
      } else {
        setError(data.message || 'Failed to send magic link');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        {/* BizzCRM Logo */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gray-800">
              <span className="text-orange-500">Bizz</span>
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

      {/* Right side - Magic Link Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="text-2xl font-bold text-gray-800">
              <span className="text-orange-500">Bizz</span>
              <span>CRM</span>
            </div>
          </div>

          {/* Back to password login link */}
          <div className="mb-6 flex justify-center">
            <Link 
              href="/login" 
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-blue-200 group"
            >
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Login with password instead</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Magic Link Login ✨
            </h1>
            <p className="text-gray-600">
              Enter your email and we'll send you a magic link to sign in instantly
            </p>
          </div>

          {/* Success Message */}
          {sent ? (
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-900 mb-2">Magic link sent!</h2>
              <p className="text-green-700 mb-4">
                Check your email and click the link to sign in instantly.
              </p>
              <p className="text-green-600 text-sm">
                Sent to: <strong>{email}</strong>
              </p>
              <button
                onClick={() => {setSent(false); setEmail(''); setError('');}}
                className="mt-4 text-[#003174] hover:text-[#0052b4] font-medium text-sm"
              >
                Send to different email
              </button>
            </div>
          ) : (
            /* Magic Link Form */
            <form onSubmit={handleSendMagicLink} className="space-y-6">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent text-lg"
                  required
                />
                <label className="block text-sm text-gray-500 mt-2">Email address</label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Send Magic Link Button */}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-[#003174] hover:bg-blue-700 text-white font-medium py-4 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending magic link...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Send magic link
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            BizzCRM © 2025 · Privacy · Terms
          </div>
        </div>
      </div>
    </div>
  );
}