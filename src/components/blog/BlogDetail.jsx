import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaEye, FaHeart, FaShareAlt, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import BlogService from '../../services/blogService';
import BlogCard from './BlogCard';
import SEO from '../SEO';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getBlogBySlug(slug);
      setBlog(response.blog);
      setLikes(response.blog.likes || 0);
      
      // Fetch related blogs
      const relatedResponse = await BlogService.getPublishedBlogs({
        category: response.blog.category,
        limit: 3
      });
      setRelatedBlogs(relatedResponse.blogs.filter(b => b._id !== response.blog._id));
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!blog || liked) return;
    
    try {
      await BlogService.likeBlog(blog._id);
      setLiked(true);
      setLikes(prev => prev + 1);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2">
          <FaSpinner className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading blog...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={blog?.metaTitle || blog?.title}
        description={blog?.metaDescription || blog?.excerpt}
        keywords={blog?.tags || []}
        image={blog?.featuredImage}
        url={`/blog/${blog?.slug}`}
        type="article"
        author={blog?.author}
        publishedTime={blog?.publishedAt || blog?.createdAt}
        modifiedTime={blog?.updatedAt}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Cover Image */}
            {blog.featuredImage && (
              <div className="aspect-video bg-gray-100">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              {/* Category */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <FaUser className="w-4 h-4" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEye className="w-4 h-4" />
                  <span>{blog.views || 0} views</span>
                </div>
              </div>

              {/* Excerpt */}
              <div className="text-lg text-gray-700 mb-6 leading-relaxed">
                {blog.excerpt}
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="prose max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    disabled={liked}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      liked
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaHeart className="w-4 h-4" />
                    <span>{likes} {liked ? 'Liked' : 'Like'}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaShareAlt className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Related Posts */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <div key={relatedBlog._id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <Link
                        to={`/blog/${relatedBlog.slug}`}
                        className="block hover:text-blue-600 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {relatedBlog.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedBlog.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span>{formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-gray-600 mb-4">
                Get the latest mutual fund insights delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {['SIPs', 'ELSS', 'Market Insights', 'Tax Savings', 'Investment Tips', 'Financial Planning'].map(category => (
                  <Link
                    key={category}
                    to={`/blog?category=${category}`}
                    className="block text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BlogDetail;
