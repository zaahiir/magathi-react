import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileService from '../services/profileService';
import { Camera, User, Mail, Phone, Calendar, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadProfileData();
  }, [isAuthenticated, navigate]);

  const loadProfileData = async () => {
    try {
      // Get user token from localStorage
      const token = localStorage.getItem('token');
      
      console.log('Profile loadProfileData - Token found:', !!token);
      console.log('Profile loadProfileData - Token value:', token ? token.substring(0, 20) + '...' : 'null');
      
      if (!token) {
        console.error('No token found');
        navigate('/login');
        return;
      }

      const response = await ProfileService.getUserProfile(token);
      if (response.success) {
        setProfileData(response.user);
        if (response.user.profileImage) {
          setProfileImage(ProfileService.getProfileImageUrl(response.user.profileImage));
        }
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
      
      // If token is invalid, try to refresh it
      if (error.message.includes('Invalid or expired token')) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ refreshToken })
            });

            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              localStorage.setItem('token', data.token);
              localStorage.setItem('refreshToken', data.refreshToken);
              localStorage.setItem('user', JSON.stringify(data.user));
              
              // Retry the profile request with new token
              const retryResponse = await ProfileService.getUserProfile(data.token);
              if (retryResponse.success) {
                setProfileData(retryResponse.user);
                if (retryResponse.user.profileImage) {
                  setProfileImage(ProfileService.getProfileImageUrl(retryResponse.user.profileImage));
                }
                return;
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }
        
        // If refresh fails, redirect to login
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file.");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB.");
        return;
      }
      
      setIsUploading(true);
      
      try {
        const token = localStorage.getItem('token');
        const response = await ProfileService.uploadProfileImage(file, token);
        if (response.success) {
          setProfileImage(ProfileService.getProfileImageUrl(response.profileImage));
          alert("Photo uploaded successfully! ✅");
        }
      } catch (error) {
        console.error('Profile image upload error:', error);
        alert(`Failed to upload image: ${error.message}`);
      } finally {
        setIsUploading(false);
        event.target.value = '';
      }
    }
  };

  const handleDeleteImage = async () => {
    if (window.confirm("Are you sure you want to delete your profile image?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await ProfileService.deleteProfileImage(token);
        if (response.success) {
          setProfileImage(null);
          alert("Profile image deleted successfully!");
        }
      } catch (error) {
        console.error('Delete profile image error:', error);
        alert(`Failed to delete image: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#53755d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-red-600 mb-4">Failed to load profile data</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 mb-2">Authentication required. Please log in to view your profile.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Go to Login
            </button>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3a4b3e] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Profile Header - Using consistent design */}
          <ProfileHeader 
            variant="page"
            showActions={false}
            className="rounded-t-xl"
          />


          {/* Profile Details */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{profileData.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{profileData.phone || 'Not provided'}</p>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verification Status</p>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profileData.isEmailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Email {profileData.isEmailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profileData.isPhoneVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Phone {profileData.isPhoneVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
