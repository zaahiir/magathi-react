# Firebase Setup Guide

## Current Status
✅ **Backend SMS service is working** - OTPs are being generated and shown in console
⚠️ **Firebase is using demo configuration** - This is why you see the warning

## Quick Fix (Recommended)
The SMS OTP is already working through the backend service. The warning is just informational.

## To Enable Real Firebase OTP (Optional)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Follow the setup wizard

### Step 2: Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Phone" provider
5. Add your domain to authorized domains

### Step 3: Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register your app
5. Copy the config object

### Step 4: Create .env file
Create a `.env` file in the `my-project` directory with:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Backend API URL
VITE_API_URL=http://localhost:5000
```

### Step 5: Restart the app
```bash
npm run dev
```

## Current Working Solution
The SMS OTP is already working through the backend service. You can:

1. **Test the OTP flow** - It will show OTP in the backend console
2. **Use the OTP** - Enter the OTP shown in console to verify
3. **No real SMS needed** - For development, console OTP is sufficient

## Testing
1. Start backend: `cd backend && npm start`
2. Start frontend: `cd my-project && npm run dev`
3. Try phone OTP - check backend console for the OTP
4. Enter the OTP in the frontend to complete verification

## Troubleshooting
- If you see the warning, it's normal - the backend SMS service is working
- Check backend console for OTP when testing
- Make sure both backend and frontend are running
