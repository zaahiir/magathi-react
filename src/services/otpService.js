const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Timeout configuration - increased to handle email service initialization
const REQUEST_TIMEOUT = 30000; // 30 seconds (email service initialization can take time)

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

export const otpService = {
  // Send OTP with robust error handling and timeout
  sendOTP: async (identifier, type, purpose) => {
    try {
      // Use the same type as frontend (email/phone)
      const backendType = type;
      
      console.log('🚀 Sending OTP request:', { identifier, type, purpose, backendType, url: `${API_BASE_URL}/api/auth/send-otp` });
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          type: backendType,
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

  // Verify OTP with robust error handling and timeout
  verifyOTP: async (identifier, otp, type, purpose, userData = {}) => {
    try {
      // Use the same type as frontend (email/phone)
      const backendType = type;
      
      console.log('🔐 Verifying OTP:', { identifier, type, purpose, backendType, firebaseAuth: userData.firebaseAuth, url: `${API_BASE_URL}/api/auth/verify-otp` });
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          otp,
          type: backendType,
          purpose,
          ...userData
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

  // Update PAN card
  updatePanCard: async (panCard, token) => {
    try {
      console.log('🆔 Updating PAN card:', { panCard, url: `${API_BASE_URL}/api/auth/update-pan` });
      
      const response = await fetch(`${API_BASE_URL}/api/auth/update-pan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          panCard
        }),
      });

      console.log('📡 Update PAN Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Update PAN API Error:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update PAN card`);
      }

      const data = await response.json();
      console.log('✅ PAN card updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Update PAN card error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  },

  // Register user with email and phone
  registerUser: async (userData) => {
    try {
      console.log('👤 Registering user:', { userData, url: `${API_BASE_URL}/api/auth/register-user` });
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📡 Register User Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Register User API Error:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: Registration failed`);
      }

      const data = await response.json();
      console.log('✅ User registered successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Register user error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  },

  // Phone OTP methods
  sendPhoneOTP: async (phone, purpose = 'login') => {
    try {
      console.log('📱 Sending phone OTP:', { phone, purpose, url: `${API_BASE_URL}/api/phone/send-phone-otp` });
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/phone/send-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, purpose }),
      }, REQUEST_TIMEOUT);

      console.log('📡 Phone OTP Response status:', response.status);

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
        
        console.error('❌ Phone OTP API Error:', errorData);
        
        const error = new Error(errorData.message || `HTTP ${response.status}: Failed to send phone OTP`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse success response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      console.log('✅ Phone OTP sent successfully:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Send phone OTP error:', error);
      
      const friendlyError = new Error(getErrorMessage(error));
      friendlyError.originalError = error;
      friendlyError.status = error.status;
      friendlyError.data = error.data;
      throw friendlyError;
    }
  },

  verifyPhoneOTP: async (phone, otp, purpose = 'login') => {
    try {
      console.log('🔐 Verifying phone OTP:', { phone, purpose, url: `${API_BASE_URL}/api/phone/verify-phone-otp` });
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/phone/verify-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp, purpose }),
      }, REQUEST_TIMEOUT);

      console.log('📡 Verify Phone OTP Response status:', response.status);

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
        
        console.error('❌ Verify Phone OTP API Error:', errorData);
        
        const error = new Error(errorData.message || `HTTP ${response.status}: Phone OTP verification failed`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse success response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      console.log('✅ Phone OTP verified successfully:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Verify phone OTP error:', error);
      
      const friendlyError = new Error(getErrorMessage(error));
      friendlyError.originalError = error;
      friendlyError.status = error.status;
      friendlyError.data = error.data;
      throw friendlyError;
    }
  },

  completePhoneVerification: async (email, phone, otp, firstName, lastName, panCard) => {
    try {
      console.log('✅ Completing phone verification:', { email, phone, url: `${API_BASE_URL}/api/phone/complete-phone-verification` });
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/phone/complete-phone-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone, otp, firstName, lastName, panCard }),
      }, REQUEST_TIMEOUT);

      console.log('📡 Complete Phone Verification Response status:', response.status);

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
        
        console.error('❌ Complete Phone Verification API Error:', errorData);
        
        const error = new Error(errorData.message || `HTTP ${response.status}: Phone verification failed`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse success response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      console.log('✅ Phone verification completed successfully:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Complete phone verification error:', error);
      
      const friendlyError = new Error(getErrorMessage(error));
      friendlyError.originalError = error;
      friendlyError.status = error.status;
      friendlyError.data = error.data;
      throw friendlyError;
    }
  },

  // PAN card methods
  uploadPANCard: async (file, token) => {
    try {
      console.log('📄 Uploading PAN card:', { fileName: file.name, url: `${API_BASE_URL}/api/phone/upload-pan` });
      
      const formData = new FormData();
      formData.append('panFile', file);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/phone/upload-pan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      }, REQUEST_TIMEOUT);

      console.log('📡 Upload PAN Response status:', response.status);

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
        
        console.error('❌ Upload PAN API Error:', errorData);
        
        const error = new Error(errorData.message || `HTTP ${response.status}: PAN card upload failed`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse success response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      console.log('✅ PAN card uploaded successfully:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Upload PAN card error:', error);
      
      const friendlyError = new Error(getErrorMessage(error));
      friendlyError.originalError = error;
      friendlyError.status = error.status;
      friendlyError.data = error.data;
      throw friendlyError;
    }
  },

  getUserProfile: async (token) => {
    try {
      console.log('👤 Getting user profile:', { url: `${API_BASE_URL}/api/phone/me` });
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/phone/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }, REQUEST_TIMEOUT);

      console.log('📡 Get User Profile Response status:', response.status);

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
        
        console.error('❌ Get User Profile API Error:', errorData);
        
        const error = new Error(errorData.message || `HTTP ${response.status}: Failed to get user profile`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse success response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      console.log('✅ User profile retrieved successfully:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Get user profile error:', error);
      
      const friendlyError = new Error(getErrorMessage(error));
      friendlyError.originalError = error;
      friendlyError.status = error.status;
      friendlyError.data = error.data;
      throw friendlyError;
    }
  },

  deletePANCard: async (token) => {
    try {
      console.log('🗑️ Deleting PAN card:', { url: `${API_BASE_URL}/api/phone/pan-card` });
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/phone/pan-card`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }, REQUEST_TIMEOUT);

      console.log('📡 Delete PAN Response status:', response.status);

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
        
        console.error('❌ Delete PAN API Error:', errorData);
        
        const error = new Error(errorData.message || `HTTP ${response.status}: PAN card deletion failed`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse success response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      console.log('✅ PAN card deleted successfully:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Delete PAN card error:', error);
      
      const friendlyError = new Error(getErrorMessage(error));
      friendlyError.originalError = error;
      friendlyError.status = error.status;
      friendlyError.data = error.data;
      throw friendlyError;
    }
  }
};

export default otpService;
