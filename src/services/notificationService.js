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
         error.message?.includes('timeout') ||
         error.message?.includes('Request timeout');
};

class NotificationService {
  // Get all notifications for admin
  async getAdminNotifications(token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/admin/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      // Handle 503 Service Unavailable silently - return empty structure
      if (response.status === 503) {
        return { notifications: [], totalPages: 0, currentPage: 1, total: 0, unreadCount: 0 };
      }

      if (!response.ok) {
        // Don't suppress 401 errors - let component handle them
        if (response.status === 401) {
          const error = new Error(`Authentication failed (401)`);
          error.status = 401;
          error.response = { status: 401 };
          throw error;
        }
        // Return empty notifications array for other errors
        return { notifications: [], totalPages: 0, currentPage: 1, total: 0, unreadCount: 0 };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Suppress all connection errors - return empty notifications array silently
      if (isConnectionError(error)) {
        return { notifications: [], totalPages: 0, currentPage: 1, total: 0, unreadCount: 0 };
      }
      // Return empty array for any other errors too
      return { notifications: [], totalPages: 0, currentPage: 1, total: 0, unreadCount: 0 };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId, token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/admin/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Suppress connection errors - fail silently
      if (isConnectionError(error)) {
        return { success: false, message: 'Server unavailable' };
      }
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/admin/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Suppress connection errors - fail silently
      if (isConnectionError(error)) {
        return { success: false, message: 'Server unavailable' };
      }
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Create a new notification (for testing or admin use)
  async createNotification(notificationData, token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/admin/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (isConnectionError(error)) {
        throw new Error('Server unavailable - cannot create notification');
      }
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get notification statistics
  async getNotificationStats(token) {
    try {
      const response = await fetch(`${normalizedAPI_BASE_URL}/admin/notifications/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Suppress connection errors - return empty stats
      if (isConnectionError(error)) {
        return { total: 0, unread: 0, read: 0, success: false };
      }
      console.error('Error fetching notification stats:', error);
      return { total: 0, unread: 0, read: 0, success: false };
    }
  }
}

export default new NotificationService();
