import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCalculator, FaChartLine, FaCoins, FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';

const SIPCalculator = () => {
  const navigate = useNavigate();
  const [sipAmount, setSipAmount] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [futureValue, setFutureValue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);

  // Calculate SIP returns
  useEffect(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;
    const totalInvested = sipAmount * months;
    
    // SIP Future Value Formula: P * [((1 + r)^n - 1) / r] * (1 + r)
    const fv = sipAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const returns = fv - totalInvested;
    
    setFutureValue(Math.round(fv));
    setTotalInvestment(totalInvested);
    setTotalReturns(Math.round(returns));
  }, [sipAmount, years, expectedReturn]);

  const handleBack = () => {
    navigate('/mutual-funds');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <HeaderNav />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-100/50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full -translate-y-48 translate-x-48 opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex items-center mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Mutual Funds</span>
            </button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              SIP Calculator
            </h1>
            <nav className="flex flex-wrap justify-center items-center space-x-2 text-sm">
              <a href="/" className="text-gray-500 hover:text-green-600">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/mutual-funds" className="text-gray-500 hover:text-green-600">Calculator</a>
              <span className="text-gray-400">/</span>
              <span className="text-green-600 font-medium">SIP Calculator</span>
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
                Online SIP Investment Calculator
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Calculate your potential returns from Systematic Investment Plans (SIP) in mutual funds
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Calculator Inputs */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">SIP Parameters</h3>
                  
                  <div className="space-y-6">
                    {/* SIP Amount */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Monthly SIP Amount (₹)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={sipAmount}
                          onChange={(e) => setSipAmount(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                          placeholder="Enter monthly SIP amount"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="500"
                          max="100000"
                          step="500"
                          value={sipAmount}
                          onChange={(e) => setSipAmount(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>₹500</span>
                          <span>₹1L</span>
                        </div>
                      </div>
                    </div>

                    {/* Investment Period */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Investment Period (Years)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={years}
                          onChange={(e) => setYears(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                          placeholder="Enter investment period"
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
                        Expected Annual Return (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={expectedReturn}
                          onChange={(e) => setExpectedReturn(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
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
                {/* Results Summary */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">SIP Investment Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Future Value</span>
                      <span className="text-2xl font-bold text-green-600">₹{futureValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Total Investment</span>
                      <span className="text-2xl font-bold text-blue-600">₹{totalInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Expected Returns</span>
                      <span className="text-2xl font-bold text-purple-600">₹{totalReturns.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-lg text-gray-700">Return Percentage</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {((totalReturns / totalInvestment) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monthly Breakdown */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Monthly Breakdown</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
                      <span className="text-lg text-gray-700">Monthly SIP</span>
                      <span className="text-xl font-bold text-gray-900">₹{sipAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
                      <span className="text-lg text-gray-700">Total Months</span>
                      <span className="text-xl font-bold text-gray-900">{years * 12}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
                      <span className="text-lg text-gray-700">Expected Return</span>
                      <span className="text-xl font-bold text-gray-900">{expectedReturn}% p.a.</span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-blue-50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">SIP Benefits</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>• Rupee Cost Averaging</li>
                    <li>• Disciplined Investing</li>
                    <li>• Power of Compounding</li>
                    <li>• Start with Small Amounts</li>
                    <li>• Flexibility to Increase/Decrease</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">Important Information</h3>
              <ul className="space-y-2 text-yellow-700">
                <li>• This calculator provides an estimate based on the inputs provided</li>
                <li>• Actual returns may vary due to market conditions</li>
                <li>• SIP investments are subject to market risks</li>
                <li>• Past performance does not guarantee future results</li>
                <li>• Consider consulting a financial advisor before making investment decisions</li>
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
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default SIPCalculator;
