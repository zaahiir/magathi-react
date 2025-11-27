import React, { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaPlus, FaEdit, FaTrash, FaShieldAlt, FaNewspaper, FaChartLine,
  FaUser, FaTable, FaFont, FaIcons, FaMapMarkerAlt,
  FaSearch, FaTh, FaCog, FaSignOutAlt, FaHome, FaChartBar,
  FaFileAlt, FaUsers, FaCog as FaSettings, FaDatabase, FaEye,
  FaTimes, FaImage, FaDownload, FaUpload, FaHeart, FaEnvelope,
  FaPhone, FaIdCard, FaCalendarAlt, FaComment, FaCheckCircle,
  FaExclamationCircle, FaClock, FaTimesCircle
} from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import PlanService from '../services/planService';
import BlogService from '../services/blogService';
import SettingsService from '../services/settingsService';
import HealthInsuranceService from '../services/healthInsuranceService';
import ImageUpload from '../components/ImageUpload';
import SettingsPanel from '../components/SettingsPanel';
import ProfileHeader from '../components/ProfileHeader';
import AdminProfileHeader from '../components/AdminProfileHeader';
import AdminBlogManagement from '../components/admin/AdminBlogManagement';
import AdminPlanManagement from '../components/admin/AdminPlanManagement';

const AdminDashboard = () => {
  const { adminUser, adminLogout, isAdmin, hasValidAdminToken } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [plans, setPlans] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [healthPolicies, setHealthPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingHealthPolicy, setEditingHealthPolicy] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [selectedBlogCategory, setSelectedBlogCategory] = useState('');
  const [selectedBlogStatus, setSelectedBlogStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [blogToView, setBlogToView] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactToView, setContactToView] = useState(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [showContactDeleteModal, setShowContactDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showUserViewModal, setShowUserViewModal] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userEditFormData, setUserEditFormData] = useState({
    name: '',
    email: '',
    username: '',
    status: 'active',
    phone: '',
    profileImage: ''
  });
  const [apiErrors, setApiErrors] = useState({});
  const carouselRef = useRef(null);
  
  const blogCategories = [
    'All', 'Equity Funds', 'SIP Tips', 'Tax Saving'
  ];
  
  const blogStatuses = ['All', 'draft', 'published', 'archived'];
  
  const [analytics, setAnalytics] = useState({
    planUsage: [],
    userRegistrations: [],
    revenueData: []
  });
  const [stats, setStats] = useState({
    totalPlans: 0,
    revenue: 245000,
    activeUsers: 0,
    blogPosts: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    healthPolicies: 0,
    plansGrowth: 12,
    usersGrowth: 245
  });
  const [planFormData, setPlanFormData] = useState({
    // Professional fields
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
    status: 'Active',
    // Legacy fields for backward compatibility
    name: '',
    riskLevel: 'Medium',
    returns: 0,
    aum: 0,
    rating: 1,
    launchDate: '',
    description: ''
  });
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    slug: '',
    category: 'Equity Funds',
    author: '',
    featuredImage: '',
    excerpt: '',
    content: '',
    tags: '',
    metaTitle: '',
    metaDescription: '',
    publishDate: '',
    status: 'draft'
  });
  const [healthPolicyFormData, setHealthPolicyFormData] = useState({
    policyName: '',
    policyType: 'Individual',
    coverageAmount: 0,
    premium: 0,
    duration: 1,
    ageLimit: {
      min: 18,
      max: 65
    },
    description: '',
    benefits: [],
    features: [],
    exclusions: [],
    waitingPeriod: 30,
    claimSettlementRatio: 95,
    networkHospitals: 0,
    cashlessHospitals: 0,
    renewalTerms: 'Annual',
    preExistingDiseaseCoverage: false,
    maternityCoverage: false,
    criticalIllnessCoverage: false,
    accidentalCoverage: false,
    status: 'Active',
    provider: {
      name: '',
      logo: '',
      website: ''
    },
    documents: {
      policyDocument: '',
      termsAndConditions: '',
      brochure: ''
    },
    tags: [],
    isPopular: false,
    isRecommended: false,
    rating: 3
  });

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: FaHome },
    { id: 'plans', name: 'Mutual Fund Plans', icon: FaChartBar },
    { id: 'plans-management', name: 'Plans Management', icon: FaCog },
    { id: 'health-insurance', name: 'Health Insurance', icon: FaHeart },
    { id: 'blogs', name: 'Blog Posts', icon: FaNewspaper },
    { id: 'enquiries', name: 'Contact Enquiries', icon: FaEnvelope },
    { id: 'users', name: 'User Management', icon: FaUsers },
    { id: 'analytics', name: 'Analytics', icon: FaChartLine },
    { id: 'settings', name: 'Settings', icon: FaSettings },
  ];

  // Chart colors
  const COLORS = ['#53755d', '#3e5d49', '#2d4a3a', '#1a3d2e', '#0d2b1f'];
  const CHART_COLORS = {
    primary: '#53755d',
    secondary: '#3e5d49',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  };

  useEffect(() => {
    // Check if user is authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      console.log('No admin token found, redirecting to login');
      navigate('/admin-login');
      return;
    }
    
    // Load dashboard data
    fetchDashboardData();

    // Only fetch data if we're on the relevant tab to avoid unnecessary network calls
    if (activeTab === 'plans') {
      fetchPlans();
    } else if (activeTab === 'blogs') {
      fetchBlogs();
    } else if (activeTab === 'enquiries') {
      fetchContacts();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'health-insurance') {
      fetchHealthPolicies();
    } else if (activeTab === 'analytics') {
      generateAnalytics();
    } else if (activeTab === 'dashboard') {
      // Generate analytics for dashboard view
      generateAnalytics();
    }
    
  }, [activeTab, navigate, hasValidAdminToken]);

  // Initialize Owl Carousel when dashboard tab is active
  useEffect(() => {
    if (activeTab === 'dashboard') {
      // Load Owl Carousel CSS and JS dynamically
      const loadOwlCarousel = () => {
        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css';
        document.head.appendChild(cssLink);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js';
        script.onload = () => {
          // Initialize carousel after script loads
          if (window.$ && window.$.fn.owlCarousel) {
            $('.stats-carousel').owlCarousel({
              loop: true,
              margin: 24,
              nav: false,
              dots: false,
              autoplay: true,
              autoplayTimeout: 3000,
              autoplayHoverPause: true,
              responsive: {
                0: {
                  items: 1
                },
                768: {
                  items: 2
                },
                1024: {
                  items: 3
                },
                1280: {
                  items: 4
                }
              }
            });
          }
        };
        document.head.appendChild(script);
      };

      // Load jQuery first if not already loaded
      if (!window.$) {
        const jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        jqueryScript.onload = loadOwlCarousel;
        document.head.appendChild(jqueryScript);
      } else {
        loadOwlCarousel();
      }
    }
  }, [activeTab]);

  // Fetch dashboard data function
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all dashboard data in parallel
      await Promise.all([
        fetchPlans(),
        fetchBlogs(),
        fetchContacts(),
        fetchUsers(),
        fetchHealthPolicies()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Separate useEffect to update stats when data changes
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalPlans: plans.length,
      blogPosts: blogs.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      totalEnquiries: contacts.length,
      newEnquiries: contacts.filter(c => c.status === 'new').length,
      healthPolicies: healthPolicies.length
    }));
  }, [plans.length, blogs.length, users.length, contacts.length, healthPolicies.length]);


  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await PlanService.getAllPlans();
      // Handle both old and new response formats
      setPlans(response.data || response || []);
    } catch (error) {
      // Only log non-connection errors to reduce console spam
      const isConnectionError = error.message?.includes('Failed to fetch') || 
                               error.message?.includes('ERR_CONNECTION_REFUSED') ||
                               error.message?.includes('NetworkError') ||
                               error.message?.includes('ERR_NETWORK');
      
      if (!isConnectionError) {
        console.error('Error fetching plans:', error);
      }
      // Set empty array as fallback to prevent network errors from breaking the UI
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setApiErrors(prev => ({ ...prev, blogs: null }));
      const response = await BlogService.getAllBlogs();
      setBlogs(response.blogs || []);
      setFilteredBlogs(response.blogs || []);
      setApiErrors(prev => ({ ...prev, blogs: null }));
    } catch (error) {
      // Only log non-connection errors to reduce console spam
      const isConnectionError = error.message?.includes('Failed to fetch') || 
                               error.message?.includes('ERR_CONNECTION_REFUSED') ||
                               error.message?.includes('NetworkError') ||
                               error.message?.includes('ERR_NETWORK');
      
      if (!isConnectionError) {
        console.error('Error fetching blogs:', error);
        if (error.response?.status === 401 || error.showError) {
          setApiErrors(prev => ({ 
            ...prev, 
            blogs: error.errorMessage || 'Authentication failed (401). Please check your admin token.' 
          }));
        } else {
          setApiErrors(prev => ({ 
            ...prev, 
            blogs: error.message || 'Failed to fetch blogs. Please try again.' 
          }));
        }
      }
      // Set empty array as fallback to prevent network errors from breaking the UI
      setBlogs([]);
      setFilteredBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs based on search term, category, and status
  const filterBlogs = () => {
    let filtered = blogs;

    if (blogSearchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(blogSearchTerm.toLowerCase())
      );
    }

    if (selectedBlogCategory && selectedBlogCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedBlogCategory);
    }

    if (selectedBlogStatus && selectedBlogStatus !== 'All') {
      filtered = filtered.filter(blog => blog.status === selectedBlogStatus);
    }

    setFilteredBlogs(filtered);
  };

  // Effect to filter blogs when filters change
  useEffect(() => {
    filterBlogs();
  }, [blogs, blogSearchTerm, selectedBlogCategory, selectedBlogStatus]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setApiErrors(prev => ({ ...prev, contacts: null }));
      const token = localStorage.getItem('adminToken');
      // Use relative URL to leverage Vite proxy
      const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
      const normalizedAPI_BASE_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
      
      const response = await fetch(`${normalizedAPI_BASE_URL}/contact/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setApiErrors(prev => ({ 
            ...prev, 
            contacts: 'Authentication failed (401). Please check your admin token or contact administrator.' 
          }));
          setContacts([]);
          return;
        }
        setApiErrors(prev => ({ 
          ...prev, 
          contacts: `Failed to fetch contacts: ${response.status} ${response.statusText}` 
        }));
        setContacts([]);
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setContacts(data.data.contacts || []);
        setApiErrors(prev => ({ ...prev, contacts: null }));
      } else {
        setContacts([]);
      }
    } catch (error) {
      // Only log non-connection errors to reduce console spam
      const isConnectionError = error.message?.includes('Failed to fetch') || 
                               error.message?.includes('ERR_CONNECTION_REFUSED') ||
                               error.message?.includes('NetworkError') ||
                               error.message?.includes('ERR_NETWORK') ||
                               error.name === 'AbortError' ||
                               error.message?.includes('timeout');
      
      if (!isConnectionError) {
        console.error('Error fetching contacts:', error);
        setApiErrors(prev => ({ 
          ...prev, 
          contacts: error.message || 'Failed to fetch contacts. Please try again.' 
        }));
      }
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setApiErrors(prev => ({ ...prev, users: null }));
      const token = localStorage.getItem('adminToken');
      // Use relative URL to leverage Vite proxy
      const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
      const normalizedAPI_BASE_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
      
      const response = await fetch(`${normalizedAPI_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        setApiErrors(prev => ({ ...prev, users: null }));
        // Transform the data to match the expected format
        const transformedUsers = data.users.map(user => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          username: user.email.split('@')[0], // Use email prefix as username
          profileImage: user.profileImage || null,
          loginTime: user.lastLogin ? new Date(user.lastLogin).toISOString() : new Date().toISOString(),
          planSubscriptions: user.planSubscriptions || [],
          status: user.isActive ? 'active' : 'inactive',
          lastInvestment: user.lastInvestment ? new Date(user.lastInvestment).toISOString() : new Date(Date.now() - 86400000).toISOString(),
          totalInvestments: user.totalInvestments || 0,
          createdAt: user.createdAt,
          phone: user.phone,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified
        }));
        setUsers(transformedUsers);
      } else {
        // Only log non-connection errors
        if (response.status === 401) {
          setApiErrors(prev => ({ 
            ...prev, 
            users: 'Authentication failed (401). Please check your admin token or contact administrator.' 
          }));
        } else {
          setApiErrors(prev => ({ 
            ...prev, 
            users: `Failed to fetch users: ${response.status} ${response.statusText}` 
          }));
        }
        console.error('Error fetching users:', response.statusText);
        // Fallback to mock data if API fails
        const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          username: 'johndoe',
          profileImage: null,
          loginTime: new Date().toISOString(),
          planSubscriptions: ['Plan A', 'Plan B'],
          status: 'active',
          lastInvestment: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          totalInvestments: 2
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          username: 'janesmith',
          profileImage: 'https://via.placeholder.com/150',
          loginTime: new Date(Date.now() - 3600000).toISOString(),
          planSubscriptions: ['Plan C'],
          status: 'active',
          lastInvestment: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          totalInvestments: 1
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          username: 'mikej',
          profileImage: null,
          loginTime: new Date(Date.now() - 7200000).toISOString(),
          planSubscriptions: ['Plan A', 'Plan C', 'Plan D'],
          status: 'inactive',
          lastInvestment: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          totalInvestments: 3
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          username: 'sarahw',
          profileImage: null,
          loginTime: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          planSubscriptions: ['Plan B'],
          status: 'active',
          lastInvestment: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          totalInvestments: 1
        }
      ];
      setUsers(mockUsers);
      }
    } catch (error) {
      // Only log non-connection errors to reduce console spam
      const isConnectionError = error.message?.includes('Failed to fetch') || 
                               error.message?.includes('ERR_CONNECTION_REFUSED') ||
                               error.message?.includes('NetworkError') ||
                               error.message?.includes('ERR_NETWORK') ||
                               error.name === 'AbortError' ||
                               error.message?.includes('timeout');
      
      if (!isConnectionError) {
        console.error('Error fetching users:', error);
      }
      // Fallback to empty array if API fails (no mock data to reduce confusion)
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthPolicies = async () => {
    try {
      setLoading(true);
      const response = await HealthInsuranceService.getAllPolicies();
      // Handle both old and new response formats
      setHealthPolicies(response.data?.policies || response.policies || []);
    } catch (error) {
      // Only log non-connection errors to reduce console spam
      const isConnectionError = error.message?.includes('Failed to fetch') || 
                               error.message?.includes('ERR_CONNECTION_REFUSED') ||
                               error.message?.includes('NetworkError') ||
                               error.message?.includes('ERR_NETWORK');
      
      if (!isConnectionError) {
        console.error('Error fetching health insurance policies:', error);
      }
      setHealthPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalytics = () => {
    // Plan usage analytics with more realistic data
    const planUsage = plans.length > 0 ? plans.map(plan => ({
      name: plan.name.length > 15 ? plan.name.substring(0, 15) + '...' : plan.name,
      users: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(plan.returns * 1000) + Math.floor(Math.random() * 50000),
      category: plan.category
    })) : [
      { name: 'Equity Fund', users: 25, revenue: 75000, category: 'Equity' },
      { name: 'Debt Fund', users: 18, revenue: 45000, category: 'Debt' },
      { name: 'Hybrid Fund', users: 12, revenue: 35000, category: 'Hybrid' },
      { name: 'Large Cap', users: 30, revenue: 90000, category: 'Equity' },
      { name: 'Small Cap', users: 8, revenue: 25000, category: 'Equity' }
    ];

    // User registration data for last 7 days
    const userRegistrations = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: Math.floor(Math.random() * 20) + 5
    }));

    // Revenue data for last 12 months
    const revenueData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
      revenue: Math.floor(Math.random() * 100000) + 50000
    }));

    // console.log('Generated analytics:', { planUsage, userRegistrations, revenueData });
    
    setAnalytics({
      planUsage,
      userRegistrations,
      revenueData
    });
  };

  // Card selection functions
  const toggleCardSelection = (cardId) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Carousel scroll functions
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };


  // User CRUD operations
  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setUserEditFormData({
      name: user.name || '',
      email: user.email || '',
      username: user.username || '',
      status: user.status || 'active',
      phone: user.phone || '',
      profileImage: user.profileImage || ''
    });
    setShowUserEditModal(true);
  };

  const handleUserDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully!');
    }
  };

  const handleUserView = (user) => {
    setSelectedUser(user);
    setShowUserViewModal(true);
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Prepare update data
      const updateData = {
        ...userEditFormData
      };
      
      // Make API call to update user
      // Use relative URL to leverage Vite proxy
      const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
      const normalizedAPI_BASE_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
      const response = await fetch(`${normalizedAPI_BASE_URL}/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? { ...user, ...updateData } : user
        ));
        
        setShowUserEditModal(false);
        setSelectedUser(null);
        
        toast.success('User updated successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(`Error: ${error.message || 'Failed to update user'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePlanInputChange = (e) => {
    const { name, value } = e.target;
    setPlanFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlogInputChange = (e) => {
    const { name, value } = e.target;
    setBlogFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Auto-generate slug from title
      if (name === 'title') {
        const slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .trim();
        newData.slug = slug;
        
        // Auto-generate meta title if not set
        if (!prev.metaTitle) {
          newData.metaTitle = value;
        }
      }
      
      return newData;
    });
  };

  const handleHealthPolicyInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHealthPolicyFormData(prev => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        };
      }
      
      if (name === 'benefits' || name === 'features' || name === 'exclusions' || name === 'tags') {
        return {
          ...prev,
          [name]: value.split(',').map(item => item.trim()).filter(item => item)
        };
      }
      
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
    });
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!hasValidAdminToken()) {
        alert('No admin authentication token found. Please login again.');
        navigate('/admin-login');
        return;
      }
      
      const token = localStorage.getItem('adminToken');
      console.log('Token from localStorage:', token);
      
      if (editingPlan) {
        await PlanService.updatePlan(editingPlan._id, planFormData, token);
        toast.success('Plan updated successfully!');
      } else {
        await PlanService.createPlan(planFormData, token);
        toast.success('Plan created successfully!');
      }
      
      setShowAddForm(false);
      setEditingPlan(null);
      setPlanFormData({
        // Professional fields
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
        status: 'Active',
        // Legacy fields for backward compatibility
        name: '',
        riskLevel: 'Medium',
        returns: 0,
        aum: 0,
        rating: 1,
        launchDate: '',
        description: ''
      });
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Error saving plan. Please try again.');
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!hasValidAdminToken()) {
        alert('No admin authentication token found. Please login again.');
        navigate('/admin-login');
        return;
      }
      
      const token = localStorage.getItem('adminToken');
      const blogData = {
        ...blogFormData,
        tags: blogFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      if (editingBlog) {
        await BlogService.updateBlog(editingBlog._id, blogData, token);
        setSuccessMessage('Blog updated successfully!');
        setShowSuccessModal(true);
      } else {
        await BlogService.createBlog(blogData, token);
        setSuccessMessage('Blog created successfully!');
        setShowSuccessModal(true);
      }
      
      setShowAddForm(false);
      setEditingBlog(null);
      setBlogFormData({
        title: '',
        slug: '',
        category: 'Equity Funds',
        author: '',
        featuredImage: '',
        excerpt: '',
        content: '',
        tags: '',
        metaTitle: '',
        metaDescription: '',
        publishDate: '',
        status: 'draft'
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog. Please try again.');
    }
  };

  const handleHealthPolicySubmit = async (e) => {
    e.preventDefault();
    try {
      if (!hasValidAdminToken()) {
        alert('No admin authentication token found. Please login again.');
        navigate('/admin-login');
        return;
      }
      
      const token = localStorage.getItem('adminToken');
      
      if (editingHealthPolicy) {
        await HealthInsuranceService.updatePolicy(editingHealthPolicy._id, healthPolicyFormData, token);
        toast.success('Health insurance policy updated successfully!');
      } else {
        await HealthInsuranceService.createPolicy(healthPolicyFormData, token);
        toast.success('Health insurance policy created successfully!');
      }
      
      setShowAddForm(false);
      setEditingHealthPolicy(null);
      setHealthPolicyFormData({
        policyName: '',
        policyType: 'Individual',
        coverageAmount: 0,
        premium: 0,
        duration: 1,
        ageLimit: {
          min: 18,
          max: 65
        },
        description: '',
        benefits: [],
        features: [],
        exclusions: [],
        waitingPeriod: 30,
        claimSettlementRatio: 95,
        networkHospitals: 0,
        cashlessHospitals: 0,
        renewalTerms: 'Annual',
        preExistingDiseaseCoverage: false,
        maternityCoverage: false,
        criticalIllnessCoverage: false,
        accidentalCoverage: false,
        status: 'Active',
        provider: {
          name: '',
          logo: '',
          website: ''
        },
        documents: {
          policyDocument: '',
          termsAndConditions: '',
          brochure: ''
        },
        tags: [],
        isPopular: false,
        isRecommended: false,
        rating: 3
      });
      fetchHealthPolicies();
    } catch (error) {
      console.error('Error saving health insurance policy:', error);
      toast.error('Error saving health insurance policy. Please try again.');
    }
  };

  const handlePlanEdit = (plan) => {
    setEditingPlan(plan);
    setPlanFormData({
      // Professional fields
      schemeName: plan.schemeName || plan.name || '',
      amcName: plan.amcName || '',
      category: plan.category || 'Equity',
      subcategory: plan.subcategory || 'Large Cap',
      riskometer: plan.riskometer || plan.riskLevel || 'Moderate',
      nav: plan.nav || 0,
      minInvestment: plan.minInvestment || 0,
      sipAmount: plan.sipAmount || 0,
      expenseRatio: plan.expenseRatio || 0,
      exitLoad: plan.exitLoad || '',
      fundManager: plan.fundManager || '',
      benchmarkIndex: plan.benchmarkIndex || '',
      fundObjective: plan.fundObjective || plan.description || '',
      documents: plan.documents || {
        sid: '',
        kim: '',
        sai: ''
      },
      status: plan.status || 'Active',
      // Legacy fields for backward compatibility
      name: plan.name || plan.schemeName || '',
      riskLevel: plan.riskLevel || plan.riskometer || 'Medium',
      returns: plan.returns || 0,
      aum: plan.aum || 0,
      rating: plan.rating || 1,
      launchDate: plan.launchDate ? new Date(plan.launchDate).toISOString().split('T')[0] : '',
      description: plan.description || plan.fundObjective || ''
    });
    setShowAddForm(true);
  };

  const handlePlanDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await PlanService.deletePlan(planId, token);
        toast.success('Plan deleted successfully!');
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
        toast.error('Error deleting plan. Please try again.');
      }
    }
  };

  const handleHealthPolicyEdit = (policy) => {
    setEditingHealthPolicy(policy);
    setHealthPolicyFormData({
      policyName: policy.policyName || '',
      policyType: policy.policyType || 'Individual',
      coverageAmount: policy.coverageAmount || 0,
      premium: policy.premium || 0,
      duration: policy.duration || 1,
      ageLimit: policy.ageLimit || { min: 18, max: 65 },
      description: policy.description || '',
      benefits: policy.benefits || [],
      features: policy.features || [],
      exclusions: policy.exclusions || [],
      waitingPeriod: policy.waitingPeriod || 30,
      claimSettlementRatio: policy.claimSettlementRatio || 95,
      networkHospitals: policy.networkHospitals || 0,
      cashlessHospitals: policy.cashlessHospitals || 0,
      renewalTerms: policy.renewalTerms || 'Annual',
      preExistingDiseaseCoverage: policy.preExistingDiseaseCoverage || false,
      maternityCoverage: policy.maternityCoverage || false,
      criticalIllnessCoverage: policy.criticalIllnessCoverage || false,
      accidentalCoverage: policy.accidentalCoverage || false,
      status: policy.status || 'Active',
      provider: policy.provider || { name: '', logo: '', website: '' },
      documents: policy.documents || { policyDocument: '', termsAndConditions: '', brochure: '' },
      tags: policy.tags || [],
      isPopular: policy.isPopular || false,
      isRecommended: policy.isRecommended || false,
      rating: policy.rating || 3
    });
    setShowAddForm(true);
  };

  const handleHealthPolicyDelete = async (policyId) => {
    if (window.confirm('Are you sure you want to delete this health insurance policy?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await HealthInsuranceService.deletePolicy(policyId, token);
        toast.success('Health insurance policy deleted successfully!');
        fetchHealthPolicies();
      } catch (error) {
        console.error('Error deleting health insurance policy:', error);
        toast.error('Error deleting health insurance policy. Please try again.');
      }
    }
  };

  // Professional CRUD functions
  const handleBlogView = (blog) => {
    setBlogToView(blog);
    setShowViewModal(true);
  };

  const handleBlogEdit = (blog) => {
    setEditingBlog(blog);
    setBlogFormData({
      title: blog.title,
      slug: blog.slug || '',
      category: blog.category,
      author: blog.author || '',
      featuredImage: blog.featuredImage || '',
      excerpt: blog.excerpt,
      content: blog.content,
      tags: blog.tags ? blog.tags.join(', ') : '',
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      publishDate: blog.publishDate ? new Date(blog.publishDate).toISOString().split('T')[0] : '',
      status: blog.status
    });
    setShowAddForm(true);
  };

  const handleBlogDelete = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const confirmBlogDelete = async () => {
    if (!blogToDelete) return;
    
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await BlogService.deleteBlog(blogToDelete._id, token);
      
      toast.success('Blog deleted successfully!');
      
      fetchBlogs();
      setShowDeleteModal(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Error deleting blog. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlogStatusChange = async (blog, newStatus) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const updatedBlog = {
        ...blog,
        status: newStatus,
        publishedAt: newStatus === 'published' ? new Date() : blog.publishedAt
      };
      
      await BlogService.updateBlog(blog._id, updatedBlog, token);
      
      toast.success(`Blog ${newStatus} successfully!`);
      
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog status:', error);
      toast.error('Error updating blog status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleContactStatusUpdate = async (contactId, newStatus) => {
    try {
      setActionLoading(true);
      
      // If status is 'deleted', call the delete API instead of status update
      if (newStatus === 'deleted') {
        const token = localStorage.getItem('adminToken');
        // Use relative URL to leverage Vite proxy
        const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
        const normalizedAPI_BASE_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
        const response = await fetch(`${normalizedAPI_BASE_URL}/contact/admin/${contactId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          // Remove the contact from the local state
          setContacts(prev => prev.filter(contact => contact._id !== contactId));
          
          toast.success('Contact deleted successfully!');
        } else {
          throw new Error(data.message || 'Failed to delete contact');
        }
        return;
      }
      
      // For other statuses, make API call
      const token = localStorage.getItem('adminToken');
      // Use relative URL to leverage Vite proxy
      const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
      const normalizedAPI_BASE_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
      const response = await fetch(`${normalizedAPI_BASE_URL}/contact/admin/${contactId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        // Update the contact in the local state
        setContacts(prev => prev.map(contact => 
          contact._id === contactId 
            ? { ...contact, status: newStatus }
            : contact
        ));
        
        toast.success('Contact status updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update contact status');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error(`Error: ${error.message || 'Failed to update contact status'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleContactView = (contact) => {
    setContactToView(contact);
    setShowContactModal(true);
  };

  const handleContactDelete = (contact) => {
    setContactToDelete(contact);
    setShowContactDeleteModal(true);
  };

  const confirmContactDelete = async () => {
    if (!contactToDelete) return;
    
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      // Use relative URL to leverage Vite proxy
      const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
      const normalizedAPI_BASE_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
      const response = await fetch(`${normalizedAPI_BASE_URL}/contact/admin/${contactToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        // Remove the contact from the local state
        setContacts(prev => prev.filter(contact => contact._id !== contactToDelete._id));
        
        toast.success('Contact deleted successfully!');
        
        setShowContactDeleteModal(false);
        setContactToDelete(null);
      } else {
        throw new Error(data.message || 'Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Error deleting contact. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelContactDelete = () => {
    // Simply close the modal without making any API calls
    setShowContactDeleteModal(false);
    setContactToDelete(null);
  };


  // Close profile panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfilePanel && !event.target.closest('.profile-panel-container')) {
        setShowProfilePanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfilePanel]);

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <FaShieldAlt className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the admin dashboard. This area is restricted to administrators only.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-[#53755d] text-white py-3 px-4 rounded-lg hover:bg-[#3e5d49] transition-colors font-semibold"
              >
                Go to Home
              </button>
              <button
                onClick={() => navigate('/mutual-funds-plan')}
                className="w-full border border-[#53755d] text-[#53755d] py-3 px-4 rounded-lg hover:bg-[#53755d] hover:text-white transition-colors font-semibold"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex admin-dashboard">
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        body {
          overflow-x: hidden;
        }
        .admin-dashboard {
          overflow-x: hidden;
          width: 100vw;
        }
        .admin-dashboard > div {
          min-width: 0;
        }
        
        /* Owl Carousel Custom Styles */
        .stats-carousel .owl-stage {
          display: flex;
          align-items: stretch;
          margin-bottom: 2.5rem;
        }
        .stats-carousel .owl-item {
          display: flex;
          align-items: stretch;
          width: 350px !important;
          margin-right: 24px;
        }
        .stats-carousel .item {
          width: 350px;
          height: 100%;
          margin-right: 24px;
        }
        
        /* Sidebar hover effects */
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        /* Sidebar navigation improvements */
        .sidebar-nav-item {
          position: relative;
          overflow: hidden;
        }
        
        .sidebar-nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }
        
        .sidebar-nav-item:hover::before {
          left: 100%;
        }
      `}</style>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} bg-gradient-to-b from-[#53755d] to-[#3e5d49] text-white transition-all duration-300 flex flex-col min-h-screen`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <h1 className={`text-xl font-bold block text-center ${sidebarOpen ? 'block' : 'hidden'}`}>
            MAGATHI ADMIN
          </h1>
          <div className={`${sidebarOpen ? 'hidden' : 'block'} text-center`}>
            <FaDatabase className="h-8 w-8 mx-auto" />
          </div>
          {sidebarOpen && (
            <div className="mt-2 text-sm text-white/70 text-center">
              Admin Portal
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-4 rounded-xl transition-all duration-200 sidebar-nav-item ${
                      activeTab === item.id
                        ? 'bg-white/25 text-white shadow-lg transform scale-105'
                        : 'text-white/80 hover:bg-white/15 hover:text-white hover:transform hover:scale-102'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span className="ml-4 text-sm font-medium truncate">{item.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Admin Profile Section */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaUser className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {adminUser?.name || 'Admin User'}
                </p>
                <p className="text-xs text-white/60 truncate">
                  {adminUser?.email || 'admin@magathi.com'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 mr-4 text-gray-600 hover:text-gray-900"
              >
                <FaTh className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                />
              </div>
              
              {/* Admin Profile Header with Notifications */}
              <AdminProfileHeader />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* API Error Messages */}
              {Object.keys(apiErrors).length > 0 && Object.values(apiErrors).some(err => err) && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FaExclamationCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-red-800 mb-2">API Errors Detected</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                        {apiErrors.blogs && <li>Blogs: {apiErrors.blogs}</li>}
                        {apiErrors.users && <li>Users: {apiErrors.users}</li>}
                        {apiErrors.contacts && <li>Contacts: {apiErrors.contacts}</li>}
                        {apiErrors.notifications && <li>Notifications: {apiErrors.notifications}</li>}
                      </ul>
                      <p className="text-xs text-red-600 mt-2">
                        Please check your authentication token or contact your administrator if the issue persists.
                      </p>
                    </div>
                    <button
                      onClick={() => setApiErrors({})}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Stats Cards Owl Carousel */}
              <div className="owl-carousel owl-theme stats-carousel">
                <div className="item">
                  <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-200 cursor-pointer hover:shadow-xl ${
                    selectedCards.has('plans') ? 'ring-2 ring-[#53755d] shadow-xl' : ''
                  }`} onClick={() => toggleCardSelection('plans')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-r from-[#53755d] to-[#3e5d49] rounded-lg">
                          <FaFileAlt className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Plans</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.totalPlans}</p>
                          <p className="text-sm text-green-600">▲ {stats.plansGrowth}% from last month</p>
                        </div>
                      </div>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <FaHeart className={`h-5 w-5 ${selectedCards.has('plans') ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="item">
                  <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-200 cursor-pointer hover:shadow-xl ${
                    selectedCards.has('revenue') ? 'ring-2 ring-[#53755d] shadow-xl' : ''
                  }`} onClick={() => toggleCardSelection('revenue')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                          <FaChartBar className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">₹{stats.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Last 30 days</p>
                        </div>
                      </div>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <FaHeart className={`h-5 w-5 ${selectedCards.has('revenue') ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="item">
                  <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-200 cursor-pointer hover:shadow-xl ${
                    selectedCards.has('users') ? 'ring-2 ring-[#53755d] shadow-xl' : ''
                  }`} onClick={() => toggleCardSelection('users')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                          <FaUsers className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Active Users</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                          <p className="text-sm text-green-600">+{stats.usersGrowth} this week</p>
                        </div>
                      </div>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <FaHeart className={`h-5 w-5 ${selectedCards.has('users') ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="item">
                  <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-200 cursor-pointer hover:shadow-xl ${
                    selectedCards.has('blogs') ? 'ring-2 ring-[#53755d] shadow-xl' : ''
                  }`} onClick={() => toggleCardSelection('blogs')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                          <FaNewspaper className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.blogPosts}</p>
                          <p className="text-sm text-gray-500">Published</p>
                        </div>
                      </div>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <FaHeart className={`h-5 w-5 ${selectedCards.has('blogs') ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="item">
                  <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-200 cursor-pointer hover:shadow-xl ${
                    selectedCards.has('enquiries') ? 'ring-2 ring-[#53755d] shadow-xl' : ''
                  }`} onClick={() => toggleCardSelection('enquiries')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                          <FaEnvelope className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Contact Enquiries</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.totalEnquiries}</p>
                          <p className="text-sm text-orange-600">{stats.newEnquiries} new</p>
                        </div>
                      </div>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <FaHeart className={`h-5 w-5 ${selectedCards.has('enquiries') ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="item">
                  <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-200 cursor-pointer hover:shadow-xl ${
                    selectedCards.has('health') ? 'ring-2 ring-[#53755d] shadow-xl' : ''
                  }`} onClick={() => toggleCardSelection('health')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg">
                          <FaHeart className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Health Insurance</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.healthPolicies}</p>
                          <p className="text-sm text-pink-600">Policies</p>
                        </div>
                      </div>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <FaHeart className={`h-5 w-5 ${selectedCards.has('health') ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Usage Distribution</h3>
                  <div className="h-64">
                    {analytics.planUsage.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.planUsage}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="users"
                          >
                            {analytics.planUsage.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No plan data available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registration Trend</h3>
                  <div className="h-64">
                    {analytics.userRegistrations.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.userRegistrations}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="users" 
                            stroke={CHART_COLORS.primary} 
                            fill={CHART_COLORS.primary}
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No user data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan</h3>
                  <div className="h-64">
                    {analytics.planUsage.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.planUsage}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                          <Bar dataKey="revenue" fill={CHART_COLORS.primary} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No revenue data available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
                  <div className="h-64">
                    {analytics.revenueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke={CHART_COLORS.success} 
                            strokeWidth={3}
                            dot={{ fill: CHART_COLORS.success, strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No revenue data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Plans Management */}
          {activeTab === 'plans-management' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Professional Plans Management</h3>
                <button
                  onClick={() => navigate('/plans-management')}
                  className="flex items-center px-4 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors"
                >
                  <FaCog className="h-4 w-4 mr-2" />
                  Open Plans Management
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-[#53755d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCog className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Professional CRUD Operations</h4>
                <p className="text-gray-600 mb-6">
                  Access the dedicated plans management interface with advanced filtering, sorting, and professional CRUD operations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <FaPlus className="h-4 w-4 mr-2 text-green-600" />
                    Create Plans
                  </div>
                  <div className="flex items-center justify-center">
                    <FaEdit className="h-4 w-4 mr-2 text-blue-600" />
                    Edit Plans
                  </div>
                  <div className="flex items-center justify-center">
                    <FaTrash className="h-4 w-4 mr-2 text-red-600" />
                    Delete Plans
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plans Management */}
          {activeTab === 'plans' && (
            <AdminPlanManagement 
              onEdit={handlePlanEdit}
              onAdd={() => {
                setShowAddForm(true);
                setEditingPlan(null);
                setPlanFormData({
                  // Professional fields
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
                  status: 'Active',
                  // Legacy fields for backward compatibility
                  name: '',
                  riskLevel: 'Medium',
                  returns: 0,
                  aum: 0,
                  rating: 1,
                  launchDate: '',
                  description: ''
                });
              }}
            />
          )}

          {/* Blogs Management */}
          {activeTab === 'blogs' && (
            <AdminBlogManagement />
          )}

          {/* Contact Enquiries Management */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Contact Enquiries</h3>
                <div className="text-sm text-gray-500">
                  Total Enquiries: {contacts.length} | New: {contacts.filter(c => c.status === 'new').length}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Contact Enquiries ({contacts.length})
                  </h2>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53755d]"></div>
                    <span className="ml-3 text-gray-600">Loading enquiries...</span>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="w-full table-fixed">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Phone</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Subject</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contacts.map((contact) => (
                          <tr key={contact._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-900 truncate">{contact.firstName} {contact.lastName}</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 truncate">{contact.email}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 truncate">{contact.phone}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 truncate" title={contact.subject}>{contact.subject}</td>
                            <td className="px-4 py-4">
                              <select
                                value={contact.status}
                                onChange={(e) => handleContactStatusUpdate(contact._id, e.target.value)}
                                disabled={actionLoading}
                                className={`text-xs px-2 py-1 border rounded-md focus:ring-1 focus:ring-[#53755d] focus:border-[#53755d] bg-white w-full transition-colors ${
                                  contact.status === 'new' ? 'border-blue-300 bg-blue-50' :
                                  contact.status === 'in_progress' ? 'border-yellow-300 bg-yellow-50' :
                                  contact.status === 'resolved' ? 'border-green-300 bg-green-50' :
                                  contact.status === 'closed' ? 'border-gray-300 bg-gray-50' :
                                  'border-gray-300'
                                }`}
                              >
                                <option value="new">New</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                                <option value="deleted">Delete</option>
                              </select>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 truncate">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium">
                              <div 
                                className="flex space-x-1 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                onClick={() => handleContactView(contact)}
                                title="Click to view full details"
                              >
                                <FaEye className="h-4 w-4 text-[#53755d] hover:text-[#3e5d49]" />
                                <span className="text-xs text-gray-500 hidden sm:inline">View</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <div className="text-sm text-gray-500">
                  Total Users: {users.length} | Active: {users.filter(u => u.status === 'active').length}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Users ({users.length})
                  </h2>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53755d]"></div>
                    <span className="ml-3 text-gray-600">Loading users...</span>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="w-full table-fixed">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">User</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Username</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Last Login</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Plans</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                  {user.profileImage ? (
                                    <img 
                                      src={user.profileImage} 
                                      alt={user.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-[#53755d] flex items-center justify-center">
                                      <FaUser className="h-4 w-4 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 truncate">{user.username}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 truncate">{user.email}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 truncate">
                              {new Date(user.loginTime).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 text-center">
                              {user.planSubscriptions.length}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium">
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleUserView(user)}
                                  className="text-[#53755d] hover:text-[#3e5d49]"
                                  title="View Details"
                                >
                                  <FaEye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleUserEdit(user)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit User"
                                >
                                  <FaEdit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleUserDelete(user.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete User"
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
                )}
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>

              {/* Analytics Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-[#53755d] to-[#3e5d49] rounded-lg">
                      <FaChartBar className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Plan Subscriptions</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.planUsage.reduce((sum, plan) => sum + plan.users, 0)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                      <FaUsers className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                      <FaChartLine className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{analytics.planUsage.reduce((sum, plan) => sum + plan.revenue, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Performance</h3>
                  <div className="h-80">
                    {analytics.planUsage.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.planUsage} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip />
                          <Bar dataKey="users" fill={CHART_COLORS.primary} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No plan performance data available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Distribution</h3>
                  <div className="h-80">
                    {analytics.planUsage.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.planUsage}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="revenue"
                          >
                            {analytics.planUsage.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No revenue distribution data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health Insurance Management */}
          {activeTab === 'health-insurance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Health Insurance Policies</h3>
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    setEditingHealthPolicy(null);
                    setHealthPolicyFormData({
                      policyName: '',
                      policyType: 'Individual',
                      coverageAmount: 0,
                      premium: 0,
                      duration: 1,
                      ageLimit: {
                        min: 18,
                        max: 65
                      },
                      description: '',
                      benefits: [],
                      features: [],
                      exclusions: [],
                      waitingPeriod: 30,
                      claimSettlementRatio: 95,
                      networkHospitals: 0,
                      cashlessHospitals: 0,
                      renewalTerms: 'Annual',
                      preExistingDiseaseCoverage: false,
                      maternityCoverage: false,
                      criticalIllnessCoverage: false,
                      accidentalCoverage: false,
                      status: 'Active',
                      provider: {
                        name: '',
                        logo: '',
                        website: ''
                      },
                      documents: {
                        policyDocument: '',
                        termsAndConditions: '',
                        brochure: ''
                      },
                      tags: [],
                      isPopular: false,
                      isRecommended: false,
                      rating: 3
                    });
                  }}
                  className="flex items-center px-4 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Add New Policy
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Health Insurance Policies ({healthPolicies.length})
                  </h2>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53755d]"></div>
                    <span className="ml-3 text-gray-600">Loading policies...</span>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="w-full table-fixed">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Policy Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Coverage</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Premium</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Provider</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {healthPolicies.map((policy) => (
                          <tr key={policy._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-900 truncate">{policy.policyName}</div>
                              <div className="text-sm text-gray-500 truncate">{policy.description?.substring(0, 50)}...</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 truncate">{policy.policyType}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 truncate">₹{policy.coverageAmount?.toLocaleString() || 'N/A'}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 truncate">₹{policy.premium?.toLocaleString() || 'N/A'}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 truncate">{policy.provider?.name || 'N/A'}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {policy.status || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm font-medium">
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleHealthPolicyEdit(policy)}
                                  className="text-[#53755d] hover:text-[#3e5d49]"
                                  title="Edit"
                                >
                                  <FaEdit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleHealthPolicyDelete(policy._id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete"
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
                )}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <SettingsPanel />
          )}
        </main>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {activeTab === 'plans' 
                ? (editingPlan ? 'Edit Plan' : 'Add New Plan')
                : activeTab === 'health-insurance'
                ? (editingHealthPolicy ? 'Edit Health Insurance Policy' : 'Add New Health Insurance Policy')
                : (editingBlog ? 'Edit Blog Post' : 'Add New Blog Post')
              }
            </h2>
            
            {activeTab === 'plans' ? (
              <form onSubmit={handlePlanSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Professional Mutual Fund Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheme Name *</label>
                  <input
                    type="text"
                    name="schemeName"
                    value={planFormData.schemeName}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="e.g., HDFC Equity Fund"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AMC / Bank Name *</label>
                  <input
                    type="text"
                    name="amcName"
                    value={planFormData.amcName}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="e.g., HDFC Mutual Fund"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={planFormData.category}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  >
                    <option value="Equity">Equity</option>
                    <option value="Debt">Debt</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Solution Oriented">Solution Oriented</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                  <select
                    name="subcategory"
                    value={planFormData.subcategory}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  >
                    <option value="Large Cap">Large Cap</option>
                    <option value="Mid Cap">Mid Cap</option>
                    <option value="Small Cap">Small Cap</option>
                    <option value="ELSS">ELSS</option>
                    <option value="Liquid">Liquid</option>
                    <option value="Ultra Short">Ultra Short</option>
                    <option value="Short Duration">Short Duration</option>
                    <option value="Medium Duration">Medium Duration</option>
                    <option value="Long Duration">Long Duration</option>
                    <option value="Gilt">Gilt</option>
                    <option value="Corporate Bond">Corporate Bond</option>
                    <option value="Credit Risk">Credit Risk</option>
                    <option value="Banking & PSU">Banking & PSU</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="FMCG">FMCG</option>
                    <option value="Auto">Auto</option>
                    <option value="Energy">Energy</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Riskometer *</label>
                  <select
                    name="riskometer"
                    value={planFormData.riskometer}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NAV (₹) *</label>
                  <input
                    type="number"
                    name="nav"
                    value={planFormData.nav}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 45.67"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Investment (₹) *</label>
                  <input
                    type="number"
                    name="minInvestment"
                    value={planFormData.minInvestment}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    min="0"
                    placeholder="e.g., 5000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SIP Amount (₹) *</label>
                  <input
                    type="number"
                    name="sipAmount"
                    value={planFormData.sipAmount}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    min="0"
                    placeholder="e.g., 1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expense Ratio (%) *</label>
                  <input
                    type="number"
                    name="expenseRatio"
                    value={planFormData.expenseRatio}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    step="0.01"
                    min="0"
                    max="15"
                    placeholder="e.g., 1.2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exit Load *</label>
                  <input
                    type="text"
                    name="exitLoad"
                    value={planFormData.exitLoad}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="e.g., 1% if redeemed within 1 year"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fund Manager *</label>
                  <input
                    type="text"
                    name="fundManager"
                    value={planFormData.fundManager}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="e.g., Rajesh Kumar"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benchmark Index *</label>
                  <input
                    type="text"
                    name="benchmarkIndex"
                    value={planFormData.benchmarkIndex}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="e.g., Nifty 50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    name="status"
                    value={planFormData.status}
                    onChange={handlePlanInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fund Objective / Description *</label>
                  <textarea
                    name="fundObjective"
                    value={planFormData.fundObjective}
                    onChange={handlePlanInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="Describe the fund's investment objective and strategy..."
                    required
                  />
                </div>

                {/* Document Upload Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents Upload</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SID (Scheme Information Document)</label>
                      <input
                        type="url"
                        name="documents.sid"
                        value={planFormData.documents.sid}
                        onChange={(e) => setPlanFormData(prev => ({
                          ...prev,
                          documents: { ...prev.documents, sid: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        placeholder="PDF URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">KIM (Key Information Memorandum)</label>
                      <input
                        type="url"
                        name="documents.kim"
                        value={planFormData.documents.kim}
                        onChange={(e) => setPlanFormData(prev => ({
                          ...prev,
                          documents: { ...prev.documents, kim: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        placeholder="PDF URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SAI (Statement of Additional Information)</label>
                      <input
                        type="url"
                        name="documents.sai"
                        value={planFormData.documents.sai}
                        onChange={(e) => setPlanFormData(prev => ({
                          ...prev,
                          documents: { ...prev.documents, sai: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                        placeholder="PDF URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors"
                  >
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingPlan(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : activeTab === 'health-insurance' ? (
              <form onSubmit={handleHealthPolicySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Policy Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Policy Name *</label>
                  <input
                    type="text"
                    name="policyName"
                    value={healthPolicyFormData.policyName}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="e.g., Comprehensive Health Shield"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Policy Type *</label>
                  <select
                    name="policyType"
                    value={healthPolicyFormData.policyType}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  >
                    <option value="Individual">Individual</option>
                    <option value="Family">Family</option>
                    <option value="Group">Group</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Critical Illness">Critical Illness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Amount (₹) *</label>
                  <input
                    type="number"
                    name="coverageAmount"
                    value={healthPolicyFormData.coverageAmount}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    min="0"
                    placeholder="e.g., 500000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Premium (₹) *</label>
                  <input
                    type="number"
                    name="premium"
                    value={healthPolicyFormData.premium}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    min="0"
                    placeholder="e.g., 12000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Years) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={healthPolicyFormData.duration}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    min="1"
                    max="30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    name="status"
                    value={healthPolicyFormData.status}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {/* Age Limits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Age</label>
                  <input
                    type="number"
                    name="ageLimit.min"
                    value={healthPolicyFormData.ageLimit.min}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Age</label>
                  <input
                    type="number"
                    name="ageLimit.max"
                    value={healthPolicyFormData.ageLimit.max}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Provider Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider Name *</label>
                  <input
                    type="text"
                    name="provider.name"
                    value={healthPolicyFormData.provider.name}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="e.g., HDFC ERGO"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider Website</label>
                  <input
                    type="url"
                    name="provider.website"
                    value={healthPolicyFormData.provider.website}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Policy Details */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={healthPolicyFormData.description}
                    onChange={handleHealthPolicyInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="Describe the health insurance policy..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (comma separated)</label>
                  <input
                    type="text"
                    name="benefits"
                    value={healthPolicyFormData.benefits.join(', ')}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="Cashless treatment, Pre-existing disease coverage, Maternity benefits"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma separated)</label>
                  <input
                    type="text"
                    name="features"
                    value={healthPolicyFormData.features.join(', ')}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="24/7 helpline, Online claim settlement, Network hospitals"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waiting Period (Days)</label>
                  <input
                    type="number"
                    name="waitingPeriod"
                    value={healthPolicyFormData.waitingPeriod}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Claim Settlement Ratio (%)</label>
                  <input
                    type="number"
                    name="claimSettlementRatio"
                    value={healthPolicyFormData.claimSettlementRatio}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Network Hospitals</label>
                  <input
                    type="number"
                    name="networkHospitals"
                    value={healthPolicyFormData.networkHospitals}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cashless Hospitals</label>
                  <input
                    type="number"
                    name="cashlessHospitals"
                    value={healthPolicyFormData.cashlessHospitals}
                    onChange={handleHealthPolicyInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    min="0"
                  />
                </div>

                {/* Coverage Options */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Options</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="preExistingDiseaseCoverage"
                        checked={healthPolicyFormData.preExistingDiseaseCoverage}
                        onChange={handleHealthPolicyInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Pre-existing Disease</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="maternityCoverage"
                        checked={healthPolicyFormData.maternityCoverage}
                        onChange={handleHealthPolicyInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Maternity</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="criticalIllnessCoverage"
                        checked={healthPolicyFormData.criticalIllnessCoverage}
                        onChange={handleHealthPolicyInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Critical Illness</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="accidentalCoverage"
                        checked={healthPolicyFormData.accidentalCoverage}
                        onChange={handleHealthPolicyInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Accidental</span>
                    </label>
                  </div>
                </div>

                {/* Policy Flags */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Flags</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isPopular"
                        checked={healthPolicyFormData.isPopular}
                        onChange={handleHealthPolicyInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Popular Policy</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isRecommended"
                        checked={healthPolicyFormData.isRecommended}
                        onChange={handleHealthPolicyInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Recommended</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors"
                  >
                    {editingHealthPolicy ? 'Update Policy' : 'Create Policy'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingHealthPolicy(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleBlogSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={blogFormData.title}
                    onChange={handleBlogInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="Enter blog post title"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug / URL *</label>
                  <input
                    type="text"
                    name="slug"
                    value={blogFormData.slug}
                    onChange={handleBlogInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="Auto-generated from title (SEO friendly)"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-generated from title, but you can edit it</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={blogFormData.category}
                    onChange={handleBlogInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  >
                    <option value="Equity Funds">Equity Funds</option>
                    <option value="SIP Tips">SIP Tips</option>
                    <option value="Tax Saving">Tax Saving</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={blogFormData.author}
                    onChange={handleBlogInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="Enter author name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image / Thumbnail</label>
                  <ImageUpload
                    value={blogFormData.featuredImage}
                    onChange={(url) => setBlogFormData(prev => ({ ...prev, featuredImage: url }))}
                    placeholder="Upload featured image or enter URL"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description / Excerpt *</label>
                  <textarea
                    name="excerpt"
                    value={blogFormData.excerpt}
                    onChange={handleBlogInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="Brief description of the blog post (1-2 lines)..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content / Body *</label>
                  <textarea
                    name="content"
                    value={blogFormData.content}
                    onChange={handleBlogInputChange}
                    rows="8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="Write your blog post content here (supports basic HTML formatting)..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">You can use basic HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags / Keywords</label>
                  <input
                    type="text"
                    name="tags"
                    value={blogFormData.tags}
                    onChange={handleBlogInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="investment, mutual funds, finance (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                  <input
                    type="date"
                    name="publishDate"
                    value={blogFormData.publishDate}
                    onChange={handleBlogInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    name="status"
                    value={blogFormData.status}
                    onChange={handleBlogInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title (SEO)</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={blogFormData.metaTitle}
                    onChange={handleBlogInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="SEO title for search engines"
                    maxLength="60"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description (SEO)</label>
                  <textarea
                    name="metaDescription"
                    value={blogFormData.metaDescription}
                    onChange={handleBlogInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="SEO description for search engines"
                    maxLength="160"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                </div>

                <div className="md:col-span-2 flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors"
                  >
                    {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingBlog(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Professional Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
              <FaTrash className="h-8 w-8 text-red-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Delete Blog Post
            </h3>
            
            <p className="text-gray-600 text-center mb-2">
              Are you sure you want to delete this blog post?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">{blogToDelete?.title}</h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Author:</span> {blogToDelete?.author || 'N/A'}<br/>
                <span className="font-medium">Category:</span> {blogToDelete?.category}<br/>
                <span className="font-medium">Status:</span> {blogToDelete?.status}
              </p>
            </div>
            
            <p className="text-red-600 text-sm text-center mb-6">
              This action cannot be undone. The blog post will be permanently deleted.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBlogToDelete(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmBlogDelete}
                disabled={actionLoading}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Blog Post'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53755d]"></div>
            <span className="text-gray-700 font-semibold">Processing...</span>
          </div>
        </div>
      )}

      {/* Professional View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Blog Post Details</h3>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setBlogToView(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {blogToView && (
                <div className="space-y-6">
                  {/* Featured Image */}
                  {blogToView.featuredImage && (
                    <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={blogToView.featuredImage}
                        alt={blogToView.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Blog Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Title:</span>
                          <p className="text-gray-900">{blogToView.title}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Slug:</span>
                          <p className="text-gray-900 font-mono text-sm">{blogToView.slug}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Author:</span>
                          <p className="text-gray-900">{blogToView.author || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Category:</span>
                          <p className="text-gray-900">{blogToView.category}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Status:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            blogToView.status === 'published' ? 'bg-green-100 text-green-800' :
                            blogToView.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {blogToView.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">SEO & Publishing</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Publish Date:</span>
                          <p className="text-gray-900">
                            {blogToView.publishDate ? new Date(blogToView.publishDate).toLocaleDateString() : 'Not set'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Created:</span>
                          <p className="text-gray-900">
                            {new Date(blogToView.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Views:</span>
                          <p className="text-gray-900">{blogToView.views || 0}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Likes:</span>
                          <p className="text-gray-900">{blogToView.likes || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Excerpt */}
                  {blogToView.excerpt && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Excerpt</h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{blogToView.excerpt}</p>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {blogToView.tags && blogToView.tags.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {blogToView.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#53755d]/10 text-[#53755d] rounded-full text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Meta Information */}
                  {(blogToView.metaTitle || blogToView.metaDescription) && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">SEO Information</h4>
                      <div className="space-y-3">
                        {blogToView.metaTitle && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Meta Title:</span>
                            <p className="text-gray-900 text-sm">{blogToView.metaTitle}</p>
                          </div>
                        )}
                        {blogToView.metaDescription && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Meta Description:</span>
                            <p className="text-gray-900 text-sm">{blogToView.metaDescription}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Content Preview */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Content Preview</h4>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: blogToView.content?.substring(0, 500) + (blogToView.content?.length > 500 ? '...' : '') 
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        setBlogToView(null);
                        handleBlogEdit(blogToView);
                      }}
                      className="flex-1 px-6 py-3 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors font-semibold"
                    >
                      Edit Blog Post
                    </button>
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        setBlogToView(null);
                      }}
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

      {/* Contact Details Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Contact Enquiry Details</h3>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setContactToView(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              {contactToView && (
                <div className="space-y-6">
                  {/* Contact Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <FaIdCard className="h-6 w-6 text-[#53755d]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {contactToView.firstName} {contactToView.lastName}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <FaEnvelope className="h-6 w-6 text-[#53755d]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                        <p className="text-lg font-semibold text-gray-900">{contactToView.email}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <FaPhone className="h-6 w-6 text-[#53755d]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                        <p className="text-lg font-semibold text-gray-900">{contactToView.phone}</p>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <FaComment className="h-6 w-6 text-[#53755d]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Subject</p>
                        <p className="text-lg font-semibold text-gray-900">{contactToView.subject}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {contactToView.status === 'new' && <FaExclamationCircle className="h-6 w-6 text-blue-500" />}
                        {contactToView.status === 'in_progress' && <FaClock className="h-6 w-6 text-yellow-500" />}
                        {contactToView.status === 'resolved' && <FaCheckCircle className="h-6 w-6 text-green-500" />}
                        {contactToView.status === 'closed' && <FaTimesCircle className="h-6 w-6 text-red-500" />}
                        {contactToView.status === 'deleted' && <FaTrash className="h-6 w-6 text-red-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          contactToView.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          contactToView.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          contactToView.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          contactToView.status === 'deleted' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contactToView.status.charAt(0).toUpperCase() + contactToView.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <FaCalendarAlt className="h-6 w-6 text-[#53755d]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Submitted Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(contactToView.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {contactToView.message && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FaComment className="h-5 w-5 text-[#53755d] mr-2" />
                        Message
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{contactToView.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowContactModal(false);
                        setContactToView(null);
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        // You can add additional actions here like reply, forward, etc.
                        console.log('Additional action for contact:', contactToView._id);
                      }}
                      className="flex-1 px-6 py-3 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors font-semibold"
                    >
                      Take Action
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Delete Confirmation Modal */}
      {showContactDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
              <FaTrash className="h-8 w-8 text-red-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Mark as Deleted?
            </h3>
            
            <p className="text-gray-600 text-center mb-2">
              Do you want to mark this contact as deleted?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                {contactToDelete?.firstName} {contactToDelete?.lastName}
              </h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {contactToDelete?.email}<br/>
                <span className="font-medium">Phone:</span> {contactToDelete?.phone}<br/>
                <span className="font-medium">Subject:</span> {contactToDelete?.subject}<br/>
                <span className="font-medium">Status:</span> {contactToDelete?.status}
              </p>
            </div>
            
            <p className="text-red-600 text-sm text-center mb-6">
              This contact will be permanently removed from the list.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={cancelContactDelete}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmContactDelete}
                disabled={actionLoading}
                className="flex-1 px-6 py-3 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Mark as Deleted'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Success!
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              {successMessage}
            </p>
            
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSuccessMessage('');
                }}
                className="px-8 py-3 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User View Modal */}
      {showUserViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
                <button
                  onClick={() => {
                    setShowUserViewModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              {selectedUser && (
                <div className="space-y-6">
                  {/* User Profile Image & Basic Info */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                      {selectedUser.profileImage ? (
                        <img 
                          src={selectedUser.profileImage} 
                          alt={selectedUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#53755d] flex items-center justify-center">
                          <FaUser className="h-10 w-10 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{selectedUser.name}</h4>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                        selectedUser.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>

                  {/* User Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <FaUser className="h-6 w-6 text-[#53755d]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Username</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedUser.username}</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <FaEnvelope className="h-6 w-6 text-[#53755d]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedUser.email}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    {selectedUser.phone && (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <FaPhone className="h-6 w-6 text-[#53755d]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone Number</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedUser.phone}</p>
                        </div>
                      </div>
                    )}

                    {/* Last Login */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <FaClock className="h-6 w-6 text-[#53755d]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Login</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(selectedUser.loginTime).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Total Investments */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <FaChartBar className="h-6 w-6 text-[#53755d]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Investments</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedUser.totalInvestments}</p>
                      </div>
                    </div>

                    {/* Plan Subscriptions */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <FaFileAlt className="h-6 w-6 text-[#53755d]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Plan Subscriptions</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedUser.planSubscriptions.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Plan Subscriptions List */}
                  {selectedUser.planSubscriptions && selectedUser.planSubscriptions.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <FaFileAlt className="h-5 w-5 text-[#53755d] mr-2" />
                        Subscribed Plans
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.planSubscriptions.map((plan, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#53755d]/10 text-[#53755d] rounded-full text-sm font-medium"
                          >
                            {plan}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowUserViewModal(false);
                        handleUserEdit(selectedUser);
                      }}
                      className="flex-1 px-6 py-3 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors font-semibold"
                    >
                      Edit User
                    </button>
                    <button
                      onClick={() => {
                        setShowUserViewModal(false);
                        setSelectedUser(null);
                      }}
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

      {/* User Edit Modal */}
      {showUserEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit User</h3>
                <button
                  onClick={() => {
                    setShowUserEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleUserUpdate} className="space-y-6">
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                  <input
                    type="url"
                    name="profileImage"
                    value={userEditFormData.profileImage}
                    onChange={handleUserInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={userEditFormData.name}
                    onChange={handleUserInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={userEditFormData.email}
                    onChange={handleUserInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                  <input
                    type="text"
                    name="username"
                    value={userEditFormData.username}
                    onChange={handleUserInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userEditFormData.phone}
                    onChange={handleUserInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    name="status"
                    value={userEditFormData.status}
                    onChange={handleUserInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53755d] focus:border-transparent"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-6 py-3 bg-[#53755d] text-white rounded-lg hover:bg-[#3e5d49] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {actionLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Update User'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserEditModal(false);
                      setSelectedUser(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;