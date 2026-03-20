'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOnboardingData, saveOnboardingData } from '../../../lib/onboarding-api';

interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  planServices: Array<{
    service: {
      id: number;
      name: string;
      description: string | null;
      features: Array<{
        name: string;
        description: string | null;
      }>;
    };
  }>;
}

interface CompanyType {
  id: number;
  name: string;
  slug: string;
}

export default function PackagePage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingType, setBillingType] = useState<'monthly' | 'annual'>('annual');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [selectedCompanyType, setSelectedCompanyType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load previously saved data first to get the business type
    const loadDataAndFetchPlans = async () => {
      try {
        const dbData = await getOnboardingData();
        
        // Load businessType to determine which plans to show
        const businessType = dbData?.businessType || localStorage.getItem('businessType') || '';
        setSelectedCompanyType(businessType);
        
        // Fetch company types first to map businessType slug to companyTypeId
        const companyTypesResponse = await fetch('/api/company-types');
        let companyTypeId: number | null = null;
        
        if (companyTypesResponse.ok) {
          const typesData = await companyTypesResponse.json();
          setCompanyTypes(typesData);
          
          // Find the company type ID based on the selected business type slug
          const matchedType = typesData.find((type: CompanyType) => type.slug === businessType);
          if (matchedType) {
            companyTypeId = matchedType.id;
          }
        }
        
        // Fetch plans - filter by company type if we have one
        const plansUrl = companyTypeId 
          ? `/api/plans?company_type_id=${companyTypeId}`
          : '/api/plans';
        
        const plansResponse = await fetch(plansUrl);
        if (plansResponse.ok) {
          const plansData = await plansResponse.json();
          // Filter active plans and sort by sortOrder
          const activePlans = plansData
            .filter((p: Plan) => p.isActive)
            .sort((a: Plan, b: Plan) => a.sortOrder - b.sortOrder);
          setPlans(activePlans);
        }
        
        if (dbData?.selectedPlan) {
          setSelectedPlan(dbData.selectedPlan);
        } else {
          // Fallback to localStorage
          const savedPlan = localStorage.getItem('selectedPlan');
          if (savedPlan) {
            setSelectedPlan(savedPlan);
          }
        }
        
        if (dbData?.billingType) {
          setBillingType(dbData.billingType as 'monthly' | 'annual');
        } else {
          // Fallback to localStorage
          const savedBilling = localStorage.getItem('billingType');
          if (savedBilling) {
            setBillingType(savedBilling as 'monthly' | 'annual');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDataAndFetchPlans();
  }, []);

  const handlePlanSelect = (planSlug: string) => {
    setSelectedPlan(planSlug);
  };

  // Get plan icon based on name
  const getPlanIcon = (name: string) => {
    if (name.toLowerCase().includes('starter')) return '🚀';
    if (name.toLowerCase().includes('compliance')) return '⚡';
    if (name.toLowerCase().includes('box')) return '🏆';
    return '📦';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (selectedPlan) {
      localStorage.setItem('selectedPlan', selectedPlan);
      localStorage.setItem('billingType', billingType);
      // Save to database
      saveOnboardingData({ selectedPlan, billingType }).catch(console.error);
      
      // Navigate to expedited EIN or checkout based on plan
      const plan = plans.find(p => p.slug === selectedPlan);
      if (plan?.slug === 'starter') {
        router.push('/onboarding/expedited-ein');
      } else {
        router.push('/onboarding/checkout');
      }
    }
  };

  const handleBack = () => {
    router.push('/onboarding/company-state');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            Choose a plan to power up your business
          </h1>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {plans.map((plan, index) => {
            const price = billingType === 'annual' ? plan.yearlyPriceCents / 100 : plan.monthlyPriceCents / 100;
            const billing = billingType === 'annual' ? '/yr' : '/mo';
            const icon = getPlanIcon(plan.name);
            
            // Get service features for this plan
            const features = plan.planServices
              .slice(0, 4) // Show first 4 services
              .map(ps => ps.service.name);

            return (
              <div
                key={plan.id}
                onClick={() => handlePlanSelect(plan.slug)}
                className={`relative p-8 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.slug
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                } ${plan.isPopular ? 'border-yellow-400 bg-yellow-50' : ''}`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-6">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4">
                    <span className="text-xl">{icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {plan.description || 'Complete business solution'}
                  </p>
                </div>

                {/* Features Section */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-900 mb-4">
                    {index === 0 ? 'Core Features' : `Everything in ${plans[index - 1]?.name || 'Previous'} +`}
                  </div>
                  <div className="space-y-3">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5 mr-3">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* All Features Link */}
                  <div className="mt-4">
                    <a href="#" className="text-[#003174] text-sm hover:text-blue-700">
                      All {plan.planServices.length} Features +
                    </a>
                  </div>
                </div>

                {/* Billing Toggle - Only for Popular plan */}
                {plan.isPopular && plan.monthlyPriceCents > 0 && (
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBillingType(billingType === 'annual' ? 'monthly' : 'annual');
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          billingType === 'annual' ? 'bg-black' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            billingType === 'annual' ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-sm text-gray-900 font-medium">
                        {billingType === 'annual' ? 'Annual' : 'Monthly'}
                      </span>
                    </div>
                    {billingType === 'annual' && plan.monthlyPriceCents > 0 && (
                      <span className="text-sm text-green-600 font-medium">
                        Save {Math.round((1 - (plan.yearlyPriceCents / (plan.monthlyPriceCents * 12))) * 100)}%
                      </span>
                    )}
                  </div>
                )}

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      ${price.toLocaleString()}
                    </span>
                    <span className="text-gray-600 ml-1">{billing}</span>
                  </div>
                  {plan.isPopular && billingType === 'annual' && plan.yearlyPriceCents > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      ${Math.round(plan.yearlyPriceCents / 100 / 12).toLocaleString()}/mo billed annually
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">+ State fees</p>
                </div>

                {/* Radio button */}
                <div className="absolute bottom-8 right-8">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.slug 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {selectedPlan === plan.slug && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-[#003174] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-blue-800">
              Compare all the features of our packages to find the one that best fits your needs.{' '}
              <a href="#" className="text-[#003174] underline hover:text-blue-700">
                Explore and compare features.
              </a>
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
            disabled={!selectedPlan}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}