import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Building2, TrendingUp, Shield, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container } from '@mui/material';

import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { ArrowBackIos } from '@mui/icons-material';

// ✅ Add Capacitor imports
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { apiRequest } from '../../utils/api.js';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ Initialize Google Auth for native platforms
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 real backend call 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      console.log('🔐 Attempting login...');
      
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('📡 Login response:', data);

      if (data.success) {
        console.log('✅ Login successful');
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Network error. Please check your connection.');
    }
  };

  // ✅ Native Google login for Capacitor
  const handleNativeGoogleLogin = async () => {
    try {
      const result = await GoogleAuth.signIn();
      
      // Send the token to your backend for verification
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: result.authentication.idToken,
          email: result.email,
          name: result.name,
          picture: result.imageUrl
        }),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        login(data.user, data.token);
        navigate('/');
      } else {
        // Fallback: login with Google data directly
        const userData = {
          email: result.email,
          name: result.name,
          picture: result.imageUrl,
        };
        login(userData, result.authentication.idToken || 'google-token');
        navigate('/');
      }
    } catch (error) {
      console.error('Native Google login error:', error);
      setError('Google login failed. Please try again.');
    }
  };

  // ✅ Web Google login (unchanged)
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      };
      login(userData, credentialResponse.credential || 'google-token');
      navigate('/');
    } catch {
      setError('Google login failed');
    }
  };

  const handleGoogleFailure = () => setError('Google login was unsuccessful. Try again.');

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding:0,
        '@media (min-width: 600px)': {
          padding: 0,
        },
      }}
    >
      <div className="min-h-screen flex">
        {/* Left Side - Hero Section (unchanged) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-white-500 to-blue-500 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-1/3 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
          </div>
          
          {/* Floating Icons */}
          <div className="absolute top-0 right-0 text-white/30 animate-bounce" style={{animationDuration: '6s'}}>
            <Building2 size={40} />
          </div>
          <div className="absolute bottom-0 left-0 text-white/20 animate-bounce" style={{animationDelay: '1000ms', animationDuration: '6s'}}>
            <TrendingUp size={35} />
          </div>
          <div className="absolute top-1/2 left-20 text-white/25 animate-bounce" style={{animationDelay: '500ms', animationDuration: '6s'}}>
            <Shield size={30} />
          </div>
          <div className="absolute bottom-48 right-32 text-white/30 animate-pulse" style={{animationDelay: '2000ms'}}>
            <Zap size={25} />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center text-white">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                <Building2 size={60} className="text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Unlock Your Financial Future
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-md">
                Get instant loans tips with competitive rates and flexible terms. Your dreams are just one click away.
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Quick approval in 24 hours</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
                <span>Competitive interest rates</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '700ms'}}></div>
                <span>Flexible repayment options</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Mobile Hero Header (visible only on mobile) */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 size={40} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">FinMate</h1>
              <p className="text-gray-600">Your trusted financial companion 💼✨</p>   
            </div>

            {/* Login Form */}
             
              <div className="text-center mb-8">
                <span > <button className='text-gray-600 hover:text-gray-800' onClick={() => navigate('/')} > <ArrowBackIos/>Back To Home</button></span>

                <div className="text-4xl mb-4 animate-pulse">🏦</div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Welcome Back
                </h2>
                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                  FinMate
                </h3>
                <p className="text-gray-600">Your trusted financial companion 💼✨</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* ✅ Google Login - shows different button based on platform */}
              <div className="mb-6">
                <div className="flex justify-center transform transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                  {Capacitor.isNativePlatform() ? (
                    // Native Google login button for mobile
                    <button
                      onClick={handleNativeGoogleLogin}
                      className="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                      Sign in with Google
                    </button>
                  ) : (
                    // Web Google login for browser
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleFailure}
                    />
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-blue-600 font-semibold">OR</span>
                </div>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 lg:py-4 text-sm lg:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-gray-50 focus:bg-white"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 lg:py-4 pr-12 text-sm lg:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-gray-50 focus:bg-white"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:scale-125 transition-all duration-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-200 relative overflow-hidden group"
                >
                  <span className="relative z-10">Sign In to FinMate 🚀</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                 </button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 space-y-4 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-300 hover:-translate-y-0.5 inline-block relative"
                  >
                    Sign up
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 hover:w-full"></span>
                  </Link>
                </p>
                <Link 
                  to="/forgot-password" 
                  className="block text-purple-600 hover:text-purple-700 font-medium hover:underline transition-all duration-300 hover:-translate-y-0.5 relative inline-block"
                >
                  Forgot Password? 🔐
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 hover:w-full"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for additional animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
    
    </Container>
  );
};

export default Login;
