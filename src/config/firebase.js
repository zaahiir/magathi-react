import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo"
};

// Check if using demo configuration
const isDemoConfig = firebaseConfig.apiKey === "demo-api-key" || 
                    firebaseConfig.apiKey === "your-firebase-api-key" ||
                    !import.meta.env.VITE_FIREBASE_API_KEY;

if (isDemoConfig) {
  console.log('📱 Using backend SMS service for OTP delivery');
  console.log('✅ SMS OTPs will be sent via backend service');
  console.log('📝 To enable Firebase OTP, create a .env file with real Firebase credentials');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Note: Using production Firebase services for real OTP delivery
// For development, ensure Firebase project is properly configured

export default app;
