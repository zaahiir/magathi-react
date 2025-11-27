import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaSpinner, FaEnvelope, FaPhone, FaCheck } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import OTPVerification from '../components/OTPVerification';
import { firebaseOTPService } from '../services/firebaseOTPService';
import { unifiedOtpService } from '../services/unifiedOtpService';
import logo from '../assets/mfspl.png';

const OTPLogin = () => {
  const [step, setStep] = useState('email'); // 'email', 'phone', 'otp'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [currentOTPType, setCurrentOTPType] = useState('email');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const validateEmail = (email) => {
    return unifiedOtpService.validateEmail(email);
  };

  const validatePhone = (phone) => {
    return unifiedOtpService.validatePhone(phone);
  };

  const formatPhoneNumber = (phone) => {
    return unifiedOtpService.normalizePhoneNumber(phone);
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
    setSuccessMessage('');

    try {
      const result = await unifiedOtpService.sendOTP(email, 'email', 'login');
      
      if (result.success) {
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
    setSuccessMessage('');

    try {
      // Format the phone number for proper delivery
      const formattedPhone = formatPhoneNumber(phone);
      console.log('📱 Formatted phone number:', formattedPhone);
      
      // Use unified OTP service
      const result = await unifiedOtpService.sendOTP(formattedPhone, 'phone', 'login');
      
      if (result.success) {
        setCurrentOTPType('phone');
        setStep('otp');
        setError('');
        console.log('✅ Phone OTP sent successfully:', result.message);
      } else {
        // Check if it's a rate limiting error
        if (result.message && result.message.includes('Too many OTP requests')) {
          const retryAfter = result.retryAfter || 0;
          const minutes = Math.ceil(retryAfter / 60);
          setError(`Too many requests. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`);
        } else {
          setError(result.message || 'Failed to send OTP');
        }
      }
    } catch (err) {
      console.error('❌ Send phone OTP error:', err);
      let errorMessage = err.message || err.originalError?.message || 'Failed to send OTP';
      
      // Check if it's a rate limiting error
      if (errorMessage.includes('Too many OTP requests') || errorMessage.includes('429')) {
        const retryAfter = err.retryAfter || 0;
        const minutes = Math.ceil(retryAfter / 60);
        errorMessage = `Too many requests. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
      }
      
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
        // Use unified OTP verification for phone
        console.log('📱 Using unified OTP verification for phone');
        const identifier = formatPhoneNumber(phone);
        result = await unifiedOtpService.verifyOTP(identifier, otp, 'phone', 'login');
        
        if (result.success) {
          setPhoneVerified(true);
          console.log('📱 Phone verified. Current state - Email verified:', emailVerified, 'Email:', email, 'Phone:', phone);
          
          // Check if we have both email and phone data, and both are verified
          if (email && phone && emailVerified) {
            console.log('📱 Both phone and email verified, proceeding to login');
            await handleCompleteLogin();
            return;
          } else {
            // Move to email step to collect email
            console.log('📱 Phone verified, moving to email step');
            setStep('email');
            setError(''); // Clear any previous errors
            // Show success message
            setTimeout(() => {
              setSuccessMessage('✅ Phone verified! Now please verify your email address.');
              setError('');
            }, 100);
          }
        }
      } else {
        // Use unified OTP verification for email
        console.log('📧 Using unified OTP verification for email');
        result = await unifiedOtpService.verifyOTP(email, otp, 'email', 'login');
        
        if (result.success) {
          setEmailVerified(true);
          console.log('📧 Email verified. Current state - Phone verified:', phoneVerified, 'Phone:', phone, 'Email:', email);
          
          // Check if we have both email and phone data, and both are verified
          if (email && phone && phoneVerified) {
            console.log('📧 Both email and phone verified, proceeding to login');
            await handleCompleteLogin();
            return;
          } else {
            // Move to phone step to collect phone
            console.log('📧 Email verified, moving to phone step');
            setStep('phone');
            setError(''); // Clear any previous errors
            // Show success message
            setTimeout(() => {
              setSuccessMessage('✅ Email verified! Now please verify your phone number.');
              setError('');
            }, 100);
          }
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
        result = await unifiedOtpService.sendOTP(identifier, 'phone', 'login');
      } else {
        result = await unifiedOtpService.sendOTP(email, 'email', 'login');
      }

      if (result.success || result.message) {
        setError('');
        console.log('✅ OTP resent successfully:', result.message);
      } else {
        // Check if it's a rate limiting error
        if (result.message && result.message.includes('Too many OTP requests')) {
          const retryAfter = result.retryAfter || 0;
          const minutes = Math.ceil(retryAfter / 60);
          setError(`Too many requests. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`);
        } else {
          setError(result.message || 'Failed to resend OTP');
        }
      }
    } catch (err) {
      console.error('❌ Resend OTP error:', err);
      let errorMessage = err.message || err.originalError?.message || 'Failed to resend OTP';
      
      // Check if it's a rate limiting error
      if (errorMessage.includes('Too many OTP requests') || errorMessage.includes('429')) {
        const retryAfter = err.retryAfter || 0;
        const minutes = Math.ceil(retryAfter / 60);
        errorMessage = `Too many requests. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup Firebase resources on component unmount
  useEffect(() => {
    return () => {
      firebaseOTPService.cleanup();
    };
  }, []);

  // Check if both email and phone are verified and complete login
  useEffect(() => {
    if (emailVerified && phoneVerified && email && phone && step === 'otp') {
      console.log('🔄 Both email and phone verified, completing login...');
      handleCompleteLogin();
    }
  }, [emailVerified, phoneVerified, email, phone, step]);


  const handleCompleteLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Ensure we have both email and phone before proceeding
      if (!email || !phone) {
        setError('Both email and phone are required for login');
        setIsLoading(false);
        return;
      }

      // Ensure both are verified
      if (!emailVerified || !phoneVerified) {
        setError('Both email and phone must be verified before login');
        setIsLoading(false);
        return;
      }

      console.log('🔐 Starting login process with:', { email, phone: formatPhoneNumber(phone) });

      // Use fallback URL if VITE_API_URL is not defined
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('🔗 Using API URL:', apiUrl);

      // Call backend OTP login endpoint
      const response = await fetch(`${apiUrl}/api/auth/otp-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          phone: formatPhoneNumber(phone),
          emailOtp: 'verified', // Mark as verified since we've verified email
          phoneOtp: 'verified', // Mark as verified since we've verified phone
          firstName: firstName || 'User',
          lastName: lastName || 'User'
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Store user data and tokens from backend
        login(result.user, result.token, result.refreshToken);
        
        console.log('✅ Login completed successfully');
        console.log('👤 User data:', result.user);
        console.log('🔑 Token:', result.token);
        
        // Redirect to HomePage
        navigate('/', { replace: true });
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('❌ Complete login error:', err);
      setError(err.message || 'Failed to complete login');
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
    } else if (step === 'phone') {
      setStep('email');
    }
    setError('');
  };

  // Reset verification states when going back to email step
  const handleEmailStep = () => {
    setStep('email');
    setEmailVerified(false);
    setError('');
  };

  // Reset verification states when going back to phone step  
  const handlePhoneStep = () => {
    setStep('phone');
    setPhoneVerified(false);
    setError('');
  };


  if (step === 'otp') {
    return (
      <div>
        <OTPVerification
          identifier={currentOTPType === 'email' ? email : phone}
          type={currentOTPType}
          purpose="login"
          onVerify={handleVerifyOTP}
          onBack={handleBack}
          onResend={handleResendOTP}
        />
        {/* reCAPTCHA container for Firebase */}
        <div id="recaptcha-container"></div>
      </div>
    );
  }



  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#53755d] via-[#6b8a6b] to-[#8aab8a]">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 overflow-hidden">
          {/* Logo */}
          <div className="text-center mb-6">
            <img src={logo} alt="Magathi Logo" className="h-16 w-auto mx-auto mb-4" />
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === 'email' ? 'bg-[#53755d] text-white' : 
                emailVerified ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {emailVerified ? <FaCheck /> : '1'}
              </div>
              <div className={`w-12 h-1 ${emailVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === 'phone' ? 'bg-[#53755d] text-white' : 
                phoneVerified ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {phoneVerified ? <FaCheck /> : '2'}
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {step === 'email' ? 'Login with Email' : 'Verify Phone Number'}
            </h1>
            <p className="text-gray-600">
              {step === 'email' 
                ? 'Enter your email address to get started' 
                : 'Enter your phone number to continue'
              }
            </p>
            {(emailVerified || phoneVerified) && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  {emailVerified && phoneVerified 
                    ? '✅ Both email and phone verified! Completing login...'
                    : emailVerified 
                    ? '✅ Email verified! Now verify your phone number.'
                    : '✅ Phone verified! Now verify your email address.'
                  }
                </p>
                {!emailVerified && (
                  <button
                    onClick={handleEmailStep}
                    className="mt-2 text-xs text-blue-600 hover:underline"
                  >
                    Change email address
                  </button>
                )}
                {!phoneVerified && (
                  <button
                    onClick={handlePhoneStep}
                    className="mt-2 text-xs text-blue-600 hover:underline ml-2"
                  >
                    Change phone number
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Input Form */}
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
                      // Allow digits, +, -, (, ), and spaces for international numbers
                      const value = e.target.value.replace(/[^\d+\-() ]/g, '');
                      if (value.length <= 20) { // Increased limit for international numbers
                        setPhone(value);
                      }
                    } else {
                      setEmail(e.target.value);
                    }
                    setError('');
                    setSuccessMessage('');
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

            {successMessage && (
              <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Step Info */}
            <div className="text-center text-sm text-gray-500">
              {step === 'email' 
                ? 'You will receive an OTP via email' 
                : 'You will receive an OTP via SMS'
              }
              <br />
              <span className="text-xs text-gray-400">
                Both email and phone verification are required for login
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-[#53755d] hover:underline font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;
