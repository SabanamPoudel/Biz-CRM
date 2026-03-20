'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOnboardingData, saveOnboardingData } from '../../../lib/onboarding-api';

interface StateOption {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  billing: string;
  recommended?: boolean;
}

export default function CompanyStatePage() {
  const [selectedState, setSelectedState] = useState<string>('wyoming');
  const [showOtherStates, setShowOtherStates] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load previously saved state from database or localStorage
    const loadData = async () => {
      const dbData = await getOnboardingData();
      if (dbData?.selectedState) {
        setSelectedState(dbData.selectedState);
        if (dbData.selectedState !== 'wyoming' && dbData.selectedState !== 'other') {
          setShowOtherStates(true);
        }
      } else {
        // Fallback to localStorage
        const savedState = localStorage.getItem('selectedState');
        if (savedState) {
          setSelectedState(savedState);
          if (savedState !== 'wyoming' && savedState !== 'other') {
            setShowOtherStates(true);
          }
        }
      }
    };
    loadData();
  }, []);

  const stateOptions: StateOption[] = [
    {
      id: 'wyoming',
      name: 'Wyoming',
      subtitle: 'Recommended',
      price: '$103',
      billing: 'One-time',
      recommended: true
    },
    {
      id: 'other',
      name: 'Other',
      subtitle: 'Choose another state',
      price: 'Varies',
      billing: 'One-time'
    }
  ];

  const otherStates = [
    { id: 'alabama', name: 'Alabama', price: '$236' },
    { id: 'alaska', name: 'Alaska', price: '$250' },
    { id: 'arizona', name: 'Arizona', price: '$85' },
    { id: 'arkansas', name: 'Arkansas', price: '$45' },
    { id: 'california', name: 'California', price: '$70' },
    { id: 'colorado', name: 'Colorado', price: '$50' },
    { id: 'connecticut', name: 'Connecticut', price: '$120' },
    { id: 'delaware', name: 'Delaware', price: '$110' },
    { id: 'florida', name: 'Florida', price: '$125' },
    { id: 'georgia', name: 'Georgia', price: '$105' },
    { id: 'hawaii', name: 'Hawaii', price: '$51' },
    { id: 'idaho', name: 'Idaho', price: '$103' },
    { id: 'illinois', name: 'Illinois', price: '$153' },
    { id: 'indiana', name: 'Indiana', price: '$97' },
    { id: 'iowa', name: 'Iowa', price: '$50' },
    { id: 'kansas', name: 'Kansas', price: '$166' },
    { id: 'kentucky', name: 'Kentucky', price: '$40' },
    { id: 'louisiana', name: 'Louisiana', price: '$105' },
    { id: 'maine', name: 'Maine', price: '$178' },
    { id: 'maryland', name: 'Maryland', price: '$155' },
    { id: 'massachusetts', name: 'Massachusetts', price: '$520' },
    { id: 'michigan', name: 'Michigan', price: '$50' },
    { id: 'minnesota', name: 'Minnesota', price: '$155' },
    { id: 'mississippi', name: 'Mississippi', price: '$53' },
    { id: 'missouri', name: 'Missouri', price: '$51' },
    { id: 'montana', name: 'Montana', price: '$35' },
    { id: 'nebraska', name: 'Nebraska', price: '$103' },
    { id: 'nevada', name: 'Nevada', price: '$436' },
    { id: 'new-hampshire', name: 'New Hampshire', price: '$102' },
    { id: 'new-jersey', name: 'New Jersey', price: '$129' },
    { id: 'new-mexico', name: 'New Mexico', price: '$51' },
    { id: 'new-york', name: 'New York', price: '$205' },
    { id: 'north-carolina', name: 'North Carolina', price: '$128' },
    { id: 'north-dakota', name: 'North Dakota', price: '$135' },
    { id: 'ohio', name: 'Ohio', price: '$99' },
    { id: 'oklahoma', name: 'Oklahoma', price: '$104' },
    { id: 'oregon', name: 'Oregon', price: '$100' },
    { id: 'pennsylvania', name: 'Pennsylvania', price: '$125' },
    { id: 'rhode-island', name: 'Rhode Island', price: '$156' },
    { id: 'south-carolina', name: 'South Carolina', price: '$125' },
    { id: 'south-dakota', name: 'South Dakota', price: '$150' },
    { id: 'tennessee', name: 'Tennessee', price: '$307' },
    { id: 'texas', name: 'Texas', price: '$300' },
    { id: 'utah', name: 'Utah', price: '$59' },
    { id: 'vermont', name: 'Vermont', price: '$155' },
    { id: 'virginia', name: 'Virginia', price: '$100' },
    { id: 'washington', name: 'Washington', price: '$200' },
    { id: 'west-virginia', name: 'West Virginia', price: '$130' },
    { id: 'wisconsin', name: 'Wisconsin', price: '$130' },
  ];

  const handleStateSelect = (stateId: string) => {
    setSelectedState(stateId);
    if (stateId === 'other') {
      setShowOtherStates(true);
    } else {
      setShowOtherStates(false);
    }
  };

  const handleNext = () => {
    if (selectedState) {
      localStorage.setItem('selectedState', selectedState);
      // Save to database
      saveOnboardingData({ selectedState }).catch(console.error);
      router.push('/onboarding/ownership');
    }
  };

  const handleBack = () => {
    router.push('/onboarding/company-name');
  };

  const selectedStateDetails = stateOptions.find(state => state.id === selectedState) || 
    otherStates.find(state => state.id === selectedState);

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
            Which State do you want to form your business in?
          </h1>
        </div>

        {/* State Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stateOptions.map((state) => {
            // Check if this option should be selected
            const isSelected = state.id === 'wyoming' 
              ? selectedState === 'wyoming' 
              : (state.id === 'other' && (selectedState === 'other' || otherStates.some(s => s.id === selectedState)));
            
            return (
            <div key={state.id} className="relative">
              <div
                onClick={() => handleStateSelect(state.id)}
                className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                } ${state.recommended ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {state.name}
                    </h3>
                    {state.subtitle && (
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        state.recommended 
                          ? 'text-green-700 bg-green-100' 
                          : 'text-gray-600'
                      }`}>
                        {state.subtitle}
                      </span>
                    )}
                  </div>
                  
                  {/* Radio button */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isSelected && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Show other states dropdown */}
              {state.id === 'other' && showOtherStates && (
                <div className="mt-4">
                  <select
                    value={selectedState === 'other' ? '' : selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setShowOtherStates(true);
                    }}
                    className="w-full px-4 py-3 border-2 border-blue-500 rounded-lg bg-white text-gray-900 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-blue-500 cursor-pointer text-sm transition-all duration-200 appearance-none"
                    style={{
                      backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23374151%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')",
                      backgroundSize: '1.25em',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">Select your desired state</option>
                    {otherStates.map((otherState) => (
                      <option key={otherState.id} value={otherState.id}>
                        {otherState.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
          })}
        </div>

        {/* State Fee Table - Only show when a specific state is selected */}
        {selectedState && selectedState !== 'other' && (
          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">State Fee</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-700">State</span>
                <span className="font-medium text-gray-900">
                  {selectedStateDetails?.name || 'Wyoming'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Price</span>
                <span className="font-medium text-gray-900">
                  {selectedStateDetails?.price || '$103'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Billing</span>
                <span className="font-medium text-gray-900">One-time</span>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-[#003174] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                • Wyoming is recommended for simplified formation, lower annual operating costs and flexibility. No corporate income tax or annual franchise tax.
              </p>
              <p>
                • Some states have additional requirements after your company is registered. You can view the full list of state-specific requirements{' '}
                <a href="#" className="text-[#003174] underline hover:text-blue-700">
                  here
                </a>
                .
              </p>
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
            disabled={!selectedState}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}