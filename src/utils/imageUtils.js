// Utility functions for handling blog images

// Sample placeholder images for different categories
export const getCategoryImage = (category) => {
  const categoryImages = {
    'Investment Basics': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop',
    'Market Analysis': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    'Tax Planning': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    'Retirement Planning': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    'Insurance': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
    'Real Estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
    'Personal Finance': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop'
  };
  
  return categoryImages[category] || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop';
};

// Validate if URL is a valid image URL
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's a local upload path
  if (url.startsWith('/uploads/')) {
    return true;
  }
  
  // Check if it's a valid URL
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // Check if it's an image URL
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  // Check if it's from a trusted image service
  const trustedDomains = [
    'unsplash.com',
    'images.unsplash.com',
    'pixabay.com',
    'pexels.com',
    'imgur.com',
    'cloudinary.com',
    'amazonaws.com'
  ];
  
  const isFromTrustedDomain = trustedDomains.some(domain => 
    url.includes(domain)
  );
  
  return hasImageExtension || isFromTrustedDomain;
};

// Get a fallback image URL based on category
export const getFallbackImage = (category) => {
  return getCategoryImage(category);
};

// Process image URL to ensure it's valid and add fallback
export const processImageUrl = (imageUrl, category) => {
  if (!imageUrl || imageUrl.trim() === '') {
    return getFallbackImage(category);
  }
  
  if (isValidImageUrl(imageUrl)) {
    // If it's a local upload, prepend the backend URL
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:5000${imageUrl}`;
    }
    return imageUrl;
  }
  
  // If URL is invalid, return fallback
  return getFallbackImage(category);
};
