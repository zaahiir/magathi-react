import React, { useState, useEffect } from 'react';
import { Camera, Edit, LogOut, ChevronDown } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import ProfileService from '../services/profileService';
import LogoutConfirmationModal from './LogoutConfirmationModal';

const ProfileHeader = ({ 
  variant = 'desktop', // 'desktop', 'mobile', 'page'
  showActions = true,
  onEditProfile,
  onLogout,
  className = ''
}) => {
  const { user, isAuthenticated } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load user profile image on component mount
  useEffect(() => {
    const loadProfileImage = async () => {
      if (isAuthenticated && user?.token) {
        try {
          const response = await ProfileService.getUserProfile(user.token);
          if (response.success && response.user.profileImage) {
            setProfileImage(ProfileService.getProfileImageUrl(response.user.profileImage));
          }
        } catch (error) {
          console.error('Failed to load profile image:', error);
        }
      }
    };

    loadProfileImage();
  }, [isAuthenticated, user]);

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
        const response = await ProfileService.uploadProfileImage(file, user.token);
        if (response.success) {
          // Update the profile image state with the new image URL
          setProfileImage(ProfileService.getProfileImageUrl(response.profileImage));
          alert("Photo uploaded successfully! ✅");
        }
      } catch (error) {
        console.error('Profile image upload error:', error);
        alert(`Failed to upload image: ${error.message}`);
      } finally {
        setIsUploading(false);
        // Reset the file input
        event.target.value = '';
      }
    }
  };

  // Get user avatar based on profile image or first name initial
  const getUserAvatar = () => {
    if (profileImage) {
      return (
        <img 
          src={profileImage} 
          alt="Profile" 
          className="w-6 h-6 rounded-full object-cover border-2 border-white"
        />
      );
    }
    
    // Show first letter of first name if no profile image
    if (user?.firstName) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white">
          {user.firstName.charAt(0).toUpperCase()}
        </div>
      );
    }
    
    // Default fallback
    return <FaUser className="w-6 h-6 text-blue-500" />;
  };

  const getProfileImageSize = () => {
    switch (variant) {
      case 'mobile':
        return {
          container: 'w-16 h-16',
          image: 'w-14 h-14',
          icon: 'w-8 h-8',
          text: 'text-lg'
        };
      case 'page':
        return {
          container: 'w-32 h-32',
          image: 'w-28 h-28',
          icon: 'w-12 h-12',
          text: 'text-4xl'
        };
      default: // desktop
        return {
          container: 'w-16 h-16',
          image: 'w-14 h-14',
          icon: 'w-8 h-8',
          text: 'text-lg'
        };
    }
  };

  const sizes = getProfileImageSize();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  // Desktop variant - matches Header.jsx design
  if (variant === 'desktop') {
    return (
      <>
      <div className={`relative ${className}`} data-profile>
        <button
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className="flex items-center space-x-2 transition-all duration-200 hover:scale-105 text-white"
        >
          {getUserAvatar()}
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Profile Dropdown Menu */}
        {showProfileDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-10 z-50 border-none animate-slideInRight">
            <div className="">
              {/* Enhanced Profile Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-[#53755d] to-[#3e5d49] rounded-t-2xl">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 relative">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center">
                          {user?.firstName ? (
                            <span className="text-white font-bold text-lg">
                              {user.firstName.charAt(0).toUpperCase()}
                            </span>
                          ) : (
                            <FaUser className="w-8 h-8 text-white" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <Camera className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-white truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-sm text-white/80 truncate">
                      {user?.email}
                    </p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                        Premium Member
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Actions */}
              {showActions && (
                <div className="px-2 py-2">
                  {/* Primary Actions */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onEditProfile && onEditProfile();
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg group"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                        <Edit className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>Edit Profile</span>
                    </button>
                    
                    <label className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-lg group cursor-pointer">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                        <Camera className="h-4 w-4 text-purple-600" />
                      </div>
                      <span>{isUploading ? 'Uploading...' : 'Change Profile Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleLogoutClick();
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg group"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
      </>
    );
  }

  // Mobile variant - matches Header.jsx mobile design
  if (variant === 'mobile') {
    return (
      <>
      <div className={`w-full mt-4 space-y-2 ${className}`}>
        {/* Enhanced Profile Header */}
        <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 relative">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center">
                    {user?.firstName ? (
                      <span className="text-white font-bold text-lg">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <FaUser className="w-8 h-8 text-white" />
                    )}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-sm text-white/80 truncate">
                {user?.email}
              </p>
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                  Premium Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Profile Management Buttons */}
        {showActions && (
          <div className="space-y-3">
            {/* Primary Actions */}
            <div className="space-y-2">
              <button
                onClick={() => onEditProfile && onEditProfile()}
                className="w-full bg-white/20 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200 flex items-center justify-center group"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-white/30 transition-colors">
                  <Edit className="h-4 w-4 text-white" />
                </div>
                <span>Edit Profile</span>
              </button>

              <label className="w-full bg-white/20 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200 flex items-center justify-center cursor-pointer group">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-white/30 transition-colors">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <span>{isUploading ? 'Uploading...' : 'Change Profile Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => handleLogoutClick()}
                className="w-full bg-red-600/80 backdrop-blur-sm text-white font-bold py-4 px-4 rounded-xl border border-red-500/50 hover:bg-red-700/80 transition-all duration-200 flex items-center justify-center group"
              >
                <div className="w-8 h-8 bg-red-400/30 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-400/50 transition-colors">
                  <LogOut className="h-5 w-5 text-white" />
                </div>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
      </>
    );
  }

  // Page variant - for dedicated profile pages
  if (variant === 'page') {
    return (
      <>
      <div className={`bg-gradient-to-r from-[#53755d] to-[#3e5d49] px-8 py-8 ${className}`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div className={`${sizes.container} rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30`}>
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className={`${sizes.image} rounded-full object-cover`}
                />
              ) : (
                <div className={`${sizes.image} rounded-full bg-white/30 flex items-center justify-center`}>
                  {user?.firstName ? (
                    <span className={`text-white font-bold ${sizes.text}`}>
                      {user.firstName.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <FaUser className={`${sizes.icon} text-white`} />
                  )}
                </div>
              )}
            </div>
            
            {/* Upload Button */}
            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <Camera className="w-5 h-5 text-[#53755d]" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">
              {user?.name || 'User'}
            </h1>
            <p className="text-white/80 text-lg mb-2">
              {user?.email}
            </p>
            <div className="flex justify-center md:justify-start">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                Premium Member
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
      </>
    );
  }

  return null;
};

export default ProfileHeader;
