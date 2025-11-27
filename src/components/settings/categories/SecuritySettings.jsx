import React from 'react';
import FormField from '../shared/FormField';
import { getFieldValidation } from '../../../utils/validation';

const SecuritySettings = ({ settings = {}, updateSetting, updateNestedSetting }) => {
  const handleFieldChange = (field, value) => {
    updateSetting('security', field, value);
  };

  const handleNestedFieldChange = (fieldPath, value) => {
    updateNestedSetting('security', fieldPath, value);
  };

  return (
    <div className="space-y-8">
      {/* Password Policy */}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Minimum Password Length"
              type="number"
              value={settings.passwordPolicy?.minLength || 8}
              onChange={(value) => handleNestedFieldChange('passwordPolicy.minLength', parseInt(value))}
              validation={getFieldValidation('passwordMinLength')}
              placeholder="8"
              helpText="Minimum number of characters required"
            />
            
            <FormField
              label="Maximum Login Attempts"
              type="number"
              value={settings.passwordPolicy?.maxAttempts || 5}
              onChange={(value) => handleNestedFieldChange('passwordPolicy.maxAttempts', parseInt(value))}
              validation={getFieldValidation('maxLoginAttempts')}
              placeholder="5"
              helpText="Number of failed attempts before account lockout"
            />
          </div>
        </div>

        {/* Password Requirements */}
        <div className="space-y-4">
          <h5 className="text-md font-medium text-gray-800">Password Requirements</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'requireUppercase', label: 'Require Uppercase Letters', description: 'At least one uppercase letter (A-Z)' },
              { key: 'requireLowercase', label: 'Require Lowercase Letters', description: 'At least one lowercase letter (a-z)' },
              { key: 'requireNumbers', label: 'Require Numbers', description: 'At least one number (0-9)' },
              { key: 'requireSpecialChars', label: 'Require Special Characters', description: 'At least one special character (!@#$%^&*)' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id={key}
                  checked={settings.passwordPolicy?.[key] || false}
                  onChange={(e) => handleNestedFieldChange(`passwordPolicy.${key}`, e.target.checked)}
                  className="h-4 w-4 text-[#53755d] focus:ring-[#53755d] border-gray-300 rounded mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor={key} className="text-sm font-medium text-gray-900 cursor-pointer">
                    {label}
                  </label>
                  <p className="text-xs text-gray-600 mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Enable 2FA</h5>
              <p className="text-sm text-gray-600">
                Require two-factor authentication for enhanced security
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth?.enabled || false}
                onChange={(e) => handleNestedFieldChange('twoFactorAuth.enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#53755d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#53755d]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Required for Administrators</h5>
              <p className="text-sm text-gray-600">
                Force all administrators to use two-factor authentication
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth?.requiredForAdmins || false}
                onChange={(e) => handleNestedFieldChange('twoFactorAuth.requiredForAdmins', e.target.checked)}
                className="sr-only peer"
                disabled={!settings.twoFactorAuth?.enabled}
              />
              <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#53755d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#53755d] ${
                !settings.twoFactorAuth?.enabled ? 'bg-gray-100' : 'bg-gray-200'
              }`}></div>
            </label>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900">Session Management</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Session Timeout (minutes)"
            type="number"
            value={settings.sessionTimeout || 30}
            onChange={(value) => handleFieldChange('sessionTimeout', parseInt(value))}
            validation={{ min: 5, max: 1440, message: 'Session timeout must be between 5 and 1440 minutes' }}
            placeholder="30"
            helpText="How long before users are automatically logged out"
          />
          
          <FormField
            label="Remember Me Duration (days)"
            type="number"
            value={settings.rememberMeDuration || 7}
            onChange={(value) => handleFieldChange('rememberMeDuration', parseInt(value))}
            validation={{ min: 1, max: 365, message: 'Remember me duration must be between 1 and 365 days' }}
            placeholder="7"
            helpText="How long to keep users logged in with 'Remember Me'"
          />
        </div>
      </div>

      {/* IP Restrictions */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900">IP Restrictions</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Enable IP Whitelist</h5>
              <p className="text-sm text-gray-600">
                Restrict admin access to specific IP addresses
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.ipWhitelist?.enabled || false}
                onChange={(e) => handleNestedFieldChange('ipWhitelist.enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#53755d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#53755d]"></div>
            </label>
          </div>

          {settings.ipWhitelist?.enabled && (
            <FormField
              label="Allowed IP Addresses"
              type="textarea"
              value={settings.ipWhitelist?.addresses?.join('\n') || ''}
              onChange={(value) => handleNestedFieldChange('ipWhitelist.addresses', value.split('\n').filter(ip => ip.trim()))}
              placeholder="192.168.1.1&#10;10.0.0.1&#10;203.0.113.1"
              helpText="Enter one IP address per line"
            />
          )}
        </div>
      </div>

      {/* Security Headers */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900">Security Headers</h4>
        
        <div className="space-y-4">
          {[
            { key: 'enableHSTS', label: 'Enable HSTS', description: 'HTTP Strict Transport Security' },
            { key: 'enableCSP', label: 'Enable CSP', description: 'Content Security Policy' },
            { key: 'enableXFrameOptions', label: 'Enable X-Frame-Options', description: 'Prevent clickjacking attacks' },
            { key: 'enableXSSProtection', label: 'Enable XSS Protection', description: 'Cross-site scripting protection' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h5 className="text-sm font-medium text-gray-900">{label}</h5>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.securityHeaders?.[key] || false}
                  onChange={(e) => handleNestedFieldChange(`securityHeaders.${key}`, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#53755d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#53755d]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
