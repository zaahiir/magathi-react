import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSpinner, FaChartLine, FaArrowRight } from 'react-icons/fa';
import BlogCard from './BlogCard';
import BlogService from '../../services/blogService';
import SEO from '../SEO';
import HeaderNav from '../HeaderNav';
import Footer from '../Footer';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const categories = ['SIPs', 'ELSS', 'Market Insights', 'Tax Savings', 'Investment Tips', 'Financial Planning'];

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getPublishedBlogs({
        page: currentPage,
        limit: 9,
        category: selectedCategory || undefined,
        search: searchTerm || undefined
      });
      
      setBlogs(response.blogs);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2">
          <FaSpinner className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading blogs...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Mutual Fund Blog"
        description="Expert insights on mutual funds, SIPs, ELSS, tax savings, and investment strategies. Stay updated with the latest market trends and financial planning tips."
        keywords={['mutual funds', 'SIP', 'ELSS', 'tax savings', 'investment', 'financial planning', 'market insights']}
        url="/blog"
        type="website"
      />
      
      <div className="min-h-screen bg-gray-50">
        <HeaderNav />
        
        {/* Enhanced Hero Section */}
        <section className="relative py-24 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/src/assets/banner-1.jpg')" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center text-white max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Mutual Fund Blog
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                Stay updated with the latest insights on SIPs, ELSS, tax savings, and investment strategies
              </p>
              <nav className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex">
                <a href="/" className="hover:text-green-300 transition-colors">Home</a>
                <span className="text-gray-400">/</span>
                <span className="text-green-300 font-medium">Blog</span>
              </nav>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Enhanced Search and Filters */}
      <div className="mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53755d] focus:border-transparent text-lg transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#53755d] text-white px-6 py-2 rounded-lg hover:bg-[#3e5d49] transition-colors duration-300"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#53755d] to-[#3e5d49] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory) && (
            <div className="text-center">
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-[#53755d] hover:text-[#3e5d49] text-sm font-semibold transition-colors duration-300"
              >
                <FaFilter className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Results Count */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md border border-gray-100">
          <FaChartLine className="w-4 h-4 text-[#53755d]" />
          <p className="text-gray-700 font-medium">
            {total > 0 ? `Showing ${blogs.length} of ${total} blog posts` : 'No blog posts found'}
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      {blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#53755d] hover:text-white hover:border-[#53755d] transition-all duration-300 font-semibold"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-[#53755d] to-[#3e5d49] text-white shadow-lg'
                      : 'border-2 border-gray-200 hover:bg-gray-50 hover:border-[#53755d]'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#53755d] hover:text-white hover:border-[#53755d] transition-all duration-300 font-semibold"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div className="text-gray-400 mb-6">
              <FaFilter className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No blogs found</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Try adjusting your search criteria or browse all categories
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#53755d] to-[#3e5d49] text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <FaArrowRight className="w-4 h-4" />
              View All Blogs
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {loading && blogs.length > 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md">
            <FaSpinner className="w-5 h-5 animate-spin text-[#53755d]" />
            <span className="text-gray-600 font-medium">Loading more blogs...</span>
          </div>
        </div>
      )}
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogList;
