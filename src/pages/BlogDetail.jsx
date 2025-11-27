import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaEye, FaHeart, FaShare, FaArrowLeft, FaChartLine, FaExclamationTriangle, FaBookOpen, FaTags, FaClock, FaPrint, FaBookmark, FaComment, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaCopy, FaCheck } from 'react-icons/fa';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import BlogService from '../services/blogService';
import { processImageUrl, isValidImageUrl } from '../utils/imageUtils';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [showAMFIDisclaimer, setShowAMFIDisclaimer] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    fetchPost();
    
    // Reading progress tracking
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(scrollPercent);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getBlogById(id);
      setPost(response.blog);
      
      // Fetch related posts
      const relatedResponse = await BlogService.getPublishedBlogs({ 
        category: response.blog.category,
        limit: 3 
      });
      setRelatedPosts(relatedResponse.blogs?.filter(p => p._id !== id) || []);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      if (!isLiked) {
        await BlogService.likeBlog(id);
        setPost(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // You can implement actual bookmark functionality here
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async (platform = 'copy') => {
    const shareUrl = window.location.href;
    const shareText = `${post.title} - ${post.excerpt}`;
    
    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(shareUrl);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } else if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Fallback for different platforms
        const shareUrls = {
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
        };
        
        if (shareUrls[platform]) {
          window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#53755d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-[#53755d] hover:bg-[#3e5d49] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNav />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#53755d] to-[#3e5d49] transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>
      
      {/* Enhanced Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center bg-gray-100 hover:bg-[#53755d] hover:text-white text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </button>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBookmark}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isBookmarked 
                    ? 'bg-[#53755d] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-[#53755d] hover:text-white'
                }`}
                title="Bookmark"
              >
                <FaBookmark className="w-4 h-4" />
              </button>
              <button
                onClick={handlePrint}
                className="p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-[#53755d] hover:text-white transition-all duration-300"
                title="Print"
              >
                <FaPrint className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Category Badge */}
            <div className="mb-8 text-center">
              <span className="inline-flex items-center bg-gradient-to-r from-[#53755d] to-[#3e5d49] text-white px-8 py-4 rounded-full text-sm font-bold shadow-lg">
                <FaTags className="w-4 h-4 mr-2" />
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight text-center bg-gradient-to-r from-gray-900 via-[#53755d] to-gray-900 bg-clip-text text-transparent">
              {post.title}
            </h1>

            {/* Enhanced Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
              <div className="flex items-center bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-[#53755d] rounded-full flex items-center justify-center mr-4">
                  <FaUser className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{post.author || 'Admin'}</p>
                  <p className="text-sm text-gray-600">Research Team</p>
                </div>
              </div>
              
              <div className="flex items-center bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <FaCalendarAlt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">Published Date</p>
                </div>
              </div>
              
              <div className="flex items-center bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <FaEye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{post.views || 0}</p>
                  <p className="text-sm text-gray-600">Views</p>
                </div>
              </div>
              
              <div className="flex items-center bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                  <FaClock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{Math.ceil(post.content.length / 1000)} min</p>
                  <p className="text-sm text-gray-600">Read Time</p>
                </div>
              </div>
            </div>

            {/* Enhanced Featured Image */}
            {(() => {
              const processedImageUrl = processImageUrl(post.featuredImage, post.category);
              const hasValidImage = isValidImageUrl(post.featuredImage);
              
              return (
                <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden mb-12 shadow-2xl border-4 border-white">
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
                  
                  {/* Enhanced Fallback */}
                  <div 
                    className={`w-full h-full bg-gradient-to-br from-[#53755d] via-[#3e5d49] to-[#2d4a3a] flex items-center justify-center ${
                      hasValidImage ? 'hidden' : 'flex'
                    }`}
                  >
                    <div className="text-center text-white">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <FaChartLine className="w-16 h-16" />
                      </div>
                      <h3 className="font-bold text-2xl mb-2">{post.category}</h3>
                      <div className="w-24 h-1 bg-white/30 rounded-full mx-auto"></div>
                    </div>
                  </div>
                  
                  {/* Image Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              );
            })()}

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <button
                onClick={handleLike}
                className={`flex items-center px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                  isLiked 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-gray-100 hover:bg-red-500 hover:text-white text-gray-700'
                }`}
              >
                <FaHeart className={`w-5 h-5 mr-3 ${isLiked ? 'text-white' : 'text-red-500'}`} />
                {post.likes || 0} Likes
              </button>
              
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center bg-gray-100 hover:bg-[#53755d] hover:text-white text-gray-700 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                {shareCopied ? <FaCheck className="w-5 h-5 mr-3 text-green-500" /> : <FaCopy className="w-5 h-5 mr-3" />}
                {shareCopied ? 'Copied!' : 'Copy Link'}
              </button>
              
              {/* Social Share Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                  title="Share on Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                  title="Share on Twitter"
                >
                  <FaTwitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                  title="Share on LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#53755d]/5 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#53755d]/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
              
              <div className="relative z-10">
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
                
                {/* Content Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center text-gray-600">
                        <FaEye className="w-5 h-5 mr-2 text-[#53755d]" />
                        <span className="font-semibold">{post.views || 0} views</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaHeart className="w-5 h-5 mr-2 text-[#53755d]" />
                        <span className="font-semibold">{post.likes || 0} likes</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaComment className="w-5 h-5 mr-2 text-[#53755d]" />
                        <span className="font-semibold">0 comments</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date(post.updatedAt || post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AMFI Disclaimer */}
      <section className="py-12 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border-2 border-red-200 shadow-xl">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <FaExclamationTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-800 mb-3">Important Disclaimer</h3>
                  <p className="text-sm text-red-700 leading-relaxed mb-6">
                    Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing. 
                    Past performance does not guarantee future results.
                  </p>
                  <button
                    onClick={() => setShowAMFIDisclaimer(!showAMFIDisclaimer)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    {showAMFIDisclaimer ? 'Hide' : 'Read Full Disclaimer'}
                  </button>
                  {showAMFIDisclaimer && (
                    <div className="mt-6 p-6 bg-red-50 rounded-xl border border-red-200">
                      <p className="text-xs text-red-600 leading-relaxed">
                        The information provided in this article is for educational purposes only and should not be considered as investment advice. 
                        Investors should consult with their financial advisors before making any investment decisions. 
                        AMFI Registration Number: ARN-12345. For more information, visit www.amfiindia.com
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost._id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group transform hover:-translate-y-2">
                    <div className="relative h-48 bg-gradient-to-br from-[#53755d] to-[#3e5d49] overflow-hidden">
                      {(() => {
                        const processedImageUrl = processImageUrl(relatedPost.featuredImage, relatedPost.category);
                        const hasValidImage = isValidImageUrl(relatedPost.featuredImage);
                        
                        return (
                          <>
                            {hasValidImage ? (
                              <img 
                                src={processedImageUrl} 
                                alt={relatedPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
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
                                <p className="font-semibold">{relatedPost.category}</p>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                      
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 text-[#53755d] px-3 py-1 rounded-full text-sm font-semibold">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#53755d] transition-colors duration-300 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                        {relatedPost.excerpt || relatedPost.content.substring(0, 120) + '...'}
                      </p>
                      
                      <button
                        onClick={() => navigate(`/blog/${relatedPost._id}`)}
                        className="inline-flex items-center bg-[#53755d] hover:bg-[#3e5d49] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
                      >
                        Read More
                        <FaArrowLeft className="w-3 h-3 ml-2 rotate-180" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogDetail;
