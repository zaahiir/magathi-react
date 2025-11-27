import React from 'react';
import { FaSave, FaUndo, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const SettingsHeader = ({ 
  hasChanges, 
  onSave, 
  onReset, 
  saving, 
  activeCategory,
  lastSaved 
}) => {
  const getCategoryTitle = (category) => {
    const titles = {
      general: 'General Settings',
      security: 'Security Settings',
      notifications: 'Notification Settings',
      investment: 'Investment Settings',
      userManagement: 'User Management Settings',
      reporting: 'Data & Reporting Settings',
      performance: 'Performance Settings',
      integrations: 'Integration Settings',
      compliance: 'Compliance Settings',
      features: 'Feature Settings'
    };
    return titles[category] || 'Settings';
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      general: 'Configure basic site information and preferences',
      security: 'Manage password policies and authentication settings',
      notifications: 'Set up email notifications and alerts',
      investment: 'Configure investment limits and KYC requirements',
      userManagement: 'Control user registration and management policies',
      reporting: 'Enable analytics and data tracking features',
      performance: 'Optimize caching and performance settings',
      integrations: 'Manage third-party API integrations',
      compliance: 'Configure legal and compliance requirements',
      features: 'Toggle application features on or off'
    };
    return descriptions[category] || 'Manage your application configuration';
  };

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {getCategoryTitle(activeCategory)}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {getCategoryDescription(activeCategory)}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Status Indicators */}
          {hasChanges && (
            <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
              <FaExclamationTriangle className="h-4 w-4 mr-1.5" />
              <span className="font-medium">Unsaved changes</span>
            </div>
          )}
          
          {!hasChanges && lastSaved && (
            <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
              <FaCheckCircle className="h-4 w-4 mr-1.5" />
              <span className="font-medium">All changes saved</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onReset}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FaUndo className="h-4 w-4 mr-2" />
              Reset
            </button>
            
            <button
              onClick={onSave}
              disabled={!hasChanges || saving}
              className="px-4 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Last Saved Info */}
      {lastSaved && !hasChanges && (
        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          Last saved: {new Date(lastSaved).toLocaleString()}
        </div>
      )}

      {/* Progress Bar for Saving */}
      {saving && (
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-[#53755d] h-1.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      )}
    </div>
  );
};

export default SettingsHeader;
