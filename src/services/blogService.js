import axios from 'axios';

// Use relative URL to leverage Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Ensure API_BASE_URL ends with /api
const normalizedAPI_BASE_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

class BlogService {
  constructor() {
    const baseURL = `${normalizedAPI_BASE_URL}/blogs`;
    
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // No token available, request will fail with 401
          console.warn('No admin token available for blog operations');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 503 Service Unavailable - return empty data structure silently
        if (error.response?.status === 503) {
          // Suppress console error by intercepting before browser logs it
          const responseData = error.response.data || { blogs: [], total: 0, totalPages: 1, currentPage: 1 };
          // Return resolved promise with proper data structure
          return Promise.resolve({
            data: responseData,
            status: 200,
            statusText: 'OK'
          });
        }
        
        if (error.response?.status === 401) {
          // Don't redirect on 401 - let the component handle the error
          // Log the error but don't clear token or redirect
          console.warn('401 Unauthorized - Token may be invalid or expired, but keeping user logged in to show error');
          // Return error so component can display it
          error.showError = true;
          error.errorMessage = 'Authentication failed. Please check your token or contact administrator.';
        }
        
        // Handle timeout errors silently
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          error.isConnectionError = true;
          error.suppressError = true;
        }
        // Handle network errors silently
        if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
          error.isConnectionError = true;
          error.suppressError = true;
        }
        return Promise.reject(error);
      }
    );
  }

  // Public methods (no auth required)
  async getPublishedBlogs(params = {}) {
    try {
      const response = await this.api.get('/', { params });
      return response.data;
    } catch (error) {
      // Suppress connection/timeout errors - return empty data structure
      if (error.suppressError || error.isConnectionError) {
        return { blogs: [], total: 0, totalPages: 1, currentPage: 1 };
      }
      // Only log non-connection errors in development
      if (process.env.NODE_ENV === 'development' && !error.suppressError) {
        console.error('Error fetching published blogs:', error);
      }
      throw error;
    }
  }

  async getBlogBySlug(slug) {
    try {
      const response = await this.api.get(`/slug/${slug}`);
      return response.data;
    } catch (error) {
      // Suppress connection/timeout errors
      if (error.suppressError || error.isConnectionError) {
        return null;
      }
      // Only log non-connection errors in development
      if (process.env.NODE_ENV === 'development' && !error.suppressError) {
        console.error('Error fetching blog by slug:', error);
      }
      throw error;
    }
  }

  async getBlogById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      // Suppress connection/timeout errors
      if (error.suppressError || error.isConnectionError) {
        return null;
      }
      // Only log non-connection errors in development
      if (process.env.NODE_ENV === 'development' && !error.suppressError) {
        console.error('Error fetching blog by ID:', error);
      }
      throw error;
    }
  }

  async likeBlog(id) {
    try {
      const response = await this.api.post(`/${id}/like`);
      return response.data;
    } catch (error) {
      // Suppress connection/timeout errors - return success false
      if (error.suppressError || error.isConnectionError) {
        return { success: false, message: 'Server unavailable' };
      }
      // Only log non-connection errors in development
      if (process.env.NODE_ENV === 'development' && !error.suppressError) {
        console.error('Error liking blog:', error);
      }
      throw error;
    }
  }

  // Admin methods (auth required)
  async getAllBlogs(params = {}) {
    try {
      const response = await this.api.get('/admin/all', { params });
      // Ensure we always return the expected data structure
      return response?.data || { blogs: [], total: 0, totalPages: 1, currentPage: 1 };
    } catch (error) {
      // Suppress connection/timeout/503 errors - return empty data structure
      if (error.suppressError || error.isConnectionError || error.response?.status === 503) {
        return { blogs: [], total: 0, totalPages: 1, currentPage: 1 };
      }
      // Only log non-connection errors in development
      if (process.env.NODE_ENV === 'development' && !error.suppressError) {
        console.error('Error fetching all blogs:', error);
      }
      // Return empty structure instead of throwing to prevent crashes
      return { blogs: [], total: 0, totalPages: 1, currentPage: 1 };
    }
  }

  async createBlog(blogData) {
    try {
      const response = await this.api.post('/admin', blogData);
      return response.data;
    } catch (error) {
      // Suppress timeout/connection errors - don't log them
      if (error.suppressError || error.isConnectionError || error.code === 'ECONNABORTED') {
        throw new Error('Server unavailable. Please check your connection and try again.');
      }
      // Only log non-connection errors
      if (process.env.NODE_ENV === 'development') {
        console.error('Error creating blog:', error);
      }
      throw error;
    }
  }

  async updateBlog(id, blogData) {
    try {
      const response = await this.api.put(`/admin/${id}`, blogData);
      return response.data;
    } catch (error) {
      // Suppress timeout/connection errors
      if (error.suppressError || error.isConnectionError || error.code === 'ECONNABORTED') {
        throw new Error('Server unavailable. Please check your connection and try again.');
      }
      // Only log non-connection errors
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating blog:', error);
      }
      throw error;
    }
  }

  async deleteBlog(id) {
    try {
      const response = await this.api.delete(`/admin/${id}`);
      return response.data;
    } catch (error) {
      // Suppress timeout/connection errors
      if (error.suppressError || error.isConnectionError || error.code === 'ECONNABORTED') {
        throw new Error('Server unavailable. Please check your connection and try again.');
      }
      // Only log non-connection errors
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting blog:', error);
      }
      throw error;
    }
  }

  async uploadImage(formData) {
    try {
      const response = await this.api.post('/admin/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      // Suppress timeout/connection errors
      if (error.suppressError || error.isConnectionError || error.code === 'ECONNABORTED') {
        throw new Error('Server unavailable. Please check your connection and try again.');
      }
      // Only log non-connection errors
      if (process.env.NODE_ENV === 'development') {
        console.error('Error uploading image:', error);
      }
      throw error;
    }
  }
}

export default new BlogService();