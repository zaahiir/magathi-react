import React, { useState } from 'react';
import { FaUpload, FaImage, FaTimes } from 'react-icons/fa';
import BlogService from '../services/blogService';

const ImageUpload = ({ value, onChange, placeholder = "Enter image URL or upload" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload to server
      const response = await BlogService.uploadImage(formData);
      
      if (response.success) {
        setPreview(response.imageUrl);
        onChange(response.imageUrl);
        console.log('Image uploaded successfully:', response.imageUrl);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Error uploading image: ${error.message || 'Please try again.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image URL
        </label>
        <div className="flex space-x-2">
          <input
            type="url"
            value={value || ''}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
          />
          <button
            type="button"
            onClick={clearImage}
            className="px-3 py-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Clear image"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or Upload Image
        </label>
        <div className="flex items-center space-x-2">
          <label className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
            isUploading 
              ? 'bg-blue-100 text-blue-700 cursor-not-allowed' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}>
            <FaUpload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Choose File'}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
          <span className="text-sm text-gray-500">
            JPG, PNG, GIF up to 10MB
          </span>
        </div>
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview
          </label>
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FaImage className="w-8 h-8 mx-auto mb-2" />
                <p>Invalid image URL</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Suggested Images (Click to use)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
          ].map((url, index) => (
            <div
              key={index}
              className="relative h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#53755d] transition-all"
              onClick={() => {
                setPreview(url);
                onChange(url);
              }}
            >
              <img
                src={url}
                alt={`Suggested ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
