const API_BASE_URL = 'http://localhost:5000/api';

class ProfileService {
  // Upload profile image
  static async uploadProfileImage(file, token) {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch(`${API_BASE_URL}/profile/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload profile image');
      }

      return data;
    } catch (error) {
      console.error('Profile image upload error:', error);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user profile');
      }

      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  // Delete profile image
  static async deleteProfileImage(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete profile image');
      }

      return data;
    } catch (error) {
      console.error('Delete profile image error:', error);
      throw error;
    }
  }

  // Get profile image URL
  static getProfileImageUrl(profileImage) {
    if (!profileImage) return null;
    
    // If it's already a full URL, return as is
    if (profileImage.startsWith('http')) {
      return profileImage;
    }
    
    // If it's a relative path starting with /uploads, construct the full URL
    if (profileImage.startsWith('/uploads/')) {
      return `${API_BASE_URL}${profileImage}`;
    }
    
    // If it's just a filename, construct the full URL
    return `${API_BASE_URL}/uploads/profile-images/${profileImage}`;
  }
}

export default ProfileService;
