# OTP Implementation Guide

This guide provides a complete solution for implementing OTP (One-Time Password) verification with robust error handling, timeout management, and loading states.

## Features

✅ **Robust Error Handling** - Handles network errors, CORS issues, server failures, and timeouts  
✅ **Request Timeout** - 30-second timeout to prevent hanging requests  
✅ **Loading States** - Proper button disabling and loading indicators  
✅ **Retry Logic** - Configurable retry attempts with user feedback  
✅ **User-Friendly Messages** - Clear error messages for different failure scenarios  
✅ **React & Vue Support** - Examples for both frameworks  
✅ **Custom Hook** - Reusable `useOTP` hook for React applications  

## Files Overview

### Core Service
- `src/services/otpService.js` - Enhanced OTP service with timeout and error handling

### React Components
- `src/components/OTPVerificationExample.jsx` - Complete React component with all features
- `src/components/SimpleOTPForm.jsx` - Simplified React component using the custom hook
- `src/hooks/useOTP.js` - Custom React hook for OTP functionality

### Vue Component
- `src/components/OTPVerificationExample.vue` - Complete Vue component with all features

## Quick Start

### 1. Using the Enhanced OTP Service

```javascript
import { otpService } from './services/otpService';

// Send OTP
try {
  const result = await otpService.sendOTP('user@example.com', 'email', 'login');
  if (result.success) {
    console.log('OTP sent successfully');
  }
} catch (error) {
  console.error('Failed to send OTP:', error.message);
}

// Verify OTP
try {
  const result = await otpService.verifyOTP('user@example.com', '123456', 'email', 'login');
  if (result.success) {
    console.log('OTP verified successfully');
  }
} catch (error) {
  console.error('Failed to verify OTP:', error.message);
}
```

### 2. Using the React Hook

```jsx
import React, { useState } from 'react';
import { useOTP } from './hooks/useOTP';

const MyOTPComponent = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const {
    isLoading,
    error,
    success,
    otpSent,
    sendOTP,
    verifyOTP,
    reset
  } = useOTP({
    maxRetryAttempts: 3,
    onSuccess: (result) => {
      console.log('Login successful!', result);
      // Handle successful login
    }
  });

  const handleSendOTP = async () => {
    await sendOTP(email, 'email', 'login');
  };

  const handleVerifyOTP = async () => {
    await verifyOTP(email, otp, 'email', 'login');
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        placeholder="Enter email"
      />
      
      {!otpSent ? (
        <button onClick={handleSendOTP} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send OTP'}
        </button>
      ) : (
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={isLoading}
            placeholder="Enter OTP"
            maxLength="6"
          />
          <button onClick={handleVerifyOTP} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};
```

### 3. Using the Vue Component

```vue
<template>
  <div>
    <input
      v-model="email"
      type="email"
      :disabled="isLoading"
      placeholder="Enter email"
    />
    
    <button
      v-if="!otpSent"
      @click="handleSendOTP"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Sending...' : 'Send OTP' }}
    </button>
    
    <div v-else>
      <input
        v-model="otp"
        type="text"
        :disabled="isLoading"
        placeholder="Enter OTP"
        maxlength="6"
      />
      <button
        @click="handleVerifyOTP"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Verifying...' : 'Verify OTP' }}
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
  </div>
</template>

<script>
import { useOTP } from './hooks/useOTP';

export default {
  data() {
    return {
      email: '',
      otp: '',
      ...useOTP({
        maxRetryAttempts: 3,
        onSuccess: (result) => {
          console.log('Login successful!', result);
        }
      })
    };
  },
  methods: {
    async handleSendOTP() {
      await this.sendOTP(this.email, 'email', 'login');
    },
    async handleVerifyOTP() {
      await this.verifyOTP(this.email, this.otp, 'email', 'login');
    }
  }
};
</script>
```

## Error Handling

The implementation handles various error scenarios:

### Network Errors
- **Connection Issues**: "Network error: Unable to connect to server..."
- **CORS Issues**: "CORS error: Unable to connect to the server..."
- **Timeout**: "Request timed out. The server is taking too long to respond..."

### Server Errors
- **400 Bad Request**: Shows specific validation errors
- **429 Too Many Requests**: "Too many requests. Please wait a moment..."
- **500+ Server Errors**: "Server error. Please try again later..."

### Client Errors
- **Invalid Email**: "Please enter a valid email address"
- **Invalid OTP**: "OTP must be exactly 6 digits"
- **Max Retries**: "Maximum retry attempts reached. Please try again later."

## Configuration

### Timeout Settings
```javascript
// In otpService.js
const REQUEST_TIMEOUT = 30000; // 30 seconds
```

### Retry Settings
```javascript
// In useOTP hook
const {
  // ... other properties
} = useOTP({
  maxRetryAttempts: 3, // Maximum retry attempts
  onSuccess: (result) => { /* handle success */ },
  onError: (error, context) => { /* handle error */ },
  onOTPSent: (result) => { /* handle OTP sent */ }
});
```

## API Integration

The service integrates with your backend at `http://localhost:5000/api/auth/send-otp` and `http://localhost:5000/api/auth/verify-otp`.

### Expected Backend Response Format

**Send OTP Success:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresAt": "2024-01-01T12:00:00.000Z",
  "service": "email",
  "realDelivery": true
}
```

**Verify OTP Success:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Testing

### Test with Backend Down
1. Stop your backend server
2. Click "Send OTP"
3. Should show: "Network error: Unable to connect to server..."

### Test with Invalid Email
1. Enter invalid email format
2. Click "Send OTP"
3. Should show: "Please enter a valid email address"

### Test with Timeout
1. Set `REQUEST_TIMEOUT` to 1000ms (1 second)
2. Click "Send OTP"
3. Should show: "Request timed out. The server is taking too long to respond..."

### Test Retry Logic
1. Send OTP multiple times
2. After 3 attempts, should show: "Maximum retry attempts (3) reached..."

## Best Practices

1. **Always handle errors** - Use try-catch blocks or the hook's error handling
2. **Show loading states** - Disable buttons and show loading indicators
3. **Validate input** - Check email format and OTP length before sending
4. **Limit retries** - Prevent spam by limiting retry attempts
5. **Clear messages** - Clear error/success messages when user types
6. **Use timeouts** - Prevent hanging requests with reasonable timeouts
7. **Log errors** - Use console.error for debugging
8. **User feedback** - Provide clear, actionable error messages

## Troubleshooting

### Common Issues

**Request hangs indefinitely:**
- Check if backend is running
- Verify CORS configuration
- Check network connectivity

**CORS errors:**
- Ensure backend has proper CORS headers
- Check if frontend and backend are on different ports

**Timeout errors:**
- Increase `REQUEST_TIMEOUT` if needed
- Check backend response time
- Verify network speed

**OTP not received:**
- Check email service configuration
- Verify email address
- Check spam folder
- Look at backend logs

## Support

For issues or questions:
1. Check the browser console for error logs
2. Verify backend server is running
3. Check network connectivity
4. Review the error messages for specific guidance
