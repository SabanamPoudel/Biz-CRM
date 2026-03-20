'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOnboardingData, saveOnboardingData } from '../../../lib/onboarding-api';

interface CompanyType {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  advantages: string[];
  disadvantages: string[];
  isActive: boolean;
}

export default function BusinessTypePage() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load company types from database
    const fetchCompanyTypes = async () => {
      try {
        const response = await fetch('/api/company-types');
        if (response.ok) {
          const data = await response.json();
          // Filter only active company types
          const activeTypes = data.filter((type: CompanyType) => type.isActive);
          setCompanyTypes(activeTypes);
        }
      } catch (error) {
        console.error('Error fetching company types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyTypes();

    // Load previously saved business type from database or localStorage
    const loadData = async () => {
      const dbData = await getOnboardingData();
      if (dbData?.businessType) {
        setSelectedType(dbData.businessType);
      } else {
        // Fallback to localStorage
        const savedType = localStorage.getItem('businessType');
        if (savedType) {
          setSelectedType(savedType);
        }
      }
    };
    loadData();
  }, []);

  const handleNext = () => {
    if (selectedType) {
      localStorage.setItem('businessType', selectedType);
      // Save to database
      saveOnboardingData({ businessType: selectedType }).catch(console.error);
      router.push('/onboarding/company-name');
    }
  };

  const handleBack = () => {
    router.push('/onboarding/company-origin');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Help Button */}
        <div className="mb-12 flex justify-between items-start">
          <h1 className="text-4xl font-bold text-gray-900">
            What kind of business are you building?
          </h1>
          
          {/* Need Help Button */}
          <button className="text-gray-600 hover:text-gray-800 flex items-center transition-colors">
            <span className="mr-2">Need help?</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Entity Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {companyTypes.map((companyType) => (
            <div
              key={companyType.slug}
              onClick={() => setSelectedType(companyType.slug)}
              className={`relative p-8 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                selectedType === companyType.slug
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Header */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm">
                  <span className="text-xl">{companyType.slug === 'llc' ? '👤' : companyType.slug === 'c-corp' ? '🏢' : '🏛️'}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {companyType.name}
                  </h3>
                  {companyType.description && (
                    <p className="text-gray-600 text-sm">
                      {companyType.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Advantages */}
              {companyType.advantages.length > 0 && (
                <div className="mb-6">
                  <div className="space-y-3">
                    {companyType.advantages.map((advantage, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5 mr-3">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {advantage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disadvantages */}
              {companyType.disadvantages.length > 0 && (
                <div className="mb-6">
                  <div className="space-y-3">
                    {companyType.disadvantages.map((disadvantage, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5 mr-3">
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {disadvantage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Radio button */}
              <div className="absolute bottom-8 right-8">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedType === companyType.slug 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {selectedType === companyType.slug && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-[#003174] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-blue-800">
            Stuck on choosing your formation entity? Take our{' '}
            <a href="#" className="text-[#003174] underline hover:text-blue-700">
              quick quiz
            </a>
            .
          </p>
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
            Back
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!selectedType}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}