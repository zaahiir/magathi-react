import React, { useState } from 'react';
import { FaPhone, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';

const FixedSmsOtpTest = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [step, setStep] = useState('send'); // 'send' or 'verify'

  const sendOTP = async () => {
    if (!phone.trim()) {
      setResult('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/fixed-sms/send-sms-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, purpose: 'login' }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(`✅ OTP sent successfully! ${data.realDelivery ? 'SMS delivered' : 'Check console for OTP'}`);
        setStep('verify');
        // In development, show the OTP
        if (data.otp) {
          setOtp(data.otp);
        }
      } else {
        setResult(`❌ Failed to send OTP: ${data.message}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!phone.trim() || !otp.trim()) {
      setResult('Please enter both phone number and OTP');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/fixed-sms/verify-sms-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp, purpose: 'login' }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(`✅ OTP verified successfully! ${data.token ? 'Login successful' : 'Verification complete'}`);
        setStep('send');
        setOtp('');
      } else {
        setResult(`❌ OTP verification failed: ${data.message}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkOtpStatus = async () => {
    if (!phone.trim()) {
      setResult('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/fixed-sms/otp-status?phone=${encodeURIComponent(phone)}`);
      const data = await response.json();

      if (data.success) {
        setResult(`📊 OTP Status for ${data.phone}:\n${JSON.stringify(data.otps, null, 2)}`);
      } else {
        setResult(`❌ Failed to get OTP status: ${data.message}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">Fixed SMS OTP Test</h3>
      
      <div className="space-y-4">
        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+919876543210"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* OTP Input (only show in verify step) */}
        {step === 'verify' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP (6 digits)
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {step === 'send' ? (
            <button
              onClick={sendOTP}
              disabled={isLoading || !phone.trim()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaPhone className="mr-2" />}
              Send OTP
            </button>
          ) : (
            <button
              onClick={verifyOTP}
              disabled={isLoading || !otp.trim()}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheck className="mr-2" />}
              Verify OTP
            </button>
          )}

          <button
            onClick={checkOtpStatus}
            disabled={isLoading || !phone.trim()}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaTimes className="mr-2" />}
            Check OTP Status
          </button>

          {step === 'verify' && (
            <button
              onClick={() => {
                setStep('send');
                setOtp('');
                setResult('');
              }}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
            >
              Back to Send
            </button>
          )}
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-xs text-gray-600">
        <h4 className="font-semibold mb-2">Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Enter your phone number in E.164 format (+91XXXXXXXXXX)</li>
          <li>Click "Send OTP" to receive SMS</li>
          <li>Enter the 6-digit OTP you received</li>
          <li>Click "Verify OTP" to complete verification</li>
          <li>Use "Check OTP Status" to debug issues</li>
        </ol>
      </div>
    </div>
  );
};

export default FixedSmsOtpTest;
