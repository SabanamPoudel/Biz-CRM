'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOnboardingData, saveOnboardingData } from '../../../lib/onboarding-api';

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India', 'Japan', 'China', 'Singapore', 'Nepal',
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
  'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Central African Republic',
  'Chad', 'Chile', 'Colombia', 'Comoros', 'Congo (Democratic Republic)', 'Congo (Republic)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
  'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Greece', 'Grenada',
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Jamaica', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
  'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali',
  'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
  'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
  'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
  'Samoa', 'San Marino', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen', 'Zambia', 'Zimbabwe'
].sort();

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  email: string;
  ownership: string;
  isPrimary?: boolean;
}

export default function OwnershipPage() {
  const router = useRouter();
  const [owners, setOwners] = useState<Owner[]>([
    {
      id: '1',
      firstName: '',
      lastName: '',
      country: '',
      phone: '',
      email: '',
      ownership: '',
      isPrimary: true,
    }
  ]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const loadData = async () => {
      const dbData = await getOnboardingData();
      if (dbData?.ownershipData) {
        try {
          const savedOwners = JSON.parse(dbData.ownershipData);
          if (savedOwners && savedOwners.length > 0) {
            setOwners(savedOwners);
          }
        } catch (e) {
          console.error('Error parsing ownership data:', e);
        }
      }
    };
    loadData();
  }, []);

  const addOwner = () => {
    const total = calculateTotalOwnership();
    if (total >= 100) {
      alert('⚠️ Cannot add more owners! Total ownership is already at ' + total.toFixed(2) + '%\n\nTotal ownership must be exactly 100%. Please adjust existing ownership percentages before adding new owners.');
      return;
    }
    
    const newOwner: Owner = {
      id: Date.now().toString(),
      firstName: '',
      lastName: '',
      country: '',
      phone: '',
      email: '',
      ownership: '',
      isPrimary: false
    };
    setOwners([...owners, newOwner]);
  };

  const removeOwner = (id: string) => {
    setOwners(owners.filter(owner => owner.id !== id));
  };

  const updateOwner = (id: string, field: keyof Owner, value: string) => {
    const updatedOwners = owners.map(owner => 
      owner.id === id ? { ...owner, [field]: value } : owner
    );
    
    // Calculate total with updated values
    if (field === 'ownership') {
      const total = updatedOwners.reduce((sum, owner) => {
        const percentage = parseFloat(owner.ownership) || 0;
        return sum + percentage;
      }, 0);
      
      // Show warning if total exceeds 100
      if (total > 100) {
        setTimeout(() => {
          alert('⚠️ Total Ownership Exceeds 100%!\n\nCurrent total: ' + total.toFixed(2) + '%\nTotal ownership must be exactly 100%.\n\nPlease adjust the ownership percentages.');
        }, 500);
      }
    }
    
    setOwners(updatedOwners);
  };

  const calculateTotalOwnership = () => {
    return owners.reduce((total, owner) => {
      const percentage = parseFloat(owner.ownership) || 0;
      return total + percentage;
    }, 0);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validate each owner
    owners.forEach((owner, index) => {
      const prefix = owner.isPrimary ? 'primary' : `owner-${owner.id}`;
      
      if (!owner.firstName.trim()) {
        newErrors[`${prefix}-firstName`] = 'First name is required';
      }
      
      if (!owner.lastName.trim()) {
        newErrors[`${prefix}-lastName`] = 'Last name is required';
      }
      
      if (!owner.country.trim()) {
        newErrors[`${prefix}-country`] = 'Country is required';
      }
      
      if (!owner.phone.trim()) {
        newErrors[`${prefix}-phone`] = 'Phone number is required';
      }
      
      if (!owner.email.trim()) {
        newErrors[`${prefix}-email`] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner.email)) {
        newErrors[`${prefix}-email`] = 'Invalid email format';
      }
      
      if (!owner.ownership.trim()) {
        newErrors[`${prefix}-ownership`] = 'Ownership percentage is required';
      } else {
        const percentage = parseFloat(owner.ownership);
        if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
          newErrors[`${prefix}-ownership`] = 'Must be between 0 and 100';
        }
      }
    });
    
    // Validate total ownership
    const total = calculateTotalOwnership();
    if (total !== 100) {
      newErrors['total'] = `Total ownership must be exactly 100%. Current total: ${total.toFixed(2)}%`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateForm()) {
      const ownershipData = JSON.stringify(owners);
      localStorage.setItem('ownershipData', ownershipData);
      
      try {
        await saveOnboardingData({ ownershipData });
        router.push('/onboarding/package');
      } catch (error) {
        console.error('Error saving ownership data:', error);
        alert('Failed to save ownership data. Please try again.');
      }
    } else {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleBack = () => {
    router.push('/onboarding/company-state');
  };

  const totalOwnership = calculateTotalOwnership();
  const remainingOwnership = 100 - totalOwnership;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress indicator and Help Button */}
        <div className="mb-8 flex justify-between items-center">
          <div className="w-16 h-1 bg-green-500 rounded-full"></div>
          
          <button className="text-gray-600 hover:text-gray-800 flex items-center transition-colors">
            <span className="mr-2">Need help?</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Ownership Information
          </h1>
          <p className="text-gray-600">
            Add all owners associated with this business. Total ownership must equal 100%.
          </p>
        </div>

        {/* Ownership Summary */}
        <div className={`mb-6 p-4 border-2 rounded-lg ${
          totalOwnership === 100 
            ? 'bg-green-50 border-green-500' 
            : totalOwnership > 100 
            ? 'bg-red-50 border-red-500 animate-pulse' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Ownership</p>
              <p className={`text-2xl font-bold ${totalOwnership === 100 ? 'text-green-600' : totalOwnership > 100 ? 'text-red-600' : 'text-[#003174]'}`}>
                {totalOwnership.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Remaining</p>
              <p className={`text-2xl font-bold ${remainingOwnership === 0 ? 'text-green-600' : remainingOwnership < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {remainingOwnership.toFixed(2)}%
              </p>
            </div>
          </div>
          {totalOwnership > 100 && (
            <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-sm font-semibold text-red-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Total ownership exceeds 100%! Please reduce ownership percentages.
              </p>
            </div>
          )}
          {errors['total'] && (
            <p className="mt-2 text-sm text-red-600">{errors['total']}</p>
          )}
        </div>

        {/* Owners List */}
        <div className="space-y-6">
          {owners.map((owner, index) => {
            const prefix = owner.isPrimary ? 'primary' : `owner-${owner.id}`;
            
            return (
              <div key={owner.id} className={`p-6 border-2 rounded-xl ${owner.isPrimary ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                {/* Owner Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {owner.isPrimary ? '👑 Primary Owner' : `Owner ${index}`}
                  </h3>
                  {!owner.isPrimary && (
                    <button
                      onClick={() => removeOwner(owner.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Owner Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={owner.firstName}
                      onChange={(e) => updateOwner(owner.id, 'firstName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] ${errors[`${prefix}-firstName`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="John"
                    />
                    {errors[`${prefix}-firstName`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`${prefix}-firstName`]}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={owner.lastName}
                      onChange={(e) => updateOwner(owner.id, 'lastName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] ${errors[`${prefix}-lastName`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Doe"
                    />
                    {errors[`${prefix}-lastName`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`${prefix}-lastName`]}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      value={owner.country}
                      onChange={(e) => updateOwner(owner.id, 'country', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] ${errors[`${prefix}-country`] ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors[`${prefix}-country`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`${prefix}-country`]}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={owner.phone}
                      onChange={(e) => updateOwner(owner.id, 'phone', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] ${errors[`${prefix}-phone`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors[`${prefix}-phone`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`${prefix}-phone`]}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={owner.email}
                      onChange={(e) => updateOwner(owner.id, 'email', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] ${errors[`${prefix}-email`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="john@example.com"
                    />
                    {errors[`${prefix}-email`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`${prefix}-email`]}</p>
                    )}
                  </div>

                  {/* Ownership Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Percentage of Ownership * (Current: {owner.ownership || 0}%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={owner.ownership}
                      onChange={(e) => updateOwner(owner.id, 'ownership', e.target.value)}
                      className={`w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] ${errors[`${prefix}-ownership`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="50.00"
                    />
                    {errors[`${prefix}-ownership`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`${prefix}-ownership`]}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Owner Button */}
        <button
          onClick={addOwner}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-[#0052b4] transition-colors"
        >
          + Add Another Owner
        </button>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleBack}
            className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-[#003174] text-white rounded-lg hover:bg-[#0052b4] transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
