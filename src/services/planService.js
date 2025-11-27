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

class PlanService {
  // Get all plans with optional filters
  static async getAllPlans(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.subcategory) queryParams.append('subcategory', filters.subcategory);
      if (filters.riskometer) queryParams.append('riskometer', filters.riskometer);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      
      const response = await fetch(`${normalizedAPI_BASE_URL}/plans?${queryParams}`, {
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      // Suppress connection errors - return empty data structure silently
      if (isConnectionError(error)) {
        return { data: [], success: true, message: 'Server unavailable' };
      }
      // Only log non-connection errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching plans:', error);
      }
      return { data: [], success: false, message: error.message || 'Failed to fetch plans' };
    }
  }

  // Get single plan by ID
  static async getPlanById(id) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/plans/${id}`, {
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
      console.error('Error fetching plan:', error);
      return { data: null, success: false, message: error.message || 'Failed to fetch plan' };
    }
  }

  // Get plan categories
  static async getPlanCategories() {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/plans/categories`, {
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        return { data: [], success: true };
      }
      console.error('Error fetching categories:', error);
      return { data: [], success: false };
    }
  }

  // Get plan subcategories
  static async getPlanSubcategories() {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/plans/subcategories`, {
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        return { data: [], success: true };
      }
      console.error('Error fetching subcategories:', error);
      return { data: [], success: false };
    }
  }

  // Get plan risk levels (riskometer)
  static async getPlanRiskLevels() {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/plans/risk-levels`, {
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        return { data: [], success: true };
      }
      console.error('Error fetching risk levels:', error);
      return { data: [], success: false };
    }
  }

  // Create new plan (Admin only)
  static async createPlan(planData, token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(planData),
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        throw new Error('Server unavailable - cannot create plan');
      }
      console.error('Error creating plan:', error);
      throw error;
    }
  }

  // Update plan (Admin only)
  static async updatePlan(id, planData, token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/plans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(planData),
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        throw new Error('Server unavailable - cannot update plan');
      }
      console.error('Error updating plan:', error);
      throw error;
    }
  }

  // Delete plan (Admin only)
  static async deletePlan(id, token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/plans/${id}`, {
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
        throw new Error('Server unavailable - cannot delete plan');
      }
      console.error('Error deleting plan:', error);
      throw error;
    }
  }
}

export default PlanService;

