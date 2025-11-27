import { useState, useCallback } from 'react';
import { otpService } from '../services/otpService';

/**
 * Custom React hook for OTP verification flow
 * Provides state management, error handling, and loading states
 */
export const useOTP = (options = {}) => {
  const {
    maxRetryAttempts = 3,
    onSuccess = () => {},
    onError = () => {},
    onOTPSent = () => {}
  } = options;

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  // Handle different types of errors
  const handleError = useCallback((error, context = '') => {
    console.error(`❌ ${context} error:`, error);
    
    let errorMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.status === 429) {
      errorMessage = 'Too many requests. Please wait a moment before trying again.';
    } else if (error.status === 400) {
      errorMessage = error.message || 'Invalid request. Please check your input and try again.';
    } else if (error.status === 404) {
      errorMessage = 'OTP not found or expired. Please request a new OTP.';
    } else if (error.status >= 500) {
      errorMessage = 'Server error. Please try again later or contact support.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    setError(errorMessage);
    onError(error, context);
  }, [onError]);

  // Send OTP
  const sendOTP = useCallback(async (identifier, type = 'email', purpose = 'login') => {
    // Validation
    if (!identifier?.trim()) {
      setError('Please enter your email address or phone number');
      return { success: false, error: 'Identifier is required' };
    }

    // Email validation
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        setError('Please enter a valid email address');
        return { success: false, error: 'Invalid email format' };
      }
    }

    // Phone validation
    if (type === 'phone') {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(identifier)) {
        setError('Please enter a valid 10-digit phone number');
        return { success: false, error: 'Invalid phone format' };
      }
    }

    // Check retry limit
    if (retryCount >= maxRetryAttempts) {
      const errorMsg = `Maximum retry attempts (${maxRetryAttempts}) reached. Please try again later.`;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    clearMessages();

    try {
      console.log('🚀 Sending OTP to:', identifier, 'Type:', type);
      
      const result = await otpService.sendOTP(identifier, type, purpose);
      
      if (result.success) {
        setOtpSent(true);
        setSuccess('OTP sent successfully! Please check your ' + (type === 'email' ? 'email' : 'phone') + '.');
        setRetryCount(prev => prev + 1);
        console.log('✅ OTP sent successfully:', result);
        
        onOTPSent(result);
        return { success: true, data: result };
      } else {
        const errorMsg = result.message || 'Failed to send OTP';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      handleError(error, 'Send OTP');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [retryCount, maxRetryAttempts, clearMessages, handleError, onOTPSent]);

  // Verify OTP
  const verifyOTP = useCallback(async (identifier, otp, type = 'email', purpose = 'login', userData = {}) => {
    // Validation
    if (!otp?.trim()) {
      setError('Please enter the OTP');
      return { success: false, error: 'OTP is required' };
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be exactly 6 digits');
      return { success: false, error: 'Invalid OTP format' };
    }

    setIsLoading(true);
    clearMessages();

    try {
      console.log('🔐 Verifying OTP:', otp, 'Type:', type);
      
      const result = await otpService.verifyOTP(identifier, otp, type, purpose, userData);
      
      if (result.success) {
        setSuccess('OTP verified successfully!');
        console.log('✅ OTP verified successfully:', result);
        
        onSuccess(result);
        return { success: true, data: result };
      } else {
        const errorMsg = result.message || 'OTP verification failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      handleError(error, 'Verify OTP');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [clearMessages, handleError, onSuccess]);

  // Resend OTP
  const resendOTP = useCallback(async (identifier, type = 'email', purpose = 'login') => {
    if (retryCount >= maxRetryAttempts) {
      const errorMsg = `Maximum retry attempts (${maxRetryAttempts}) reached. Please try again later.`;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsResending(true);
    clearMessages();

    try {
      const result = await otpService.sendOTP(identifier, type, purpose);
      
      if (result.success) {
        setSuccess('New OTP sent successfully! Please check your ' + (type === 'email' ? 'email' : 'phone') + '.');
        setRetryCount(prev => prev + 1);
        console.log('✅ OTP resent successfully:', result);
        
        onOTPSent(result);
        return { success: true, data: result };
      } else {
        const errorMsg = result.message || 'Failed to resend OTP';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      handleError(error, 'Resend OTP');
      return { success: false, error: error.message };
    } finally {
      setIsResending(false);
    }
  }, [retryCount, maxRetryAttempts, clearMessages, handleError, onOTPSent]);

  // Reset all state
  const reset = useCallback(() => {
    setError('');
    setSuccess('');
    setOtpSent(false);
    setRetryCount(0);
    setIsLoading(false);
    setIsResending(false);
  }, []);

  // Clear only messages
  const clearMessagesOnly = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  return {
    // State
    isLoading,
    isResending,
    error,
    success,
    otpSent,
    retryCount,
    maxRetryAttempts,
    
    // Actions
    sendOTP,
    verifyOTP,
    resendOTP,
    reset,
    clearMessages: clearMessagesOnly,
    
    // Computed
    canRetry: retryCount < maxRetryAttempts,
    isMaxRetriesReached: retryCount >= maxRetryAttempts
  };
};

export default useOTP;
