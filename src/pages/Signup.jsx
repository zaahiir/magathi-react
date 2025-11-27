import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaSpinner, FaEnvelope, FaPhone, FaCheck } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import OTPVerification from '../components/OTPVerification';
import { otpService } from '../services/otpService';
import logo from '../assets/mfspl.png';

const Signup = () => {
  const [step, setStep] = useState('method'); // 'method', 'email', 'phone', 'otp', 'register'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [currentOTPType, setCurrentOTPType] = useState('email');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    const internationalPhoneRegex = /^\d{7,15}$/;
    return indianPhoneRegex.test(cleanPhone) || internationalPhoneRegex.test(cleanPhone);
  };

  const formatPhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (/^[6-9]\d{9}$/.test(cleanPhone)) {
      return `+91${cleanPhone}`;
    }
    
    if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
      return `+${cleanPhone}`;
    }
    
    if (cleanPhone.length >= 7 && cleanPhone.length <= 15) {
      return cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;
    }
    
    return phone;
  };

  const handleEmailVerify = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if user already exists
      const checkResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/check-user-exists?email=${encodeURIComponent(email)}`);
      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setError('User already exists with this email. Please login instead.');
        return;
      }

      const result = await otpService.sendOTP(email, 'email', 'registration');
      
      if (result.success || result.message) {
        setCurrentOTPType('email');
        setStep('otp');
        setError('');
        console.log('✅ Email OTP sent successfully:', result.message);
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('❌ Send email OTP error:', err);
      const errorMessage = err.message || err.originalError?.message || 'Failed to send OTP';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerify = async () => {
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number (10-digit Indian or international format)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      // Check if user already exists
      const checkResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/check-user-exists?phone=${encodeURIComponent(formattedPhone)}`);
      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setError('User already exists with this phone number. Please login instead.');
        return;
      }

      const result = await otpService.sendPhoneOTP(formattedPhone, 'registration');
      
      if (result.success || result.message) {
        setCurrentOTPType('phone');
        setStep('otp');
        setError('');
        console.log('✅ Phone OTP sent successfully:', result.message);
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('❌ Send phone OTP error:', err);
      const errorMessage = err.message || err.originalError?.message || 'Failed to send OTP';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setIsLoading(true);
    setError('');

    try {
      let result;
      
      if (currentOTPType === 'phone') {
        const identifier = formatPhoneNumber(phone);
        result = await otpService.verifyPhoneOTP(identifier, otp, 'registration');
        
        if (result.success) {
          setPhoneVerified(true);
          setStep('register');
        }
      } else {
        result = await otpService.verifyOTP(email, otp, 'email', 'registration');
        
        if (result.success) {
          setEmailVerified(true);
          setStep('register');
        }
      }

      if (!result.success) {
        setError(result.message || 'OTP verification failed');
      }
    } catch (err) {
      console.error('❌ Verify OTP error:', err);
      const errorMessage = err.message || err.originalError?.message || 'OTP verification failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError('');

    try {
      let result;
      
      if (currentOTPType === 'phone') {
        const identifier = formatPhoneNumber(phone);
        result = await otpService.sendPhoneOTP(identifier, 'registration');
      } else {
        result = await otpService.sendOTP(email, 'email', 'registration');
      }

      if (result.success || result.message) {
        setError('');
        console.log('✅ OTP resent successfully:', result.message);
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('❌ Resend OTP error:', err);
      const errorMessage = err.message || err.originalError?.message || 'Failed to resend OTP';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userData = {
        email: email,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        isEmailVerified: emailVerified,
        isPhoneVerified: phoneVerified
      };

      const result = await otpService.registerUser(userData);
      
      if (result.token) {
        login(result.user, result.token, result.refreshToken);
        
        const from = location.state?.from?.pathname || '/mutual-funds-plan';
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      if (currentOTPType === 'email') {
        setStep('email');
      } else {
        setStep('phone');
      }
    } else if (step === 'email' || step === 'phone') {
      setStep('method');
    } else if (step === 'register') {
      setStep('otp');
    }
    setError('');
  };

  const handleMethodSelect = (method) => {
    if (method === 'email') {
      setStep('email');
    } else if (method === 'phone') {
      setStep('phone');
    }
  };

  if (step === 'otp') {
    return (
      <div>
        <OTPVerification
          identifier={currentOTPType === 'email' ? email : phone}
          type={currentOTPType}
          purpose="registration"
          onVerify={handleVerifyOTP}
          onBack={handleBack}
          onResend={handleResendOTP}
        />
      </div>
    );
  }

  if (step === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#53755d] via-[#6b8a6b] to-[#8aab8a]">
        <div className="w-full max-w-md mx-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 overflow-hidden">
            <button
              onClick={handleBack}
              className="absolute left-6 top-6 text-gray-600 hover:text-[#53755d] transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Registration</h2>
              <p className="text-gray-600">Add your name to complete your account</p>
            </div>

            {/* Verification Status */}
            <div className="mb-6 space-y-3">
              {emailVerified && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <FaCheck className="text-green-500 mr-2" />
                    <span className="text-sm text-green-700">Email verified</span>
                  </div>
                  <span className="text-xs text-green-600">{email}</span>
                </div>
              )}
              {phoneVerified && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <FaCheck className="text-green-500 mr-2" />
                    <span className="text-sm text-green-700">Phone verified</span>
                  </div>
                  <span className="text-xs text-green-600">{phone}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent transition-colors"
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={isLoading || !firstName.trim() || !lastName.trim()}
                className="w-full bg-[#53755d] text-white py-3 px-6 rounded-lg hover:bg-[#3e5d49] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : null}
                Complete Registration
              </button>
            </div>

            {error && (
              <div className="mt-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'method') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#53755d] via-[#6b8a6b] to-[#8aab8a]">
        <div className="w-full max-w-md mx-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 overflow-hidden">
            {/* Logo */}
            <div className="text-center mb-6">
              <img src={logo} alt="Magathi Logo" className="h-16 w-auto mx-auto mb-4" />
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
              <p className="text-gray-600">Choose how you'd like to sign up</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                onClick={() => handleMethodSelect('email')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaEnvelope className="text-blue-500 mr-2" />
                Sign up with Email
              </button>

              <button
                onClick={() => handleMethodSelect('phone')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaPhone className="text-green-500 mr-2" />
                Sign up with Phone
              </button>
            </div>

            {error && (
              <div className="mt-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#53755d] hover:underline font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#53755d] via-[#6b8a6b] to-[#8aab8a]">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 overflow-hidden">
          <button
            onClick={handleBack}
            className="absolute left-6 top-6 text-gray-600 hover:text-[#53755d] transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {step === 'email' ? 'Sign up with Email' : 'Sign up with Phone'}
            </h1>
            <p className="text-gray-600">
              {step === 'email' 
                ? 'Enter your email address to get started' 
                : 'Enter your phone number to continue'
              }
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {step === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="flex">
                <input
                  type={step === 'email' ? 'email' : 'tel'}
                  value={step === 'email' ? email : phone}
                  onChange={(e) => {
                    if (step === 'phone') {
                      const value = e.target.value.replace(/[^\d+\-() ]/g, '');
                      if (value.length <= 20) {
                        setPhone(value);
                      }
                    } else {
                      setEmail(e.target.value);
                    }
                    setError('');
                  }}
                  placeholder={step === 'email' ? 'Enter your email' : 'Enter phone number (e.g., 9876543210 or +1-234-567-8900)'}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent transition-colors"
                />
                <button
                  onClick={step === 'email' ? handleEmailVerify : handlePhoneVerify}
                  disabled={isLoading || (step === 'email' ? !email.trim() : !phone.trim())}
                  className="px-6 py-3 bg-[#53755d] text-white rounded-r-lg hover:bg-[#3e5d49] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              {step === 'email' 
                ? 'You will receive an OTP via email' 
                : 'You will receive an OTP via SMS'
              }
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#53755d] hover:underline font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

