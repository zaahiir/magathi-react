import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { processImageUrl, isValidImageUrl } from '../utils/imageUtils';

const BlogCarousel = ({ posts = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    // Get the first 3 posts as featured posts for carousel
    setFeaturedPosts(posts.slice(0, 3));
  }, [posts]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (featuredPosts.length === 0) {
    return (
      <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl overflow-hidden mb-12">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Featured Articles</h3>
            <p className="text-sm">Check back soon for new content</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
      {/* Carousel Container */}
      <div className="relative h-96 overflow-hidden">
        {featuredPosts.map((post, index) => (
          <div
            key={post._id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="relative h-full bg-gradient-to-r from-[#53755d] to-[#3e5d49]">
              {/* Background Image or Pattern */}
              {(() => {
                const processedImageUrl = processImageUrl(post.featuredImage, post.category);
                const hasValidImage = isValidImageUrl(post.featuredImage);
                
                return (
                  <>
                    {hasValidImage ? (
                      <img 
                        src={processedImageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback Pattern */}
                    <div 
                      className={`w-full h-full bg-gradient-to-br from-[#53755d] to-[#3e5d49] flex items-center justify-center ${
                        hasValidImage ? 'hidden' : 'flex'
                      }`}
                    >
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="relative z-10 text-center text-white">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FaCalendarAlt className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{post.category}</h3>
                        <p className="text-white/80">Featured Article</p>
                      </div>
                    </div>
                  </>
                );
              })()}
              
              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="container mx-auto px-8">
                  <div className="max-w-2xl">
                    {/* Author Info */}
                    <div className="flex items-center mb-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                        <div className="flex items-center text-white">
                          <FaUser className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Admin</span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center text-white/80">
                        <FaCalendarAlt className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                      {post.title}
                    </h1>
                    
                    {/* Excerpt */}
                    <p className="text-lg text-white/90 mb-8 line-clamp-2 leading-relaxed">
                      {post.excerpt || post.content.substring(0, 200) + '...'}
                    </p>
                    
                    {/* Read More Button */}
                    <Link
                      to={`/blog/${post._id}`}
                      className="inline-flex items-center bg-white text-[#53755d] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    >
                      Read More
                      <FaArrowRight className="w-5 h-5 ml-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {featuredPosts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-[#53755d] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-10"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-[#53755d] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-10"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {featuredPosts.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {featuredPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {featuredPosts.length > 1 && (
        <div className="absolute top-6 right-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
            <span className="text-white text-sm font-medium">
              {currentSlide + 1} / {featuredPosts.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCarousel;
