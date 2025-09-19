import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.loanmate.app',
  appName: 'LoanMate',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'light',
      backgroundColor: '#1976d2',
      overlay: false
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual web client ID
      forceCodeForRefreshToken: true
    }
  }
};

export default config;