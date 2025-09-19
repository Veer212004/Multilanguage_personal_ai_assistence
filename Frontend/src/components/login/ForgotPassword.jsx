import React, { useState } from "react";
import { CreditCard, DollarSign, TrendingUp, Shield, Mail, Clock, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Backend URL
  const backendUrl = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://loanplatform.onrender.com";

  // Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStep(2);
        setMessage("OTP sent to your email successfully!");
        startCountdown();
      } else {
        setMessage(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${backendUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStep(3);
        setMessage("OTP verified! Password reset link sent to your email.");
      } else {
        setMessage(data.message || "Invalid OTP");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("New OTP sent to your email!");
        startCountdown();
      } else {
        setMessage(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer for resend OTP
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Reset form
  const handleBackToEmail = () => {
    setStep(1);
    setOtp("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Loan-related imagery section */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center space-x-6 mb-6">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-2xl shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-4 rounded-2xl shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-2xl shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Secure Loan Portal
          </h1>
          <p className="text-gray-600 text-sm">
            Your trusted financial partner
          </p>
        </div>

        {/* Main form card */}
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
          {/* Progress indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <div className={`w-8 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                ✓
              </div>
            </div>
          </div>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
                  Forgot Password
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter your email to receive a secure OTP
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-700"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {loading ? "Sending..." : "Send OTP"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                  Verify OTP
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter the 6-digit code sent to <br/>
                  <span className="font-semibold text-blue-600">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength="6"
                    required
                    className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-700 text-center text-2xl tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {loading ? "Verifying..." : "Verify OTP"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <div className="flex justify-between items-center text-sm">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ← Change Email
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || loading}
                    className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                  Success!
                </h2>
                <p className="text-gray-600 text-sm">
                  Password reset link has been sent to your email
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-700 font-medium mb-2">
                  Check your email inbox!
                </p>
                <p className="text-green-600 text-sm">
                  We've sent a secure password reset link to<br/>
                  <span className="font-semibold">{email}</span>
                </p>
              </div>

              <button
                onClick={() => window.location.href = '/login'}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Back to Login
              </button>
            </>
          )}

          {/* Message display */}
          {message && (
            <div className={`mt-6 p-4 rounded-2xl border ${
              message.includes('success') || message.includes('sent') || message.includes('verified')
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700'
                : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700'
            }`}>
              <p className="text-sm text-center font-medium">
                {message}
              </p>
            </div>
          )}

          {/* Trust indicators */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Bank Grade Security</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>FDIC Insured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Need help? Contact our loan specialists
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;