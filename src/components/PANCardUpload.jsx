import React, { useState, useRef } from 'react';
import { FaUpload, FaFileImage, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';
import { otpService } from '../services/otpService';

const PANCardUpload = ({ onUpload, onSkip, isRequired = false }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid file (JPEG, PNG, or PDF)');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const result = await otpService.uploadPANCard(selectedFile, token);
      
      if (result.success) {
        onUpload(result.panUrl);
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSkip = () => {
    if (isRequired) {
      setError('PAN card is required');
      return;
    }
    onSkip();
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#53755d] transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="pan-file-input"
        />
        
        <label
          htmlFor="pan-file-input"
          className="cursor-pointer flex flex-col items-center space-y-4"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <FaUpload className="w-8 h-8 text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700">
              {selectedFile ? 'File Selected' : 'Upload PAN Card'}
            </p>
            <p className="text-sm text-gray-500">
              {selectedFile ? selectedFile.name : 'Click to select file (JPEG, PNG, PDF)'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Maximum file size: 5MB
            </p>
          </div>
        </label>
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaFileImage className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {previewUrl && (
                <button
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="p-2 text-gray-500 hover:text-[#53755d] transition-colors"
                  title="Preview"
                >
                  <FaEye className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={handleRemoveFile}
                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                title="Remove"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="PAN card preview"
                className="max-w-full h-32 object-contain rounded border"
              />
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1 bg-[#53755d] text-white py-3 px-6 rounded-lg hover:bg-[#3e5d49] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isUploading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            'Upload PAN Card'
          )}
        </button>
        
        {!isRequired && (
          <button
            onClick={handleSkip}
            disabled={isUploading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <p>• Supported formats: JPEG, PNG, PDF</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Make sure the PAN card is clearly visible and readable</p>
      </div>
    </div>
  );
};

export default PANCardUpload;
