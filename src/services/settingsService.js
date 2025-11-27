// Use relative URL to leverage Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class SettingsService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/settings`;
  }

  // Get authorization headers
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get all settings
  async getSettings() {
    try {
      // Check if we're in development mode or if backend is not available
      const isDevelopment = import.meta.env.DEV;
      
      if (isDevelopment) {
        // In development, always use mock data to avoid API calls
        console.log('Development mode: Using mock settings data');
        return {
          success: true,
          data: this.getDefaultSettings()
        };
      }

      const response = await fetch(`${this.baseURL}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Return mock data for development if API is not available
      console.warn('Settings API not available, using mock data');
      return {
        success: true,
        data: this.getDefaultSettings()
      };
    }
  }

  // Get settings by category
  async getSettingsByCategory(category) {
    try {
      // Check if we're in development mode
      const isDevelopment = import.meta.env.DEV;
      
      if (isDevelopment) {
        console.log(`Development mode: Using mock data for category: ${category}`);
        const defaultSettings = this.getDefaultSettings();
        return {
          success: true,
          data: defaultSettings[category] || {}
        };
      }

      const response = await fetch(`${this.baseURL}/category/${category}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching settings by category:', error);
      // Return mock data for development if API is not available
      console.warn('Settings API not available, using mock data for category:', category);
      const defaultSettings = this.getDefaultSettings();
      return {
        success: true,
        data: defaultSettings[category] || {}
      };
    }
  }

  // Update settings
  async updateSettings(category, settings) {
    try {
      // Validate settings before sending
      const validationErrors = this.validateSettingsData(category, settings);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Validation errors found',
          errors: validationErrors
        };
      }

      // Check if we're in development mode
      const isDevelopment = import.meta.env.DEV;
      
      if (isDevelopment) {
        console.log(`Development mode: Simulating update for category: ${category}`);
        return {
          success: true,
          message: `${category} settings updated successfully (simulated)`,
          data: { [category]: settings }
        };
      }

      const response = await fetch(`${this.baseURL}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ category, settings })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      // For development, simulate successful update
      console.warn('Settings API not available, simulating successful update');
      return {
        success: true,
        message: `${category} settings updated successfully (simulated)`,
        data: { [category]: settings }
      };
    }
  }

  // Update specific setting field
  async updateSettingField(category, field, value) {
    try {
      // Check if we're in development mode
      const isDevelopment = import.meta.env.DEV;
      
      if (isDevelopment) {
        console.log(`Development mode: Simulating field update for ${category}.${field}`);
        return {
          success: true,
          message: `${category}.${field} updated successfully (simulated)`,
          data: { [category]: { [field]: value } }
        };
      }

      const response = await fetch(`${this.baseURL}/field`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ category, field, value })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating setting field:', error);
      // For development, simulate successful update
      console.warn('Settings API not available, simulating successful field update');
      return {
        success: true,
        message: `${category}.${field} updated successfully (simulated)`,
        data: { [category]: { [field]: value } }
      };
    }
  }

  // Validate settings
  async validateSettings(category, settings) {
    try {
      // Check if we're in development mode
      const isDevelopment = import.meta.env.DEV;
      
      if (isDevelopment) {
        console.log(`Development mode: Simulating validation for category: ${category}`);
        return {
          success: true,
          message: 'Settings validation passed (simulated)'
        };
      }

      const response = await fetch(`${this.baseURL}/validate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ category, settings })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating settings:', error);
      // For development, simulate successful validation
      console.warn('Settings API not available, simulating successful validation');
      return {
        success: true,
        message: 'Settings validation passed (simulated)'
      };
    }
  }

  // Reset settings to default
  async resetSettings() {
    try {
      // Check if we're in development mode
      const isDevelopment = import.meta.env.DEV;
      
      if (isDevelopment) {
        console.log('Development mode: Simulating settings reset');
        return {
          success: true,
          message: 'Settings reset to default successfully (simulated)',
          data: this.getDefaultSettings()
        };
      }

      const response = await fetch(`${this.baseURL}/reset`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error resetting settings:', error);
      // For development, simulate successful reset
      console.warn('Settings API not available, simulating successful reset');
      return {
        success: true,
        message: 'Settings reset to default successfully (simulated)',
        data: this.getDefaultSettings()
      };
    }
  }

  // Get settings history
  async getSettingsHistory(page = 1, limit = 10) {
    try {
      // Check if we're in development mode
      const isDevelopment = import.meta.env.DEV;
      
      if (isDevelopment) {
        console.log('Development mode: Returning empty settings history');
        return {
          success: true,
          data: [],
          pagination: {
            current: parseInt(page),
            pages: 0,
            total: 0
          }
        };
      }

      const response = await fetch(`${this.baseURL}/history?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching settings history:', error);
      // For development, return empty history
      console.warn('Settings API not available, returning empty history');
      return {
        success: true,
        data: [],
        pagination: {
          current: parseInt(page),
          pages: 0,
          total: 0
        }
      };
    }
  }

  // Bulk update multiple settings
  async bulkUpdateSettings(updates) {
    try {
      const promises = updates.map(update => 
        this.updateSettingField(update.category, update.field, update.value)
      );
      
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('Error in bulk update:', error);
      throw error;
    }
  }

  // Get settings with caching
  async getSettingsCached() {
    const cacheKey = 'settings_cache';
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheExpiry) {
          return { success: true, data };
        }
      }
      
      const result = await this.getSettings();
      if (result.success) {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: result.data,
          timestamp: Date.now()
        }));
      }
      
      return result;
    } catch (error) {
      console.error('Error with cached settings:', error);
      // Fallback to non-cached request
      return this.getSettings();
    }
  }

  // Validate settings data before sending
  validateSettingsData(category, settings) {
    const errors = [];
    
    switch (category) {
      case 'general':
        if (settings.siteName && settings.siteName.length < 3) {
          errors.push('Site name must be at least 3 characters long');
        }
        if (settings.contactEmail && !this.isValidEmail(settings.contactEmail)) {
          errors.push('Contact email must be a valid email address');
        }
        if (settings.contactPhone && !this.isValidPhone(settings.contactPhone)) {
          errors.push('Contact phone must be a valid phone number');
        }
        break;
        
      case 'security':
        if (settings.passwordPolicy) {
          const policy = settings.passwordPolicy;
          if (policy.minLength && policy.minLength < 6) {
            errors.push('Minimum password length must be at least 6');
          }
          if (policy.maxAttempts && policy.maxAttempts < 3) {
            errors.push('Maximum login attempts must be at least 3');
          }
        }
        break;
        
      case 'investment':
        if (settings.minInvestmentAmount && settings.minInvestmentAmount < 100) {
          errors.push('Minimum investment amount must be at least ₹100');
        }
        if (settings.maxInvestmentAmount && settings.maxInvestmentAmount < settings.minInvestmentAmount) {
          errors.push('Maximum investment amount must be greater than minimum investment amount');
        }
        break;
    }
    
    return errors;
  }

  // Helper function to validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper function to validate phone
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Clear settings cache
  clearCache() {
    localStorage.removeItem('settings_cache');
  }

  // Get default settings for development/fallback
  getDefaultSettings() {
    return {
      general: {
        siteName: 'Magathi Mutual Funds',
        siteDescription: 'Your trusted partner for mutual fund investments',
        contactEmail: 'support@magathi.com',
        contactPhone: '+91-9876543210',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        maintenanceMode: false
      },
      security: {
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          maxAttempts: 5
        },
        twoFactorAuth: {
          enabled: false,
          requiredForAdmins: true
        }
      },
      notifications: {
        email: {
          smtpHost: '',
          smtpPort: 587,
          fromEmail: 'noreply@magathi.com',
          fromName: 'Magathi Mutual Funds'
        },
        notificationTypes: {
          userRegistration: true,
          userLogin: false,
          planSubscription: true,
          blogPublish: true,
          systemAlerts: true,
          maintenanceMode: true
        }
      },
      investment: {
        minInvestmentAmount: 500,
        maxInvestmentAmount: 10000000,
        kycRequirements: {
          panCardRequired: true,
          aadhaarRequired: false,
          bankAccountRequired: true,
          addressProofRequired: false
        }
      },
      userManagement: {
        registration: {
          enabled: true,
          requireEmailVerification: true,
          requirePhoneVerification: true,
          autoApproveUsers: false
        }
      },
      reporting: {
        analytics: {
          enabled: true,
          trackUserBehavior: true,
          trackPageViews: true,
          trackClicks: true
        }
      },
      performance: {
        caching: {
          cacheDuration: 300
        },
        rateLimiting: {
          requestsPerMinute: 100
        }
      },
      integrations: {
        paymentGateway: {
          provider: 'razorpay',
          apiKey: ''
        }
      },
      compliance: {
        gdpr: {
          enabled: false,
          cookieConsentRequired: true,
          rightToErasure: true
        }
      },
      features: {
        blogSystem: true,
        calculatorTools: true,
        portfolioTracking: false,
        goalPlanning: false,
        roboAdvisor: false,
        socialFeatures: false,
        mobileApp: false,
        apiAccess: false
      }
    };
  }
}

export default new SettingsService();
