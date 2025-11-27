import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminRoute = ({ children }) => {
  const { isAdminAuthenticated, isAdmin, adminLoading } = useAdminAuth();
  const location = useLocation();

  // Check localStorage directly as fallback to avoid race conditions
  const checkAuthFromStorage = () => {
    try {
      const savedAdminUser = localStorage.getItem('adminUser');
      const savedAdminToken = localStorage.getItem('adminToken');
      if (savedAdminUser && savedAdminToken) {
        const adminData = JSON.parse(savedAdminUser);
        return adminData.isAdmin === true;
      }
    } catch (error) {
      return false;
    }
    return false;
  };

  // Always check localStorage first, even while loading, to prevent redirect loops
  const hasAuthInStorage = checkAuthFromStorage();
  const isAuthenticated = isAdminAuthenticated || hasAuthInStorage;

  if (adminLoading && !hasAuthInStorage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#53755d]"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to admin login page if not authenticated
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Check isAdmin from context or localStorage
  const adminDataFromStorage = (() => {
    try {
      const savedAdminUser = localStorage.getItem('adminUser');
      if (savedAdminUser) {
        return JSON.parse(savedAdminUser);
      }
    } catch (error) {
      return null;
    }
    return null;
  })();
  const isUserAdmin = isAdmin || adminDataFromStorage?.isAdmin === true;

  if (!isUserAdmin) {
    // Redirect to home page if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

