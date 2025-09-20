import { CapacitorHttp } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';

// ✅ Use your deployed backend
const API_BASE_URL = 'https://loanplatform.onrender.com';

// ✅ Create API utility for both web and mobile
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    // ✅ Use CapacitorHttp for native platforms
    if (Capacitor.isNativePlatform()) {
      console.log('📱 Using Capacitor HTTP for native platform');
      
      const response = await CapacitorHttp.request({
        url,
        method: options.method || 'GET',
        headers: defaultOptions.headers,
        data: options.body ? JSON.parse(options.body) : undefined,
      });

      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        json: async () => response.data,
        text: async () => JSON.stringify(response.data),
      };
    } else {
      // ✅ Use fetch for web platforms
      console.log('🌐 Using fetch for web platform');
      return await fetch(url, defaultOptions);
    }
  } catch (error) {
    console.error('❌ API Request Error:', error);
    throw error;
  }
};

// ✅ Export API base for direct use
export const API_BASE = API_BASE_URL;