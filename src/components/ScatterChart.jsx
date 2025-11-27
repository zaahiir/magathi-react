import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

// Mutual fund data with risk-return profiles
const mutualFundData = [
  // Large Cap Funds (Low Risk)
  { risk: 15, return: 12, aum: 5000, name: 'HDFC Top 100 Fund', category: 'Large Cap', color: '#4ade80' },
  { risk: 18, return: 11, aum: 3200, name: 'ICICI Pru Bluechip Fund', category: 'Large Cap', color: '#4ade80' },
  { risk: 16, return: 13, aum: 4100, name: 'SBI Large Cap Fund', category: 'Large Cap', color: '#4ade80' },
  { risk: 20, return: 10, aum: 2800, name: 'Axis Bluechip Fund', category: 'Large Cap', color: '#4ade80' },
  
  // Multi Cap Funds (Medium Risk)
  { risk: 25, return: 15, aum: 6500, name: 'HDFC Flexi Cap Fund', category: 'Multi Cap', color: '#60a5fa' },
  { risk: 28, return: 16, aum: 4800, name: 'Parag Parikh Flexi Cap', category: 'Multi Cap', color: '#60a5fa' },
  { risk: 22, return: 14, aum: 3900, name: 'Kotak Flexicap Fund', category: 'Multi Cap', color: '#60a5fa' },
  { risk: 30, return: 17, aum: 5200, name: 'Mirae Asset Flexi Cap', category: 'Multi Cap', color: '#60a5fa' },
  
  // Mid Cap Funds (High Risk)
  { risk: 35, return: 18, aum: 2100, name: 'HDFC Mid-Cap Fund', category: 'Mid Cap', color: '#fbbf24' },
  { risk: 40, return: 20, aum: 1800, name: 'Axis Midcap Fund', category: 'Mid Cap', color: '#fbbf24' },
  { risk: 38, return: 19, aum: 2400, name: 'Kotak Emerging Equity', category: 'Mid Cap', color: '#fbbf24' },
  { risk: 42, return: 21, aum: 1600, name: 'DSP Midcap Fund', category: 'Mid Cap', color: '#fbbf24' },
  
  // Small Cap Funds (Very High Risk)
  { risk: 50, return: 22, aum: 800, name: 'SBI Small Cap Fund', category: 'Small Cap', color: '#f97316' },
  { risk: 55, return: 25, aum: 950, name: 'Axis Small Cap Fund', category: 'Small Cap', color: '#f97316' },
  { risk: 48, return: 20, aum: 720, name: 'HDFC Small Cap Fund', category: 'Small Cap', color: '#f97316' },
  { risk: 52, return: 24, aum: 680, name: 'Kotak Small Cap Fund', category: 'Small Cap', color: '#f97316' },
  
  // ELSS Funds (Tax Saving)
  { risk: 32, return: 16, aum: 3500, name: 'Axis Long Term Equity', category: 'ELSS', color: '#8b5cf6' },
  { risk: 29, return: 15, aum: 4200, name: 'HDFC TaxSaver Fund', category: 'ELSS', color: '#8b5cf6' },
  { risk: 35, return: 17, aum: 2900, name: 'DSP Tax Saver Fund', category: 'ELSS', color: '#8b5cf6' },
  
  // Sectoral Funds (Maximum Risk)
  { risk: 65, return: 28, aum: 1200, name: 'ICICI Pru Technology', category: 'Sectoral', color: '#ef4444' },
  { risk: 70, return: 30, aum: 800, name: 'SBI IT Fund', category: 'Sectoral', color: '#ef4444' },
  { risk: 68, return: 26, aum: 600, name: 'Axis Banking ETF', category: 'Sectoral', color: '#ef4444' },
  { risk: 72, return: 32, aum: 450, name: 'HDFC Pharma Fund', category: 'Sectoral', color: '#ef4444' }
];

const MAIN_COLOR = '#53755d';
const MAIN_COLOR_DARK = '#3e5d49';

const categoryColors = {
  'Large Cap': MAIN_COLOR,
  'Multi Cap': MAIN_COLOR, 
  'Mid Cap': MAIN_COLOR,
  'Small Cap': MAIN_COLOR,
  'ELSS': MAIN_COLOR,
  'Sectoral': MAIN_COLOR
};

const getRiskLevel = (risk) => {
  if (risk <= 20) return 'Low';
  if (risk <= 30) return 'Medium';
  if (risk <= 40) return 'High';
  if (risk <= 55) return 'Very High';
  return 'Extreme';
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg border border-gray-600">
        <p className="font-semibold text-blue-300">{data.name}</p>
        <p className="text-gray-300">Category: {data.category}</p>
        <p className="text-gray-300">Risk: {data.risk}%</p>
        <p className="text-gray-300">Expected Return: {data.return}%</p>
        <p className="text-gray-300">AUM: ₹{data.aum} Cr</p>
        <p className="text-gray-300">Risk Level: {getRiskLevel(data.risk)}</p>
      </div>
    );
  }
  return null;
};

// Portfolio Analysis Modal Component
const PortfolioAnalysisModal = ({ isOpen, onClose, data, selectedCategory }) => {
  if (!isOpen) return null;

  // Calculate analysis metrics
  const avgRisk = data.length > 0 ? data.reduce((acc, fund) => acc + fund.risk, 0) / data.length : 0;
  const avgReturn = data.length > 0 ? data.reduce((acc, fund) => acc + fund.return, 0) / data.length : 0;
  const totalAUM = data.reduce((acc, fund) => acc + fund.aum, 0);
  const avgAUM = data.length > 0 ? totalAUM / data.length : 0;
  
  const bestPerformer = data.reduce((best, fund) => fund.return > best.return ? fund : best, {return: 0});
  const worstPerformer = data.reduce((worst, fund) => fund.return < worst.return ? fund : worst, {return: 999});
  
  // Risk distribution
  const riskDistribution = data.reduce((acc, fund) => {
    const level = getRiskLevel(fund.risk);
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});
  
  // Category distribution
  const categoryDistribution = data.reduce((acc, fund) => {
    acc[fund.category] = (acc[fund.category] || 0) + 1;
    return acc;
  }, {});

  const riskDistributionData = Object.entries(riskDistribution).map(([level, count]) => ({
    name: level,
    value: count,
    color: level === 'Low' ? '#4ade80' : 
           level === 'Medium' ? '#60a5fa' : 
           level === 'High' ? '#fbbf24' : 
           level === 'Very High' ? '#f97316' : '#ef4444'
  }));

  const categoryDistributionData = Object.entries(categoryDistribution).map(([category, count]) => ({
    name: category,
    value: count,
    color: MAIN_COLOR
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Portfolio Analysis</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Average Risk</p>
                  <p className="text-2xl font-bold text-orange-400">{avgRisk.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Average Return</p>
                  <p className="text-2xl font-bold text-green-400">{avgReturn.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total AUM</p>
                  <p className="text-xl font-bold text-blue-400">₹{totalAUM.toLocaleString()} Cr</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Average AUM</p>
                  <p className="text-xl font-bold text-purple-400">₹{avgAUM.toLocaleString()} Cr</p>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
              <div className="space-y-3">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Best Performer</p>
                  <p className="text-lg font-semibold text-green-400">{bestPerformer.name}</p>
                  <p className="text-sm text-gray-300">{bestPerformer.return}% return</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Worst Performer</p>
                  <p className="text-lg font-semibold text-red-400">{worstPerformer.name}</p>
                  <p className="text-sm text-gray-300">{worstPerformer.return}% return</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Risk Distribution */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-4">Risk Distribution</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-4">Category Distribution</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryDistributionData}>
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Bar dataKey="value" fill={MAIN_COLOR} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fund List */}
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-4">All Funds ({data.length})</h4>
            <div className="bg-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-white">Fund Name</th>
                      <th className="px-4 py-3 text-left text-white">Category</th>
                      <th className="px-4 py-3 text-left text-white">Risk (%)</th>
                      <th className="px-4 py-3 text-left text-white">Return (%)</th>
                      <th className="px-4 py-3 text-left text-white">AUM (Cr)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((fund, index) => (
                      <tr key={index} className="border-b border-gray-600">
                        <td className="px-4 py-3 text-white">{fund.name}</td>
                        <td className="px-4 py-3 text-gray-300">{fund.category}</td>
                        <td className="px-4 py-3 text-orange-400">{fund.risk}</td>
                        <td className="px-4 py-3 text-green-400">{fund.return}</td>
                        <td className="px-4 py-3 text-blue-400">{fund.aum.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fund Comparison Modal Component
const FundComparisonModal = ({ isOpen, onClose, data, selectedFunds, setSelectedFunds }) => {
  if (!isOpen) return null;

  const handleFundSelection = (fundName) => {
    if (selectedFunds.includes(fundName)) {
      setSelectedFunds(selectedFunds.filter(name => name !== fundName));
    } else if (selectedFunds.length < 3) {
      setSelectedFunds([...selectedFunds, fundName]);
    }
  };

  const selectedFundsData = data.filter(fund => selectedFunds.includes(fund.name));

  const getBestInCategory = (category) => {
    const categoryFunds = selectedFundsData.filter(fund => fund.category === category);
    if (categoryFunds.length === 0) return null;
    return categoryFunds.reduce((best, fund) => fund.return > best.return ? fund : best);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Compare Funds</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Fund Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Select Funds to Compare (Max 3)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.map((fund) => (
                <button
                  key={fund.name}
                  onClick={() => handleFundSelection(fund.name)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedFunds.includes(fund.name)
                      ? 'border-[#53755d] bg-[#53755d] text-white'
                      : 'border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-medium">{fund.name}</p>
                    <p className="text-sm opacity-75">{fund.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          {selectedFundsData.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Comparison Results</h3>
              
              {/* Comparison Table */}
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-white">Metric</th>
                        {selectedFundsData.map((fund, index) => (
                          <th key={index} className="px-4 py-3 text-left text-white">
                            {fund.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-600">
                        <td className="px-4 py-3 text-gray-300">Category</td>
                        {selectedFundsData.map((fund, index) => (
                          <td key={index} className="px-4 py-3 text-white">{fund.category}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-600">
                        <td className="px-4 py-3 text-gray-300">Risk (%)</td>
                        {selectedFundsData.map((fund, index) => {
                          const bestRisk = Math.min(...selectedFundsData.map(f => f.risk));
                          return (
                            <td key={index} className={`px-4 py-3 ${fund.risk === bestRisk ? 'text-green-400 font-bold' : 'text-orange-400'}`}>
                              {fund.risk}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b border-gray-600">
                        <td className="px-4 py-3 text-gray-300">Return (%)</td>
                        {selectedFundsData.map((fund, index) => {
                          const bestReturn = Math.max(...selectedFundsData.map(f => f.return));
                          return (
                            <td key={index} className={`px-4 py-3 ${fund.return === bestReturn ? 'text-green-400 font-bold' : 'text-green-400'}`}>
                              {fund.return}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b border-gray-600">
                        <td className="px-4 py-3 text-gray-300">AUM (Cr)</td>
                        {selectedFundsData.map((fund, index) => {
                          const bestAUM = Math.max(...selectedFundsData.map(f => f.aum));
                          return (
                            <td key={index} className={`px-4 py-3 ${fund.aum === bestAUM ? 'text-blue-400 font-bold' : 'text-blue-400'}`}>
                              {fund.aum.toLocaleString()}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-300">Risk Level</td>
                        {selectedFundsData.map((fund, index) => (
                          <td key={index} className="px-4 py-3 text-yellow-400">{getRiskLevel(fund.risk)}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Visual Comparison Chart */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-4">Return vs Risk Comparison</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      type="number" 
                      dataKey="risk" 
                      name="Risk (%)" 
                      domain={[0, 80]}
                      stroke="#9ca3af"
                    />
                    <YAxis 
                      type="number" 
                      dataKey="return" 
                      name="Expected Return (%)" 
                      domain={[0, 35]}
                      stroke="#9ca3af"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter 
                      data={selectedFundsData} 
                      fill={MAIN_COLOR}
                      stroke={MAIN_COLOR_DARK}
                      strokeWidth={2}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MutualFundScatterChart() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeFrame, setTimeFrame] = useState('3Y');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [selectedFunds, setSelectedFunds] = useState([]);
  
  // Dynamic date
  const today = new Date();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const formattedDate = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  const categories = ['All', 'Large Cap', 'Multi Cap', 'Mid Cap', 'Small Cap', 'ELSS', 'Sectoral'];
  const timeFrames = ['1Y', '3Y', '5Y', '10Y'];

  const filteredData = selectedCategory === 'All' 
    ? mutualFundData 
    : mutualFundData.filter(fund => fund.category === selectedCategory);

  // Dynamic total AUM
  const totalAUM = filteredData.reduce((acc, fund) => acc + fund.aum, 0);
  const totalAUMDisplay = `\u20B9${totalAUM.toLocaleString()} Cr.`;

  // Analyze Portfolio function
  const analyzePortfolio = () => {
    setShowAnalysisModal(true);
  };

  // Compare Funds function
  const compareFunds = () => {
    setShowComparisonModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#53755d] to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Mutual Fund</h1>
              <h2 className="text-3xl font-light" style={{ color: MAIN_COLOR }}>Risk-Return Analysis</h2>
              <p className="text-gray-400 mt-2">Data as on {formattedDate}</p>
            </div>
            <div className="text-right">
              <div className="text-gray-400 mb-1">Total AUM Analyzed</div>
              <div className="text-2xl font-bold text-white">{totalAUMDisplay}</div>
            </div>
          </div>
        </div>

        {/* Time Frame Selector */}
        <div className="flex space-x-2 mb-6">
          {timeFrames.map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeFrame === frame
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {frame}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <ResponsiveContainer width="100%" height={500}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    type="number" 
                    dataKey="risk" 
                    name="Risk (%)" 
                    domain={[0, 80]}
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="return" 
                    name="Expected Return (%)" 
                    domain={[0, 35]}
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter 
                    data={filteredData} 
                    fill={MAIN_COLOR}
                    stroke={MAIN_COLOR_DARK}
                    strokeWidth={2}
                  />
                </ScatterChart>
              </ResponsiveContainer>
              
              {/* Risk Return Summary */}
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400">Average Return since inception</p>
                    <p className="text-3xl font-bold text-green-400">16.8%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400">Risk Level</p>
                    <p className="text-xl font-semibold text-orange-400">Medium-High</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Fund Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedCategory === category
                        ? 'bg-[#53755d] text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category}</span>
                      {category !== 'All' && (
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: categoryColors[category] }}
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Portfolio Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Funds</p>
                  <p className="text-2xl font-bold text-white">{filteredData.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg Risk Level</p>
                  <p className="text-xl font-semibold text-yellow-400">
                    {getRiskLevel(filteredData.reduce((acc, fund) => acc + fund.risk, 0) / filteredData.length)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Best Performer</p>
                  <p className="text-sm font-medium text-green-400">
                    {filteredData.reduce((best, fund) => fund.return > best.return ? fund : best, {return: 0}).name}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              className="inline-block bg-[#53755d] text-white px-8 py-3 font-medium transition-all duration-300 hover:scale-105 hover:bg-[#3e5d49] shadow-none hover:shadow-lg"
              style={{
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '0px',
                borderBottomRightRadius: '20px',
                borderBottomLeftRadius: '0px',
              }}
              onClick={analyzePortfolio}
            >
              ANALYZE PORTFOLIO
            </button>
            <button
              className="w-full bg-transparent border-2 border-[#53755d] text-[#53755d] hover:bg-[#53755d] hover:text-white font-semibold py-3 px-6 rounded-xl transition-all"
              onClick={compareFunds}
            >
              COMPARE FUNDS
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PortfolioAnalysisModal 
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        data={filteredData}
        selectedCategory={selectedCategory}
      />
      
      <FundComparisonModal 
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        data={filteredData}
        selectedFunds={selectedFunds}
        setSelectedFunds={setSelectedFunds}
      />
    </div>
  );
}