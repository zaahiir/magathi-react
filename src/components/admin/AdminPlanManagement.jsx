import React, { useState, useEffect } from 'react';
import { 
  FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaPlus, FaChartBar, 
  FaFileAlt, FaUsers, FaChartLine, FaArrowDown, FaCheckCircle,
  FaTimes, FaDownload, FaUpload, FaCog, FaHeart, FaStar
} from 'react-icons/fa';
import PlanService from '../../services/planService';
import { toast } from 'react-toastify';

const AdminPlanManagement = ({ onEdit, onAdd, onView }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ show: false, plan: null });
  const [viewModal, setViewModal] = useState({ show: false, plan: null });
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    totalAUM: 0,
    avgReturns: 0
  });

  const categories = ['Equity', 'Debt', 'Hybrid', 'Solution Oriented', 'Others'];
  const riskLevels = ['Low', 'Moderate', 'High'];
  const statuses = ['Active', 'Inactive'];

  useEffect(() => {
    fetchPlans();
  }, [currentPage, categoryFilter, statusFilter, riskFilter]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await PlanService.getAllPlans();
      let filteredPlans = response.data || [];
      
      // Apply filters
      if (searchTerm) {
        filteredPlans = filteredPlans.filter(plan =>
          (plan.schemeName || plan.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (plan.amcName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (plan.fundManager || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (categoryFilter) {
        filteredPlans = filteredPlans.filter(plan => plan.category === categoryFilter);
      }
      
      if (statusFilter) {
        filteredPlans = filteredPlans.filter(plan => plan.status === statusFilter);
      }
      
      if (riskFilter) {
        filteredPlans = filteredPlans.filter(plan => 
          (plan.riskometer || plan.riskLevel || '').toLowerCase() === riskFilter.toLowerCase()
        );
      }

      setPlans(filteredPlans);
      setTotal(filteredPlans.length);
      
      // Calculate stats
      const activePlans = filteredPlans.filter(plan => plan.status === 'Active');
      const totalAUM = filteredPlans.reduce((sum, plan) => sum + (plan.aum || 0), 0);
      const avgReturns = filteredPlans.length > 0 
        ? filteredPlans.reduce((sum, plan) => sum + (plan.returns || 0), 0) / filteredPlans.length 
        : 0;

      setStats({
        totalPlans: filteredPlans.length,
        activePlans: activePlans.length,
        totalAUM: totalAUM,
        avgReturns: avgReturns
      });
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (plan) => {
    setDeleteModal({ show: true, plan });
  };

  const confirmDelete = async () => {
    if (!deleteModal.plan) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await PlanService.deletePlan(deleteModal.plan._id, token);
      toast.success('Plan deleted successfully');
      fetchPlans();
      setDeleteModal({ show: false, plan: null });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
  };

  const handleView = (plan) => {
    setViewModal({ show: true, plan });
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && plans.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53755d]"></div>
        <span className="ml-3 text-gray-600">Loading plans...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-[#53755d] to-[#3e5d49] rounded-lg">
              <FaFileAlt className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPlans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <FaCheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activePlans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <FaChartBar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total AUM</p>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.totalAUM / 10000000).toFixed(1)}Cr</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
              <FaChartLine className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Returns</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgReturns.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Mutual Fund Plans Management</h2>
            <button
              onClick={onAdd}
              className="flex items-center px-4 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors"
            >
              <FaPlus className="h-4 w-4 mr-2" />
              Add New Plan
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search plans, AMC, or fund manager..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
            >
              <option value="">All Risk Levels</option>
              {riskLevels.map(risk => (
                <option key={risk} value={risk}>{risk}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIP Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.map((plan) => (
                <tr key={plan._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#53755d] to-[#3e5d49] flex items-center justify-center">
                          <FaFileAlt className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {plan.schemeName || plan.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {plan.fundManager || 'Fund Manager not specified'}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {plan.subcategory || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{plan.amcName || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {plan.category || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(plan.riskometer || plan.riskLevel)}`}>
                      {plan.riskometer || plan.riskLevel || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      ₹{plan.nav?.toFixed(2) || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      ₹{plan.sipAmount?.toLocaleString() || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                      {plan.status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(plan)}
                        className="text-[#53755d] hover:text-[#3e5d49] p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit && onEdit(plan)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Edit Plan"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Delete Plan"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {plans.length === 0 && !loading && (
          <div className="text-center py-12">
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No plans found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter || statusFilter || riskFilter
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating a new mutual fund plan.'
              }
            </p>
            {!searchTerm && !categoryFilter && !statusFilter && !riskFilter && (
              <div className="mt-6">
                <button
                  onClick={onAdd}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#53755d] hover:bg-[#3e5d49]"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Add New Plan
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
              <FaTrash className="h-8 w-8 text-red-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Delete Plan
            </h3>
            
            <p className="text-gray-600 text-center mb-2">
              Are you sure you want to delete this mutual fund plan?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                {deleteModal.plan?.schemeName || deleteModal.plan?.name}
              </h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium">AMC:</span> {deleteModal.plan?.amcName || 'N/A'}<br/>
                <span className="font-medium">Category:</span> {deleteModal.plan?.category}<br/>
                <span className="font-medium">Status:</span> {deleteModal.plan?.status}
              </p>
            </div>
            
            <p className="text-red-600 text-sm text-center mb-6">
              This action cannot be undone. The plan will be permanently deleted.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteModal({ show: false, plan: null })}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Plan Details</h3>
                <button
                  onClick={() => setViewModal({ show: false, plan: null })}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              {viewModal.plan && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Scheme Name:</span>
                            <p className="text-gray-900">{viewModal.plan.schemeName || viewModal.plan.name || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">AMC Name:</span>
                            <p className="text-gray-900">{viewModal.plan.amcName || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Fund Manager:</span>
                            <p className="text-gray-900">{viewModal.plan.fundManager || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Category:</span>
                            <p className="text-gray-900">{viewModal.plan.category || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Subcategory:</span>
                            <p className="text-gray-900">{viewModal.plan.subcategory || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">NAV:</span>
                            <p className="text-gray-900">₹{viewModal.plan.nav?.toFixed(2) || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Minimum Investment:</span>
                            <p className="text-gray-900">₹{viewModal.plan.minInvestment?.toLocaleString() || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">SIP Amount:</span>
                            <p className="text-gray-900">₹{viewModal.plan.sipAmount?.toLocaleString() || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Expense Ratio:</span>
                            <p className="text-gray-900">{viewModal.plan.expenseRatio?.toFixed(2) || 'N/A'}%</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Exit Load:</span>
                            <p className="text-gray-900">{viewModal.plan.exitLoad || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk & Performance</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Riskometer:</span>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(viewModal.plan.riskometer || viewModal.plan.riskLevel)}`}>
                            {viewModal.plan.riskometer || viewModal.plan.riskLevel || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Expected Returns:</span>
                          <p className="text-gray-900">{viewModal.plan.returns?.toFixed(2) || 'N/A'}%</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">AUM:</span>
                          <p className="text-gray-900">₹{(viewModal.plan.aum / 10000000)?.toFixed(2) || 'N/A'} Cr</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Benchmark Index:</span>
                          <p className="text-gray-900">{viewModal.plan.benchmarkIndex || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Status & Documents</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Status:</span>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewModal.plan.status)}`}>
                            {viewModal.plan.status || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Launch Date:</span>
                          <p className="text-gray-900">
                            {viewModal.plan.launchDate ? new Date(viewModal.plan.launchDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Rating:</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`h-4 w-4 ${
                                  i < (viewModal.plan.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {viewModal.plan.fundObjective && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Fund Objective</h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {viewModal.plan.fundObjective || viewModal.plan.description || 'No description available'}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setViewModal({ show: false, plan: null });
                        onEdit && onEdit(viewModal.plan);
                      }}
                      className="flex-1 px-6 py-3 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors font-semibold"
                    >
                      Edit Plan
                    </button>
                    <button
                      onClick={() => setViewModal({ show: false, plan: null })}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlanManagement;
