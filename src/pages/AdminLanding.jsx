import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaChartLine, FaCog, FaUsers, FaNewspaper } from 'react-icons/fa';
import logo from '../assets/mfspl.png';

const AdminLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#53755d] via-[#3e5d49] to-[#2d4a3a] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-6 rounded-full shadow-2xl">
              <img src={logo} alt="Logo" className="h-16 w-20" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Admin Portal</h1>
          <p className="text-xl text-white/80 mb-8">Manage your mutual fund platform with ease</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <FaChartLine className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Mutual Fund Plans</h3>
            <p className="text-white/70 text-sm">Create, edit, and manage mutual fund investment plans</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <FaNewspaper className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Blog Management</h3>
            <p className="text-white/70 text-sm">Publish and manage blog posts and articles</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <FaUsers className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
            <p className="text-white/70 text-sm">Monitor and manage user accounts and activities</p>
          </div>
        </div>

        {/* Login Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#53755d] p-4 rounded-full">
              <FaShieldAlt className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Secure Admin Access</h2>
          <p className="text-gray-600 mb-8">
            Access the admin dashboard with your administrator credentials
          </p>
          
          <div className="space-y-4">
            <Link
              to="/admin-login"
              className="inline-flex items-center px-8 py-4 bg-[#53755d] text-white font-semibold rounded-lg hover:bg-[#3e5d49] transition-colors shadow-lg"
            >
              <FaShieldAlt className="h-5 w-5 mr-2" />
              Admin Login
            </Link>
            
            <div className="pt-4">
              <Link
                to="/"
                className="text-[#53755d] hover:text-[#3e5d49] transition-colors font-medium"
              >
                ← Back to Main Site
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            © 2024 Magathi Financial Services. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLanding;
