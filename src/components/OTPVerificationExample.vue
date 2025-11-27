<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center mb-6">OTP Verification</h2>
    
    <!-- Email Input Section -->
    <div class="mb-4">
      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
        Email Address
      </label>
      <input
        type="email"
        id="email"
        v-model="email"
        @input="clearMessages"
        :disabled="isLoading || isResending"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder="Enter your email address"
      />
    </div>

    <!-- Send OTP Button -->
    <button
      v-if="!otpSent"
      @click="handleSendOTP"
      :disabled="isLoading || !email.trim() || retryCount >= MAX_RETRY_ATTEMPTS"
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
    >
      <span v-if="isLoading" class="flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending OTP...
      </span>
      <span v-else>Send OTP</span>
    </button>

    <!-- OTP Input Section -->
    <div v-if="otpSent" class="mb-4">
      <label for="otp" class="block text-sm font-medium text-gray-700 mb-2">
        Enter OTP (6 digits)
      </label>
      <input
        type="text"
        id="otp"
        v-model="otp"
        @input="clearMessages"
        :disabled="isLoading || isResending"
        maxlength="6"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-center text-lg tracking-widest"
        placeholder="000000"
      />
    </div>

    <!-- Action Buttons -->
    <div v-if="otpSent" class="space-y-2">
      <button
        @click="handleVerifyOTP"
        :disabled="isLoading || !otp.trim() || otp.length !== 6"
        class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
      >
        <span v-if="isLoading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verifying...
        </span>
        <span v-else>Verify OTP</span>
      </button>

      <div class="flex space-x-2">
        <button
          @click="handleResendOTP"
          :disabled="isResending || isLoading || retryCount >= MAX_RETRY_ATTEMPTS"
          class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        >
          <span v-if="isResending" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Resending...
          </span>
          <span v-else>Resend OTP</span>
        </button>

        <button
          @click="handleReset"
          :disabled="isLoading || isResending"
          class="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Retry Counter -->
    <div v-if="retryCount > 0" class="text-sm text-gray-600 text-center mt-2">
      Attempts: {{ retryCount }}/{{ MAX_RETRY_ATTEMPTS }}
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="success" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm">{{ success }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { otpService } from '../services/otpService';

export default {
  name: 'OTPVerificationExample',
  data() {
    return {
      email: '',
      otp: '',
      isLoading: false,
      error: '',
      success: '',
      otpSent: false,
      retryCount: 0,
      isResending: false,
      MAX_RETRY_ATTEMPTS: 3
    };
  },
  methods: {
    // Clear all messages
    clearMessages() {
      this.error = '';
      this.success = '';
    },

    // Send OTP with proper error handling
    async handleSendOTP() {
      // Validation
      if (!this.email.trim()) {
        this.error = 'Please enter your email address';
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.error = 'Please enter a valid email address';
        return;
      }

      // Check retry limit
      if (this.retryCount >= this.MAX_RETRY_ATTEMPTS) {
        this.error = `Maximum retry attempts (${this.MAX_RETRY_ATTEMPTS}) reached. Please try again later.`;
        return;
      }

      this.isLoading = true;
      this.clearMessages();

      try {
        console.log('🚀 Sending OTP to:', this.email);
        
        const result = await otpService.sendOTP(this.email, 'email', 'login');
        
        if (result.success) {
          this.otpSent = true;
          this.success = 'OTP sent successfully! Please check your email.';
          this.retryCount++;
          console.log('✅ OTP sent successfully:', result);
        } else {
          this.error = result.message || 'Failed to send OTP';
          console.error('❌ OTP send failed:', result);
        }
      } catch (error) {
        console.error('❌ Send OTP error:', error);
        
        // Handle different types of errors
        if (error.status === 429) {
          this.error = 'Too many requests. Please wait a moment before trying again.';
        } else if (error.status === 400) {
          this.error = error.message || 'Invalid email address. Please check and try again.';
        } else if (error.status >= 500) {
          this.error = 'Server error. Please try again later or contact support.';
        } else {
          this.error = error.message || 'Failed to send OTP. Please try again.';
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Verify OTP with proper error handling
    async handleVerifyOTP() {
      // Validation
      if (!this.otp.trim()) {
        this.error = 'Please enter the OTP';
        return;
      }

      if (!/^\d{6}$/.test(this.otp)) {
        this.error = 'OTP must be exactly 6 digits';
        return;
      }

      this.isLoading = true;
      this.clearMessages();

      try {
        console.log('🔐 Verifying OTP:', this.otp);
        
        const result = await otpService.verifyOTP(this.email, this.otp, 'email', 'login');
        
        if (result.success) {
          this.success = 'OTP verified successfully! You are now logged in.';
          console.log('✅ OTP verified successfully:', result);
          
          // Handle successful login (redirect, store token, etc.)
          if (result.token) {
            localStorage.setItem('authToken', result.token);
            // Redirect to dashboard or next step
            console.log('🎉 Login successful, token stored');
          }
        } else {
          this.error = result.message || 'OTP verification failed';
          console.error('❌ OTP verification failed:', result);
        }
      } catch (error) {
        console.error('❌ Verify OTP error:', error);
        
        // Handle different types of errors
        if (error.status === 400) {
          this.error = error.message || 'Invalid OTP. Please check and try again.';
        } else if (error.status === 404) {
          this.error = 'OTP not found or expired. Please request a new OTP.';
        } else if (error.status >= 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = error.message || 'OTP verification failed. Please try again.';
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Resend OTP
    async handleResendOTP() {
      if (this.retryCount >= this.MAX_RETRY_ATTEMPTS) {
        this.error = `Maximum retry attempts (${this.MAX_RETRY_ATTEMPTS}) reached. Please try again later.`;
        return;
      }

      this.isResending = true;
      this.clearMessages();

      try {
        const result = await otpService.sendOTP(this.email, 'email', 'login');
        
        if (result.success) {
          this.success = 'New OTP sent successfully! Please check your email.';
          this.retryCount++;
          this.otp = ''; // Clear current OTP input
        } else {
          this.error = result.message || 'Failed to resend OTP';
        }
      } catch (error) {
        console.error('❌ Resend OTP error:', error);
        this.error = error.message || 'Failed to resend OTP. Please try again.';
      } finally {
        this.isResending = false;
      }
    },

    // Reset form
    handleReset() {
      this.email = '';
      this.otp = '';
      this.otpSent = false;
      this.error = '';
      this.success = '';
      this.retryCount = 0;
    }
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
