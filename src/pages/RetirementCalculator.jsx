import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaChair, FaChartLine, FaCoins, FaClock, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';

const RetirementCalculator = () => {
  const navigate = useNavigate();
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentIncome, setCurrentIncome] = useState(50000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);
  const [monthlySIP, setMonthlySIP] = useState(0);
  const [retirementCorpus, setRetirementCorpus] = useState(0);
  const [requiredCorpus, setRequiredCorpus] = useState(0);
  const [shortfall, setShortfall] = useState(0);

  // Calculate retirement planning
  useEffect(() => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    
    // Calculate required monthly income at retirement (considering inflation)
    const monthlyIncomeAtRetirement = currentIncome * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    
    // Assuming 4% withdrawal rate (25x annual income)
    const requiredAnnualIncome = monthlyIncomeAtRetirement * 12;
    const requiredCorpusAmount = requiredAnnualIncome * 25;
    
    // Calculate monthly SIP needed
    const monthlyRate = expectedReturn / 100 / 12;
    const sipNeeded = requiredCorpusAmount / (((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate) * (1 + monthlyRate));
    
    // Calculate actual corpus with current SIP
    const actualCorpus = monthlySIP * (((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate) * (1 + monthlyRate));
    
    setRequiredCorpus(Math.round(requiredCorpusAmount));
    setMonthlySIP(Math.round(sipNeeded));
    setRetirementCorpus(Math.round(actualCorpus));
    setShortfall(Math.round(requiredCorpusAmount - actualCorpus));
  }, [currentAge, retirementAge, currentIncome, expectedReturn, inflationRate, monthlySIP]);

  const handleBack = () => {
    navigate('/mutual-funds');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <HeaderNav />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-50 to-pink-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-100/50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -translate-y-48 translate-x-48 opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex items-center mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Mutual Funds</span>
            </button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Retirement Planning Calculator
            </h1>
            <nav className="flex flex-wrap justify-center items-center space-x-2 text-sm">
              <a href="/" className="text-gray-500 hover:text-purple-600">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/mutual-funds" className="text-gray-500 hover:text-purple-600">Calculator</a>
              <span className="text-gray-400">/</span>
              <span className="text-purple-600 font-medium">Retirement Planning</span>
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
                Plan Your Retirement with Mutual Funds
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Calculate how much you need to invest monthly to achieve your retirement goals
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Calculator Inputs */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h3>
                  
                  <div className="space-y-6">
                    {/* Current Age */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Current Age
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={currentAge}
                          onChange={(e) => setCurrentAge(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                          placeholder="Enter your current age"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          years
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="25"
                          max="60"
                          step="1"
                          value={currentAge}
                          onChange={(e) => setCurrentAge(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>25 years</span>
                          <span>60 years</span>
                        </div>
                      </div>
                    </div>

                    {/* Retirement Age */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Retirement Age
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={retirementAge}
                          onChange={(e) => setRetirementAge(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                          placeholder="Enter retirement age"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          years
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="50"
                          max="70"
                          step="1"
                          value={retirementAge}
                          onChange={(e) => setRetirementAge(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>50 years</span>
                          <span>70 years</span>
                        </div>
                      </div>
                    </div>

                    {/* Current Monthly Income */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Current Monthly Income (₹)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={currentIncome}
                          onChange={(e) => setCurrentIncome(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                          placeholder="Enter current monthly income"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="20000"
                          max="200000"
                          step="5000"
                          value={currentIncome}
                          onChange={(e) => setCurrentIncome(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>₹20K</span>
                          <span>₹2L</span>
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                          placeholder="Enter expected return"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          %
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="8"
                          max="15"
                          step="0.5"
                          value={expectedReturn}
                          onChange={(e) => setExpectedReturn(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>8%</span>
                          <span>15%</span>
                        </div>
                      </div>
                    </div>

                    {/* Inflation Rate */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Expected Inflation Rate (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={inflationRate}
                          onChange={(e) => setInflationRate(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                          placeholder="Enter inflation rate"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          %
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="4"
                          max="8"
                          step="0.5"
                          value={inflationRate}
                          onChange={(e) => setInflationRate(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>4%</span>
                          <span>8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-8">
                {/* Retirement Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Retirement Planning Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Years to Retirement</span>
                      <span className="text-2xl font-bold text-purple-600">{retirementAge - currentAge} years</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Required Corpus</span>
                      <span className="text-2xl font-bold text-green-600">₹{requiredCorpus.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Monthly SIP Needed</span>
                      <span className="text-2xl font-bold text-blue-600">₹{monthlySIP.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-lg text-gray-700">Monthly Income at Retirement</span>
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{Math.round(currentIncome * Math.pow(1 + inflationRate / 100, retirementAge - currentAge)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Investment Timeline */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Investment Timeline</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FaClock className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">Current Age</p>
                        <p className="text-gray-600">{currentAge} years</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaChartLine className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">Investment Period</p>
                        <p className="text-gray-600">{retirementAge - currentAge} years</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaChair className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">Retirement Age</p>
                        <p className="text-gray-600">{retirementAge} years</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-yellow-50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-yellow-900 mb-4">Retirement Planning Tips</h3>
                  <ul className="space-y-2 text-yellow-800">
                    <li>• Start investing early to benefit from compounding</li>
                    <li>• Increase SIP amount annually with salary increments</li>
                    <li>• Diversify across different asset classes</li>
                    <li>• Review and rebalance your portfolio regularly</li>
                    <li>• Consider inflation while planning expenses</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Important Information</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• This calculator provides an estimate based on the inputs provided</li>
                <li>• Actual returns may vary due to market conditions</li>
                <li>• Consider your risk tolerance while choosing investments</li>
                <li>• Review your retirement plan annually</li>
                <li>• Consult a financial advisor for personalized advice</li>
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
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default RetirementCalculator;
