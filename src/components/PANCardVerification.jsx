import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

const PANCardVerification = ({ 
  user, 
  onVerify, 
  onSkip, 
  isLoading = false 
}) => {
  const [showPAN, setShowPAN] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Encrypt PAN card number for display (show only last 4 digits)
  const maskPANCard = (panCard) => {
    if (!panCard) return 'Not provided';
    if (panCard.length < 4) return panCard;
    return 'XXXX' + panCard.slice(-4);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await onVerify();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSkip = async () => {
    setIsVerifying(true);
    try {
      await onSkip();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            PAN Card Verification
          </h2>
          <p className="text-gray-600">
            Please verify your PAN card details to continue
          </p>
        </div>

        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">User Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{user?.phone}</span>
              </div>
            </div>
          </div>

          {/* PAN Card Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">PAN Card Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">PAN Number:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-lg font-bold">
                    {showPAN ? user?.panCard : maskPANCard(user?.panCard)}
                  </span>
                  <button
                    onClick={() => setShowPAN(!showPAN)}
                    className="p-1 hover:bg-gray-200 rounded"
                    type="button"
                  >
                    {showPAN ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              {user?.panUrl && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Document:</span>
                  <a
                    href={user.panUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    View PAN Card
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleVerify}
              disabled={isVerifying || isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify PAN Card</span>
                </>
              )}
            </button>

            <button
              onClick={handleSkip}
              disabled={isVerifying || isLoading}
              className="w-full bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Skip for Now</span>
                </>
              )}
            </button>
          </div>

          {/* Info Text */}
          <div className="text-xs text-gray-500 text-center">
            <p>
              By verifying your PAN card, you can access all features of the platform.
              You can skip this step and verify later from your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PANCardVerification;
