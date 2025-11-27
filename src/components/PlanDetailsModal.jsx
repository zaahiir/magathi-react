import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const PlanDetailsModal = ({ 
  isOpen, 
  onClose, 
  plan, 
  planType = 'plan' // 'mutual-fund', 'health-insurance', 'general-insurance', 'deposit'
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleViewDetails = () => {
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login');
      onClose();
      return;
    }
    
    // If authenticated, show the modal
    // The modal is already open, so we don't need to do anything else
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{plan.name || plan.policyName || plan.schemeName}</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Login Check Section */}
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-4xl text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Please log in to view detailed information about this {planType.replace('-', ' ')}.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleViewDetails}
                  className="bg-[#53755d] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#3e5d49] transition-colors shadow-lg hover:shadow-xl"
                >
                  Go to Login
                </button>
                <button
                  onClick={handleClose}
                  className="block mx-auto text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Plan Details Content */
            <div className="space-y-6">
              {/* Welcome Message for Logged-in User */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-green-800">Welcome back, {user?.name || user?.fullName || 'User'}!</h4>
                    <p className="text-green-700 text-sm">You can now view detailed information about this {planType.replace('-', ' ')}.</p>
                  </div>
                </div>
              </div>

              {/* Plan Information */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Plan Features</h3>
                  <ul className="space-y-3">
                    {plan.features && plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.benefits && plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Terms & Conditions</h3>
                  <ul className="space-y-3">
                    {plan.terms && plan.terms.map((term, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheckCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Plan Details */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Plan Details</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {plan.coverageAmount && (
                      <div>
                        <p className="text-sm text-gray-600">Coverage Amount</p>
                        <p className="text-2xl font-bold text-[#53755d]">₹{plan.coverageAmount.toLocaleString()}</p>
                      </div>
                    )}
                    {plan.monthlyPremium && (
                      <div>
                        <p className="text-sm text-gray-600">Monthly Premium</p>
                        <p className="text-2xl font-bold text-[#53755d]">₹{plan.monthlyPremium.toLocaleString()}</p>
                      </div>
                    )}
                    {plan.annualPremium && (
                      <div>
                        <p className="text-sm text-gray-600">Annual Premium</p>
                        <p className="text-2xl font-bold text-[#53755d]">₹{plan.annualPremium.toLocaleString()}</p>
                      </div>
                    )}
                    {plan.nav && (
                      <div>
                        <p className="text-sm text-gray-600">Current NAV</p>
                        <p className="text-2xl font-bold text-[#53755d]">{plan.nav}</p>
                      </div>
                    )}
                    {plan.returns && (
                      <div>
                        <p className="text-sm text-gray-600">Expected Returns</p>
                        <p className="text-2xl font-bold text-[#53755d]">{plan.returns}</p>
                      </div>
                    )}
                    {plan.minInvestment && (
                      <div>
                        <p className="text-sm text-gray-600">Minimum Investment</p>
                        <p className="text-2xl font-bold text-[#53755d]">{plan.minInvestment}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-[#53755d] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#3e5d49] transition duration-300">
                      Get Started
                    </button>
                    <button 
                      onClick={handleClose}
                      className="border-2 border-[#53755d] text-[#53755d] px-8 py-3 rounded-lg font-semibold hover:bg-[#53755d] hover:text-white transition duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsModal;
