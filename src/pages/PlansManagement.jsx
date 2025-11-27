import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaDownload, 
  FaUpload, FaFilePdf, FaExternalLinkAlt, FaCheck, FaTimes,
  FaSort, FaSortUp, FaSortDown, FaRedo, FaSave, FaTimes as FaClose
} from 'react-icons/fa';
import PlanService from '../services/planService';

const PlansManagement = () => {
  const { adminUser, adminLogout, isAdmin, hasValidAdminToken } = useAdminAuth();
  const navigate = useNavigate();
  
  // State management
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [viewingPlan, setViewingPlan] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSubcategory, setFilterSubcategory] = useState('All');
  const [filterRiskometer, setFilterRiskometer] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('schemeName');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Form data
  const [formData, setFormData] = useState({
    schemeName: '',
    amcName: '',
    category: 'Equity',
    subcategory: 'Large Cap',
    riskometer: 'Moderate',
    nav: 0,
    minInvestment: 0,
    sipAmount: 0,
    expenseRatio: 0,
    exitLoad: '',
    fundManager: '',
    benchmarkIndex: '',
    fundObjective: '',
    documents: {
      sid: '',
      kim: '',
      sai: ''
    },
    status: 'Active'
  });
  
  // Options
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [riskLevels, setRiskLevels] = useState([]);

  // Check admin access
  useEffect(() => {
    if (!isAdmin || !hasValidAdminToken()) {
      navigate('/admin-login');
      return;
    }
    fetchPlans();
    fetchOptions();
  }, [isAdmin, hasValidAdminToken, navigate]);

  // Fetch plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PlanService.getAllPlans({
        category: filterCategory !== 'All' ? filterCategory : undefined,
        subcategory: filterSubcategory !== 'All' ? filterSubcategory : undefined,
        riskometer: filterRiskometer !== 'All' ? filterRiskometer : undefined,
        search: searchTerm || undefined,
        sortBy: sortBy
      });
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to fetch plans. Please check if the backend server is running.');
      setPlans([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
a  };

  // Fetch options with fallback data
  const fetchOptions = async () => {
    try {
      const [categoriesRes, subcategoriesRes, riskLevelsRes] = await Promise.allSettled([
        PlanService.getPlanCategories(),
        PlanService.getPlanSubcategories(),
        PlanService.getPlanRiskLevels()
      ]);
      
      // Set categories with fallback
      if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.data) {
        setCategories(categoriesRes.value.data);
      } else {
        console.warn('Failed to fetch categories, using fallback data');
        setCategories(['Equity', 'Debt', 'Hybrid', 'Solution Oriented', 'Others']);
      }
      
      // Set subcategories with fallback
      if (subcategoriesRes.status === 'fulfilled' && subcategoriesRes.value?.data) {
        setSubcategories(subcategoriesRes.value.data);
      } else {
        console.warn('Failed to fetch subcategories, using fallback data');
        setSubcategories([
          'Large Cap', 'Mid Cap', 'Small Cap', 'ELSS', 'Liquid', 'Ultra Short', 
          'Short Duration', 'Medium Duration', 'Long Duration', 'Gilt', 'Corporate Bond', 
          'Credit Risk', 'Banking & PSU', 'Infrastructure', 'Technology', 'Healthcare', 
          'FMCG', 'Auto', 'Energy', 'Others'
        ]);
      }
      
      // Set risk levels with fallback
      if (riskLevelsRes.status === 'fulfilled' && riskLevelsRes.value?.data) {
        setRiskLevels(riskLevelsRes.value.data);
      } else {
        console.warn('Failed to fetch risk levels, using fallback data');
        setRiskLevels(['Low', 'Moderate', 'High']);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
      // Set fallback data even if all requests fail
      setCategories(['Equity', 'Debt', 'Hybrid', 'Solution Oriented', 'Others']);
      setSubcategories([
        'Large Cap', 'Mid Cap', 'Small Cap', 'ELSS', 'Liquid', 'Ultra Short', 
        'Short Duration', 'Medium Duration', 'Long Duration', 'Gilt', 'Corporate Bond', 
        'Credit Risk', 'Banking & PSU', 'Infrastructure', 'Technology', 'Healthcare', 
        'FMCG', 'Auto', 'Energy', 'Others'
      ]);
      setRiskLevels(['Low', 'Moderate', 'High']);
    }
  };

  // Filter and sort plans
  const filteredAndSortedPlans = plans
    .filter(plan => {
      const matchesSearch = 
        (plan.schemeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plan.amcName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plan.fundObjective || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'All' || plan.category === filterCategory;
      const matchesSubcategory = filterSubcategory === 'All' || plan.subcategory === filterSubcategory;
      const matchesRiskometer = filterRiskometer === 'All' || plan.riskometer === filterRiskometer;
      const matchesStatus = filterStatus === 'All' || plan.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesRiskometer && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [name]: value
      }
    }));
  };

  const resetForm = () => {
    setFormData({
      schemeName: '',
      amcName: '',
      category: 'Equity',
      subcategory: 'Large Cap',
      riskometer: 'Moderate',
      nav: 0,
      minInvestment: 0,
      sipAmount: 0,
      expenseRatio: 0,
      exitLoad: '',
      fundManager: '',
      benchmarkIndex: '',
      fundObjective: '',
      documents: {
        sid: '',
        kim: '',
        sai: ''
      },
      status: 'Active'
    });
    setEditingPlan(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (plan) => {
    setFormData({
      schemeName: plan.schemeName || '',
      amcName: plan.amcName || '',
      category: plan.category || 'Equity',
      subcategory: plan.subcategory || 'Large Cap',
      riskometer: plan.riskometer || 'Moderate',
      nav: plan.nav || 0,
      minInvestment: plan.minInvestment || 0,
      sipAmount: plan.sipAmount || 0,
      expenseRatio: plan.expenseRatio || 0,
      exitLoad: plan.exitLoad || '',
      fundManager: plan.fundManager || '',
      benchmarkIndex: plan.benchmarkIndex || '',
      fundObjective: plan.fundObjective || '',
      documents: plan.documents || {
        sid: '',
        kim: '',
        sai: ''
      },
      status: plan.status || 'Active'
    });
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleView = (plan) => {
    setViewingPlan(plan);
  };

  const handleDelete = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      
      if (editingPlan) {
        await PlanService.updatePlan(editingPlan._id, formData, token);
        alert('Plan updated successfully!');
      } else {
        await PlanService.createPlan(formData, token);
        alert('Plan created successfully!');
      }
      
      setShowForm(false);
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error saving plan. Please try again.');
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await PlanService.deletePlan(planToDelete._id, token);
      alert('Plan deleted successfully!');
      setShowDeleteModal(false);
      setPlanToDelete(null);
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Error deleting plan. Please try again.');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="h-4 w-4 text-gray-400" />;
    return sortOrder === 'asc' ? <FaSortUp className="h-4 w-4" /> : <FaSortDown className="h-4 w-4" />;
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#53755d] via-[#4a6b56] to-[#3e5d49]"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Plans Management
              </h1>
              <p className="text-blue-100 text-lg">Professional mutual fund plans administration</p>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-200">Live System</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-blue-200">{plans.length} Plans</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="group flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              <button
                onClick={adminLogout}
                className="group flex items-center px-6 py-3 bg-red-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-red-600/80 transition-all duration-300 border border-red-400/50"
              >
                <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#53755d] to-[#3e5d49] rounded-xl flex items-center justify-center">
                <FaFilter className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Filters & Search</h2>
                <p className="text-gray-600">Refine your search criteria</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchPlans}
                className="group p-3 text-gray-600 hover:text-[#53755d] hover:bg-[#53755d]/5 rounded-xl transition-all duration-200"
                title="Refresh"
              >
                <FaRedo className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <button
                onClick={handleAddNew}
                className="group flex items-center px-6 py-3 bg-gradient-to-r from-[#53755d] to-[#3e5d49] text-white rounded-xl hover:from-[#3e5d49] hover:to-[#2d4538] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaPlus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add New Plan
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="relative group">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-[#53755d] transition-colors" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53755d]/20 focus:border-[#53755d] transition-all duration-200 bg-gray-50/50 hover:bg-white"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53755d]/20 focus:border-[#53755d] transition-all duration-200 bg-gray-50/50 hover:bg-white cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53755d]/20 focus:border-[#53755d] transition-all duration-200 bg-gray-50/50 hover:bg-white cursor-pointer"
            >
              <option value="All">All Subcategories</option>
              {subcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            
            <select
              value={filterRiskometer}
              onChange={(e) => setFilterRiskometer(e.target.value)}
              className="px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53755d]/20 focus:border-[#53755d] transition-all duration-200 bg-gray-50/50 hover:bg-white cursor-pointer"
            >
              <option value="All">All Risk Levels</option>
              {riskLevels.map(risk => (
                <option key={risk} value={risk}>{risk}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53755d]/20 focus:border-[#53755d] transition-all duration-200 bg-gray-50/50 hover:bg-white cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">
                  {filteredAndSortedPlans.length} of {plans.length} plans
                </span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">
                  {plans.filter(p => p.status === 'Active').length} Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FaTimes className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
                  <div className="text-red-700 space-y-1">
                    <p className="font-medium">{error}</p>
                    <p className="text-sm">Please ensure the backend server is running on port 5000.</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setError(null);
                  fetchPlans();
                  fetchOptions();
                }}
                className="ml-4 px-6 py-3 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Modern Plans Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#53755d]/20 border-t-[#53755d] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">Loading Plans</h3>
                <p className="mt-2 text-gray-600">Please wait while we fetch your data...</p>
              </div>
            </div>
          ) : filteredAndSortedPlans.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <FaSearch className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Plans Found</h3>
                <p className="text-gray-600 mb-6 max-w-md">No plans match your current search criteria. Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('All');
                    setFilterSubcategory('All');
                    setFilterRiskometer('All');
                    setFilterStatus('All');
                  }}
                  className="px-6 py-3 bg-[#53755d] text-white rounded-xl hover:bg-[#3e5d49] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedPlans.map((plan, index) => (
                <div 
                  key={plan._id} 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                          {plan.schemeName || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{plan.subcategory || 'N/A'}</p>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                            {plan.status || 'N/A'}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRiskColor(plan.riskometer)}`}>
                            {plan.riskometer || 'N/A'} Risk
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleView(plan)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(plan)}
                          className="p-2 text-[#53755d] hover:text-[#3e5d49] hover:bg-[#53755d]/5 rounded-lg transition-all duration-200"
                          title="Edit Plan"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete Plan"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">AMC</p>
                        <p className="text-sm font-semibold text-gray-900">{plan.amcName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Category</p>
                        <p className="text-sm font-semibold text-gray-900">{plan.category}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">NAV</p>
                        <p className="text-lg font-bold text-[#53755d]">₹{plan.nav?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Min Investment</p>
                        <p className="text-sm font-semibold text-gray-900">₹{plan.minInvestment?.toLocaleString() || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">Expense Ratio: {plan.expenseRatio?.toFixed(2) || 'N/A'}%</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {plan.fundManager ? `by ${plan.fundManager}` : 'No Manager'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto border border-white/20">
              <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-8 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#53755d] to-[#3e5d49] rounded-xl flex items-center justify-center">
                      <FaEdit className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {editingPlan ? 'Update plan details' : 'Create a new mutual fund plan'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  >
                    <FaClose className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Professional Fields */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Scheme Name *</label>
                    <input
                      type="text"
                      name="schemeName"
                      value={formData.schemeName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53755d]/20 focus:border-[#53755d] transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">AMC / Bank Name *</label>
                    <input
                      type="text"
                      name="amcName"
                      value={formData.amcName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      required
                    >
                      {subcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Riskometer *</label>
                    <select
                      name="riskometer"
                      value={formData.riskometer}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      required
                    >
                      {riskLevels.map(risk => (
                        <option key={risk} value={risk}>{risk}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NAV (₹) *</label>
                    <input
                      type="number"
                      name="nav"
                      value={formData.nav}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Investment (₹) *</label>
                    <input
                      type="number"
                      name="minInvestment"
                      value={formData.minInvestment}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SIP Amount (₹) *</label>
                    <input
                      type="number"
                      name="sipAmount"
                      value={formData.sipAmount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expense Ratio (%) *</label>
                    <input
                      type="number"
                      name="expenseRatio"
                      value={formData.expenseRatio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      step="0.01"
                      min="0"
                      max="15"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exit Load *</label>
                    <input
                      type="text"
                      name="exitLoad"
                      value={formData.exitLoad}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fund Manager *</label>
                    <input
                      type="text"
                      name="fundManager"
                      value={formData.fundManager}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Benchmark Index *</label>
                    <input
                      type="text"
                      name="benchmarkIndex"
                      value={formData.benchmarkIndex}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fund Objective *</label>
                    <textarea
                      name="fundObjective"
                      value={formData.fundObjective}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Document Upload Section */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents Upload</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SID (PDF URL)</label>
                        <input
                          type="url"
                          name="sid"
                          value={formData.documents.sid}
                          onChange={handleDocumentChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">KIM (PDF URL)</label>
                        <input
                          type="url"
                          name="kim"
                          value={formData.documents.kim}
                          onChange={handleDocumentChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SAI (PDF URL)</label>
                        <input
                          type="url"
                          name="sai"
                          value={formData.documents.sai}
                          onChange={handleDocumentChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-12 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="group flex items-center px-8 py-4 bg-gradient-to-r from-[#53755d] to-[#3e5d49] text-white rounded-xl hover:from-[#3e5d49] hover:to-[#2d4538] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                  >
                    <FaSave className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced View Plan Modal */}
        {viewingPlan && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto border border-white/20">
              <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-8 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FaEye className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Plan Details</h2>
                      <p className="text-gray-600 mt-1">View comprehensive plan information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingPlan(null)}
                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  >
                    <FaClose className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Scheme Name:</span>
                        <p className="text-gray-900">{viewingPlan.schemeName || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">AMC Name:</span>
                        <p className="text-gray-900">{viewingPlan.amcName || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Category:</span>
                        <p className="text-gray-900">{viewingPlan.category}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Subcategory:</span>
                        <p className="text-gray-900">{viewingPlan.subcategory || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Riskometer:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(viewingPlan.riskometer)}`}>
                          {viewingPlan.riskometer || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">NAV:</span>
                        <p className="text-gray-900">₹{viewingPlan.nav?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Min Investment:</span>
                        <p className="text-gray-900">₹{viewingPlan.minInvestment?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">SIP Amount:</span>
                        <p className="text-gray-900">₹{viewingPlan.sipAmount?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Expense Ratio:</span>
                        <p className="text-gray-900">{viewingPlan.expenseRatio?.toFixed(2) || 'N/A'}%</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Exit Load:</span>
                        <p className="text-gray-900">{viewingPlan.exitLoad || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Fund Manager:</span>
                      <p className="text-gray-900">{viewingPlan.fundManager || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Benchmark Index:</span>
                      <p className="text-gray-900">{viewingPlan.benchmarkIndex || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(viewingPlan.status)}`}>
                        {viewingPlan.status || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Fund Objective:</span>
                      <p className="text-gray-900 mt-1">{viewingPlan.fundObjective || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {viewingPlan.documents && (viewingPlan.documents.sid || viewingPlan.documents.kim || viewingPlan.documents.sai) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                    <div className="flex space-x-4">
                      {viewingPlan.documents.sid && (
                        <a
                          href={viewingPlan.documents.sid}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <FaFilePdf className="h-4 w-4 mr-2" />
                          SID
                          <FaExternalLinkAlt className="h-3 w-3 ml-2" />
                        </a>
                      )}
                      {viewingPlan.documents.kim && (
                        <a
                          href={viewingPlan.documents.kim}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <FaFilePdf className="h-4 w-4 mr-2" />
                          KIM
                          <FaExternalLinkAlt className="h-3 w-3 ml-2" />
                        </a>
                      )}
                      {viewingPlan.documents.sai && (
                        <a
                          href={viewingPlan.documents.sai}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <FaFilePdf className="h-4 w-4 mr-2" />
                          SAI
                          <FaExternalLinkAlt className="h-3 w-3 ml-2" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full border border-white/20">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaTrash className="h-10 w-10 text-red-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Delete Plan
                </h3>
                
                <p className="text-gray-600 mb-8 text-lg">
                  Are you sure you want to delete this plan? This action cannot be undone.
                </p>
                
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 mb-8 border border-red-200">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">{planToDelete?.schemeName || 'N/A'}</h4>
                  <p className="text-gray-700">{planToDelete?.amcName || 'N/A'}</p>
                  <div className="mt-3 flex items-center justify-center space-x-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(planToDelete?.status)}`}>
                      {planToDelete?.status || 'N/A'}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRiskColor(planToDelete?.riskometer)}`}>
                      {planToDelete?.riskometer || 'N/A'} Risk
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                  >
                    Delete Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansManagement;
