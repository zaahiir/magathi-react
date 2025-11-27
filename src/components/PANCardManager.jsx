import React, { useState } from 'react';
import { FaEdit, FaCheck, FaTimes, FaIdCard } from 'react-icons/fa';

const PANCardManager = ({ 
  currentPanCard, 
  onUpdate, 
  onSkip, 
  isRequired = false 
}) => {
  const [isEditing, setIsEditing] = useState(!currentPanCard);
  const [panCard, setPanCard] = useState(currentPanCard || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const handleSave = async () => {
    if (!panCard.trim()) {
      setError('PAN card number is required');
      return;
    }

    if (!validatePAN(panCard)) {
      setError('Invalid PAN card format. Format: ABCDE1234F');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onUpdate(panCard);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update PAN card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPanCard(currentPanCard || '');
    setError('');
    setIsEditing(false);
  };

  const handleSkip = () => {
    if (isRequired) {
      setError('PAN card is required for this service');
      return;
    }
    onSkip();
  };

  const formatPAN = (pan) => {
    if (pan.length <= 5) return pan;
    return `${pan.slice(0, 5)}${pan.slice(5, 9)}${pan.slice(9)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <FaIdCard className="text-[#53755d] mr-3 text-xl" />
        <h3 className="text-lg font-semibold text-gray-800">PAN Card Information</h3>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PAN Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={panCard}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                  if (value.length <= 10) {
                    setPanCard(value);
                    setError('');
                  }
                }}
                placeholder="ABCDE1234F"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent transition-colors"
                maxLength="10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {panCard.length === 10 ? (
                  <FaCheck className="text-green-500" />
                ) : (
                  <span className="text-xs">{panCard.length}/10</span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Format: 5 letters + 4 numbers + 1 letter (e.g., ABCDE1234F)
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={isLoading || !panCard || panCard.length !== 10}
              className="flex-1 bg-[#53755d] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#3e5d49] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? 'Saving...' : 'Save PAN Card'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {!isRequired && (
            <button
              onClick={handleSkip}
              className="w-full text-gray-500 hover:text-gray-700 text-sm py-2"
            >
              Skip for now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">PAN Card Number</p>
            <p className="font-mono text-lg font-semibold text-gray-800">
              {formatPAN(currentPanCard)}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-[#53755d] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#3e5d49] transition-colors flex items-center justify-center"
            >
              <FaEdit className="mr-2" />
              Update PAN Card
            </button>
            {!isRequired && (
              <button
                onClick={onSkip}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      )}

      {isRequired && !currentPanCard && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> PAN card is required for investment services and tax compliance.
          </p>
        </div>
      )}
    </div>
  );
};

export default PANCardManager;
