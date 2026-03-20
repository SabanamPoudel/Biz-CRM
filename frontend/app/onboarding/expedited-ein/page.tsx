'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOnboardingData, saveOnboardingData } from '../../../lib/onboarding-api';

export default function ExpeditedEINPage() {
  const [expeditedEIN, setExpeditedEIN] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Load previously saved expedited EIN choice
    const loadData = async () => {
      try {
        const dbData = await getOnboardingData();
        if (dbData?.expeditedEIN !== undefined) {
          setExpeditedEIN(dbData.expeditedEIN ? 'yes' : 'no');
        } else {
          // Fallback to localStorage
          const savedChoice = localStorage.getItem('expeditedEIN');
          if (savedChoice) {
            setExpeditedEIN(savedChoice === 'true' ? 'yes' : 'no');
          }
        }
      } catch (error) {
        console.error('Error loading expedited EIN data:', error);
        // Fallback to localStorage
        const savedChoice = localStorage.getItem('expeditedEIN');
        if (savedChoice) {
          setExpeditedEIN(savedChoice === 'true' ? 'yes' : 'no');
        }
      }
    };
    loadData();
  }, []);

  const handleNext = async () => {
    // Save to localStorage
    localStorage.setItem('expeditedEIN', expeditedEIN === 'yes' ? 'true' : 'false');
    
    // Try to save to database
    try {
      await saveOnboardingData({ 
        expeditedEIN: expeditedEIN === 'yes' 
      });
    } catch (error) {
      console.error('Error saving expedited EIN to database:', error);
      // Continue anyway - localStorage is saved
    }
    // Save to localStorage
    localStorage.setItem('expeditedEIN', expeditedEIN === 'yes' ? 'true' : 'false');
    
    // Try to save to database
    try {
      await saveOnboardingData({ 
        expeditedEIN: expeditedEIN === 'yes' 
      });
    } catch (error) {
      console.error('Error saving expedited EIN to database:', error);
      // Continue anyway - localStorage is saved
    }
    
    if (expeditedEIN === 'yes') {
      // If user selected expedited EIN, show upgrade to Total Compliance page
      router.push('/onboarding/upgrade-compliance');
    } else if (expeditedEIN === 'no') {
      // If user declined expedited EIN, go directly to checkout with Starter package
      router.push('/onboarding/checkout');
    }
  };

  const handleBack = () => {
    router.push('/onboarding/package');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress indicator and Help Button */}
        <div className="mb-8 flex justify-between items-center">
          <div className="w-16 h-1 bg-green-500 rounded-full"></div>
          
          {/* Need Help Button */}
          <button className="text-gray-600 hover:text-gray-800 flex items-center transition-colors">
            <span className="mr-2">Need help?</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Want to launch your business at lightening speed?
          </h1>
        </div>

        {/* Expedited EIN Options */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expedited EIN Option */}
            <div
              onClick={() => setExpeditedEIN('yes')}
              className={`p-8 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                expeditedEIN === 'yes'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Expedited EIN
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get your EIN number from the IRS up to 2 weeks faster!
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900">$300</span>
                    <span className="text-gray-600 ml-2 text-sm">One-time</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    expeditedEIN === 'yes' 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {expeditedEIN === 'yes' && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* No Thanks Option */}
            <div
              onClick={() => setExpeditedEIN('no')}
              className={`p-8 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                expeditedEIN === 'no'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No thanks,
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    I can wait up to 8 weeks on average for my company to be formed.
                  </p>
                  <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      Get your Expedited EIN and more included when you upgrade to Total Compliance
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    expeditedEIN === 'no' 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {expeditedEIN === 'no' && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!expeditedEIN}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}