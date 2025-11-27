import React, { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationService from '../services/notificationService';
import { FaUser, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { 
  Bell, User, Settings, LogOut, Edit, Check, X,
  Mail, Phone, CreditCard, Calendar, Shield
} from 'lucide-react';

const AdminProfileHeader = () => {
  const { adminUser, adminLogout, updateAdminUser } = useAdminAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize admin user data
  useEffect(() => {
    if (adminUser) {
      setEditFormData({
        name: adminUser.name || 'Super Admin',
        email: adminUser.email || 'admin@magathi.com',
        phone: adminUser.phone || '+91 9876543210',
        role: adminUser.role || 'Super Administrator'
      });
    }
  }, [adminUser]);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling - different intervals based on backend availability
    const interval = setInterval(() => {
      if (isBackendAvailable) {
        fetchNotifications();
      } else {
        // Check if backend is back online every 2 minutes when offline
        fetchNotifications();
      }
    }, isBackendAvailable ? 30000 : 120000); // 30 seconds when online, 2 minutes when offline
    
    return () => clearInterval(interval);
  }, [isBackendAvailable]);

  const fetchNotifications = async () => {
    // Skip if we've tried too many times and backend is not available
    if (!isBackendAvailable && retryCount >= 3) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const data = await NotificationService.getAdminNotifications(token);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setIsBackendAvailable(true);
      setRetryCount(0);
    } catch (error) {
      // Suppress all errors - set empty notifications and mark backend as unavailable
      setIsBackendAvailable(false);
      setRetryCount(prev => prev + 1);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    // Update local state immediately for better UX
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Only try to sync with backend if it's available
    if (isBackendAvailable) {
      try {
        const token = localStorage.getItem('adminToken');
        await NotificationService.markAsRead(notificationId, token);
      } catch (error) {
        // Suppress errors - local state already updated
      }
    }
  };

  const markAllAsRead = async () => {
    // Update local state immediately for better UX
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);

    // Only try to sync with backend if it's available
    if (isBackendAvailable) {
      try {
        const token = localStorage.getItem('adminToken');
        await NotificationService.markAllAsRead(token);
      } catch (error) {
        // Suppress errors - local state already updated
      }
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
    setIsEditing(true);
    setShowProfileDropdown(false);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      // Use relative URL to leverage Vite proxy
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        const data = await response.json();
        updateAdminUser(data.admin);
        setShowEditModal(false);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin-login');
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'plan_subscription':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'contact_enquiry':
        return <Mail className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <Bell className={`h-5 w-5 transition-transform group-hover:scale-110 ${unreadCount > 0 ? 'text-red-500' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse shadow-lg">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            {!isBackendAvailable && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotificationDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    {!isBackendAvailable && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-red-600">Offline</span>
                        <button
                          onClick={() => {
                            setRetryCount(0);
                            setIsBackendAvailable(true);
                            fetchNotifications();
                          }}
                          className="text-xs text-[#53755d] hover:text-[#3e5d49] font-medium ml-2"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-[#53755d] hover:text-[#3e5d49] font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {!isBackendAvailable && retryCount >= 3 ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Bell className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="text-sm">Backend unavailable</p>
                    <p className="text-xs text-gray-400 mt-1">Showing demo notifications</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markNotificationAsRead(notification.id)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowNotificationDropdown(false);
                      // Navigate to notifications page if exists
                    }}
                    className="w-full text-center text-sm text-[#53755d] hover:text-[#3e5d49] font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-[#53755d] rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">
                {adminUser?.name || 'Super Admin'}
              </p>
              <p className="text-xs text-gray-500">
                {adminUser?.role || 'Super Administrator'}
              </p>
            </div>
            <Settings className="h-4 w-4 text-gray-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#53755d] rounded-full flex items-center justify-center">
                    <FaUser className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {adminUser?.name || 'Super Admin'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {adminUser?.email || 'admin@magathi.com'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <button
                  onClick={handleEditProfile}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="h-4 w-4 text-gray-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    // Navigate to settings if exists
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 text-red-400" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setIsEditing(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={editFormData.role}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-4 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2 inline" />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProfileHeader;
