import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from '../../contexts/SettingsContext';
import SettingsSidebar from './SettingsSidebar';
import SettingsHeader from './SettingsHeader';
import GeneralSettings from './categories/GeneralSettings';
import SecuritySettings from './categories/SecuritySettings';
import NotificationSettings from './categories/NotificationSettings';
import InvestmentSettings from './categories/InvestmentSettings';
import UserManagementSettings from './categories/UserManagementSettings';
import ReportingSettings from './categories/ReportingSettings';
import PerformanceSettings from './categories/PerformanceSettings';
import IntegrationSettings from './categories/IntegrationSettings';
import ComplianceSettings from './categories/ComplianceSettings';
import FeatureSettings from './categories/FeatureSettings';
import { FaChevronDown, FaExclamationTriangle } from 'react-icons/fa';

// Main Settings Content Component
const SettingsContent = () => {
  const { state, updateSetting, updateNestedSetting, saveSettings, resetSettings, setActiveCategory } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Handle save
  const handleSave = async () => {
    const result = await saveSettings();
    if (result.success) {
      setLastSaved(new Date());
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  // Handle reset
  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      const result = await resetSettings();
      if (result.success) {
        setLastSaved(new Date());
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setIsMobileMenuOpen(false);
  };

  // Render settings component based on active category
  const renderSettingsComponent = () => {
    const commonProps = {
      settings: state.settings[state.activeCategory] || {},
      updateSetting: (field, value) => updateSetting(state.activeCategory, field, value),
      updateNestedSetting: (fieldPath, value) => updateNestedSetting(state.activeCategory, fieldPath, value)
    };

    switch (state.activeCategory) {
      case 'general':
        return <GeneralSettings {...commonProps} />;
      case 'security':
        return <SecuritySettings {...commonProps} />;
      case 'notifications':
        return <NotificationSettings {...commonProps} />;
      case 'investment':
        return <InvestmentSettings {...commonProps} />;
      case 'userManagement':
        return <UserManagementSettings {...commonProps} />;
      case 'reporting':
        return <ReportingSettings {...commonProps} />;
      case 'performance':
        return <PerformanceSettings {...commonProps} />;
      case 'integrations':
        return <IntegrationSettings {...commonProps} />;
      case 'compliance':
        return <ComplianceSettings {...commonProps} />;
      case 'features':
        return <FeatureSettings {...commonProps} />;
      default:
        return <GeneralSettings {...commonProps} />;
    }
  };

  // Loading state
  if (state.loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53755d]"></div>
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings Not Available</h3>
        <p className="text-gray-600 mb-4 text-center max-w-md">{state.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors"
        >
          Retry Loading Settings
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <SettingsHeader 
        hasChanges={state.hasChanges}
        onSave={handleSave}
        onReset={handleReset}
        saving={state.saving}
        activeCategory={state.activeCategory}
        lastSaved={lastSaved}
      />

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">Settings Categories</span>
          <FaChevronDown className={`h-4 w-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className={`lg:col-span-1 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <SettingsSidebar 
            activeCategory={state.activeCategory}
            onCategoryChange={handleCategoryChange}
            hasChanges={{ [state.activeCategory]: state.hasChanges }}
          />
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {renderSettingsComponent()}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Settings Panel Component with Provider
const SettingsPanel = () => {
  return (
    <SettingsProvider>
      <SettingsContent />
    </SettingsProvider>
  );
};

export default SettingsPanel;
