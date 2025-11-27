import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaClock, FaHeart, FaShare, FaTag, FaEye, FaChartLine, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaBookmark, FaPrint, FaExclamationTriangle, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import BlogService from '../services/blogService';
import { processImageUrl, isValidImageUrl } from '../utils/imageUtils';
import '../styles/blog-post.css';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await BlogService.getBlogById(id);
        
        if (response && response.blog) {
          setBlog(response.blog);
          // Fetch related posts
          fetchRelatedPosts(response.blog.category);
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchRelatedPosts = async (category) => {
    try {
      const response = await BlogService.getPublishedBlogs();
      if (response && response.blogs) {
        const related = response.blogs
          .filter(post => post.category === category && post._id !== id)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    } catch (err) {
      console.error('Error fetching related posts:', err);
    }
  };

  const handleLike = async () => {
    if (!blog || liked) return;
    
    try {
      await BlogService.likeBlog(blog._id);
      setLiked(true);
      setBlog(prev => ({
        ...prev,
        likes: (prev.likes || 0) + 1
      }));
    } catch (err) {
      console.error('Error liking blog:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog.title);
    const text = encodeURIComponent(blog.excerpt || '');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // Here you could implement actual bookmarking functionality
  };

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
      setShowShareModal(false);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderNav />
        <div className="flex justify-center items-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderNav />
        <div className="flex justify-center items-center py-32">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEye className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Post Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/blog')}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Back to Blog
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const publishDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const readTime = Math.max(1, Math.ceil((blog.content || '').split(' ').length / 200));

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNav />
      
      {/* Enhanced Hero Section with Custom Header */}
      <section className="relative py-0">
        {/* Custom Header with Blog Title */}
        <div className="bg-[#53755d] py-16 md:py-20">   
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Back Button */}
              <button
                onClick={() => navigate('/blog')}
                className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors duration-300 group"
              >
                <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Blog
              </button>

              {/* Blog Title and Meta */}
              <div className="text-center text-white">
                {/* Category Badge */}
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/30">
                  <span className="text-sm font-semibold">{blog.category}</span>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                  {blog.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/80 mb-8">
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-4 h-4 mr-2" />
                    <span className="font-medium">{publishDate.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUser className="w-4 h-4 mr-2" />
                    <span className="font-medium">{blog.author?.name || 'ADMIN'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="w-4 h-4 mr-2" />
                    <span>{readTime} min read</span>
                  </div>
                  {blog.views > 0 && (
                    <div className="flex items-center">
                      <FaEye className="w-4 h-4 mr-2" />
                      <span>{blog.views} views</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={handleLike}
                    disabled={liked}
                    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      liked 
                        ? 'bg-red-500 text-white cursor-not-allowed' 
                        : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                    }`}
                  >
                    <FaHeart className="w-4 h-4 mr-2" />
                    {liked ? 'Liked' : 'Like'} ({blog.likes || 0})
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl font-semibold transition-all duration-300"
                  >
                    <FaShare className="w-4 h-4 mr-2" />
                    Share
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      bookmarked 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                    }`}
                  >
                    <FaBookmark className="w-4 h-4 mr-2" />
                    {bookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl font-semibold transition-all duration-300"
                  >
                    <FaPrint className="w-4 h-4 mr-2" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image Section */}
        <div className="relative -mt-8 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="relative h-80 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                {(() => {
                  const processedImageUrl = processImageUrl(blog.featuredImage, blog.category);
                  const hasValidImage = isValidImageUrl(blog.featuredImage);
                  
                  return (
                    <>
                      {hasValidImage ? (
                        <img 
                          src={processedImageUrl} 
                          alt={blog.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('Image failed to load:', processedImageUrl);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                          onLoad={(e) => {
                            console.log('Image loaded successfully:', processedImageUrl);
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback when no image or image fails to load */}
                      <div 
                        className={`w-full h-full bg-gradient-to-br from-[#53755d] to-[#3e5d49] flex items-center justify-center ${
                          hasValidImage ? 'hidden' : 'flex'
                        }`}
                      >
                        <div className="text-center text-white">
                          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaChartLine className="w-12 h-12" />
                          </div>
                          <p className="font-medium text-xl">{blog.category}</p>
                        </div>
                      </div>
                    </>
                  );
                })()}
                
                {/* Author Info Overlay */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 shadow-lg">
                    <p className="text-sm font-semibold text-gray-800">{blog.author?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-600">Research Team</p>
                  </div>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-6 right-6">
                  <span className="bg-[#53755d] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    {blog.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>


      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Share Article</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  <FaFacebook className="w-5 h-5 mr-2" />
                  Facebook
                </button>
                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="flex items-center justify-center p-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  <FaTwitter className="w-5 h-5 mr-2" />
                  Twitter
                </button>
                <button
                  onClick={() => handleSocialShare('linkedin')}
                  className="flex items-center justify-center p-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  <FaLinkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleSocialShare('whatsapp')}
                  className="flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  WhatsApp
                </button>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300"
                >
                  <FaShare className="w-5 h-5 mr-2" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Tags Section */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-12 text-center">
                <div className="flex flex-wrap justify-center gap-3">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#53755d]/10 text-[#53755d] rounded-full text-sm font-medium hover:bg-[#53755d] hover:text-white transition-all duration-300 cursor-pointer border border-[#53755d]/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Content Header */}
              <div className="bg-gradient-to-r from-[#53755d] to-[#3e5d49] px-8 py-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-white gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <FaUser className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{blog.author?.name || 'Admin'}</p>
                      <p className="text-sm text-white/80">Research Team</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-white/80">Published</p>
                    <p className="font-semibold text-lg">{publishDate}</p>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8 md:p-12">
                {/* Excerpt */}
                {blog.excerpt && (
                  <div className="mb-12 p-8 bg-gradient-to-r from-[#53755d]/5 to-[#3e5d49]/5 rounded-2xl border-l-4 border-[#53755d] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#53755d]/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-[#53755d] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <FaQuoteLeft className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#53755d] mb-3">Article Summary</h3>
                          <p className="text-lg text-gray-700 leading-relaxed font-medium">
                            {blog.excerpt}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reading Progress Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Reading Progress</span>
                    <span>{readTime} min read</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#53755d] to-[#3e5d49] h-2 rounded-full transition-all duration-300" style={{width: '0%'}}></div>
                  </div>
                </div>

                {/* Content */}
                <div className="blog-post-content">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: blog.content?.replace(/\n/g, '<br />') || 'Content not available.' 
                    }}
                  />
                </div>

              </div>

              {/* Content Footer */}
              <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaEye className="w-4 h-4 mr-2" />
                      <span>{blog.views || 0} views</span>
                    </div>
                    <div className="flex items-center">
                      <FaHeart className="w-4 h-4 mr-2" />
                      <span>{blog.likes || 0} likes</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="w-4 h-4 mr-2" />
                      <span>{readTime} min read</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleLike}
                      disabled={liked}
                      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        liked 
                          ? 'bg-red-500 text-white cursor-not-allowed' 
                          : 'bg-[#53755d] hover:bg-[#3e5d49] text-white'
                      }`}
                    >
                      <FaHeart className="w-4 h-4 mr-2" />
                      {liked ? 'Liked' : 'Like'}
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-300"
                    >
                      <FaShare className="w-4 h-4 mr-2" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Related Articles</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Continue your learning journey with these related articles
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((post) => (
                  <article key={post._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative h-48 bg-gradient-to-br from-[#53755d] to-[#3e5d49] overflow-hidden">
                      {(() => {
                        const processedImageUrl = processImageUrl(post.featuredImage, post.category);
                        const hasValidImage = isValidImageUrl(post.featuredImage);
                        
                        return (
                          <>
                            {hasValidImage ? (
                              <img 
                                src={processedImageUrl} 
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : null}
                            
                            <div 
                              className={`w-full h-full bg-gradient-to-br from-[#53755d] to-[#3e5d49] flex items-center justify-center ${
                                hasValidImage ? 'hidden' : 'flex'
                              }`}
                            >
                              <div className="text-center text-white">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <FaChartLine className="w-8 h-8" />
                                </div>
                                <p className="font-semibold">{post.category}</p>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                      
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 text-[#53755d] px-3 py-1 rounded-full text-sm font-semibold">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <FaCalendarAlt className="w-4 h-4 mr-2 text-[#53755d]" />
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#53755d] transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {post.excerpt || post.content.substring(0, 100) + '...'}
                      </p>
                      
                      <button
                        onClick={() => navigate(`/blog/${post._id}`)}
                        className="inline-flex items-center text-[#53755d] hover:text-[#3e5d49] font-semibold transition-colors duration-300 group"
                      >
                        Read More
                        <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Back to Blog CTA */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#53755d]/5 rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#3e5d49]/5 rounded-full translate-y-16 -translate-x-16"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-[#53755d] to-[#3e5d49] rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaChartLine className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Enjoyed this article?</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Discover more insights, strategies, and expert advice in our comprehensive blog collection. 
                  Stay informed with the latest trends in investment and financial planning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/blog')}
                    className="bg-gradient-to-r from-[#53755d] to-[#3e5d49] hover:from-[#3e5d49] hover:to-[#53755d] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Browse More Articles
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-white hover:bg-gray-50 text-[#53755d] border-2 border-[#53755d] px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
