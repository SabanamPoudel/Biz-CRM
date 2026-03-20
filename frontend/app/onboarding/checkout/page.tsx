'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [companyDetails, setCompanyDetails] = useState({
    name: '',
    entityType: '',
    state: ''
  });
  const router = useRouter();

  useEffect(() => {
    // Get stored onboarding data
    const packageType = localStorage.getItem('selectedPlan') || 'total-compliance';
    const billingType = localStorage.getItem('billingType') || 'annual';
    const companyName = localStorage.getItem('companyName') || 'lala';
    const entityType = localStorage.getItem('entityType') || 'LLC';
    const selectedStateId = localStorage.getItem('selectedState') || 'wyoming';
    
    // Map package ID to display name
    let packageName = 'Total Compliance';
    if (packageType === 'starter') {
      packageName = 'Starter';
    } else if (packageType === 'business-in-a-box') {
      packageName = 'Business-in-a-Box™';
    }
    
    // Map state ID to display name
    const stateNames: { [key: string]: string } = {
      'wyoming': 'Wyoming',
      'delaware': 'Delaware',
      'nevada': 'Nevada',
      'texas': 'Texas',
      'california': 'California',
      'arkansas': 'Arkansas',
      // Add more states as needed
    };
    
    const stateName = stateNames[selectedStateId] || 'Wyoming';
    
    setSelectedPackage(packageName);
    setCompanyDetails({
      name: companyName,
      entityType: entityType,
      state: stateName
    });
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleEditCompany = () => {
    router.push('/onboarding/business-type');
  };

  const handleEditSubscription = () => {
    router.push('/onboarding/package');
  };

  const handleEditStateFee = () => {
    router.push('/onboarding/company-state');
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      // Navigate to payment page
      router.push('/payment');
    }
  };

  // Calculate prices based on selected package
  let packagePrice = 1999.00;
  let billingLabel = 'Annual';
  
  if (selectedPackage === 'Starter') {
    packagePrice = 297.00;
  } else if (selectedPackage === 'Business-in-a-Box™') {
    const billingType = localStorage.getItem('billingType') || 'annual';
    if (billingType === 'monthly') {
      packagePrice = 329.00;
      billingLabel = 'Monthly';
    } else {
      packagePrice = 2999.00;
    }
  }
  
  const stateFee = 103.75;
  const totalPrice = packagePrice + stateFee;

  return (
    <div className="min-h-screen bg-white">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-green-500 h-1" style={{ width: '100%' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Your dream business is ready. Are you?
          </h1>

          {/* Flawless Formation Guarantee */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-12">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Flawless Formation — Or You Get Your Money Back
                </h3>
                <p className="text-gray-600 mb-4">
                  We know how important it is to get your company formed the right way. If there's an error in your formation due to our service, we'll refund that portion — no questions asked.
                </p>
                <button className="text-[#003174] hover:text-blue-800 font-medium">
                  See Conditions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Company Details */}
          <div className="space-y-8">
            {/* Company Section */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Company</h3>
                <button 
                  onClick={handleEditCompany}
                  className="text-[#003174] hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                >
                  <span>Edit</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Preferred name</span>
                  <span className="text-gray-900 font-medium">{companyDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entity type</span>
                  <span className="text-gray-900 font-medium">{companyDetails.entityType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State</span>
                  <span className="text-gray-900 font-medium">{companyDetails.state}</span>
                </div>
              </div>
            </div>

            {/* Subscription Section */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Subscription</h3>
                <button 
                  onClick={handleEditSubscription}
                  className="text-[#003174] hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                >
                  <span>Edit</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package</span>
                  <span className="text-gray-900 font-medium">{selectedPackage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="text-gray-900 font-medium">${packagePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing</span>
                  <span className="text-gray-900 font-medium">{billingLabel}</span>
                </div>
              </div>
            </div>

            {/* State Fee Section */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">State fee</h3>
                <button 
                  onClick={handleEditStateFee}
                  className="text-[#003174] hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                >
                  <span>Edit</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">State</span>
                  <span className="text-gray-900 font-medium">{companyDetails.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="text-gray-900 font-medium">${stateFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing</span>
                  <span className="text-gray-900 font-medium">One-time</span>
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="mt-1 w-5 h-5 text-[#003174] border-gray-300 rounded focus:ring-[#003174]"
                />
                <span className="text-gray-700">
                  By checking the box, I confirm the accuracy of the provided information.
                </span>
              </label>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-8">
            {/* Your Plan Summary */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your plan</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">{selectedPackage}</span>
                  <span className="text-gray-900 font-medium">${packagePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">State fee</span>
                  <span className="text-gray-900 font-medium">${stateFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total due today</span>
                    <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 bg-[#003174] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">💡</span>
                  </div>
                </div>
                <p className="text-blue-800 text-sm">
                  After confirming, we'll gather additional details about your company, such as company members, registered address, ownership breakdown, and more.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-12">
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
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}