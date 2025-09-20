import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.loanmate.app',
  appName: 'LoanMate',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'https://loanplatform.onrender.com',
      'https://loanmate-platform.vercel.app'
    ],
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'light',
      backgroundColor: '#1976d2',
      overlay: false
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    },
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;