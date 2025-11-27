import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip AuthContext initialization if admin is logged in
    const adminUser = localStorage.getItem('adminUser');
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminUser && adminToken) {
      // Admin is logged in, skip regular user authentication checks
      setLoading(false);
      return;
    }
    
    // Check if user is logged in on app load
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    
    if (savedUser && savedToken) {
      // If we have both user and token, restore immediately for better UX
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Silent error - just continue without user
      }
      
      // Then verify/refresh in background silently
      restoreSessionFromDatabase(savedToken, savedRefreshToken);
    } else {
      setLoading(false);
    }
  }, []);

  const restoreSessionFromDatabase = async (token, refreshToken) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user-login-details?sessionToken=${token}`, {
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          // Update with fresh data from database
          setUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.sessionToken);
          localStorage.setItem('refreshToken', data.refreshToken);
        } else {
          // Silently try token verification
          await verifyToken(token, null, refreshToken);
        }
      } else {
        // Silently try token verification
        await verifyToken(token, null, refreshToken);
      }
    } catch (error) {
      // Suppress timeout and connection errors - silently try token verification
      const isConnectionError = error.message.includes('Failed to fetch') || 
                               error.message.includes('ERR_CONNECTION_REFUSED') ||
                               error.message.includes('NetworkError') ||
                               error.name === 'AbortError' ||
                               error.name === 'TimeoutError' ||
                               error.message.includes('timeout') ||
                               error.message.includes('Timeout') ||
                               error.message.includes('signal timed out');
      
      // Suppress all errors - silently try token verification
      if (refreshToken) {
        try {
          await refreshUserToken(refreshToken);
        } catch (refreshError) {
          // Suppress refresh errors - keep existing session
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token, savedUser, refreshToken) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          // Use fresh user data from server
          setUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // Keep user logged in with existing data if verification fails
          const currentUser = localStorage.getItem('user');
          if (currentUser) {
            setUser(JSON.parse(currentUser));
            setIsAuthenticated(true);
          }
        }
      } else if (refreshToken) {
        // Try to refresh the token silently
        await refreshUserToken(refreshToken);
      } else {
        // Keep user logged in even if verification fails
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          setUser(JSON.parse(currentUser));
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      // Suppress network errors - keep user logged in with existing data
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        setUser(JSON.parse(currentUser));
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUserToken = async (refreshToken) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ refreshToken }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Handle 503 Service Unavailable silently
      if (response.status === 503) {
        // Keep user logged in with existing session - suppress error
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          setUser(JSON.parse(currentUser));
          setIsAuthenticated(true);
        }
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
        } else {
          // Keep user logged in even if refresh fails
          const currentUser = localStorage.getItem('user');
          if (currentUser) {
            setUser(JSON.parse(currentUser));
            setIsAuthenticated(true);
          }
        }
      } else {
        // Keep user logged in even if refresh fails (for other error codes)
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          setUser(JSON.parse(currentUser));
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      // Suppress all errors silently - keep user logged in with existing session
      // Also suppress timeout and connection errors
      clearTimeout(timeoutId);
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        setUser(JSON.parse(currentUser));
        setIsAuthenticated(true);
      }
    }
  };

  const login = (userData, token = null, refreshToken = null) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    
    if (token) {
      localStorage.setItem('token', token);
    }
    
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    // Send login notification to admin
    sendLoginNotification(userData);
    
    console.log('✅ AuthContext: User logged in successfully with persistent session');
  };

  // Send login notification to admin
  const sendLoginNotification = async (userData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/track-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.id || userData._id,
          userEmail: userData.email,
          userName: userData.firstName && userData.lastName ? 
            `${userData.firstName} ${userData.lastName}` : 
            userData.displayName || userData.name || 'User',
          loginTime: new Date().toISOString(),
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        })
      });

      if (response.ok) {
        console.log('✅ Login notification sent successfully');
      } else {
        console.warn('⚠️ Failed to send login notification');
      }
    } catch (error) {
      console.error('❌ Error sending login notification:', error);
      // Don't fail the login if notification fails
    }
  };

  const logout = async (forceLogout = false) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Call logout endpoint to deactivate session
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Only clear auth state if this is an explicit logout
      if (forceLogout) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        console.log('✅ AuthContext: User logged out successfully');
      }
    }
  };

  const isAdmin = user?.isAdmin === true;

  const hasValidToken = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
    localStorage.setItem('user', JSON.stringify({
      ...user,
      ...updatedUserData
    }));
  };

  // Explicit logout function that actually logs out the user
  const forceLogout = async () => {
    await logout(true);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout: forceLogout, // Use the explicit logout function
    isAdmin,
    hasValidToken,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
