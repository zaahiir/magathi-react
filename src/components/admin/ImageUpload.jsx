import React, { useState } from 'react';
import { FaUpload, FaImage, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BlogService from '../../services/blogService';

const ImageUpload = ({ currentImage, onImageUploaded, onRemoveImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Upload image
      const response = await BlogService.uploadImage(formData);
      
      if (response.success) {
        const imageUrl = response.imageUrl;
        setPreview(imageUrl);
        onImageUploaded(imageUrl);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    onRemoveImage();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const fileInput = document.getElementById('image-upload');
      fileInput.files = files;
      handleFileSelect({ target: { files: [files[0]] } });
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Image Preview */}
      {preview && (
        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          uploading
            ? 'border-blue-300 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-2">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-600">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <FaImage className="w-8 h-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                <p className="font-medium">Click to upload or drag and drop</p>
                <p>PNG, JPG, GIF, WebP up to 10MB</p>
              </div>
              <button
                type="button"
                onClick={() => document.getElementById('image-upload').click()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaUpload className="w-4 h-4" />
                Choose Image
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Info */}
      {preview && (
        <div className="text-xs text-gray-500">
          <p>✓ Image uploaded successfully</p>
          <p>Click the × button to remove this image</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;