import React from 'react';
import { FaCalendarAlt, FaUser, FaEye, FaHeart, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-100">
      {/* Cover Image */}
      {blog.featuredImage && (
        <div className="aspect-video bg-gray-100 overflow-hidden relative">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
      )}

      <div className="p-8">
        {/* Category */}
        <div className="mb-4">
          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#53755d] to-[#3e5d49] text-white rounded-full text-sm font-semibold shadow-md">
            {blog.category}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 hover:text-[#53755d] transition-colors duration-300">
          <Link to={`/blog/${blog.slug}`}>
            {blog.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {truncateText(blog.excerpt)}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4 text-[#53755d]" />
              <span className="font-medium">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="w-4 h-4 text-[#53755d]" />
              <span className="font-medium">{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaEye className="w-4 h-4 text-[#53755d]" />
              <span className="font-medium">{blog.views || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeart className="w-4 h-4 text-[#53755d]" />
              <span className="font-medium">{blog.likes || 0}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-[#53755d] hover:text-white transition-colors duration-300"
                >
                  #{tag}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  +{blog.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Read More Button */}
        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-2 text-[#53755d] hover:text-[#3e5d49] font-semibold transition-colors duration-300 group"
        >
          Read More
          <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
