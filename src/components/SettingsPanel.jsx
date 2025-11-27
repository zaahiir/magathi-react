import React, { useState, useEffect } from 'react';
import { 
  FaCog, FaShieldAlt, FaBell, FaChartLine, FaUsers, FaDatabase,
  FaLock, FaEnvelope, FaSms, FaGlobe, FaCreditCard, FaFileAlt,
  FaSave, FaUndo, FaCheck, FaTimes, FaExclamationTriangle,
  FaInfoCircle, FaEye, FaEyeSlash, FaUpload, FaDownload
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import SettingsService from '../services/settingsService';

const SettingsPanel = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);

  const categories = [
    { id: 'general', name: 'General', icon: FaGlobe, color: 'blue' },
    { id: 'security', name: 'Security', icon: FaShieldAlt, color: 'red' },
    { id: 'notifications', name: 'Notifications', icon: FaBell, color: 'green' },
    { id: 'investment', name: 'Investment', icon: FaCreditCard, color: 'purple' },
    { id: 'userManagement', name: 'User Management', icon: FaUsers, color: 'indigo' },
    { id: 'reporting', name: 'Data & Reporting', icon: FaChartLine, color: 'yellow' },
    { id: 'performance', name: 'Performance', icon: FaDatabase, color: 'pink' },
    { id: 'integrations', name: 'Integrations', icon: FaCog, color: 'gray' },
    { id: 'compliance', name: 'Compliance', icon: FaFileAlt, color: 'orange' },
    { id: 'features', name: 'Features', icon: FaLock, color: 'teal' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await SettingsService.getSettingsCached();
      if (response.success) {
        setSettings(response.data);
        // Only show success message if not in development mode with mock data
        if (!import.meta.env.DEV) {
          toast.success('Settings loaded successfully');
        }
      } else {
        toast.error('Failed to load settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setValidationErrors([]);
      const response = await SettingsService.updateSettings(activeCategory, settings[activeCategory] || {});
      if (response.success) {
        toast.success(response.message || 'Settings saved successfully');
        // Clear cache to ensure fresh data on next load
        SettingsService.clearCache();
      } else {
        if (response.errors && response.errors.length > 0) {
          setValidationErrors(response.errors);
          toast.error('Please fix the validation errors below');
        } else {
          toast.error(response.message || 'Failed to save settings');
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      try {
        setSaving(true);
        const response = await SettingsService.resetSettings();
        if (response.success) {
          toast.success(response.message || 'Settings reset to default');
          // Clear cache and reload settings
          SettingsService.clearCache();
          await fetchSettings();
        } else {
          toast.error(response.message || 'Failed to reset settings');
        }
      } catch (error) {
        console.error('Error resetting settings:', error);
        toast.error('Failed to reset settings');
      } finally {
        setSaving(false);
      }
    }
  };

  const updateSetting = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  // Handle nested field updates (e.g., security.passwordPolicy.minLength)
  const updateNestedSetting = (category, fieldPath, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const pathArray = fieldPath.split('.');
      let current = newSettings[category] || {};
      
      // Navigate to the parent object
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) {
          current[pathArray[i]] = {};
        }
        current = current[pathArray[i]];
      }
      
      // Set the final value
      current[pathArray[pathArray.length - 1]] = value;
      
      return {
        ...newSettings,
        [category]: {
          ...newSettings[category],
          ...current
        }
      };
    });
  };

  const togglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53755d]"></div>
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  // Show error state if settings failed to load
  if (!settings || Object.keys(settings).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings Not Available</h3>
        <p className="text-gray-600 mb-4">Unable to load settings. This might be due to API connectivity issues.</p>
        <button
          onClick={fetchSettings}
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaUndo className="inline h-4 w-4 mr-2" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors disabled:opacity-50"
          >
            <FaSave className="inline h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-lg bg-red-100 text-red-800">
          <div className="flex items-start">
            <FaExclamationTriangle className="h-4 w-4 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium mb-2">Validation Errors:</h4>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Settings Categories</h4>
            <nav className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-[#53755d] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {category.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeCategory === 'general' && <GeneralSettings settings={settings.general} updateSetting={updateSetting} updateNestedSetting={updateNestedSetting} />}
            {activeCategory === 'security' && <SecuritySettings settings={settings.security} updateSetting={updateSetting} updateNestedSetting={updateNestedSetting} showPassword={showPassword} togglePassword={togglePassword} />}
            {activeCategory === 'notifications' && <NotificationSettings settings={settings.notifications} updateSetting={updateSetting} updateNestedSetting={updateNestedSetting} showPassword={showPassword} togglePassword={togglePassword} />}
            {activeCategory === 'investment' && <InvestmentSettings settings={settings.investment} updateSetting={updateSetting} updateNestedSetting={updateNestedSetting} />}
            {activeCategory === 'userManagement' && <UserManagementSettings settings={settings.userManagement} updateSetting={updateSetting} updateNestedSetting={updateNestedSetting} />}
            {activeCategory === 'reporting' && <ReportingSettings settings={settings.reporting} updateSetting={updateSetting} updateNestedSetting={updateNestedSetting} />}
            {activeCategory === 'performance' && <PerformanceSettings settings={settings.performance} updateSetting={updateSetting} updateNestedSetting={updateNestedSetting} />}
            {activeCategory === 'integrations' && <IntegrationSettings settings={settings.integrations} updateSetting={updateSetting} updateNestedSetting={updateNestedSetting} showPassword={showPassword} togglePassword={togglePassword} />}
            {activeCategory === 'compliance' && <ComplianceSettings settings={settings.compliance} updateSetting={updateSetting} updateNestedSetting={updateNestedSetting} />}
            {activeCategory === 'features' && <FeatureSettings settings={settings.features} updateSetting={updateSetting} updateNestedSetting={updateNestedSetting} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// General Settings Component
const GeneralSettings = ({ settings = {}, updateSetting, updateNestedSetting }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">General Settings</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
        <input
          type="text"
          value={settings.siteName || ''}
          onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
        <input
          type="email"
          value={settings.contactEmail || ''}
          onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
        <input
          type="tel"
          value={settings.contactPhone || ''}
          onChange={(e) => updateSetting('general', 'contactPhone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
        <select
          value={settings.currency || 'INR'}
          onChange={(e) => updateSetting('general', 'currency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
        >
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
        <select
          value={settings.timezone || 'Asia/Kolkata'}
          onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
        >
          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York (EST)</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="maintenanceMode"
          checked={settings.maintenanceMode || false}
          onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
          className="h-4 w-4 text-[#53755d] focus:ring-[#53755d] border-gray-300 rounded"
        />
        <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-700">
          Enable Maintenance Mode
        </label>
      </div>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
      <textarea
        value={settings.siteDescription || ''}
        onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
        rows="3"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
      />
    </div>
  </div>
);

// Security Settings Component
const SecuritySettings = ({ settings = {}, updateSetting, updateNestedSetting, showPassword, togglePassword }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">Security Settings</h4>
    
    <div className="space-y-6">
      <div>
        <h5 className="text-md font-medium text-gray-800 mb-4">Password Policy</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Length</label>
            <input
              type="number"
              value={settings.passwordPolicy?.minLength || 8}
              onChange={(e) => updateNestedSetting('security', 'passwordPolicy.minLength', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
            <input
              type="number"
              value={settings.passwordPolicy?.maxAttempts || 5}
              onChange={(e) => updateNestedSetting('security', 'passwordPolicy.maxAttempts', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {[
            { key: 'requireUppercase', label: 'Require Uppercase Letters' },
            { key: 'requireLowercase', label: 'Require Lowercase Letters' },
            { key: 'requireNumbers', label: 'Require Numbers' },
            { key: 'requireSpecialChars', label: 'Require Special Characters' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                id={key}
                checked={settings.passwordPolicy?.[key] || false}
                onChange={(e) => updateNestedSetting('security', `passwordPolicy.${key}`, e.target.checked)}
                className="h-4 w-4 text-[#53755d] focus:ring-[#53755d] border-gray-300 rounded"
              />
              <label htmlFor={key} className="ml-2 text-sm text-gray-700">{label}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h5 className="text-md font-medium text-gray-800 mb-4">Two-Factor Authentication</h5>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="twoFactorEnabled"
              checked={settings.twoFactorAuth?.enabled || false}
              onChange={(e) => updateNestedSetting('security', 'twoFactorAuth.enabled', e.target.checked)}
              className="h-4 w-4 text-[#53755d] focus:ring-[#53755d] border-gray-300 rounded"
            />
            <label htmlFor="twoFactorEnabled" className="ml-2 text-sm text-gray-700">
              Enable Two-Factor Authentication
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="twoFactorRequiredAdmins"
              checked={settings.twoFactorAuth?.requiredForAdmins || false}
              onChange={(e) => updateNestedSetting('security', 'twoFactorAuth.requiredForAdmins', e.target.checked)}
              className="h-4 w-4 text-[#53755d] focus:ring-[#53755d] border-gray-300 rounded"
            />
            <label htmlFor="twoFactorRequiredAdmins" className="ml-2 text-sm text-gray-700">
              Required for Administrators
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Notification Settings Component
const NotificationSettings = ({ settings = {}, updateSetting, updateNestedSetting, showPassword, togglePassword }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">Notification Settings</h4>
    
    <div className="space-y-6">
      <div>
        <h5 className="text-md font-medium text-gray-800 mb-4">Email Configuration</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
            <input
              type="text"
              value={settings.email?.smtpHost || ''}
              onChange={(e) => updateNestedSetting('notifications', 'email.smtpHost', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
            <input
              type="number"
              value={settings.email?.smtpPort || 587}
              onChange={(e) => updateNestedSetting('notifications', 'email.smtpPort', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
            <input
              type="email"
              value={settings.email?.fromEmail || ''}
              onChange={(e) => updateNestedSetting('notifications', 'email.fromEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
            <input
              type="text"
              value={settings.email?.fromName || ''}
              onChange={(e) => updateNestedSetting('notifications', 'email.fromName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h5 className="text-md font-medium text-gray-800 mb-4">Notification Types</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'userRegistration', label: 'User Registration' },
            { key: 'userLogin', label: 'User Login' },
            { key: 'planSubscription', label: 'Plan Subscription' },
            { key: 'blogPublish', label: 'Blog Publish' },
            { key: 'systemAlerts', label: 'System Alerts' },
            { key: 'maintenanceMode', label: 'Maintenance Mode' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                id={key}
                checked={settings.notificationTypes?.[key] || false}
                onChange={(e) => updateNestedSetting('notifications', `notificationTypes.${key}`, e.target.checked)}
                className="h-4 w-4 text-[#53755d] focus:ring-[#53755d] border-gray-300 rounded"
              />
              <label htmlFor={key} className="ml-2 text-sm text-gray-700">{label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Investment Settings Component
const InvestmentSettings = ({ settings = {}, updateSetting, updateNestedSetting }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">Investment Settings</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Investment (₹)</label>
        <input
          type="number"
          value={settings.minInvestmentAmount || 500}
          onChange={(e) => updateSetting('investment', 'minInvestmentAmount', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Investment (₹)</label>
        <input
          type="number"
          value={settings.maxInvestmentAmount || 10000000}
          onChange={(e) => updateSetting('investment', 'maxInvestmentAmount', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
        />
      </div>
    </div>
    
    <div>
      <h5 className="text-md font-medium text-gray-800 mb-4">KYC Requirements</h5>
      <div className="space-y-2">
        {[
          { key: 'panCardRequired', label: 'PAN Card Required' },
          { key: 'aadhaarRequired', label: 'Aadhaar Required' },
          { key: 'bankAccountRequired', label: 'Bank Account Required' },
          { key: 'addressProofRequired', label: 'Address Proof Required' }
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              id={key}
              checked={settings.kycRequirements?.[key] || false}
              onChange={(e) => updateNestedSetting('investment', `kycRequirements.${key}`, e.target.checked)}
              className="h-4 w-4 text-[#53755d] focus:ring-[#53755d] border-gray-300 rounded"
            />
            <label htmlFor={key} className="ml-2 text-sm text-gray-700">{label}</label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// User Management Settings Component
const UserManagementSettings = ({ settings = {}, updateSetting, updateNestedSetting }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">User Management Settings</h4>
    
    <div>
      <h5 className="text-md font-medium text-gray-800 mb-4">Registration Settings</h5>
      <div className="space-y-2">
        {[
          { key: 'enabled', label: 'Enable User Registration' },
          { key: 'requireEmailVerification', label: 'Require Email Verification' },
          { key: 'requirePhoneVerification', label: 'Require Phone Verification' },
          { key: 'autoApproveUsers', label: 'Auto Approve New Users' }
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              id={key}
              checked={settings.registration?.[key] || false}
              onChange={(e) => updateNestedSetting('userManagement', `registration.${key}`, e.target.checked)}
              className="h-4 w-4 text-[#53755d] focus:ring-[#53755d] border-gray-300 rounded"
            />
            <label htmlFor={key} className="ml-2 text-sm text-gray-700">{label}</label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Reporting Settings Component
const ReportingSettings = ({ settings = {}, updateSetting, updateNestedSetting }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">Data & Reporting Settings</h4>
    
    <div>
      <h5 className="text-md font-medium text-gray-800 mb-4">Analytics</h5>
      <div className="space-y-2">
        {[
          { key: 'enabled', label: 'Enable Analytics' },
          { key: 'trackUserBehavior', label: 'Track User Behavior' },
          { key: 'trackPageViews', label: 'Track Page Views' },
          { key: 'trackClicks', label: 'Track Clicks' }
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              id={key}
              checked={settings.analytics?.[key] || false}
              onChange={(e) => updateNestedSetting('reporting', `analytics.${key}`, e.target.checked)}
              className="h-4 w-4 text-[#53755d] focus:ring-[#53755d] border-gray-300 rounded"
            />
            <label htmlFor={key} className="ml-2 text-sm text-gray-700">{label}</label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Performance Settings Component
const PerformanceSettings = ({ settings = {}, updateSetting, updateNestedSetting }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">Performance Settings</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cache Duration (seconds)</label>
        <input
          type="number"
          value={settings.caching?.cacheDuration || 300}
          onChange={(e) => updateNestedSetting('performance', 'caching.cacheDuration', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Requests Per Minute</label>
        <input
          type="number"
          value={settings.rateLimiting?.requestsPerMinute || 100}
          onChange={(e) => updateNestedSetting('performance', 'rateLimiting.requestsPerMinute', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
        />
      </div>
    </div>
  </div>
);

// Integration Settings Component
const IntegrationSettings = ({ settings = {}, updateSetting, updateNestedSetting, showPassword, togglePassword }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">Integration Settings</h4>
    
    <div>
      <h5 className="text-md font-medium text-gray-800 mb-4">Payment Gateway</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
          <select
            value={settings.paymentGateway?.provider || 'razorpay'}
            onChange={(e) => updateNestedSetting('integrations', 'paymentGateway.provider', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
          >
            <option value="razorpay">Razorpay</option>
            <option value="payu">PayU</option>
            <option value="paytm">Paytm</option>
            <option value="stripe">Stripe</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
          <div className="relative">
            <input
              type={showPassword.apiKey ? 'text' : 'password'}
              value={settings.paymentGateway?.apiKey || ''}
              onChange={(e) => updateNestedSetting('integrations', 'paymentGateway.apiKey', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => togglePassword('apiKey')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword.apiKey ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Compliance Settings Component
const ComplianceSettings = ({ settings = {}, updateSetting, updateNestedSetting }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">Compliance Settings</h4>
    
    <div>
      <h5 className="text-md font-medium text-gray-800 mb-4">GDPR Compliance</h5>
      <div className="space-y-2">
        {[
          { key: 'enabled', label: 'Enable GDPR Compliance' },
          { key: 'cookieConsentRequired', label: 'Require Cookie Consent' },
          { key: 'rightToErasure', label: 'Enable Right to Erasure' }
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              id={key}
              checked={settings.gdpr?.[key] || false}
              onChange={(e) => updateNestedSetting('compliance', `gdpr.${key}`, e.target.checked)}
              className="h-4 w-4 text-[#53755d] focus:ring-[#53755d] border-gray-300 rounded"
            />
            <label htmlFor={key} className="ml-2 text-sm text-gray-700">{label}</label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Feature Settings Component
const FeatureSettings = ({ settings = {}, updateSetting, updateNestedSetting }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-gray-900">Feature Flags</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { key: 'blogSystem', label: 'Blog System' },
        { key: 'calculatorTools', label: 'Calculator Tools' },
        { key: 'portfolioTracking', label: 'Portfolio Tracking' },
        { key: 'goalPlanning', label: 'Goal Planning' },
        { key: 'roboAdvisor', label: 'Robo Advisor' },
        { key: 'socialFeatures', label: 'Social Features' },
        { key: 'mobileApp', label: 'Mobile App' },
        { key: 'apiAccess', label: 'API Access' }
      ].map(({ key, label }) => (
        <div key={key} className="flex items-center">
          <input
            type="checkbox"
            id={key}
            checked={settings[key] || false}
            onChange={(e) => updateSetting('features', key, e.target.checked)}
            className="h-4 w-4 text-[#53755d] focus:ring-[#53755d] border-gray-300 rounded"
          />
          <label htmlFor={key} className="ml-2 text-sm text-gray-700">{label}</label>
        </div>
      ))}
    </div>
  </div>
);

export default SettingsPanel;
