import React, { useState } from 'react';
import { otpService } from '../services/otpService';

/**
 * Example React component demonstrating proper OTP verification flow
 * with error handling, loading states, and timeout management
 */
const OTPVerificationExample = () => {
  // State management
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Maximum retry attempts
  const MAX_RETRY_ATTEMPTS = 3;

  // Clear all messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearMessages();
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    clearMessages();
  };

  // Send OTP with proper error handling
  const handleSendOTP = async () => {
    // Validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check retry limit
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      setError(`Maximum retry attempts (${MAX_RETRY_ATTEMPTS}) reached. Please try again later.`);
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      console.log('🚀 Sending OTP to:', email);
      
      const result = await otpService.sendOTP(email, 'email', 'login');
      
      if (result.success) {
        setOtpSent(true);
        setSuccess('OTP sent successfully! Please check your email.');
        setRetryCount(prev => prev + 1);
        console.log('✅ OTP sent successfully:', result);
      } else {
        setError(result.message || 'Failed to send OTP');
        console.error('❌ OTP send failed:', result);
      }
    } catch (error) {
      console.error('❌ Send OTP error:', error);
      
      // Handle different types of errors
      if (error.status === 429) {
        setError('Too many requests. Please wait a moment before trying again.');
      } else if (error.status === 400) {
        setError(error.message || 'Invalid email address. Please check and try again.');
      } else if (error.status >= 500) {
        setError('Server error. Please try again later or contact support.');
      } else {
        setError(error.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP with proper error handling
  const handleVerifyOTP = async () => {
    // Validation
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be exactly 6 digits');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      console.log('🔐 Verifying OTP:', otp);
      
      const result = await otpService.verifyOTP(email, otp, 'email', 'login');
      
      if (result.success) {
        setSuccess('OTP verified successfully! You are now logged in.');
        console.log('✅ OTP verified successfully:', result);
        
        // Handle successful login (redirect, store token, etc.)
        if (result.token) {
          localStorage.setItem('authToken', result.token);
          // Redirect to dashboard or next step
          console.log('🎉 Login successful, token stored');
        }
      } else {
        setError(result.message || 'OTP verification failed');
        console.error('❌ OTP verification failed:', result);
      }
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      
      // Handle different types of errors
      if (error.status === 400) {
        setError(error.message || 'Invalid OTP. Please check and try again.');
      } else if (error.status === 404) {
        setError('OTP not found or expired. Please request a new OTP.');
      } else if (error.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(error.message || 'OTP verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      setError(`Maximum retry attempts (${MAX_RETRY_ATTEMPTS}) reached. Please try again later.`);
      return;
    }

    setIsResending(true);
    clearMessages();

    try {
      const result = await otpService.sendOTP(email, 'email', 'login');
      
      if (result.success) {
        setSuccess('New OTP sent successfully! Please check your email.');
        setRetryCount(prev => prev + 1);
        setOtp(''); // Clear current OTP input
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('❌ Resend OTP error:', error);
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setEmail('');
    setOtp('');
    setOtpSent(false);
    setError('');
    setSuccess('');
    setRetryCount(0);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">OTP Verification</h2>
      
      {/* Email Input Section */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          disabled={isLoading || isResending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Enter your email address"
        />
      </div>

      {/* Send OTP Button */}
      {!otpSent && (
        <button
          onClick={handleSendOTP}
          disabled={isLoading || !email.trim() || retryCount >= MAX_RETRY_ATTEMPTS}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending OTP...
            </span>
          ) : (
            'Send OTP'
          )}
        </button>
      )}

      {/* OTP Input Section */}
      {otpSent && (
        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP (6 digits)
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOtpChange}
            disabled={isLoading || isResending}
            maxLength="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-center text-lg tracking-widest"
            placeholder="000000"
          />
        </div>
      )}

      {/* Action Buttons */}
      {otpSent && (
        <div className="space-y-2">
          <button
            onClick={handleVerifyOTP}
            disabled={isLoading || !otp.trim() || otp.length !== 6}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify OTP'
            )}
          </button>

          <div className="flex space-x-2">
            <button
              onClick={handleResendOTP}
              disabled={isResending || isLoading || retryCount >= MAX_RETRY_ATTEMPTS}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resending...
                </span>
              ) : (
                'Resend OTP'
              )}
            </button>

            <button
              onClick={handleReset}
              disabled={isLoading || isResending}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Retry Counter */}
      {retryCount > 0 && (
        <div className="text-sm text-gray-600 text-center mt-2">
          Attempts: {retryCount}/{MAX_RETRY_ATTEMPTS}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPVerificationExample;
