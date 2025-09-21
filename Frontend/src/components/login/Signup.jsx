import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  TrendingUp,
  Percent,
  RefreshCw,
  Home,
  Sparkles,
  Shield, // ✅ Add Shield icon for captcha
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { ArrowBackIos } from '@mui/icons-material';

// ✅ Add Capacitor imports
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { apiRequest, API_BASE } from '../../utils/api.js';

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mathCaptcha, setMathCaptcha] = useState({ question: "", answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ Initialize Google Auth for native platforms
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize();
    }
  }, []);

  useEffect(() => {
    const generateMathCaptcha = () => {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const operators = ['+', '-'];
      const operator = operators[Math.floor(Math.random() * operators.length)];
      
      let answer;
      if (operator === '+') {
        answer = num1 + num2;
      } else {
        answer = num1 - num2;
      }
      
      setMathCaptcha({
        question: `${num1} ${operator} ${num2} = ?`,
        answer: answer
      });
    };
    
    generateMathCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Check if email exists before signup
  const checkEmailExists = async (email) => {
    try {
      const response = await apiRequest('/api/auth/check-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  // ✅ Enhanced form validation
  const validateForm = async () => {
    // Reset error
    setError('');

    // Validate name
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }

    // Validate email
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      setError('An account with this email already exists. Please login instead.');
      return false;
    }

    // Validate password
    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Validate captcha
    if (parseInt(userAnswer) !== mathCaptcha.answer) {
      setError('Please solve the math problem correctly');
      return false;
    }

    return true;
  };

  // ✅ Updated signup function with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('🚀 === SIGNUP PROCESS START ===');
    
    // ... your validation code stays the same ...

    setIsSubmitting(true);

    try {
      const requestPayload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      console.log('📤 Sending signup request...');

      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      
      console.log('📊 Response debug:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      // ✅ Handle success (status 200 or 201)
      if (response.ok && (data.success === true || (response.status === 201 && data.user))) {
        console.log('🎉 Signup successful!');
        
        // Clear form
        setFormData({ name: "", email: "", password: "" });
        setUserAnswer("");
        setError('');
        
        // Login and redirect
        login(data.user, data.token);
        navigate('/');
        
      } else {
        // ✅ Handle specific error cases
        console.log('❌ Signup failed:', data);
        
        if (response.status === 409) {
          // Email already exists
          setError('An account with this email already exists. Please try logging in instead or use a different email.');
        } else if (response.status === 400) {
          // Validation error
          setError(data.message || 'Please check your input and try again.');
        } else {
          // Other errors
          setError(data.message || `Signup failed (Status: ${response.status}). Please try again.`);
        }
      }
      
    } catch (error) {
      console.error('💥 Signup error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Native Google signup for Capacitor
  const handleNativeGoogleSignup = async () => {
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
        navigate("/");
      } else {
        // Fallback: signup with Google data directly
        const userData = {
          email: result.email,
          name: result.name,
          picture: result.imageUrl,
        };
        login(userData, result.authentication.idToken || "google-signup-token");
        navigate("/");
      }
    } catch (error) {
      console.error('Native Google signup error:', error);
      setError('Google signup failed. Please try again.');
    }
  };

  // ✅ Web Google signup (unchanged)
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      };
      login(userData, credentialResponse.credential || "google-signup-token");
      navigate("/");
    } catch {
      setError("Google signup failed.");
    }
  };

  const handleGoogleError = () => {
    setError("Google signup was unsuccessful. Try again.");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 relative overflow-hidden flex items-center justify-center p-8 lg:p-12">
        {/* Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/5 rounded-full blur-lg animate-bounce"></div>
          <div
            className="absolute top-1/2 left-10 w-16 h-16 bg-white/15 rounded-lg rotate-45 animate-spin"
            style={{ animationDuration: "10s" }}
          ></div>
          <div
            className="absolute top-32 right-32 text-white/20 text-4xl"
            style={{ animation: "float 6s ease-in-out infinite" }}
          >
            <TrendingUp size={48} />
          </div>
          <div
            className="absolute bottom-48 left-16 text-white/15 text-3xl animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            <Percent size={36} />
          </div>
          <div
            className="absolute top-1/4 left-1/4 text-white/10 text-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          >
            <RefreshCw size={24} />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 md:px-12 max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Home size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            Unlock Your Financial Future
          </h1>
          <p className="text-blue-100 text-base md:text-lg mb-8 leading-relaxed">
            Get instant loan tips with competitive rates and flexible terms. Your dreams are just one click away.
          </p>
          <div className="space-y-3 text-left text-sm md:text-base">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-blue-100">Quick approval in 24 hours</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-blue-100">Competitive interest rates</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-blue-100">Flexible repayment options</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 text-white/5 hidden md:block">
            <Sparkles size={120} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <span > <button className='text-gray-600 hover:text-gray-800' onClick={() => navigate('/')} > <ArrowBackIos/>Back To Home</button></span>
     
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🙋🏻‍♂️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
            <div className="text-blue-600 font-semibold text-lg mb-1">FinMate</div>
            <p className="text-gray-600">Join the financial revolution 🚀✨</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* ✅ Google Signup - shows different button based on platform */}
          <div className="flex justify-center mb-6">
            {Capacitor.isNativePlatform() ? (
              // Native Google signup button for mobile
              <button
                onClick={handleNativeGoogleSignup}
                className="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                Sign up with Google
              </button>
            ) : (
              // Web Google signup for browser
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            )}
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* ✅ MATH CAPTCHA SECTION */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Shield size={16} className="text-blue-500" />
                  Security Question
                </label>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 border border-gray-300 px-4 py-3 rounded-lg font-mono text-lg">
                    {mathCaptcha.question}
                  </div>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Answer"
                    className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const generateMathCaptcha = () => {
                        const num1 = Math.floor(Math.random() * 10) + 1;
                        const num2 = Math.floor(Math.random() * 10) + 1;
                        const operators = ['+', '-'];
                        const operator = operators[Math.floor(Math.random() * operators.length)];
                        
                        let answer;
                        if (operator === '+') {
                          answer = num1 + num2;
                        } else {
                          answer = num1 - num2;
                        }
                        
                        setMathCaptcha({
                          question: `${num1} ${operator} ${num2} = ?`,
                          answer: answer
                        });
                        setUserAnswer("");
                      };
                      generateMathCaptcha();
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
                    title="Generate new question"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              {/* Submit button - Updated validation */}
              <button
                type="submit"
                disabled={isSubmitting || !userAnswer}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : (
                  "Join FinMate 🚀"
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Float animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;
