'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import PaymentForm from '@/components/PaymentForm';
import { API_URL } from '@/lib/api-config';

// Initialize Stripe with your publishable key
// You'll need to add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51...');

export default function PaymentPage() {
  const [email, setEmail] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    packageName: '',
    packagePrice: 0,
    stateName: '',
    stateFee: 0,
    total: 0,
    billingType: ''
  });
  const router = useRouter();

  useEffect(() => {
    // Load order details from localStorage
    const savedPlan = localStorage.getItem('selectedPlan');
    const savedState = localStorage.getItem('selectedState');
    const savedBilling = localStorage.getItem('billingType');
    const userEmail = localStorage.getItem('email') || '';
    
    setEmail(userEmail);

    // Calculate package price
    let packagePrice = 1999.00;
    let packageName = 'Total Compliance';
    
    if (savedPlan === 'starter') {
      packagePrice = 297.00;
      packageName = 'Starter';
    } else if (savedPlan === 'business-in-a-box') {
      if (savedBilling === 'monthly') {
        packagePrice = 329.00;
        packageName = 'Business-in-a-Box';
      } else {
        packagePrice = 2999.00;
        packageName = 'Business-in-a-Box';
      }
    }

    const stateFee = 250.00; // Example state fee
    const total = packagePrice + stateFee;

    setOrderDetails({
      packageName,
      packagePrice,
      stateName: savedState || 'Alaska',
      stateFee,
      total,
      billingType: savedBilling || 'annual'
    });

    // Create payment intent
    createPaymentIntent(total);
  }, []);

  const createPaymentIntent = async (amount: number) => {
    try {
      const response = await fetch(`${API_URL}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'usd',
        }),
      });

      const data = await response.json();
      setClientSecret(data.clientSecret);
      
      // Check if we're in mock mode
      if (data.clientSecret && data.clientSecret.includes('mock')) {
        setIsMockMode(true);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handlePaymentSuccess = async () => {
    // Mark onboarding as complete
    localStorage.setItem('onboardingComplete', 'true');
    
    // Update onboarding status in database
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/users/onboarding`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ onboardingComplete: true }),
        });
      }
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
      rules: {
        '.Label': {
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px',
        },
        '.Input': {
          padding: '12px',
          fontSize: '16px',
        },
      },
    },
    loader: 'auto',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-1">
        <div className="bg-green-500 h-1" style={{ width: '100%' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            From dreamer to Do'er — Make it official!
          </h1>

          {/* Flawless Formation Guarantee */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-12">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center p-4">
                  <div className="relative">
                    <div className="text-6xl">📋</div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">✓</span>
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

        {/* Payment Form */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Order Summary */}
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pay BizzCRM</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ${orderDetails.total.toFixed(2)}
              </div>
              <p className="text-gray-600">
                Then ${orderDetails.packagePrice.toFixed(2)} per {orderDetails.billingType === 'monthly' ? 'month' : 'year'}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">{orderDetails.stateName} - Formation State Fee - [LLC]</span>
                <span className="font-medium text-gray-900">${orderDetails.stateFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">{orderDetails.packageName}</div>
                  <div className="text-sm text-gray-500">Billed {orderDetails.billingType === 'monthly' ? 'monthly' : 'annually'}</div>
                </div>
                <span className="font-medium text-gray-900">${orderDetails.packagePrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between py-4 border-t-2 border-gray-300">
              <span className="text-lg font-semibold text-gray-900">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">${orderDetails.total.toFixed(2)}</span>
            </div>

            <button className="text-gray-600 hover:text-gray-800 text-sm mt-4">
              Add promotion code
            </button>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between py-3">
                <span className="text-xl font-bold text-gray-900">Total due today</span>
                <span className="text-xl font-bold text-gray-900">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div>
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact information</h3>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174]"
                    disabled
                  />
                </div>
              </div>

              {/* Stripe Payment Form */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment method</h3>
                
                {/* Demo Mode Notice */}
                {isMockMode && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-900 px-4 py-4 rounded-lg mb-6">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">⚠️</span>
                      <div>
                        <h4 className="font-bold mb-1">Demo Mode - No Real Payment Processing</h4>
                        <p className="text-sm">Click "Complete Payment (Demo)" below to continue without real payment. To enable real payments, add your Stripe keys to the configuration files.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003174]"></div>
                  </div>
                ) : clientSecret ? (
                  isMockMode ? (
                    <div className="space-y-4">
                      <div className="bg-[#e7edfc] border-2 border-[#003174] rounded-lg p-6 text-center">
                        <div className="text-5xl mb-4">💳</div>
                        <h3 className="text-xl font-bold text-[#003174] mb-2">Demo Payment Mode</h3>
                        <p className="text-gray-600 mb-6">This is a demonstration. No actual payment will be processed.</p>
                        <button
                          onClick={handlePaymentSuccess}
                          className="w-full bg-[#003174] hover:bg-[#0052b4] text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 shadow-md"
                        >
                          Complete Payment (Demo) →
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        To process real payments, configure Stripe API keys in your .env files
                      </p>
                    </div>
                  ) : (
                    <Elements stripe={stripePromise} options={options}>
                      <PaymentForm
                        amount={orderDetails.total}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </Elements>
                  )
                ) : (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    Unable to initialize payment. Please try again.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mt-12 flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
