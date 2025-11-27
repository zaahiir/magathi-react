import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaShieldAlt, FaChartLine, FaNewspaper, FaSignOutAlt, FaHome, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/mfspl.png';
import LogoutConfirmationModal from './LogoutConfirmationModal';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const goToMainSite = () => {
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-[#53755d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Logo" className="h-10 w-16" />
            <div className="flex items-center space-x-2">
              <FaShieldAlt className="h-6 w-6 text-[#53755d]" />
              <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#53755d] hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChartLine className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={goToMainSite}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#53755d] hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaHome className="h-4 w-4" />
              <span>Main Site</span>
            </button>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:block text-sm text-gray-600">
              <span className="font-medium">{user?.name}</span>
              <span className="text-gray-400 ml-2">• Admin</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-[#53755d] hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate('/admin-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#53755d] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChartLine className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  goToMainSite();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#53755d] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaHome className="h-4 w-4" />
                <span>Main Site</span>
              </button>

              <div className="pt-2 border-t border-gray-200">
                <div className="px-3 py-2 text-sm text-gray-600">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-gray-400">Admin User</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
};

export default AdminHeader;
