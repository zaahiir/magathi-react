import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

class FirebaseOTPService {
  constructor() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }

  // Initialize reCAPTCHA verifier
  initializeRecaptcha(containerId = 'recaptcha-container') {
    try {
      // Clear any existing verifier
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
      }
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      // Create new verifier
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
      
      window.recaptchaVerifier = this.recaptchaVerifier;
      return this.recaptchaVerifier;
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      throw error;
    }
  }

  // Send OTP to phone number
  async sendOTPToPhone(phoneNumber) {
    try {
      console.log('📱 Sending OTP to phone:', phoneNumber);
      
      // Check if using demo configuration or invalid API key
      const isDemoConfig = auth.app.options.apiKey === "demo-api-key" || 
                          auth.app.options.apiKey === "your-firebase-api-key" ||
                          !auth.app.options.apiKey ||
                          auth.app.options.apiKey.length < 20;
      
      if (isDemoConfig) {
        console.warn('⚠️ Demo/Invalid Firebase configuration detected. Using backend SMS service for real delivery.');
        
        // Use backend SMS service for real OTP delivery
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/send-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              identifier: phoneNumber,
              type: 'phone',
              purpose: 'login'
            })
          });
          
          const result = await response.json();
          
          if (result.message) {
            console.log('✅ Backend SMS OTP sent successfully');
            console.log('📱 Check your phone for the SMS');
            
            // Store phone for verification
            this.demoPhone = phoneNumber;
            
            return {
              success: true,
              message: 'OTP sent to your phone number via SMS',
              verificationId: 'backend-sms-verification',
              backendSMS: true
            };
          } else {
            throw new Error(result.message || 'Failed to send SMS');
          }
        } catch (backendError) {
          console.error('❌ Backend SMS failed:', backendError);
          
          // Fallback to demo OTP
          const demoOTP = Math.floor(100000 + Math.random() * 900000).toString();
          console.log('📱 FALLBACK DEMO SMS OTP:');
          console.log('═══════════════════════════════════════');
          console.log(`📱 To: ${phoneNumber}`);
          console.log(`🔑 OTP: ${demoOTP}`);
          console.log(`⏰ Valid for: 10 minutes`);
          console.log('═══════════════════════════════════════');
          
          this.demoOTP = demoOTP;
          this.demoPhone = phoneNumber;
          
          return {
            success: true,
            message: 'Demo OTP generated (check console for OTP)',
            verificationId: 'demo-verification-id',
            demoOTP: demoOTP
          };
        }
      }
      
      // Format phone number (add country code if not present)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      // Ensure we have a clean reCAPTCHA verifier
      this.initializeRecaptcha();

      // Wait a bit for reCAPTCHA to initialize
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send OTP via Firebase Auth
      this.confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, this.recaptchaVerifier);
      
      console.log('✅ Firebase OTP sent successfully');
      console.log('📱 Check your phone for the SMS from Firebase');
      return {
        success: true,
        message: 'OTP sent to your phone number via Firebase SMS',
        verificationId: this.confirmationResult.verificationId
      };
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      
      // Check if it's an API key error and skip Firebase fallback
      if (error.code === 'auth/api-key-not-valid' || 
          error.message?.includes('api-key-not-valid') ||
          error.message?.includes('invalid-api-key')) {
        console.log('🔄 Invalid Firebase API key detected. Using backend SMS service...');
        
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/send-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              identifier: phoneNumber,
              type: 'phone',
              purpose: 'login'
            })
          });
          
          const result = await response.json();
          
          if (result.message) {
            console.log('✅ Backend SMS service successful');
            this.demoPhone = phoneNumber;
            
            return {
              success: true,
              message: 'OTP sent to your phone number via SMS',
              verificationId: 'backend-sms-service',
              backendSMS: true
            };
          }
        } catch (backendError) {
          console.error('❌ Backend SMS service failed:', backendError);
        }
      } else {
        // Try backend SMS as fallback for other errors
        try {
          console.log('🔄 Trying backend SMS service as fallback...');
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/send-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              identifier: phoneNumber,
              type: 'phone',
              purpose: 'login'
            })
          });
          
          const result = await response.json();
          
          if (result.message) {
            console.log('✅ Backend SMS fallback successful');
            this.demoPhone = phoneNumber;
            
            return {
              success: true,
              message: 'OTP sent to your phone number via SMS (fallback)',
              verificationId: 'backend-sms-fallback',
              backendSMS: true
            };
          }
        } catch (fallbackError) {
          console.error('❌ Backend SMS fallback also failed:', fallbackError);
        }
      }
      
      // Handle specific Firebase errors
      let errorMessage = 'Failed to send OTP';
      
      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = 'Invalid phone number format. Please enter a valid 10-digit Indian mobile number';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please wait 5 minutes before trying again';
          break;
        case 'auth/quota-exceeded':
          errorMessage = 'SMS quota exceeded. Please try again later or contact support';
          break;
        case 'auth/captcha-check-failed':
          errorMessage = 'reCAPTCHA verification failed. Please refresh the page and try again';
          break;
        case 'auth/invalid-app-credential':
          errorMessage = 'Invalid app credentials. Please contact support';
          break;
        case 'auth/argument-error':
          errorMessage = 'reCAPTCHA not properly initialized. Please refresh the page and try again';
          break;
        case 'auth/missing-app-credential':
          errorMessage = 'Firebase configuration missing. Please contact support';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection and try again';
          break;
        default:
          errorMessage = error.message || 'Failed to send OTP. Please try again';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error
      };
    }
  }

  // Verify OTP code
  async verifyOTP(otpCode) {
    try {
      console.log('🔐 Verifying OTP:', otpCode);
      
      // Check if using demo configuration or backend SMS
      const isDemoConfig = auth.app.options.apiKey === "demo-api-key" || 
                          auth.app.options.apiKey === "your-firebase-api-key" ||
                          !auth.app.options.apiKey ||
                          auth.app.options.apiKey.length < 20;
      
      if (isDemoConfig || this.demoPhone) {
        // Try backend verification first
        if (this.demoPhone) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/verify-otp`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                identifier: this.demoPhone,
                otp: otpCode,
                type: 'phone',
                purpose: 'login'
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              console.log('✅ Backend OTP verification successful');
              
              // Create user profile
              const userProfile = {
                id: 'user-' + Date.now(),
                email: '',
                phone: this.demoPhone,
                displayName: 'User',
                firstName: 'User',
                lastName: '',
                emailVerified: false,
                phoneVerified: true,
                isAdmin: false,
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString()
              };
              
              return {
                success: true,
                message: 'OTP verified successfully',
                user: userProfile,
                token: 'backend-token-' + Date.now()
              };
            } else {
              return {
                success: false,
                message: result.message || 'Invalid OTP code',
                error: 'Invalid OTP'
              };
            }
          } catch (backendError) {
            console.error('❌ Backend verification failed:', backendError);
            // Fall through to demo verification
          }
        }
        
        // Fallback to demo verification
        if (this.demoOTP && otpCode === this.demoOTP) {
          console.log('✅ Demo OTP verified successfully');
          
          // Create a demo user profile
          const userProfile = {
            id: 'demo-user-' + Date.now(),
            email: '',
            phone: this.demoPhone,
            displayName: 'Demo User',
            firstName: 'Demo',
            lastName: 'User',
            emailVerified: false,
            phoneVerified: true,
            isAdmin: false,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };
          
          return {
            success: true,
            message: 'Demo OTP verified successfully',
            user: userProfile,
            token: 'demo-token-' + Date.now()
          };
        } else {
          return {
            success: false,
            message: 'Invalid OTP code. Please check and try again.',
            error: 'Invalid OTP'
          };
        }
      }
      
      if (!this.confirmationResult) {
        throw new Error('No OTP session found. Please request OTP again.');
      }

      // Verify the OTP
      const result = await this.confirmationResult.confirm(otpCode);
      const user = result.user;
      
      console.log('✅ OTP verified successfully');
      
      // Get or create user profile in Firestore
      const userProfile = await this.getOrCreateUserProfile(user);
      
      return {
        success: true,
        message: 'OTP verified successfully',
        user: userProfile,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      
      let errorMessage = 'Failed to verify OTP';
      
      switch (error.code) {
        case 'auth/invalid-verification-code':
          errorMessage = 'Invalid OTP code';
          break;
        case 'auth/code-expired':
          errorMessage = 'OTP code has expired. Please request a new one';
          break;
        case 'auth/invalid-verification-id':
          errorMessage = 'Invalid verification session. Please request OTP again';
          break;
        default:
          errorMessage = error.message || 'Failed to verify OTP';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error
      };
    }
  }

  // Send OTP to email
  async sendOTPToEmail(email) {
    try {
      console.log('📧 Sending OTP to email:', email);
      
      // For email, we'll use email verification
      // First check if user exists
      let user;
      try {
        // Try to sign in with email (this will work if user exists)
        const result = await signInWithEmailAndPassword(auth, email, 'temp-password');
        user = result.user;
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          // User doesn't exist, create a temporary account
          const tempPassword = Math.random().toString(36).slice(-8);
          const result = await createUserWithEmailAndPassword(auth, email, tempPassword);
          user = result.user;
        } else if (error.code === 'auth/wrong-password') {
          // User exists but wrong password, send verification email
          user = error.user;
        } else {
          throw error;
        }
      }

      // Send email verification
      await sendEmailVerification(user);
      
      console.log('✅ Email verification sent successfully');
      return {
        success: true,
        message: 'Verification email sent to your email address',
        user: user
      };
    } catch (error) {
      console.error('❌ Error sending email verification:', error);
      
      let errorMessage = 'Failed to send verification email';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        default:
          errorMessage = error.message || 'Failed to send verification email';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error
      };
    }
  }

  // Get or create user profile in Firestore
  async getOrCreateUserProfile(firebaseUser) {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        // User exists, return their profile
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
          phoneVerified: !!firebaseUser.phoneNumber,
          ...userSnap.data()
        };
      } else {
        // Create new user profile
        const userProfile = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber,
          displayName: firebaseUser.displayName || 'User',
          firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          emailVerified: firebaseUser.emailVerified,
          phoneVerified: !!firebaseUser.phoneNumber,
          isAdmin: false,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        
        await setDoc(userRef, userProfile);
        return userProfile;
      }
    } catch (error) {
      console.error('Error getting/creating user profile:', error);
      // Return basic user info if Firestore fails
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        phone: firebaseUser.phoneNumber,
        displayName: firebaseUser.displayName || 'User',
        firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
        emailVerified: firebaseUser.emailVerified,
        phoneVerified: !!firebaseUser.phoneNumber,
        isAdmin: false
      };
    }
  }

  // Update user profile
  async updateUserProfile(uid, profileData) {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, profileData, { merge: true });
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  }

  // Sign out
  async signOut() {
    try {
      await auth.signOut();
      this.confirmationResult = null;
      this.recaptchaVerifier = null;
      return { success: true, message: 'Signed out successfully' };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, message: 'Failed to sign out' };
    }
  }

  // Clean up reCAPTCHA
  cleanup() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  }
}

// Create and export a singleton instance
export const firebaseOTPService = new FirebaseOTPService();
export default firebaseOTPService;
