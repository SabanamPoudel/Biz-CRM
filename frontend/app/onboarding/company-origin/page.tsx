'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveOnboardingData, getOnboardingData } from '@/lib/onboarding-api';

export default function CompanyOriginPage() {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Load existing data when component mounts
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Try to load from database if logged in
        if (token) {
          try {
            const data = await getOnboardingData();
            if (data && data.companyOrigin) {
              setSelectedOption(data.companyOrigin);
              console.log('Company origin loaded from DB:', data.companyOrigin);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.warn('Could not load from database:', error);
          }
        }
        
        // Load from localStorage as fallback
        const savedOrigin = localStorage.getItem('companyOrigin');
        if (savedOrigin) {
          setSelectedOption(savedOrigin);
          console.log('Company origin loaded from localStorage:', savedOrigin);
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExistingData();
  }, []);

  const options = [
    {
      id: 'form-new',
      title: 'Form & start my new US business',
      description: 'Form your company, get your EIN, and stay compliant.',
      icon: '🚀',
      selected: selectedOption === 'form-new'
    },
    {
      id: 'run-existing',
      title: 'Run & grow my existing US business',
      description: 'International banking, tax filings, bookkeeping and more.',
      icon: '✅',
      selected: selectedOption === 'run-existing'
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleContinue = async () => {
    if (selectedOption) {
      setIsSaving(true);
      try {
        const token = localStorage.getItem('token');
        
        // Try to save to database if logged in
        if (token) {
          try {
            await saveOnboardingData({ companyOrigin: selectedOption });
            console.log('✅ Saved to database');
          } catch (error) {
            console.warn('Could not save to database, saving locally only:', error);
          }
        }
        
        // Always save to localStorage
        localStorage.setItem('companyOrigin', selectedOption);
        
        // Continue to next page
        router.push('/onboarding/business-type');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    router.push('/onboarding/country');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="max-w-md">
          {/* 3D Isometric Illustration */}
          <div className="relative mb-8">
            <div className="w-80 h-80 relative">
              {/* Base platform */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-16 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg shadow-lg"></div>
              
              {/* Building blocks */}
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div className="flex flex-col items-center space-y-2">
                  {/* Top block with flag */}
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg transform rotate-12 flex items-center justify-center">
                    <span className="text-2xl">🏁</span>
                  </div>
                  
                  {/* Middle blocks */}
                  <div className="flex space-x-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg shadow-lg transform -rotate-6"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-lg shadow-lg transform rotate-6"></div>
                  </div>
                  
                  {/* Bottom blocks */}
                  <div className="flex space-x-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg shadow-lg"></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg shadow-lg"></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg shadow-lg"></div>
                  </div>
                </div>
              </div>
              
              {/* Character with flag */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-lg">👤</span>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-20 right-10 w-8 h-8 bg-yellow-300 rounded-lg opacity-60 animate-bounce"></div>
              <div className="absolute top-32 left-10 w-6 h-6 bg-blue-300 rounded-lg opacity-60 animate-pulse"></div>
              <div className="absolute bottom-32 right-16 w-4 h-4 bg-green-300 rounded-lg opacity-60"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Need Help Button */}
          <div className="flex justify-end mb-4">
            <button className="text-gray-600 hover:text-gray-800 flex items-center transition-colors">
              <span className="mr-2">Need help?</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              How can we help you? 🤝
            </h1>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  option.selected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    option.id === 'form-new' 
                      ? 'bg-red-100' 
                      : 'bg-green-100'
                  }`}>
                    {option.id === 'form-new' ? (
                      <div className="text-red-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="text-green-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {option.description}
                    </p>
                  </div>
                  
                  {/* Radio button */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    option.selected 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {option.selected && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedOption || isSaving || isLoading}
              className="flex-1 bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <span>{isSaving ? 'Saving...' : 'Continue'}</span>
              {!isSaving && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            BizzCRM © 2025 · Privacy · Terms
          </div>
        </div>
      </div>
    </div>
  );
}