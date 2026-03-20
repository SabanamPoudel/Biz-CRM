"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Here you would typically call your forgot password API
      const response = await fetch("http://localhost:3001/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to send reset email");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/login");
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
            {/* Main tower structure */}
            <div className="relative">
              {/* Base platform */}
              <div className="w-64 h-8 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg transform perspective-1000 rotateX-10 shadow-lg"></div>
              
              {/* Building blocks - taller tower */}
              <div className="absolute -top-48 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {/* Bottom block */}
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg shadow-xl transform perspective-1000 rotateY-12 rotateX-5"></div>
                  
                  {/* Second level */}
                  <div className="absolute -top-24 left-2 w-28 h-24 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg shadow-lg transform perspective-1000 rotateY-15 rotateX-8"></div>
                  
                  {/* Third level */}
                  <div className="absolute -top-40 left-4 w-24 h-20 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg shadow-lg transform perspective-1000 rotateY-18 rotateX-10"></div>
                  
                  {/* Fourth level */}
                  <div className="absolute -top-52 left-6 w-20 h-16 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-lg shadow-md transform perspective-1000 rotateY-20 rotateX-12"></div>
                  
                  {/* Top level */}
                  <div className="absolute -top-60 left-8 w-16 h-12 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg shadow-md transform perspective-1000 rotateY-25 rotateX-15"></div>
                </div>
              </div>

              {/* Character with flag at the top */}
              <div className="absolute -top-72 left-1/2 transform -translate-x-1/2 translate-x-4">
                <div className="relative">
                  {/* Flag pole */}
                  <div className="w-1 h-16 bg-gray-600 absolute left-1/2 transform -translate-x-1/2"></div>
                  {/* Flag */}
                  <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-r-lg absolute -top-2 left-1/2 shadow-md"></div>
                  {/* Character */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-[#003174] rounded-full"></div>
                    <div className="w-4 h-8 bg-blue-700 rounded-lg mx-auto"></div>
                    <div className="flex space-x-0.5 justify-center">
                      <div className="w-1.5 h-4 bg-blue-800 rounded"></div>
                      <div className="w-1.5 h-4 bg-blue-800 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Character at bottom working */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 translate-x-8">
                <div className="relative">
                  {/* Character */}
                  <div className="w-6 h-6 bg-[#003174] rounded-full"></div>
                  <div className="w-4 h-8 bg-blue-700 rounded-lg mx-auto"></div>
                  <div className="flex space-x-0.5 justify-center">
                    <div className="w-1.5 h-4 bg-blue-800 rounded"></div>
                    <div className="w-1.5 h-4 bg-blue-800 rounded"></div>
                  </div>
                  {/* Laptop/work surface */}
                  <div className="w-8 h-1 bg-gray-600 rounded mx-auto mt-1"></div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-32 -right-16 w-6 h-6 bg-gradient-to-r from-cyan-200 to-cyan-300 rounded-lg shadow-md transform rotate-12"></div>
              <div className="absolute -top-48 -left-12 w-8 h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg shadow-md transform -rotate-12"></div>
              <div className="absolute -top-24 right-12 w-4 h-4 bg-gradient-to-r from-indigo-200 to-indigo-300 rounded-lg shadow-sm transform rotate-45"></div>
              <div className="absolute -top-56 right-4 w-5 h-5 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-sm transform -rotate-30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="text-2xl font-bold text-gray-800">
              <span className="text-orange-500">Bizz</span>
              <span>CRM</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
              Reset your password
              <span className="ml-2">🔒</span>
            </h1>
          </div>

          {success ? (
            /* Success Message */
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Email sent!</h2>
                <p className="text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>
              <button
                onClick={handleBack}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Back to login
              </button>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
                  required
                />
                <label className="block text-xs text-gray-500 mt-1">Email</label>
              </div>

              {/* Info Message */}
              <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm text-gray-700">
                  <p>
                    You will receive an email shortly with verification code to reset your password.
                    Please remember to check your spam folder.
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
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