import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthTest = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Authentication Test</h3>
        <p>Please login to test authentication features.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Authentication Test</h3>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Current User Info:</h4>
        <div className="bg-white p-3 rounded border">
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
          <p><strong>Auth Provider:</strong> {user.authProvider || 'local'}</p>
          <p><strong>Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}</p>
          <p><strong>Phone Verified:</strong> {user.isPhoneVerified ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default AuthTest;

