import React from 'react';
import { FaTimes, FaCalendarAlt, FaUser, FaEye, FaHeart, FaShareAlt } from 'react-icons/fa';

const BlogPreviewModal = ({ blog, onClose }) => {
  if (!blog) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Blog Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            {/* Cover Image */}
            {blog.featuredImage && (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Blog Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <FaUser className="w-4 h-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="w-4 h-4" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaEye className="w-4 h-4" />
                <span>{blog.views || 0} views</span>
              </div>
              <div className="flex items-center gap-1">
                <FaHeart className="w-4 h-4" />
                <span>{blog.likes || 0} likes</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>

            {/* Category */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {blog.category}
              </span>
            </div>

            {/* Excerpt */}
            <div className="text-lg text-gray-700 mb-6 leading-relaxed">
              {blog.excerpt}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {/* SEO Preview */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">SEO Preview</h3>
              <div className="space-y-2">
                <div>
                  <div className="text-blue-600 text-lg font-medium">
                    {blog.metaTitle || blog.title}
                  </div>
                  <div className="text-green-600 text-sm">
                    {window.location.origin}/blog/{blog.slug}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {blog.metaDescription || blog.excerpt}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <FaShareAlt className="w-4 h-4" />
              Share
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              blog.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : blog.status === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPreviewModal;
