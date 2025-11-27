import React, { useState } from 'react';
import { FaPhone, FaSpinner, FaCheck, FaCog } from 'react-icons/fa';

const LiveSmsOtpTest = () => {
  const [twilioPhone, setTwilioPhone] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [step, setStep] = useState('config'); // 'config', 'send', 'verify'

  const setTwilioPhoneNumber = async () => {
    if (!twilioPhone.trim()) {
      setResult('Please enter your Twilio phone number');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/set-twilio-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: twilioPhone }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(`✅ Twilio phone number set successfully: ${data.phoneNumber}`);
        setStep('send');
      } else {
        setResult(`❌ Failed to set Twilio phone number: ${data.message}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!testPhone.trim()) {
      setResult('Please enter a test phone number');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier: testPhone, 
          type: 'phone', 
          purpose: 'login' 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(`✅ OTP sent successfully! 
Service: ${data.service}
Real Delivery: ${data.realDelivery ? 'Yes' : 'No'}
Message SID: ${data.messageSid || 'N/A'}
Status: ${data.status || 'N/A'}
Price: ${data.price || 'N/A'}
OTP: ${data.consoleOTP || 'Check your phone'}`);
        setStep('verify');
        if (data.consoleOTP) {
          setOtp(data.consoleOTP);
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
    if (!testPhone.trim() || !otp.trim()) {
      setResult('Please enter both phone number and OTP');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier: testPhone, 
          otp: otp, 
          type: 'phone', 
          purpose: 'login' 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(`✅ OTP verified successfully! 
Message: ${data.message}
Token: ${data.token ? 'Generated' : 'N/A'}`);
        setStep('config');
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">Live SMS OTP Test</h3>
      
      <div className="space-y-4">
        {/* Twilio Phone Configuration */}
        {step === 'config' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Twilio Phone Number
            </label>
            <input
              type="tel"
              value={twilioPhone}
              onChange={(e) => setTwilioPhone(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={setTwilioPhoneNumber}
              disabled={isLoading || !twilioPhone.trim()}
              className="w-full mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCog className="mr-2" />}
              Set Twilio Phone
            </button>
          </div>
        )}

        {/* Test Phone Number */}
        {step !== 'config' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Phone Number
            </label>
            <input
              type="tel"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="+919876543210"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

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
          {step === 'send' && (
            <button
              onClick={sendOTP}
              disabled={isLoading || !testPhone.trim()}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaPhone className="mr-2" />}
              Send OTP
            </button>
          )}

          {step === 'verify' && (
            <button
              onClick={verifyOTP}
              disabled={isLoading || !otp.trim()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheck className="mr-2" />}
              Verify OTP
            </button>
          )}

          {step !== 'config' && (
            <button
              onClick={() => {
                setStep('config');
                setOtp('');
                setResult('');
              }}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Back to Config
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
          <li>Enter your Twilio phone number (E.164 format)</li>
          <li>Click "Set Twilio Phone" to configure</li>
          <li>Enter test phone number</li>
          <li>Click "Send OTP" to send SMS</li>
          <li>Enter the 6-digit OTP you received</li>
          <li>Click "Verify OTP" to complete verification</li>
        </ol>
      </div>
    </div>
  );
};

export default LiveSmsOtpTest;
