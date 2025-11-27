import React, { useState, useEffect } from "react";
import { TrendingUp, Shield, Calculator, Star, Filter, Search, ChevronDown, Info, Clock, DollarSign } from "lucide-react";
import PlanDetailsModal from '../components/PlanDetailsModal';

// Enhanced color palette
const colors = {
  primary: "#53755d",
  secondary: "#fff",
  accent: "#4ade80",
  danger: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  light: "#f8fafc",
  dark: "#1e293b"
};

// Enhanced mutual funds data with more realistic details
const mutualFunds = [
  {
    id: 1,
    name: "Equity Growth Fund",
    category: "Equity",
    description: "Diversified large-cap equities for long-term capital appreciation. Invests in top 100 companies by market cap.",
    amfiCode: "MF123456",
    govRules: "SEBI regulated, tax benefits under Section 80C",
    returns: "12.5%",
    oneYearReturn: "15.2%",
    threeYearReturn: "11.8%",
    fiveYearReturn: "12.5%",
    risk: "High",
    riskLevel: 5,
    minInvestment: "₹5,000",
    nav: "₹156.42",
    aum: "₹12,450 Cr",
    expenseRatio: "0.85%",
    rating: 4.2,
    fundManager: "Rahul Sharma",
    launched: "2015",
    benchmark: "BSE Sensex",
    dividendYield: "2.1%",
    topHoldings: ["Reliance Industries", "HDFC Bank", "Infosys", "TCS", "ICICI Bank"],
    sectorAllocation: {
      "Financial Services": 28.5,
      "Information Technology": 22.3,
      "Consumer Goods": 15.8,
      "Energy": 12.4,
      "Healthcare": 8.9,
      "Others": 12.1
    }
  },
  {
    id: 2,
    name: "Balanced Advantage Fund",
    category: "Hybrid",
    description: "Dynamic asset allocation between equity and debt based on market conditions. Suitable for moderate risk investors.",
    amfiCode: "MF654321",
    govRules: "SEBI regulated, moderate risk profile",
    returns: "9.8%",
    oneYearReturn: "11.2%",
    threeYearReturn: "9.5%",
    fiveYearReturn: "9.8%",
    risk: "Moderate",
    riskLevel: 3,
    minInvestment: "₹1,000",
    nav: "₹89.67",
    aum: "₹8,750 Cr",
    expenseRatio: "1.15%",
    rating: 4.0,
    fundManager: "Priya Patel",
    launched: "2017",
    benchmark: "CRISIL Hybrid 35+65",
    dividendYield: "3.2%",
    topHoldings: ["HDFC Bank", "Government Securities", "Infosys", "Corporate Bonds", "SBI"],
    sectorAllocation: {
      "Government Securities": 35.2,
      "Financial Services": 18.5,
      "Information Technology": 12.8,
      "Corporate Bonds": 15.6,
      "Consumer Goods": 8.9,
      "Others": 9.0
    }
  },
  {
    id: 3,
    name: "Liquid Savings Fund",
    category: "Debt",
    description: "Investment in high-quality short-term debt instruments. Ideal for emergency funds and short-term goals.",
    amfiCode: "MF112233",
    govRules: "SEBI regulated, instant redemption available",
    returns: "6.2%",
    oneYearReturn: "6.8%",
    threeYearReturn: "6.0%",
    fiveYearReturn: "6.2%",
    risk: "Low",
    riskLevel: 1,
    minInvestment: "₹500",
    nav: "₹2,156.89",
    aum: "₹15,240 Cr",
    expenseRatio: "0.25%",
    rating: 4.5,
    fundManager: "Amit Kumar",
    launched: "2010",
    benchmark: "CRISIL Liquid Fund Index",
    dividendYield: "6.2%",
    topHoldings: ["Treasury Bills", "Commercial Papers", "Certificate of Deposits", "Bank FDs", "Govt Securities"],
    sectorAllocation: {
      "Government Securities": 45.2,
      "Treasury Bills": 25.8,
      "Commercial Papers": 15.3,
      "Certificate of Deposits": 8.7,
      "Bank Deposits": 5.0
    }
  },
  {
    id: 4,
    name: "Tax Saver ELSS Fund",
    category: "ELSS",
    description: "Equity Linked Savings Scheme with tax benefits under Section 80C. 3-year lock-in period.",
    amfiCode: "MF789456",
    govRules: "SEBI regulated, Section 80C benefits up to ₹1.5L",
    returns: "13.2%",
    oneYearReturn: "16.8%",
    threeYearReturn: "12.5%",
    fiveYearReturn: "13.2%",
    risk: "High",
    riskLevel: 4,
    minInvestment: "₹500",
    nav: "₹245.78",
    aum: "₹9,680 Cr",
    expenseRatio: "1.05%",
    rating: 4.3,
    fundManager: "Sanjay Gupta",
    launched: "2012",
    benchmark: "BSE 500",
    dividendYield: "1.8%",
    topHoldings: ["TCS", "Reliance", "HDFC Bank", "Bajaj Finance", "Asian Paints"],
    sectorAllocation: {
      "Information Technology": 25.4,
      "Financial Services": 22.1,
      "Consumer Goods": 18.3,
      "Healthcare": 12.7,
      "Industrials": 11.2,
      "Others": 10.3
    }
  }
];

// Government offers with more details
const govOffers = [
  {
    title: "Section 80C Tax Benefits",
    desc: "Save up to ₹1.5L annually on taxes through ELSS investments",
    icon: <Shield className="w-6 h-6" />,
    validity: "FY 2024-25",
    benefit: "Up to ₹46,800 tax saving"
  },
  {
    title: "SIP Benefits",
    desc: "Start SIP with as low as ₹100/month and build wealth systematically",
    icon: <TrendingUp className="w-6 h-6" />,
    validity: "Ongoing",
    benefit: "Rupee cost averaging"
  },
  {
    title: "Senior Citizen Benefits",
    desc: "Additional tax benefits and lower expense ratios for senior citizens",
    icon: <Star className="w-6 h-6" />,
    validity: "Age 60+",
    benefit: "Extra ₹50,000 deduction"
  }
];

export default function EnhancedMutualFundsPage() {
  const [selectedFund, setSelectedFund] = useState(mutualFunds[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCalculator, setShowCalculator] = useState(false);
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipYears, setSipYears] = useState(10);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [selectedFundForDetails, setSelectedFundForDetails] = useState(null);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter functions
  const categories = ["All", ...new Set(mutualFunds.map(fund => fund.category))];
  const filteredFunds = mutualFunds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || fund.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // SIP Calculator
  const calculateSIP = () => {
    const monthlyRate = parseFloat(selectedFund.returns) / 100 / 12;
    const months = sipYears * 12;
    const futureValue = sipAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvestment = sipAmount * months;
    const returns = futureValue - totalInvestment;
    return { futureValue, totalInvestment, returns };
  };

  const sipCalculation = calculateSIP();

  const handleViewDetails = (fund) => {
    setSelectedFundForDetails(fund);
    setShowPlanDetails(true);
  };

  return (
    <div style={{ background: colors.primary, minHeight: "100vh" }}>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mutual funds..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                SIP Calculator
              </button>
            </div>

            {/* SIP Calculator */}
            {showCalculator && (
              <div className="bg-blue-50 rounded-lg p-6 mb-6 animate-slideIn">
                <h3 className="text-lg font-bold mb-4 text-blue-800">SIP Calculator</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly SIP Amount</label>
                    <input
                      type="number"
                      value={sipAmount}
                      onChange={(e) => setSipAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Investment Period (Years)</label>
                    <input
                      type="number"
                      value={sipYears}
                      onChange={(e) => setSipYears(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expected Return</label>
                    <input
                      type="text"
                      value={selectedFund.returns}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Investment</p>
                    <p className="text-xl font-bold text-blue-600">₹{sipCalculation.totalInvestment.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Expected Returns</p>
                    <p className="text-xl font-bold text-green-600">₹{sipCalculation.returns.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Future Value</p>
                    <p className="text-xl font-bold text-purple-600">₹{sipCalculation.futureValue.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fund Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredFunds.map((fund) => (
              <div
                key={fund.id}
                onClick={() => setSelectedFund(fund)}
                className={`bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg ${
                  selectedFund.id === fund.id ? 'ring-4 ring-green-200 shadow-xl' : 'hover:shadow-xl'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{fund.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {fund.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{fund.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{fund.returns}</div>
                    <div className="text-xs text-gray-500">5Y CAGR</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">NAV: </span>
                    <span className="font-medium">{fund.nav}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">AUM: </span>
                    <span className="font-medium">{fund.aum}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Min SIP: </span>
                    <span className="font-medium">{fund.minInvestment}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Risk: </span>
                    <span className={`font-medium ${
                      fund.risk === 'High' ? 'text-red-600' : 
                      fund.risk === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {fund.risk}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Fund Information */}
          <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedFund.name}</h2>
                <p className="text-gray-600 text-lg">{selectedFund.description}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600 mb-1">{selectedFund.returns}</div>
                <div className="text-sm text-gray-500">5 Year CAGR</div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedFund.oneYearReturn}</div>
                <div className="text-sm text-gray-600">1 Year Return</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{selectedFund.threeYearReturn}</div>
                <div className="text-sm text-gray-600">3 Year Return</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedFund.nav}</div>
                <div className="text-sm text-gray-600">Current NAV</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{selectedFund.expenseRatio}</div>
                <div className="text-sm text-gray-600">Expense Ratio</div>
              </div>
            </div>

            {/* Fund Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Fund Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fund Manager:</span>
                    <span className="font-medium">{selectedFund.fundManager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Launched:</span>
                    <span className="font-medium">{selectedFund.launched}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Benchmark:</span>
                    <span className="font-medium">{selectedFund.benchmark}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dividend Yield:</span>
                    <span className="font-medium">{selectedFund.dividendYield}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">AUM:</span>
                    <span className="font-medium">{selectedFund.aum}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Top Holdings</h3>
                <div className="space-y-2">
                  {selectedFund.topHoldings.map((holding, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">{holding}</span>
                      <span className="text-sm text-gray-500">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sector Allocation */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Sector Allocation</h3>
              <div className="space-y-3">
                {Object.entries(selectedFund.sectorAllocation).map(([sector, percentage]) => (
                  <div key={sector}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">{sector}</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => handleViewDetails(selectedFund)}
                className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                Start SIP
              </button>
              <button 
                onClick={() => handleViewDetails(selectedFund)}
                className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Lumpsum Investment
              </button>
              <button 
                onClick={() => handleViewDetails(selectedFund)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:border-gray-400 transition-colors"
              >
                View Factsheet
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          {/* Government Offers */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-center">Government Offers & Benefits</h3>
            <div className="space-y-4">
              {govOffers.map((offer, index) => (
                <div key={index} className="border border-green-200 rounded-lg p-4 hover:bg-green-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div style={{ color: colors.primary }}>
                      {offer.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{offer.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{offer.desc}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-green-600 font-medium">{offer.benefit}</span>
                        <span className="text-gray-500">{offer.validity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-bold text-yellow-800">Important Information</h3>
            </div>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>• All funds are AMFI registered and SEBI regulated</li>
              <li>• Investments are subject to market risks</li>
              <li>• Read all scheme documents carefully</li>
              <li>• Past performance doesn't guarantee future returns</li>
              <li>• Consult your financial advisor before investing</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-yellow-200">
              <p className="text-xs text-yellow-700">
                For more information, visit{" "}
                <a href="https://www.amfiindia.com/" className="underline hover:text-yellow-900" target="_blank" rel="noopener noreferrer">
                  AMFI India
                </a>{" "}
                or{" "}
                <a href="https://www.sebi.gov.in/" className="underline hover:text-yellow-900" target="_blank" rel="noopener noreferrer">
                  SEBI
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx="true">{`
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Plan Details Modal */}
      <PlanDetailsModal
        isOpen={showPlanDetails}
        onClose={() => setShowPlanDetails(false)}
        plan={selectedFundForDetails}
        planType="mutual-fund"
      />
    </div>
  );
}