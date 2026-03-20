"use client";

import { useState, useEffect } from 'react';

// Simple country detection based on phone number patterns
const detectCountryFromNumber = (phoneNumber: string) => {
  const digits = phoneNumber.replace(/\D/g, '');
  
  if (digits.length === 0) return null;

  // Nepal: Mobile numbers start with 98, 97, 96
  if (digits.startsWith('98') || digits.startsWith('97') || digits.startsWith('96')) {
    return { flag: '🇳🇵', code: '+977', name: 'Nepal' };
  }
  
  // India: Mobile numbers start with 9, 8, 7, 6 (but prioritize specific patterns)
  if (digits.length >= 1) {
    const firstDigit = digits[0];
    if (['9', '8', '7', '6'].includes(firstDigit) && !digits.startsWith('98') && !digits.startsWith('97') && !digits.startsWith('96')) {
      return { flag: '🇮🇳', code: '+91', name: 'India' };
    }
  }
  
  // China: Mobile numbers start with 13, 14, 15, 16, 17, 18, 19
  if (digits.match(/^1[3-9]/)) {
    return { flag: '🇨🇳', code: '+86', name: 'China' };
  }
  
  // UK: Mobile numbers start with 7
  if (digits.startsWith('7') && digits.length >= 10) {
    return { flag: '🇬🇧', code: '+44', name: 'United Kingdom' };
  }
  
  // Australia: Mobile numbers start with 4
  if (digits.startsWith('4') && digits.length >= 9) {
    return { flag: '🇦🇺', code: '+61', name: 'Australia' };
  }
  
  // US/Canada: Valid area codes (10 digits starting with 2-9)
  if (digits.match(/^[2-9]\d{2}/) && digits.length >= 10) {
    return { flag: '🇺🇸', code: '+1', name: 'United States' };
  }
  
  // Indonesia: Mobile numbers start with 8
  if (digits.startsWith('8') && digits.length >= 10) {
    return { flag: '🇮🇩', code: '+62', name: 'Indonesia' };
  }
  
  // Pakistan: Mobile numbers start with 3
  if (digits.startsWith('3') && digits.length >= 10) {
    return { flag: '🇵🇰', code: '+92', name: 'Pakistan' };
  }
  
  // Thailand: Mobile numbers start with 6, 8, 9
  if (digits.match(/^[689]/) && digits.length >= 9) {
    return { flag: '🇹🇭', code: '+66', name: 'Thailand' };
  }
  
  // Bangladesh: Mobile numbers start with 1
  if (digits.startsWith('1') && digits.length >= 10) {
    return { flag: '🇧🇩', code: '+880', name: 'Bangladesh' };
  }
  
  return null;
};

interface AutoDetectPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AutoDetectPhoneInput({ 
  value, 
  onChange, 
  placeholder = "Phone number",
  className = ""
}: AutoDetectPhoneInputProps) {
  const [detectedCountry, setDetectedCountry] = useState<any>(null);

  useEffect(() => {
    const country = detectCountryFromNumber(value);
    setDetectedCountry(country);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Only allow digits, spaces, hyphens, and parentheses
    const cleanValue = newValue.replace(/[^\d\s\-\(\)]/g, '');
    onChange(cleanValue);
  };

  return (
    <div className={`flex ${className}`}>
      {/* Country flag and code display */}
      <div className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 min-w-[5rem] justify-center">
        {detectedCountry ? (
          <div className="flex items-center gap-1">
            <span className="text-lg">{detectedCountry.flag}</span>
            <span className="text-sm text-gray-700 font-medium">{detectedCountry.code}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-lg">🌍</span>
            <span className="text-sm text-gray-500">+--</span>
          </div>
        )}
      </div>
      
      {/* Phone number input */}
      <input
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className="flex-1 px-3 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoComplete="tel-national"
      />
    </div>
  );
}