import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaGraduationCap, FaChartLine, FaCoins, FaChild, FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';

const ChildrenEducationCalculator = () => {
  const navigate = useNavigate();
  const [childAge, setChildAge] = useState(5);
  const [educationAge, setEducationAge] = useState(18);
  const [currentCost, setCurrentCost] = useState(500000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [inflationRate, setInflationRate] = useState(8);
  const [monthlySIP, setMonthlySIP] = useState(0);
  const [futureCost, setFutureCost] = useState(0);
  const [requiredCorpus, setRequiredCorpus] = useState(0);
  const [shortfall, setShortfall] = useState(0);

  // Calculate education planning
  useEffect(() => {
    const yearsToEducation = educationAge - childAge;
    const monthsToEducation = yearsToEducation * 12;
    
    // Calculate future cost considering inflation
    const futureEducationCost = currentCost * Math.pow(1 + inflationRate / 100, yearsToEducation);
    
    // Calculate monthly SIP needed
    const monthlyRate = expectedReturn / 100 / 12;
    const sipNeeded = futureEducationCost / (((Math.pow(1 + monthlyRate, monthsToEducation) - 1) / monthlyRate) * (1 + monthlyRate));
    
    // Calculate actual corpus with current SIP
    const actualCorpus = monthlySIP * (((Math.pow(1 + monthlyRate, monthsToEducation) - 1) / monthlyRate) * (1 + monthlyRate));
    
    setFutureCost(Math.round(futureEducationCost));
    setRequiredCorpus(Math.round(futureEducationCost));
    setMonthlySIP(Math.round(sipNeeded));
    setShortfall(Math.round(futureEducationCost - actualCorpus));
  }, [childAge, educationAge, currentCost, expectedReturn, inflationRate, monthlySIP]);

  const handleBack = () => {
    navigate('/mutual-funds');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <HeaderNav />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-orange-50 to-red-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-red-100/50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-red-200 rounded-full -translate-y-48 translate-x-48 opacity-30"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex items-center mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Mutual Funds</span>
            </button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Children Education Calculator
            </h1>
            <nav className="flex flex-wrap justify-center items-center space-x-2 text-sm">
              <a href="/" className="text-gray-500 hover:text-orange-600">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/mutual-funds" className="text-gray-500 hover:text-orange-600">Calculator</a>
              <span className="text-gray-400">/</span>
              <span className="text-orange-600 font-medium">Children Education</span>
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
                Plan Your Child's Education with Mutual Funds
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Calculate how much you need to invest monthly to secure your child's educational future
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Calculator Inputs */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Education Planning Details</h3>
                  
                  <div className="space-y-6">
                    {/* Child's Current Age */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Child's Current Age
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={childAge}
                          onChange={(e) => setChildAge(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                          placeholder="Enter child's current age"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          years
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="0"
                          max="15"
                          step="1"
                          value={childAge}
                          onChange={(e) => setChildAge(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>0 years</span>
                          <span>15 years</span>
                        </div>
                      </div>
                    </div>

                    {/* Education Age */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Age When Education Starts
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={educationAge}
                          onChange={(e) => setEducationAge(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                          placeholder="Enter education start age"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          years
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="16"
                          max="25"
                          step="1"
                          value={educationAge}
                          onChange={(e) => setEducationAge(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>16 years</span>
                          <span>25 years</span>
                        </div>
                      </div>
                    </div>

                    {/* Current Education Cost */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Current Education Cost (₹)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={currentCost}
                          onChange={(e) => setCurrentCost(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                          placeholder="Enter current education cost"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="100000"
                          max="2000000"
                          step="50000"
                          value={currentCost}
                          onChange={(e) => setCurrentCost(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>₹1L</span>
                          <span>₹20L</span>
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
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
                        Expected Education Inflation (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={inflationRate}
                          onChange={(e) => setInflationRate(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                          placeholder="Enter inflation rate"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          %
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="5"
                          max="12"
                          step="0.5"
                          value={inflationRate}
                          onChange={(e) => setInflationRate(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>5%</span>
                          <span>12%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-8">
                {/* Education Summary */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Education Planning Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Years to Education</span>
                      <span className="text-2xl font-bold text-orange-600">{educationAge - childAge} years</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Future Education Cost</span>
                      <span className="text-2xl font-bold text-red-600">₹{futureCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-lg text-gray-700">Monthly SIP Needed</span>
                      <span className="text-2xl font-bold text-green-600">₹{monthlySIP.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-lg text-gray-700">Current Education Cost</span>
                      <span className="text-2xl font-bold text-blue-600">₹{currentCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Education Timeline */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Education Timeline</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <FaChild className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">Current Age</p>
                        <p className="text-gray-600">{childAge} years</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaChartLine className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">Investment Period</p>
                        <p className="text-gray-600">{educationAge - childAge} years</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaGraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">Education Start Age</p>
                        <p className="text-gray-600">{educationAge} years</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education Tips */}
                <div className="bg-blue-50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Education Planning Tips</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>• Start investing early to benefit from compounding</li>
                    <li>• Consider different education options (India vs Abroad)</li>
                    <li>• Factor in additional costs like accommodation, books</li>
                    <li>• Review and adjust your plan annually</li>
                    <li>• Consider education loans as a backup option</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">Important Information</h3>
              <ul className="space-y-2 text-yellow-700">
                <li>• This calculator provides an estimate based on the inputs provided</li>
                <li>• Education costs may vary significantly based on institution and location</li>
                <li>• Consider scholarship opportunities and financial aid</li>
                <li>• Review your education plan regularly as your child grows</li>
                <li>• Consult a financial advisor for personalized education planning</li>
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
          background: #f97316;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ChildrenEducationCalculator;
