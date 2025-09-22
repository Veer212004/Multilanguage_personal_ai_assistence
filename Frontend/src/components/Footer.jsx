import React, { useState } from "react";
import { Linkedin, MessageCircle, Github, Twitter, Facebook, Mail, Phone, MapPin, Send, ChevronUp, Download } from "lucide-react";
import { Instagram } from "@mui/icons-material";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // ✅ Add name state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(''); // ✅ Added missing state

  // Replace the handleNewsletterSubmit function
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    // ✅ Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      console.log('📧 Subscribing:', { email, name });
      
      // ✅ Try local first, then production
      const backendUrl = window.location.hostname === 'localhost' 
        ? "http://localhost:5000" 
        : "https://loanplatform.onrender.com";
      
      console.log('🌐 Using backend URL:', backendUrl);
      
      const res = await fetch(`${backendUrl}/api/subscribe`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          email, 
          name: name || "Friend" // ✅ Send name or default to "Friend"
        }),
        // ✅ Remove credentials for now to avoid CORS issues
        // credentials: 'include'
      });

      console.log('📡 Response status:', res.status);
      console.log('📡 Response OK:', res.ok);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log('📨 Subscribe response:', data);
      
      if (data.success) {
        setIsSubscribed(true);
        setEmail("");
        setName(""); // ✅ Clear name field
        alert(`🎉 Subscription successful! Welcome email sent to ${email}.`);
      } else {
        alert(`❌ ${data.message || 'Subscription failed. Please try again.'}`);
      }
      
    } catch (error) {
      console.error('❌ Subscription error:', error);
      
      // ✅ More specific error messages
      let errorMessage = "❌ ";
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage += "Cannot connect to server. Please check if the backend is running and try again.";
      } else if (error.message.includes('CORS')) {
        errorMessage += "Server configuration error. Please contact support.";
      } else if (error.message.includes('404')) {
        errorMessage += "Subscription service not found. Please contact support.";
      } else if (error.message.includes('500')) {
        errorMessage += "Server error. Please try again later.";
      } else {
        errorMessage += `Subscription failed: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 // Replace the handleAPKDownload function in your Footer.jsx
const handleAPKDownload = async () => {
  try {
    setDownloadStatus('downloading');
    
    // ✅ Correct path - APK must be in public folder
    const apkUrl = "/assets/LoanMateNew.apk";
    
    console.log('🔍 Checking APK at:', apkUrl);
    
    // Check if file exists
    const response = await fetch(apkUrl, { method: 'HEAD' });
    
    if (response.ok) {
      console.log('✅ APK file found, starting download...');
      
      // File exists, proceed with download
      const link = document.createElement('a');
      link.href = apkUrl;
      link.download = 'LoanMate-v1.0.apk';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus(''), 3000);
      
      console.log('📱 APK download started successfully');
      
    } else {
      console.error('❌ APK file not found at:', apkUrl);
      throw new Error('APK file not found');
    }
  } catch (error) {
    console.error('❌ Download error:', error);
    setDownloadStatus('error');
    setTimeout(() => setDownloadStatus(''), 5000); // Show error longer
    
    // Fallback: Open web app
    setTimeout(() => {
      window.open('https://loanmate-platform.vercel.app', '_blank');
    }, 2000);
  }
};

  const getDownloadButtonContent = () => {
    switch (downloadStatus) {
      case 'downloading':
        return (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            Downloading...
          </>
        );
      case 'success':
        return <>✅ Download Started!</>;
      case 'error':
        return <>❌ Try Again</>;
      default:
        return (
          <>
            <Download size={16} />
            Download APK
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </>
        );
    }
  };

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Loan Eligibility", href: "/loan-eligibility" },
    { label: "Dashboard", href: "/Dashboard" },
    { label: "Financial Tips", href: "/financial-tips" },
    { label: "Bank Lists", href: "/banklists" }
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/veeresh-hedderi-83838525b", color: "hover:text-blue-600" },
    { icon: MessageCircle, href: "https://wa.me/+918880717978", color: "hover:text-green-500" },
    { icon: Github, href: "https://github.com/Veer212004/Multilanguage_personal_ai_assistence", color: "hover:text-gray-700" },
    { icon: Instagram, href: "https://instagram.com/smart_soul_veer", color: "hover:text-blue-700" }
  ];

  const bottomLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/support", label: "Support" }
  ];

  return (
    <footer className="bg-gray text-gray-800 relative">
      {/* Decorative Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
            fill="#215bd0ff"
          />
        </svg>
      </div>

      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  LoanMate
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your trusted partner for smart financial decisions. Get personalized loan recommendations and expert guidance.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <MapPin className="text-lg text-blue-500" />
                  <span>Bengaluru, Karnataka, India</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <Mail className="text-lg text-blue-500" />
                  <a href="mailto:veereshhedderi18@gmail.com" className="hover:underline">
                    veereshhedderi18@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <Phone className="text-lg text-blue-500" />
                  <a href="tel:+918880717978" className="hover:underline">
                    +91 888-071-7978
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-1 inline-block text-sm group"
                    >
                      <span className="border-b border-transparent group-hover:border-blue-600 transition-all duration-300">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services & Download */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Our Services</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  Instant loan eligibility check
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  AI-powered recommendations
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  Compare bank offers
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  Financial planning tools
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  24/7 Expert support
                </li>
              </ul>

              {/* Download Section */}
              <div className="mt-6 space-y-3">
                <button 
                  onClick={handleAPKDownload}
                  disabled={downloadStatus === 'downloading'}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {getDownloadButtonContent()}
                </button>

                <div className="text-xs text-gray-500 text-center">
                  <p>Version 1.0.0 • Android 6.0+ • ~15MB</p>
                  {downloadStatus === 'success' && <p className="text-green-600 mt-1">✅ Check your downloads folder</p>}
                  {downloadStatus === 'error' && <p className="text-red-600 mt-1">❌ File not found. Coming soon!</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => window.open('https://loanmate-platform.vercel.app', '_blank')}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-xs text-gray-700 transition-colors flex items-center justify-center gap-1"
                  >
                    🌐 Web App
                  </button>
                  <button 
                    onClick={() => alert('Coming soon to Google Play Store!')}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-xs text-gray-700 transition-colors flex items-center justify-center gap-1"
                  >
                    🏪 Play Store
                  </button>
                </div>
              </div>
            </div>

            {/* Newsletter & Social */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Stay Connected</h3>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">Get the latest financial tips and updates!</p>
                <div className="space-y-3">
                  {/* ✅ Add name input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <button
                    onClick={handleNewsletterSubmit}
                    disabled={isSubscribed}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubscribed ? (
                      <>✓ Subscribed!</>
                    ) : (
                      <>
                        <Send size={16} />
                        Subscribe
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-3">Follow us on social media</p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 ${social.color} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md`}
                      >
                        <IconComponent size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 mt-12 pt-8 px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 text-center md:text-left">
                <p>© {new Date().getFullYear()} LoanMate. All rights reserved. | Built with ❤️ for better financial decisions, Created By Veeresh</p>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                {bottomLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute top-4 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} className="group-hover:animate-bounce" />
      </button>
    </footer>
  );
};

export default Footer;