import React from 'react';
import FormField from '../shared/FormField';
import { getFieldValidation } from '../../../utils/validation';

const GeneralSettings = ({ settings = {}, updateSetting, updateNestedSetting }) => {
  const handleFieldChange = (field, value) => {
    updateSetting('general', field, value);
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Site Name"
              value={settings.siteName || ''}
              onChange={(value) => handleFieldChange('siteName', value)}
              validation={getFieldValidation('siteName')}
              placeholder="Enter your site name"
              required
            />
            
            <FormField
              label="Contact Email"
              type="email"
              value={settings.contactEmail || ''}
              onChange={(value) => handleFieldChange('contactEmail', value)}
              validation={getFieldValidation('contactEmail')}
              placeholder="contact@example.com"
              required
            />
            
            <FormField
              label="Contact Phone"
              type="tel"
              value={settings.contactPhone || ''}
              onChange={(value) => handleFieldChange('contactPhone', value)}
              validation={getFieldValidation('contactPhone')}
              placeholder="+91 9876543210"
              required
            />
            
            <FormField
              label="Currency"
              type="select"
              value={settings.currency || 'INR'}
              onChange={(value) => handleFieldChange('currency', value)}
              validation={{
                options: [
                  { value: 'INR', label: 'INR (₹)' },
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'GBP', label: 'GBP (£)' }
                ]
              }}
            />
            
            <FormField
              label="Timezone"
              type="select"
              value={settings.timezone || 'Asia/Kolkata'}
              onChange={(value) => handleFieldChange('timezone', value)}
              validation={{
                options: [
                  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                  { value: 'UTC', label: 'UTC' },
                  { value: 'America/New_York', label: 'America/New_York (EST)' },
                  { value: 'Europe/London', label: 'Europe/London (GMT)' },
                  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' }
                ]
              }}
            />
          </div>
        </div>

        {/* Site Description */}
        <FormField
          label="Site Description"
          type="textarea"
          value={settings.siteDescription || ''}
          onChange={(value) => handleFieldChange('siteDescription', value)}
          validation={getFieldValidation('siteDescription')}
          placeholder="Describe your website and services..."
          helpText="This description will be used in search engines and social media previews"
        />
      </div>

      {/* System Settings */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900">System Settings</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Maintenance Mode</h5>
              <p className="text-sm text-gray-600">
                Enable maintenance mode to temporarily disable public access
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode || false}
                onChange={(e) => handleFieldChange('maintenanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#53755d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#53755d]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Debug Mode</h5>
              <p className="text-sm text-gray-600">
                Enable debug mode for development and troubleshooting
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.debugMode || false}
                onChange={(e) => handleFieldChange('debugMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#53755d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#53755d]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Auto-save Settings</h5>
              <p className="text-sm text-gray-600">
                Automatically save changes when switching between categories
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave || true}
                onChange={(e) => handleFieldChange('autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#53755d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#53755d]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900">Social Media Links</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Facebook URL"
            type="url"
            value={settings.socialMedia?.facebook || ''}
            onChange={(value) => updateNestedSetting('general', 'socialMedia.facebook', value)}
            validation={getFieldValidation('facebookUrl')}
            placeholder="https://facebook.com/yourpage"
            helpText="Your Facebook page URL"
          />
          
          <FormField
            label="Twitter URL"
            type="url"
            value={settings.socialMedia?.twitter || ''}
            onChange={(value) => updateNestedSetting('general', 'socialMedia.twitter', value)}
            validation={getFieldValidation('twitterUrl')}
            placeholder="https://twitter.com/yourhandle"
            helpText="Your Twitter profile URL"
          />
          
          <FormField
            label="LinkedIn URL"
            type="url"
            value={settings.socialMedia?.linkedin || ''}
            onChange={(value) => updateNestedSetting('general', 'socialMedia.linkedin', value)}
            validation={getFieldValidation('linkedinUrl')}
            placeholder="https://linkedin.com/company/yourcompany"
            helpText="Your LinkedIn company page URL"
          />
          
          <FormField
            label="Instagram URL"
            type="url"
            value={settings.socialMedia?.instagram || ''}
            onChange={(value) => updateNestedSetting('general', 'socialMedia.instagram', value)}
            validation={getFieldValidation('instagramUrl')}
            placeholder="https://instagram.com/yourhandle"
            helpText="Your Instagram profile URL"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
