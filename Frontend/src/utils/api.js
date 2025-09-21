import { CapacitorHttp } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';

// ✅ Use your deployed backend
const API_BASE_URL = 'https://loanplatform.onrender.com';

// ✅ Create API utility for both web and mobile
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🌐 === API REQUEST DEBUG START ===');
  console.log('URL:', url);
  console.log('Method:', options.method || 'GET');
  console.log('Platform:', Capacitor.isNativePlatform() ? 'Native' : 'Web');
  console.log('Request body:', options.body);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  console.log('Headers:', defaultOptions.headers);

  try {
    let response;
    
    // ✅ Use CapacitorHttp for native platforms
    if (Capacitor.isNativePlatform()) {
      console.log('📱 Using Capacitor HTTP');
      
      const capacitorResponse = await CapacitorHttp.request({
        url,
        method: options.method || 'GET',
        headers: defaultOptions.headers,
        data: options.body ? JSON.parse(options.body) : undefined,
      });

      console.log('📱 Raw Capacitor response:', capacitorResponse);

      response = {
        ok: capacitorResponse.status >= 200 && capacitorResponse.status < 300,
        status: capacitorResponse.status,
        statusText: capacitorResponse.status >= 200 && capacitorResponse.status < 300 ? 'OK' : 'Error',
        json: async () => capacitorResponse.data,
        text: async () => JSON.stringify(capacitorResponse.data),
      };
    } else {
      // ✅ Use fetch for web platforms
      console.log('🌐 Using fetch');
      
      response = await fetch(url, defaultOptions);
      console.log('🌐 Fetch response status:', response.status);
      console.log('🌐 Fetch response ok:', response.ok);
      console.log('🌐 Fetch response statusText:', response.statusText);
    }

    console.log('📡 Final response object:', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText || 'Unknown'
    });

    console.log('🌐 === API REQUEST DEBUG END ===');
    return response;
    
  } catch (error) {
    console.error('❌ === API REQUEST ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Network status:', navigator.onLine ? 'Online' : 'Offline');
    console.error('=========================');
    throw error;
  }
};

// ✅ Export API base for direct use
export const API_BASE = API_BASE_URL;