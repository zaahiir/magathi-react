const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Timeout configuration
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Helper function to handle fetch with timeout
const fetchWithTimeout = async (url, options, timeoutMs = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
};

// Helper function to get user-friendly error message
const getErrorMessage = (error) => {
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network error: Unable to connect to server. Please check your internet connection and ensure the backend is running.';
  }
  
  // Timeout errors
  if (error.message.includes('timeout')) {
    return 'Request timed out. The server is taking too long to respond. Please try again.';
  }
  
  // CORS errors
  if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
    return 'CORS error: Unable to connect to the server. Please check if the backend is running and CORS is properly configured.';
  }
  
  // Abort errors
  if (error.name === 'AbortError') {
    return 'Request was cancelled. Please try again.';
  }
  
  // Server errors (5xx)
  if (error.status >= 500) {
    return 'Server error: The server encountered an internal error. Please try again later.';
  }
  
  // Client errors (4xx)
  if (error.status >= 400 && error.status < 500) {
    return error.message || 'Invalid request. Please check your input and try again.';
  }
  
  // Default error message
  return error.message || 'An unexpected error occurred. Please try again.';
};

// Phone number normalization helper
const normalizePhoneNumber = (phone) => {
  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // If it's a 10-digit Indian number, add +91
  if (/^[6-9]\d{9}$/.test(cleanPhone)) {
    return `+91${cleanPhone}`;
  }
  
  // If it's already international format, return as is
  if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    return `+${cleanPhone}`;
  }
  
  // For other international numbers, add + if not present
  if (cleanPhone.length >= 7 && cleanPhone.length <= 15) {
    return cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;
  }
  
  // Default fallback
  return cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;
};

// Email validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation helper
const validatePhone = (phone) => {
  const normalizedPhone = normalizePhoneNumber(phone);
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(normalizedPhone);
};

export const unifiedOtpService = {
  // Send OTP with unified API
  sendOTP: async (identifier, type, purpose = 'verification') => {
    try {
      // Validate input
      if (!identifier || !type) {
        throw new Error('Identifier and type are required');
      }

      if (!['email', 'phone'].includes(type)) {
        throw new Error('Type must be either "email" or "phone"');
      }

      // Normalize phone number if needed
      const normalizedIdentifier = type === 'phone' ? normalizePhoneNumber(identifier) : identifier;
      
      // Validate format
      if (type === 'email' && !validateEmail(normalizedIdentifier)) {
        throw new Error('Invalid email format');
      }

      if (type === 'phone' && !validatePhone(normalizedIdentifier)) {
        throw new Error('Invalid phone number format. Use E.164 format (+91XXXXXXXXXX)');
      }

      console.log('🚀 Sending OTP request:', { 
        identifier: normalizedIdentifier, 
        type, 
        purpose, 
        url: `${API_BASE_URL}/api/auth/send-otp` 
      });
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: normalizedIdentifier,
          type,
          purpose
        }),
      }, REQUEST_TIMEOUT);

      console.log('📡 OTP Response status:', response.status);

      // Handle non-OK responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorData = { 
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status 
          };
        }
        
        console.error('❌ OTP API Error:', errorData);
        
        // Create error object with status for better handling
        const error = new Error(errorData.message || `HTTP ${response.status}: Failed to send OTP`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Parse successful response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse success response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      console.log('✅ OTP sent successfully:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Send OTP error:', error);
      
      // Re-throw with user-friendly message
      const friendlyError = new Error(getErrorMessage(error));
      friendlyError.originalError = error;
      friendlyError.status = error.status;
      friendlyError.data = error.data;
      throw friendlyError;
    }
  },

  // Verify OTP with unified API
  verifyOTP: async (identifier, otp, type, purpose = 'verification') => {
    try {
      // Normalize phone number if needed
      const normalizedIdentifier = type === 'phone' ? normalizePhoneNumber(identifier) : identifier;
      
      console.log('🔐 Verifying OTP:', { 
        identifier: normalizedIdentifier, 
        type, 
        purpose, 
        url: `${API_BASE_URL}/api/auth/verify-otp` 
      });
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: normalizedIdentifier,
          otp,
          type,
          purpose
        }),
      }, REQUEST_TIMEOUT);

      console.log('📡 Verify OTP Response status:', response.status);

      // Handle non-OK responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorData = { 
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status 
          };
        }
        
        console.error('❌ Verify OTP API Error:', errorData);
        
        // Create error object with status for better handling
        const error = new Error(errorData.message || `HTTP ${response.status}: OTP verification failed`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Parse successful response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse success response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      console.log('✅ OTP verified successfully:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      
      // Re-throw with user-friendly message
      const friendlyError = new Error(getErrorMessage(error));
      friendlyError.originalError = error;
      friendlyError.status = error.status;
      friendlyError.data = error.data;
      throw friendlyError;
    }
  },

  // Get OTP status
  getOTPStatus: async (identifier, type) => {
    try {
      const normalizedIdentifier = type === 'phone' ? normalizePhoneNumber(identifier) : identifier;
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/auth/otp-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: normalizedIdentifier,
          type
        }),
      }, REQUEST_TIMEOUT);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to get OTP status`);
      }

      const data = await response.json();
      console.log('✅ OTP status retrieved:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Get OTP status error:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Helper functions for validation
  normalizePhoneNumber,
  validateEmail,
  validatePhone
};

export default unifiedOtpService;
