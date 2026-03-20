'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOnboardingData, saveOnboardingData } from '../../../lib/onboarding-api';

export default function CompanyNamePage() {
  const [companyName, setCompanyName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Load previously saved company name from database or localStorage
    const loadData = async () => {
      const dbData = await getOnboardingData();
      if (dbData?.companyName) {
        setCompanyName(dbData.companyName);
      } else {
        // Fallback to localStorage
        const savedName = localStorage.getItem('companyName');
        if (savedName) {
          setCompanyName(savedName);
        }
      }
    };
    loadData();
  }, []);

  const handleNext = () => {
    if (companyName.trim()) {
      localStorage.setItem('companyName', companyName.trim());
      // Save to database
      saveOnboardingData({ companyName: companyName.trim() }).catch(console.error);
      router.push('/onboarding/company-state');
    }
  };

  const handleBack = () => {
    router.push('/onboarding/business-type');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress indicator and Help Button */}
        <div className="mb-8 flex justify-between items-center">
          <div className="w-full bg-gray-200 rounded-full h-1 max-w-xs">
            <div className="bg-green-500 h-1 rounded-full" style={{ width: '80%' }}></div>
          </div>
          
          {/* Need Help Button */}
          <button className="text-gray-600 hover:text-gray-800 flex items-center transition-colors ml-4">
            <span className="mr-2">Need help?</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            What is your desired company name?
          </h1>
        </div>

        {/* Company Name Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent bg-gray-50"
            autoFocus
          />
        </div>

        {/* Info Box */}
        <div className="mb-12 p-6 bg-blue-50 rounded-lg flex items-start space-x-4">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-[#003174] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-blue-800 leading-relaxed">
              Please provide your preferred company name. Don't worry - you will have another 
              chance to review your company name and make any changes prior to starting the 
              official business formation process.
            </p>
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
            disabled={!companyName.trim()}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <span>Next</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}