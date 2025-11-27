import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

const OTPVerification = ({ 
  identifier, 
  type, 
  purpose, 
  onVerify, 
  onBack, 
  onResend,
  userData = null
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onVerify(otpString);
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setTimeLeft(60);
    setCanResend(false);
    setError('');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    
    try {
      await onResend();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  const formatIdentifier = (identifier, type) => {
    if (type === 'phone') {
      return `+91 ${identifier.slice(0, 5)}****${identifier.slice(-2)}`;
    }
    const [local, domain] = identifier.split('@');
    return `${local.slice(0, 2)}***@${domain}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#53755d] via-[#6b8a6b] to-[#8aab8a]">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 overflow-hidden">
          {/* Header */}
          <div className="text-center mb-6">
            <button
              onClick={onBack}
              className="absolute left-6 top-6 text-gray-600 hover:text-[#53755d] transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
            <p className="text-gray-600">
              {type === 'phone' 
                ? 'We\'ve sent a 6-digit code via SMS to' 
                : 'We\'ve sent a 6-digit code via email to'
              }
            </p>
            <p className="text-[#53755d] font-semibold">
              {formatIdentifier(identifier, type)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {type === 'phone' 
                ? 'Check your phone for the SMS' 
                : 'Check your email inbox and spam folder'
              }
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex justify-center space-x-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-[#53755d] focus:outline-none transition-colors"
                />
              ))}
            </div>
            
            
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full h-12 bg-[#53755d] text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3e5d49] transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-[#53755d] hover:underline font-medium"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Resend OTP in {timeLeft}s
              </p>
            )}
          </div>

          {/* Additional Info for Signup */}
          {purpose === 'signup' && userData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-2">Account Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Name:</span> {userData.firstName} {userData.lastName}</p>
                {userData.panCard && (
                  <p><span className="font-medium">PAN:</span> {userData.panCard}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
