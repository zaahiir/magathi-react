// Use environment variable with fallback
// Use relative URL to leverage Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const normalizedAPI_BASE_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

// Helper to check if error is a connection error
const isConnectionError = (error) => {
  return error.message?.includes('Failed to fetch') || 
         error.message?.includes('ERR_CONNECTION_REFUSED') ||
         error.message?.includes('NetworkError') ||
         error.message?.includes('ERR_NETWORK') ||
         error.name === 'AbortError' ||
         error.name === 'TimeoutError' ||
         error.message?.includes('timeout') ||
         error.message?.includes('Request timeout') ||
         error.message?.includes('signal timed out');
};

class HealthInsuranceService {
  // Get all health insurance policies
  static async getAllPolicies(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.policyType) queryParams.append('policyType', params.policyType);
      if (params.search) queryParams.append('search', params.search);
      
      const url = `${normalizedAPI_BASE_URL}/health-insurance?${queryParams.toString()}`;
      const response = await fetch(url, {
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      // Handle 503 Service Unavailable - backend returns empty data structure
      if (response.status === 503) {
        try {
          const errorData = await response.json();
          // Return the structure with data property to match normal response format
          return errorData.data ? errorData : { data: { policies: [], totalPages: 0, currentPage: 1, total: 0 } };
        } catch (parseError) {
          // If can't parse, return default empty structure with data property
          return { data: { policies: [], totalPages: 0, currentPage: 1, total: 0 } };
        }
      }

      if (!response.ok) {
        // For other error statuses, return empty data structure instead of throwing
        return { data: { policies: [], totalPages: 0, currentPage: 1, total: 0 } };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      // Suppress connection errors - return empty data structure silently
      if (isConnectionError(error)) {
        return { data: { policies: [] }, success: true, message: 'Server unavailable' };
      }
      // Only log non-connection errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching health insurance policies:', error);
      }
      return { data: { policies: [] }, success: false, message: error.message || 'Failed to fetch policies' };
    }
  }

  // Get single health insurance policy
  static async getPolicyById(id) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/health-insurance/${id}`, {
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        return { data: null, success: false, message: 'Server unavailable' };
      }
      console.error('Error fetching health insurance policy:', error);
      return { data: null, success: false, message: error.message || 'Failed to fetch policy' };
    }
  }

  // Create new health insurance policy
  static async createPolicy(policyData, token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/health-insurance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(policyData),
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        throw new Error('Server unavailable - cannot create policy');
      }
      console.error('Error creating health insurance policy:', error);
      throw error;
    }
  }

  // Update health insurance policy
  static async updatePolicy(id, policyData, token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/health-insurance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(policyData),
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        throw new Error('Server unavailable - cannot update policy');
      }
      console.error('Error updating health insurance policy:', error);
      throw error;
    }
  }

  // Delete health insurance policy
  static async deletePolicy(id, token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/health-insurance/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        throw new Error('Server unavailable - cannot delete policy');
      }
      console.error('Error deleting health insurance policy:', error);
      throw error;
    }
  }

  // Get popular policies
  static async getPopularPolicies() {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/health-insurance/popular`, {
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        return { data: { policies: [] }, success: true };
      }
      console.error('Error fetching popular policies:', error);
      return { data: { policies: [] }, success: false };
    }
  }

  // Get recommended policies
  static async getRecommendedPolicies() {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/health-insurance/recommended`, {
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        return { data: { policies: [] }, success: true };
      }
      console.error('Error fetching recommended policies:', error);
      return { data: { policies: [] }, success: false };
    }
  }

  // Add review to policy
  static async addReview(id, reviewData, token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/health-insurance/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData),
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        throw new Error('Server unavailable - cannot add review');
      }
      console.error('Error adding review:', error);
      throw error;
    }
  }

  // Increment inquiry count
  static async incrementInquiry(id) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/health-insurance/${id}/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      // Silently fail for inquiry count - don't throw
      if (isConnectionError(error)) {
        return { success: false, message: 'Server unavailable' };
      }
      console.error('Error incrementing inquiry count:', error);
      return { success: false, message: error.message || 'Failed to increment inquiry' };
    }
  }
}

export default HealthInsuranceService;
