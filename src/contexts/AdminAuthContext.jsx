import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on app load
    const savedAdminUser = localStorage.getItem('adminUser');
    const savedAdminToken = localStorage.getItem('adminToken');
    
    console.log('AdminAuthContext useEffect - checking auth:', {
      hasUser: !!savedAdminUser,
      hasToken: !!savedAdminToken,
      tokenLength: savedAdminToken?.length
    });
    
    if (savedAdminUser && savedAdminToken) {
      // For admin, we'll use a simpler verification since it's separate from regular users
      try {
        const adminData = JSON.parse(savedAdminUser);
        console.log('Parsed admin data:', { isAdmin: adminData.isAdmin, id: adminData.id });
        
        if (adminData.isAdmin === true) {
          setAdminUser(adminData);
          setIsAdminAuthenticated(true);
          console.log('Admin authenticated from localStorage');
        } else {
          // Clear invalid admin data
          setAdminUser(null);
          setIsAdminAuthenticated(false);
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        setAdminUser(null);
        setIsAdminAuthenticated(false);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
      }
    }
    setAdminLoading(false);
  }, []);

  const adminLogin = (adminData, token = null) => {
    console.log('AdminAuthContext.adminLogin called:', { hasToken: !!token, tokenType: typeof token });
    
    // Save user data
    setAdminUser(adminData);
    setIsAdminAuthenticated(true);
    localStorage.setItem('adminUser', JSON.stringify(adminData));
    
    // Always save token if provided - log if missing
    if (token) {
      localStorage.setItem('adminToken', token);
      console.log('Admin token saved to localStorage');
    } else {
      console.error('AdminLogin: Token is missing or null!', { token, adminData });
    }
    
    // Verify token was saved
    const savedToken = localStorage.getItem('adminToken');
    if (!savedToken && token) {
      console.error('CRITICAL: Token save failed! Attempting direct save...');
      // Force save
      localStorage.setItem('adminToken', String(token));
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
  };

  const isAdmin = adminUser?.isAdmin === true;

  const hasValidAdminToken = () => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  };

  const updateAdminUser = (updatedAdminData) => {
    setAdminUser(prevAdmin => ({
      ...prevAdmin,
      ...updatedAdminData
    }));
    localStorage.setItem('adminUser', JSON.stringify({
      ...adminUser,
      ...updatedAdminData
    }));
  };

  const value = {
    adminUser,
    isAdminAuthenticated,
    adminLoading,
    adminLogin,
    adminLogout,
    isAdmin,
    hasValidAdminToken,
    updateAdminUser
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
