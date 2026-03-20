'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOnboardingData, saveOnboardingData } from '../../../lib/onboarding-api';

export default function UpgradeCompliancePage() {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Load previously saved upgrade choice
    const loadData = async () => {
      try {
        const dbData = await getOnboardingData();
        if (dbData?.upgradeToCompliance !== undefined) {
          setSelectedOption(dbData.upgradeToCompliance ? 'total-compliance' : 'no-thanks');
        } else {
          // Fallback to localStorage
          const savedPackage = localStorage.getItem('selectedPackage');
          if (savedPackage === 'Total Compliance') {
            setSelectedOption('total-compliance');
          } else {
            const savedChoice = localStorage.getItem('upgradeToCompliance');
            if (savedChoice) {
              setSelectedOption(savedChoice === 'true' ? 'total-compliance' : 'no-thanks');
            }
          }
        }
      } catch (error) {
        console.error('Error loading upgrade compliance data:', error);
        // Fallback to localStorage
        const savedPackage = localStorage.getItem('selectedPackage');
        if (savedPackage === 'Total Compliance') {
          setSelectedOption('total-compliance');
        }
      }
    };
    loadData();
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    // Save to localStorage and database
    if (selectedOption === 'total-compliance') {
      localStorage.setItem('selectedPackage', 'Total Compliance');
      localStorage.setItem('expeditedEIN', 'true');
      localStorage.setItem('upgradeToCompliance', 'true');
      
      // Try to save to database
      try {
        await saveOnboardingData({ 
          upgradeToCompliance: true,
          expeditedEIN: true,
          selectedPlan: 'total-compliance'
        });
      } catch (error) {
        console.error('Error saving upgrade choice to database:', error);
        // Continue anyway - localStorage is saved
      }
      
      router.push('/onboarding/checkout');
    } else if (selectedOption === 'no-thanks') {
      localStorage.setItem('upgradeToCompliance', 'false');
      
      // Try to save to database
      try {
        await saveOnboardingData({ 
          upgradeToCompliance: false
        });
      } catch (error) {
        console.error('Error saving upgrade choice to database:', error);
        // Continue anyway - localStorage is saved
      }
      
      router.push('/onboarding/checkout');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-green-500 h-1" style={{ width: '95%' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
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
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get your Expedite EIN and more included when you upgrade to Total Compliance
          </h1>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Total Compliance Option */}
          <div 
            className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedOption === 'total-compliance' 
                ? 'border-yellow-400 bg-yellow-50' 
                : 'border-gray-200 bg-white hover:border-yellow-200'
            }`}
            onClick={() => handleOptionSelect('total-compliance')}
          >
            {/* Lightning icon */}
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Total Compliance</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Everything in Starter + DIY Bookkeeping & Business Analytics Software, CPA Consultation, State & IRS Tax Filings, and more.
            </p>

            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900">$1,999</div>
              <div className="text-gray-500">/yr</div>
              <div className="text-sm text-gray-500 mt-1">+ State fees</div>
            </div>

            {/* Radio button */}
            <div className="absolute top-6 right-6">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedOption === 'total-compliance' 
                  ? 'border-yellow-400 bg-yellow-400' 
                  : 'border-gray-300'
              }`}>
                {selectedOption === 'total-compliance' && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>

          {/* No Thanks Option */}
          <div 
            className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedOption === 'no-thanks' 
                ? 'border-gray-400 bg-gray-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => handleOptionSelect('no-thanks')}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No thanks</h3>
            
            <p className="text-gray-600 mb-6">
              I'd rather handle my company's compliance on my own.
            </p>

            {/* Radio button */}
            <div className="absolute top-6 right-6">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedOption === 'no-thanks' 
                  ? 'border-gray-400 bg-gray-400' 
                  : 'border-gray-300'
              }`}>
                {selectedOption === 'no-thanks' && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
}