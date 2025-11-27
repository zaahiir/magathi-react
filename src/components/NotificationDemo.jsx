import React, { useState } from 'react';
import NotificationService from '../services/notificationService';
import { FaBell, FaUser, FaIdCard, FaEnvelope, FaPlus } from 'react-icons/fa';

const NotificationDemo = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createTestNotification = async (type) => {
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('adminToken');
      
      const notificationData = {
        type: type,
        title: getNotificationTitle(type),
        message: getNotificationMessage(type),
        priority: 'medium',
        data: {
          timestamp: new Date().toISOString(),
          source: 'admin_demo'
        }
      };

      await NotificationService.createNotification(notificationData, token);
      setMessage(`✅ ${type} notification created successfully!`);
    } catch (error) {
      console.error('Error creating notification:', error);
      setMessage(`❌ Error creating notification: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case 'user_registration':
        return 'New User Registration';
      case 'plan_subscription':
        return 'New Plan Subscription';
      case 'contact_enquiry':
        return 'New Contact Enquiry';
      case 'payment_received':
        return 'Payment Received';
      default:
        return 'New Notification';
    }
  };

  const getNotificationMessage = (type) => {
    switch (type) {
      case 'user_registration':
        return 'A new user has registered on the platform';
      case 'plan_subscription':
        return 'A user has subscribed to a mutual fund plan';
      case 'contact_enquiry':
        return 'A new contact form has been submitted';
      case 'payment_received':
        return 'A payment has been received for a subscription';
      default:
        return 'A new notification has been generated';
    }
  };

  const notificationTypes = [
    { type: 'user_registration', label: 'User Registration', icon: FaUser, color: 'blue' },
    { type: 'plan_subscription', label: 'Plan Subscription', icon: FaIdCard, color: 'green' },
    { type: 'contact_enquiry', label: 'Contact Enquiry', icon: FaEnvelope, color: 'orange' },
    { type: 'payment_received', label: 'Payment Received', icon: FaBell, color: 'purple' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-[#53755d] rounded-lg">
          <FaBell className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notification Demo</h3>
          <p className="text-sm text-gray-500">Create test notifications to see the bell icon in action</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {notificationTypes.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => createTestNotification(type)}
            disabled={loading}
            className={`flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              color === 'blue' ? 'hover:border-blue-300' :
              color === 'green' ? 'hover:border-green-300' :
              color === 'orange' ? 'hover:border-orange-300' :
              'hover:border-purple-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              color === 'blue' ? 'bg-blue-100' :
              color === 'green' ? 'bg-green-100' :
              color === 'orange' ? 'bg-orange-100' :
              'bg-purple-100'
            }`}>
              <Icon className={`h-4 w-4 ${
                color === 'blue' ? 'text-blue-600' :
                color === 'green' ? 'text-green-600' :
                color === 'orange' ? 'text-orange-600' :
                'text-purple-600'
              }`} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">Click to create notification</p>
            </div>
            <FaPlus className="h-4 w-4 text-gray-400 ml-auto" />
          </button>
        ))}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">How to test:</h4>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Click any notification type above to create a test notification</li>
          <li>2. Look at the bell icon in the top-right corner - it should show a red badge</li>
          <li>3. Click the bell icon to see the notification dropdown</li>
          <li>4. Click on notifications to mark them as read</li>
          <li>5. The red badge will disappear when all notifications are read</li>
        </ol>
      </div>
    </div>
  );
};

export default NotificationDemo;
