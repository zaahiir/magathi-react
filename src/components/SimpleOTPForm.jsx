import React, { useState } from 'react';
import { useOTP } from '../hooks/useOTP';

/**
 * Simplified OTP form using the useOTP hook
 * Demonstrates clean separation of concerns
 */
const SimpleOTPForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const {
    isLoading,
    isResending,
    error,
    success,
    otpSent,
    retryCount,
    canRetry,
    sendOTP,
    verifyOTP,
    resendOTP,
    reset,
    clearMessages
  } = useOTP({
    maxRetryAttempts: 3,
    onSuccess: (result) => {
      console.log('🎉 Login successful:', result);
      // Handle successful login (redirect, store token, etc.)
      if (result.data?.token) {
        localStorage.setItem('authToken', result.data.token);
      }
    },
    onError: (error, context) => {
      console.error(`Error in ${context}:`, error);
    },
    onOTPSent: (result) => {
      console.log('📧 OTP sent:', result);
    }
  });

  const handleSendOTP = async () => {
    const result = await sendOTP(email, 'email', 'login');
    if (result.success) {
      setOtp(''); // Clear OTP input
    }
  };

  const handleVerifyOTP = async () => {
    await verifyOTP(email, otp, 'email', 'login');
  };

  const handleResendOTP = async () => {
    const result = await resendOTP(email, 'email', 'login');
    if (result.success) {
      setOtp(''); // Clear OTP input
    }
  };

  const handleReset = () => {
    setEmail('');
    setOtp('');
    reset();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">OTP Verification</h2>
      
      {/* Email Input */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearMessages();
          }}
          disabled={isLoading || isResending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Enter your email address"
        />
      </div>

      {/* Send OTP Button */}
      {!otpSent && (
        <button
          onClick={handleSendOTP}
          disabled={isLoading || !email.trim() || !canRetry}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send OTP'}
        </button>
      )}

      {/* OTP Input */}
      {otpSent && (
        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP (6 digits)
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              clearMessages();
            }}
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
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="flex space-x-2">
            <button
              onClick={handleResendOTP}
              disabled={isResending || isLoading || !canRetry}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? 'Resending...' : 'Resend OTP'}
            </button>

            <button
              onClick={handleReset}
              disabled={isLoading || isResending}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Retry Counter */}
      {retryCount > 0 && (
        <div className="text-sm text-gray-600 text-center mt-2">
          Attempts: {retryCount}/3
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <p className="text-sm">{success}</p>
        </div>
      )}
    </div>
  );
};

export default SimpleOTPForm;
