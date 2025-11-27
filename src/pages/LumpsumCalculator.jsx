import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCalculator, FaChartPie, FaCoins, FaHandHoldingUsd } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';

const LumpsumCalculator = () => {
  const navigate = useNavigate();
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [lumpsumAmount, setLumpsumAmount] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);

  // Calculate lumpsum amount needed
  useEffect(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;
    const presentValue = targetAmount / Math.pow(1 + monthlyRate, months);
    const returns = targetAmount - presentValue;
    
    setLumpsumAmount(Math.round(presentValue));
    setTotalReturns(Math.round(returns));
  }, [targetAmount, years, expectedReturn]);

  const handleBack = () => {
    navigate('/mutual-funds');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <HeaderNav />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-100/50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full -translate-y-48 translate-x-48 opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex items-center mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Mutual Funds</span>
            </button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Lumpsum Calculator
            </h1>
            <nav className="flex flex-wrap justify-center items-center space-x-2 text-sm">
              <a href="/" className="text-gray-500 hover:text-blue-600">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/mutual-funds" className="text-gray-500 hover:text-blue-600">Calculator</a>
              <span className="text-gray-400">/</span>
              <span className="text-blue-600 font-medium">Lumpsum Calculator</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Calculator Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Online Lumpsum Investment Calculator
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Calculator Inputs */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Investment Parameters</h3>
                  
                  <div className="space-y-6">
                    {/* Target Amount */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Target Amount (₹)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={targetAmount}
                          onChange={(e) => setTargetAmount(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                          placeholder="Enter target amount"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="100000"
                          max="10000000"
                          step="50000"
                          value={targetAmount}
                          onChange={(e) => setTargetAmount(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>₹1L</span>
                          <span>₹1Cr</span>
                        </div>
                      </div>
                    </div>

                    {/* Number of Years */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Number of Years
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={years}
                          onChange={(e) => setYears(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                          placeholder="Enter years"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          years
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="1"
                          max="30"
                          step="1"
                          value={years}
                          onChange={(e) => setYears(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>1 year</span>
                          <span>30 years</span>
                        </div>
                      </div>
                    </div>

                    {/* Expected Return */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Expected Return (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={expectedReturn}
                          onChange={(e) => setExpectedReturn(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                          placeholder="Enter expected return"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          %
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="5"
                          max="20"
                          step="0.5"
                          value={expectedReturn}
                          onChange={(e) => setExpectedReturn(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>5%</span>
                          <span>20%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-8">
                {/* Donut Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Investment Breakdown</h3>
                  
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-64 h-64">
                      <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        {/* Target Amount (larger portion) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="8"
                          strokeDasharray={`${(totalReturns / targetAmount) * 251.2} 251.2`}
                          strokeDashoffset="0"
                        />
                        {/* Lumpsum Amount (smaller portion) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          strokeDasharray={`${(lumpsumAmount / targetAmount) * 251.2} 251.2`}
                          strokeDashoffset={`-${(totalReturns / targetAmount) * 251.2}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{(targetAmount / 100000).toFixed(1)}L
                        </div>
                        <div className="text-sm text-gray-500">Target Amount</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Target Amount</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Lumpsum Amount</span>
                    </div>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Investment Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Target Amount</span>
                      <span className="text-2xl font-bold text-gray-900">₹{targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Lumpsum Investment</span>
                      <span className="text-2xl font-bold text-blue-600">₹{lumpsumAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Expected Returns</span>
                      <span className="text-2xl font-bold text-green-600">₹{totalReturns.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-lg text-gray-700">Return Percentage</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {((totalReturns / lumpsumAmount) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">Important Information</h3>
              <ul className="space-y-2 text-yellow-700">
                <li>• This calculator provides an estimate based on the inputs provided</li>
                <li>• Actual returns may vary due to market conditions</li>
                <li>• Past performance does not guarantee future results</li>
                <li>• Consider consulting a financial advisor before making investment decisions</li>
                <li>• All calculations are for illustrative purposes only</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <style jsx="true">{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default LumpsumCalculator;
