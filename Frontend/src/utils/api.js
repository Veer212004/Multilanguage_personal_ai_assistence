// Create src/utils/api.js
export const getApiBaseUrl = () => {
  // Check if running in Capacitor (mobile app)
  if (window.Capacitor) {
    return 'https://loanplatform.onrender.com'; // Always use production URL for mobile
  }
  
  // Check if running in development
  if (import.meta.env.DEV) {
    return 'http://localhost:5000'; // Local development
  }
  
  // Production web app
  return 'https://loanplatform.onrender.com';
};

// Enhanced fetch function with better error handling for mobile
export const apiRequest = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    console.log(`📡 Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`❌ API Error: ${error.message}`);
    throw error;
  }
};