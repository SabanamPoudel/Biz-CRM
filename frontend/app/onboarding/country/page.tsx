'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { saveOnboardingData, getOnboardingData } from '@/lib/onboarding-api';

interface Country {
  code: string;
  name: string;
  flag: string;
}

const countries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { code: 'AI', name: 'Anguilla', flag: '🇦🇮' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'AQ', name: 'Antarctica', flag: '🇦🇶' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AS', name: 'American Samoa', flag: '🇦🇸' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'AW', name: 'Aruba', flag: '🇦🇼' },
  { code: 'AX', name: 'Åland Islands', flag: '🇦🇽' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'BL', name: 'Saint Barthélemy', flag: '🇧🇱' },
  { code: 'BM', name: 'Bermuda', flag: '🇧🇲' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'BQ', name: 'Caribbean Netherlands', flag: '🇧🇶' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹' },
  { code: 'BV', name: 'Bouvet Island', flag: '🇧🇻' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
  { code: 'CC', name: 'Cocos (Keeling) Islands', flag: '🇨🇨' },
  { code: 'CD', name: 'Congo (Democratic Republic)', flag: '🇨🇩' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
  { code: 'CG', name: 'Congo (Republic)', flag: '🇨🇬' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'CK', name: 'Cook Islands', flag: '🇨🇰' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'CV', name: 'Cape Verde', flag: '🇨🇻' },
  { code: 'CW', name: 'Curaçao', flag: '🇨🇼' },
  { code: 'CX', name: 'Christmas Island', flag: '🇨🇽' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'EH', name: 'Western Sahara', flag: '🇪🇭' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
  { code: 'FK', name: 'Falkland Islands', flag: '🇫🇰' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲' },
  { code: 'FO', name: 'Faroe Islands', flag: '🇫🇴' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'GF', name: 'French Guiana', flag: '🇬🇫' },
  { code: 'GG', name: 'Guernsey', flag: '🇬🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GI', name: 'Gibraltar', flag: '🇬🇮' },
  { code: 'GL', name: 'Greenland', flag: '🇬🇱' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳' },
  { code: 'GP', name: 'Guadeloupe', flag: '🇬🇵' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'GS', name: 'South Georgia and the South Sandwich Islands', flag: '🇬🇸' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'GU', name: 'Guam', flag: '🇬🇺' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'HM', name: 'Heard Island and McDonald Islands', flag: '🇭🇲' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IM', name: 'Isle of Man', flag: '🇮🇲' },
  { code: 'IO', name: 'British Indian Ocean Territory', flag: '🇮🇴' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JE', name: 'Jersey', flag: '🇯🇪' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
  { code: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { code: 'KP', name: 'North Korea', flag: '🇰🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'KY', name: 'Cayman Islands', flag: '🇰🇾' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'MF', name: 'Saint Martin', flag: '🇲🇫' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'MO', name: 'Macao', flag: '🇲🇴' },
  { code: 'MP', name: 'Northern Mariana Islands', flag: '🇲🇵' },
  { code: 'MQ', name: 'Martinique', flag: '🇲🇶' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷' },
  { code: 'MS', name: 'Montserrat', flag: '🇲🇸' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: 'NC', name: 'New Caledonia', flag: '🇳🇨' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'NF', name: 'Norfolk Island', flag: '🇳🇫' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
  { code: 'NU', name: 'Niue', flag: '🇳🇺' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'PF', name: 'French Polynesia', flag: '🇵🇫' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'PM', name: 'Saint Pierre and Miquelon', flag: '🇵🇲' },
  { code: 'PN', name: 'Pitcairn', flag: '🇵🇳' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'RE', name: 'Réunion', flag: '🇷🇪' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'SH', name: 'Saint Helena', flag: '🇸🇭' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'SJ', name: 'Svalbard and Jan Mayen', flag: '🇸🇯' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'ST', name: 'São Tomé and Príncipe', flag: '🇸🇹' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'SX', name: 'Sint Maarten', flag: '🇸🇽' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'TC', name: 'Turks and Caicos Islands', flag: '🇹🇨' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩' },
  { code: 'TF', name: 'French Southern Territories', flag: '🇹🇫' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
  { code: 'TK', name: 'Tokelau', flag: '🇹🇰' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'UM', name: 'United States Minor Outlying Islands', flag: '🇺🇲' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'VA', name: 'Vatican City', flag: '🇻🇦' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VG', name: 'British Virgin Islands', flag: '🇻🇬' },
  { code: 'VI', name: 'U.S. Virgin Islands', flag: '🇻🇮' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'WF', name: 'Wallis and Futuna', flag: '🇼🇫' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'YT', name: 'Mayotte', flag: '🇾🇹' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
];

export default function CountrySelectionPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Load existing data when component mounts
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Try to load from database if logged in
        if (token) {
          try {
            const data = await getOnboardingData();
            if (data && data.country) {
              setSelectedCountry(data.country);
              setSearchTerm(data.country);
              console.log('Country loaded from DB:', data.country);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.warn('Could not load from database:', error);
          }
        }
        
        // Load from localStorage as fallback
        const savedCountry = localStorage.getItem('selectedCountry');
        if (savedCountry) {
          setSelectedCountry(savedCountry);
          setSearchTerm(savedCountry);
          console.log('Country loaded from localStorage:', savedCountry);
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExistingData();
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country.name);
    setSearchTerm(country.name);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    if (!isDropdownOpen) {
      // When opening dropdown, clear search to show all countries
      setSearchTerm('');
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNext = async () => {
    if (selectedCountry) {
      setIsSaving(true);
      try {
        const token = localStorage.getItem('token');
        
        // Try to save to database if logged in
        if (token) {
          try {
            await saveOnboardingData({ country: selectedCountry });
            console.log('✅ Saved to database');
          } catch (error) {
            console.warn('Could not save to database, saving locally only:', error);
          }
        }
        
        // Always save to localStorage
        localStorage.setItem('selectedCountry', selectedCountry);
        
        // Continue to next page
        router.push('/onboarding/company-origin');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="max-w-md">
          {/* 3D Isometric Illustration */}
          <div className="relative mb-8">
            <div className="w-80 h-80 relative">
              {/* Base platform */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-16 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg shadow-lg"></div>
              
              {/* Building blocks */}
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div className="flex flex-col items-center space-y-2">
                  {/* Top block with flag */}
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg transform rotate-12 flex items-center justify-center">
                    <span className="text-2xl">🏁</span>
                  </div>
                  
                  {/* Middle blocks */}
                  <div className="flex space-x-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg shadow-lg transform -rotate-6"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-lg shadow-lg transform rotate-6"></div>
                  </div>
                  
                  {/* Bottom blocks */}
                  <div className="flex space-x-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg shadow-lg"></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg shadow-lg"></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg shadow-lg"></div>
                  </div>
                </div>
              </div>
              
              {/* Character with flag */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-lg">👤</span>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-20 right-10 w-8 h-8 bg-yellow-300 rounded-lg opacity-60 animate-bounce"></div>
              <div className="absolute top-32 left-10 w-6 h-6 bg-blue-300 rounded-lg opacity-60 animate-pulse"></div>
              <div className="absolute bottom-32 right-16 w-4 h-4 bg-green-300 rounded-lg opacity-60"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Which country do you reside in? 🌍
            </h1>
          </div>

          {/* Country Selection */}
          <div className="mb-8">
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                placeholder="Select country of residence"
                value={searchTerm || selectedCountry}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => {
                  setSearchTerm('');
                  setIsDropdownOpen(true);
                }}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent bg-white"
              />
              
              {/* Dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <button
                  type="button"
                  onClick={handleDropdownToggle}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="text-gray-900">{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info note */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-[#003174] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-blue-800">
              We may offer recommendations depending on your country of residence.
            </p>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!selectedCountry || isSaving || isLoading}
            className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <span>{isSaving ? 'Saving...' : 'Next'}</span>
            {!isSaving && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            BizzCRM © 2025 · Privacy · Terms
          </div>
        </div>
      </div>
    </div>
  );
}