import React from 'react';
import { FaSearch, FaChartBar, FaEye } from 'react-icons/fa';

const FundFilters = React.memo(({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterRisk,
  setFilterRisk,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  categories,
  riskLevels,
  filteredCount,
  totalCount,
  watchlistCount
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search funds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent min-h-[44px]"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent min-h-[44px]"
          >
            <option value="All">All Risk Levels</option>
            {riskLevels.map(risk => (
              <option key={risk} value={risk}>{risk} Risk</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent min-h-[44px]"
          >
            <option value="returns">Sort by Returns</option>
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="aum">Sort by AUM</option>
            <option value="expense">Sort by Expense Ratio</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`min-h-[44px] min-w-[44px] p-3 rounded-lg transition-colors flex items-center justify-center ${
              viewMode === 'grid' ? 'bg-[#53755d] text-white' : 'bg-gray-200 text-gray-600'
            }`}
            title="Grid View"
          >
            <FaChartBar className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`min-h-[44px] min-w-[44px] p-3 rounded-lg transition-colors flex items-center justify-center ${
              viewMode === 'list' ? 'bg-[#53755d] text-white' : 'bg-gray-200 text-gray-600'
            }`}
            title="List View"
          >
            <FaEye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredCount} of {totalCount} funds
        {watchlistCount > 0 && (
          <span className="ml-4">
            • {watchlistCount} in watchlist
          </span>
        )}
      </div>
    </div>
  );
});

FundFilters.displayName = 'FundFilters';

export default FundFilters;
