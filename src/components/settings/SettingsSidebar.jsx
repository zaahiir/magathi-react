import React from 'react';
import { 
  FaGlobe, FaShieldAlt, FaBell, FaCreditCard, FaUsers, 
  FaChartLine, FaDatabase, FaCog, FaFileAlt, FaLock 
} from 'react-icons/fa';

const SettingsSidebar = ({ activeCategory, onCategoryChange, hasChanges = {} }) => {
  const categories = [
    { 
      id: 'general', 
      name: 'General', 
      icon: FaGlobe, 
      color: 'blue', 
      badge: null,
      description: 'Basic site configuration'
    },
    { 
      id: 'security', 
      name: 'Security', 
      icon: FaShieldAlt, 
      color: 'red', 
      badge: 'Critical',
      description: 'Password policies and authentication'
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: FaBell, 
      color: 'green', 
      badge: null,
      description: 'Email and alert settings'
    },
    { 
      id: 'investment', 
      name: 'Investment', 
      icon: FaCreditCard, 
      color: 'purple', 
      badge: null,
      description: 'Investment limits and KYC'
    },
    { 
      id: 'userManagement', 
      name: 'User Management', 
      icon: FaUsers, 
      color: 'indigo', 
      badge: null,
      description: 'Registration and user policies'
    },
    { 
      id: 'reporting', 
      name: 'Data & Reporting', 
      icon: FaChartLine, 
      color: 'yellow', 
      badge: null,
      description: 'Analytics and tracking'
    },
    { 
      id: 'performance', 
      name: 'Performance', 
      icon: FaDatabase, 
      color: 'pink', 
      badge: null,
      description: 'Caching and optimization'
    },
    { 
      id: 'integrations', 
      name: 'Integrations', 
      icon: FaCog, 
      color: 'gray', 
      badge: 'API',
      description: 'Third-party integrations'
    },
    { 
      id: 'compliance', 
      name: 'Compliance', 
      icon: FaFileAlt, 
      color: 'orange', 
      badge: 'Legal',
      description: 'GDPR and legal compliance'
    },
    { 
      id: 'features', 
      name: 'Features', 
      icon: FaLock, 
      color: 'teal', 
      badge: null,
      description: 'Feature flags and toggles'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900">Settings Categories</h4>
        <p className="text-xs text-gray-500 mt-1">Configure different aspects of your application</p>
      </div>
      
      <nav className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          const hasUnsavedChanges = hasChanges[category.id];
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-[#53755d] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={category.description}
            >
              <div className="flex items-center min-w-0 flex-1">
                <Icon className={`h-4 w-4 mr-3 flex-shrink-0 ${
                  isActive ? 'text-white' : `text-${category.color}-500`
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center">
                    <span className="font-medium truncate">{category.name}</span>
                    {hasUnsavedChanges && (
                      <div className="ml-2 w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              </div>
              
              {category.badge && (
                <span className={`px-2 py-0.5 text-xs rounded-full ml-2 flex-shrink-0 ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      {/* Help Section */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p className="mb-2">
            <strong>Tip:</strong> Changes are saved automatically when you switch categories.
          </p>
          <p>
            Use the <strong>Reset</strong> button to restore default values.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
