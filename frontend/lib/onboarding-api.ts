import { API_URL } from './api-config';

export interface OnboardingData {
  country?: string;
  companyOrigin?: string;
  businessType?: string;
  companyName?: string;
  selectedState?: string;
  ownershipData?: string;
  selectedPlan?: string;
  billingType?: string;
  expeditedEIN?: boolean;
  upgradeToCompliance?: boolean;
  onboardingComplete?: boolean;
}

export async function saveOnboardingData(data: Partial<OnboardingData>) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found, user not logged in');
    alert('You need to be logged in to save data. Please log in first.');
    throw new Error('NO_TOKEN');
  }

  try {
    console.log('Calling API:', `${API_URL}/users/onboarding`);
    console.log('Request data:', data);
    console.log('Token exists:', !!token);

    const response = await fetch(`${API_URL}/users/onboarding`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      // If unauthorized, clear the token and redirect
      if (response.status === 401) {
        console.error('Token is invalid or expired, clearing localStorage');
        localStorage.removeItem('token');
        alert('Your session has expired. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        throw new Error('UNAUTHORIZED');
      }
      
      // For other errors, try to get error details
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      
      // Better error messages based on status code
      if (response.status === 500) {
        alert('Server error. Please try again or contact support.');
      } else if (response.status === 400) {
        alert(`Validation error: ${errorData.message || 'Please check your input'}`);
      } else {
        alert(`Error: ${errorData.message || 'Something went wrong'}`);
      }
      throw new Error(`API_ERROR_${response.status}`);
    }

    const result = await response.json();
    console.log('Save successful:', result);
    return result;
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    if (error instanceof Error && !error.message.includes('NO_TOKEN') && !error.message.includes('UNAUTHORIZED')) {
      alert('Network error. Please check your connection and try again.');
    }
    throw error;
  }
}

export async function getOnboardingData(): Promise<OnboardingData | null> {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No token found, cannot fetch onboarding data');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/users/onboarding/data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.warn('Failed to get onboarding data:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching onboarding data:', error);
    return null;
  }
}
