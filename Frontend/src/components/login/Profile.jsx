import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save,
  X,
  Camera,
  LogOut,
  Settings,
  Bell,
  Moon,
  Sun
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saveStatus, setSaveStatus] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (user) {
      setEditFormData(user);
      setDarkMode(user.darkMode || false);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const startEditing = () => {
    setEditFormData(user);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditFormData(user);
    setIsEditing(false);
  };

  const saveChanges = () => {
    try {
      updateUser(editFormData);
      setIsEditing(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newProfilePic = e.target.result;
        if (isEditing) {
          handleInputChange('profilePic', newProfilePic);
        } else {
          updateUser({ profilePic: newProfilePic });
          setSaveStatus('success');
          setTimeout(() => setSaveStatus(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateUser({ darkMode: newDarkMode });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const generateGradient = (name) => {
    if (!name) return 'from-blue-500 to-purple-500';
    
    const gradients = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-yellow-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-green-500',
      'from-orange-500 to-red-500',
      'from-cyan-500 to-blue-500'
    ];
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const currentData = isEditing ? editFormData : user;
  const theme = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
  const cardTheme = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white/80 backdrop-blur-lg border-white/30';

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme}`}>
      {/* Header */}
      <div className={`${cardTheme} border-b shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {currentData.profilePic ? (
                  <img
                    src={currentData.profilePic}
                    alt={currentData.fullName}
                    className="w-12 h-12 rounded-full border-3 border-blue-500 shadow-lg object-cover"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full border-3 border-blue-500 shadow-lg bg-gradient-to-r ${generateGradient(currentData.fullName)} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">
                      {getInitials(currentData.fullName)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                  Loan Advisor Portal
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>
                  Welcome back, {currentData.fullName?.split(' ')[0] || 'User'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'
                }`}
              >
                {darkMode ? 
                  <Sun className="w-5 h-5 text-yellow-500" /> : 
                  <Moon className="w-5 h-5 text-blue-600" />
                }
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Save Status Messages */}
        {saveStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-xl text-green-800 text-center animate-pulse">
            ✅ Profile updated successfully! Changes saved to your account.
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-800 text-center">
            ❌ Error saving changes. Please try again.
          </div>
        )}

        {/* Main Profile Card */}
        <div className={`${cardTheme} rounded-3xl p-8 shadow-xl border`}>
          {/* Profile Header Section */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 mb-8">
            <div className="relative">
              {currentData.profilePic ? (
                <img
                  src={currentData.profilePic}
                  alt={currentData.fullName}
                  className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-2xl object-cover"
                />
              ) : (
                <div className={`w-32 h-32 rounded-full border-4 border-blue-500 shadow-2xl bg-gradient-to-r ${generateGradient(currentData.fullName)} flex items-center justify-center`}>
                  <span className="text-white font-bold text-4xl">
                    {getInitials(currentData.fullName)}
                  </span>
                </div>
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editFormData.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`text-3xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none w-full text-center lg:text-left ${
                      darkMode ? 'text-white' : 'text-blue-900'
                    }`}
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    value={editFormData.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`text-lg bg-transparent border-b border-blue-300 focus:outline-none w-full text-center lg:text-left ${
                      darkMode ? 'text-gray-300' : 'text-blue-600'
                    }`}
                    placeholder="Username"
                  />
                </div>
              ) : (
                <>
                  <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                    {currentData.fullName}
                  </h1>
                  <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>
                    @{currentData.username}
                  </p>
                </>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6">
                {isEditing ? (
                  <>
                    <button 
                      onClick={saveChanges}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </button>
                    <button 
                      onClick={cancelEditing}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={startEditing}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className={`text-2xl font-bold mb-6 flex items-center ${darkMode ? 'text-white' : 'text-blue-900'}`}>
              <User className="w-6 h-6 mr-3" />
              Personal Details
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium flex items-center ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                        : 'bg-white/70 border-blue-300 focus:border-blue-500'
                    }`}
                    value={editFormData.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className={`p-4 rounded-xl border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    {user.fullName || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium flex items-center ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                  <User className="w-4 h-4 mr-2" />
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                        : 'bg-white/70 border-blue-300 focus:border-blue-500'
                    }`}
                    value={editFormData.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter username"
                  />
                ) : (
                  <div className={`p-4 rounded-xl border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    @{user.username || 'username'}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium flex items-center ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                        : 'bg-white/70 border-blue-300 focus:border-blue-500'
                    }`}
                    value={editFormData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                ) : (
                  <div className={`p-4 rounded-xl border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    {user.email || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium flex items-center ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                        : 'bg-white/70 border-blue-300 focus:border-blue-500'
                    }`}
                    value={editFormData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className={`p-4 rounded-xl border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    {user.phone || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2 md:col-span-2">
                <label className={`block text-sm font-medium flex items-center ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                        : 'bg-white/70 border-blue-300 focus:border-blue-500'
                    }`}
                    value={editFormData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your location"
                  />
                ) : (
                  <div className={`p-4 rounded-xl border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    {user.location || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2 md:col-span-2">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-200 resize-none ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                        : 'bg-white/70 border-blue-300 focus:border-blue-500'
                    }`}
                    value={editFormData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className={`p-4 rounded-xl border min-h-[100px] ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    {user.bio || 'No bio provided'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings Card */}
        <div className={`${cardTheme} rounded-3xl p-8 shadow-xl border mt-8`}>
          <h3 className={`text-2xl font-bold mb-6 flex items-center ${darkMode ? 'text-white' : 'text-blue-900'}`}>
            <Settings className="w-6 h-6 mr-3" />
            Account Settings
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Preferences */}
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
              <h4 className={`font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                <Bell className="w-5 h-5 mr-2" />
                Preferences
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-blue-700'}>Dark Mode</span>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      darkMode ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${
                        darkMode ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-blue-700'}>Email Notifications</span>
                  <button className="relative w-12 h-6 rounded-full bg-blue-500">
                    <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full shadow-md" />
                  </button>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'}`}>
              <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-purple-900'}`}>
                Account Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-purple-700'}>Member Since</span>
                  <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-purple-900'}`}>
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-purple-700'}>Profile Completion</span>
                  <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-purple-900'}`}>85%</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-purple-700'}>Last Updated</span>
                  <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-purple-900'}`}>
                    {saveStatus === 'success' ? 'Just now' : 'Today'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Progress */}
        <div className={`${cardTheme} rounded-3xl p-6 shadow-xl border mt-8`}>
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-blue-900'}`}>
            Profile Completion
          </h3>
          <div className={`w-full bg-gray-200 rounded-full h-3 mb-4 ${darkMode ? 'bg-gray-700' : ''}`}>
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: '85%' }}
            ></div>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>
            85% complete - Add more details to unlock additional features
          </p>
          
          {/* Quick Tips */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'}`}>
              <p className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                ✓ Profile picture uploaded
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-yellow-50 border-yellow-200'}`}>
              <p className={`text-xs font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                + Add phone verification
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-blue-500'}`}>
            All changes are automatically saved to your account
          </p>
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-blue-400'}`}>
            Last sync: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-8">
        <button
          onClick={isEditing ? saveChanges : startEditing}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
            isEditing 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isEditing ? <Save className="w-6 h-6" /> : <Edit className="w-6 h-6" />}
        </button>
      </div>

      {/* Background Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        
        input:focus, textarea:focus {
          outline: none;
        }
        
        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
        
        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
        
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;