// Demo OTP Service for testing without Firebase
class DemoOTPService {
  constructor() {
    this.otpStorage = new Map(); // Store OTPs temporarily
    this.verificationAttempts = new Map(); // Track verification attempts
  }

  // Generate a random 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP to phone number (demo)
  async sendOTPToPhone(phoneNumber) {
    try {
      console.log('📱 [DEMO] Sending OTP to phone:', phoneNumber);
      
      // Validate phone number format
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return {
          success: false,
          message: 'Invalid phone number format. Use 10-digit number starting with 6-9'
        };
      }

      // Generate OTP
      const otp = this.generateOTP();
      
      // Store OTP with expiration (5 minutes)
      this.otpStorage.set(phoneNumber, {
        otp: otp,
        timestamp: Date.now(),
        expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
      });

      // Reset verification attempts
      this.verificationAttempts.set(phoneNumber, 0);

      console.log('✅ [DEMO] OTP sent successfully:', otp);
      
      return {
        success: true,
        message: `OTP sent to +91${phoneNumber}. Demo OTP: ${otp}`,
        verificationId: `demo_${Date.now()}`,
        demoOTP: otp // Include OTP for demo purposes
      };
    } catch (error) {
      console.error('❌ [DEMO] Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP',
        error: error
      };
    }
  }

  // Send OTP to email (demo)
  async sendOTPToEmail(email) {
    try {
      console.log('📧 [DEMO] Sending OTP to email:', email);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Invalid email format'
        };
      }

      // Generate OTP
      const otp = this.generateOTP();
      
      // Store OTP with expiration (5 minutes)
      this.otpStorage.set(email, {
        otp: otp,
        timestamp: Date.now(),
        expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
      });

      // Reset verification attempts
      this.verificationAttempts.set(email, 0);

      console.log('✅ [DEMO] OTP sent successfully:', otp);
      
      return {
        success: true,
        message: `OTP sent to ${email}. Demo OTP: ${otp}`,
        verificationId: `demo_${Date.now()}`,
        demoOTP: otp // Include OTP for demo purposes
      };
    } catch (error) {
      console.error('❌ [DEMO] Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP',
        error: error
      };
    }
  }

  // Verify OTP
  async verifyOTP(otpCode, identifier) {
    try {
      console.log('🔐 [DEMO] Verifying OTP:', otpCode, 'for:', identifier);
      
      // Check if OTP exists
      const otpData = this.otpStorage.get(identifier);
      if (!otpData) {
        return {
          success: false,
          message: 'No OTP found for this number/email. Please request a new OTP.'
        };
      }

      // Check if OTP has expired
      if (Date.now() > otpData.expiresAt) {
        this.otpStorage.delete(identifier);
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.'
        };
      }

      // Check verification attempts
      const attempts = this.verificationAttempts.get(identifier) || 0;
      if (attempts >= 3) {
        return {
          success: false,
          message: 'Too many verification attempts. Please request a new OTP.'
        };
      }

      // Verify OTP
      if (otpCode === otpData.otp) {
        // Clear OTP after successful verification
        this.otpStorage.delete(identifier);
        this.verificationAttempts.delete(identifier);
        
        console.log('✅ [DEMO] OTP verified successfully');
        
        return {
          success: true,
          message: 'OTP verified successfully',
          user: {
            id: `demo_${Date.now()}`,
            phone: identifier.includes('@') ? null : identifier,
            email: identifier.includes('@') ? identifier : null,
            displayName: identifier.includes('@') ? identifier.split('@')[0] : `User${identifier.slice(-4)}`,
            firstName: identifier.includes('@') ? identifier.split('@')[0] : `User${identifier.slice(-4)}`,
            lastName: '',
            emailVerified: identifier.includes('@'),
            phoneVerified: !identifier.includes('@'),
            isAdmin: false,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          },
          token: `demo_token_${Date.now()}`
        };
      } else {
        // Increment verification attempts
        this.verificationAttempts.set(identifier, attempts + 1);
        
        return {
          success: false,
          message: `Invalid OTP. ${2 - attempts} attempts remaining.`
        };
      }
    } catch (error) {
      console.error('❌ [DEMO] Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP',
        error: error
      };
    }
  }

  // Clean up expired OTPs
  cleanup() {
    const now = Date.now();
    for (const [identifier, otpData] of this.otpStorage.entries()) {
      if (now > otpData.expiresAt) {
        this.otpStorage.delete(identifier);
        this.verificationAttempts.delete(identifier);
      }
    }
  }

  // Get demo OTP for display
  getDemoOTP(identifier) {
    const otpData = this.otpStorage.get(identifier);
    return otpData ? otpData.otp : null;
  }
}

// Create and export a singleton instance
export const demoOTPService = new DemoOTPService();
export default demoOTPService;
