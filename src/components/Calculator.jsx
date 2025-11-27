import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// SIP Top-up (Step-up) Calculator
function calculateSIPTopUp({
  initialAmount,
  years,
  rate,
  topupType,
  topupValue,
  topupFrequency,
  inflation,
}) {
  let details = [];
  let invested = 0;
  let value = 0;
  let annualRate = rate / 100;
  let sipAmount = initialAmount;
  let totalInvested = 0;

  for (let y = 1; y <= years; y++) {
    // Top-up logic
    if (y > 1 && topupFrequency === "Annually") {
      if (topupType === "Percentage") {
        sipAmount = Math.round(sipAmount * (1 + topupValue / 100));
      } else {
        sipAmount = Math.round(sipAmount + topupValue);
      }
    }
    let yearInvested = sipAmount * 12;
    totalInvested += yearInvested;
    // SIP FV for this year
    for (let m = 0; m < 12; m++) {
      value += sipAmount;
      value *= 1 + annualRate / 12;
    }
    details.push({
      year: y,
      sipAmount,
      invested: totalInvested,
      value: Math.round(value),
      profit: Math.round(value - totalInvested),
    });
  }
  return {
    invested: totalInvested,
    futureValue: Math.round(value),
    returns: Math.round(value - totalInvested),
    details,
  };
}

// Basic SIP Calculator
function calculateSIP({
  amount,
  frequency,
  years,
  rate,
  inflation,
  withdrawals,
  limitedPeriod,
  lumpsum,
  topup,
}) {
  let invested = 0;
  let value = 0;
  let details = [];
  let annualRate = rate / 100;
  let periods = years * (frequency === "Monthly" ? 12 : 1);
  let periodRate = frequency === "Monthly" ? annualRate / 12 : annualRate;
  let periodAmount = amount;
  let totalWithdrawn = 0;

  for (let y = 1; y <= years; y++) {
    let yearInvested = 0;
    let yearValue = value;
    for (let p = 0; p < (frequency === "Monthly" ? 12 : 1); p++) {
      if (!limitedPeriod || y <= limitedPeriod) {
        yearInvested += periodAmount;
        value += periodAmount;
      }
      value *= 1 + periodRate;
    }
    let withdrawal = withdrawals && withdrawals[y - 1] ? withdrawals[y - 1] : 0;
    value -= withdrawal;
    totalWithdrawn += withdrawal;

    details.push({
      year: y,
      invested:
        y * periodAmount * (frequency === "Monthly" ? 12 : 1) + (lumpsum || 0),
      withdrawals: withdrawal,
      value: Math.round(value),
      profit: Math.round(
        value -
          y * periodAmount * (frequency === "Monthly" ? 12 : 1) -
          (lumpsum || 0)
      ),
    });
  }

  invested =
    years * periodAmount * (frequency === "Monthly" ? 12 : 1) + (lumpsum || 0);
  return {
    invested,
    futureValue: Math.round(value),
    totalWithdrawn,
    returns: Math.round(value - invested),
    details,
  };
}

const HEADERS = [
  { key: "sip", label: "SIP" },
  { key: "sipTopup", label: "SIP Top-up" },
  { key: "lumpsum", label: "Lumpsum" },
  { key: "sipLumpsum", label: "SIP + Lumpsum" },
  { key: "swp", label: "SWP" },
  { key: "stp", label: "STP" },
];

export default function Calculator() {
  const [activeTab, setActiveTab] = useState("sip");
  const [animate, setAnimate] = useState(false);

  // SIP states
  const [amount, setAmount] = useState(10000);
  const [frequency, setFrequency] = useState("Monthly");
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12);
  const [inflation, setInflation] = useState(0);
  const [limitedPeriod, setLimitedPeriod] = useState("");
  const [lumpsum, setLumpsum] = useState(0);
  const [topup, setTopup] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  // SIP Top-up states
  const [initialAmount, setInitialAmount] = useState(5000);
  const [topupType, setTopupType] = useState("Percentage");
  const [topupValue, setTopupValue] = useState(10);
  const [topupFrequency, setTopupFrequency] = useState("Annually");
  const [topupYears, setTopupYears] = useState(10);
  const [topupRate, setTopupRate] = useState(12);
  const [topupInflation, setTopupInflation] = useState(0);
  const [showTopupDetails, setShowTopupDetails] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 200);
  }, []);

  // Results
  const sipResult = calculateSIP({
    amount,
    frequency,
    years,
    rate,
    inflation,
    withdrawals,
    limitedPeriod: limitedPeriod ? Number(limitedPeriod) : null,
    lumpsum: lumpsum ? Number(lumpsum) : 0,
    topup: topup ? Number(topup) : 0,
  });

  const pieDataSIP = {
    labels: ["Invested Amount", "Est. Returns"],
    datasets: [
      {
        data: [sipResult.invested, sipResult.returns],
        backgroundColor: ["#16a34a", "#fde047"],
        hoverOffset: 4,
      },
    ],
  };

  const topUpResult = calculateSIPTopUp({
    initialAmount,
    years: topupYears,
    rate: topupRate,
    topupType,
    topupValue,
    topupFrequency,
    inflation: topupInflation,
  });

  const pieDataTopUp = {
    labels: ["Invested Amount", "Est. Returns"],
    datasets: [
      {
        data: [topUpResult.invested, topUpResult.returns],
        backgroundColor: ["#16a34a", "#fde047"],
        hoverOffset: 4,
      },
    ],
  };

  // Placeholder for other calculators
  const renderTabContent = () => {
    switch (activeTab) {
      case "sip":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
            <div className="animate-fade-in delay-200">
              <label className="block font-semibold mb-1">
                Investment Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
              <label className="block font-semibold mb-1">
                Payment Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              >
                <option>Monthly</option>
                <option>Annually</option>
              </select>
              <label className="block font-semibold mb-1">
                Investment Timing
              </label>
              <select className="w-full border rounded px-3 py-2 mb-3" disabled>
                <option>End of Period</option>
              </select>
              <label className="block font-semibold mb-1">
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
              <label className="block font-semibold mb-1">
                Total Investment Period (Years)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
              <label className="block font-semibold mb-1">
                Limited SIP period
              </label>
              <input
                type="number"
                value={limitedPeriod}
                onChange={(e) => setLimitedPeriod(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
              <label className="block font-semibold mb-1">Lumpsum</label>
              <input
                type="number"
                value={lumpsum}
                onChange={(e) => setLumpsum(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
              <label className="block font-semibold mb-1">SIP Top-up</label>
              <input
                type="number"
                value={topup}
                onChange={(e) => setTopup(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
              <label className="block font-semibold mb-1">
                Adjust for Inflation
              </label>
              <input
                type="number"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
            </div>
            <div className="flex flex-col items-center justify-center animate-fade-in delay-400">
              <div className="w-full flex justify-center">
                <Pie data={pieDataSIP} />
              </div>
              <div className="mt-6 text-center">
                <div className="font-semibold text-lg text-gray-700">
                  Invested Amount
                </div>
                <div className="text-2xl font-bold text-green-700 animate-count">{`₹${sipResult.invested.toLocaleString()}`}</div>
                <div className="font-semibold text-lg text-gray-700 mt-2">
                  Future Value
                </div>
                <div className="text-2xl font-bold text-yellow-500 animate-count">{`₹${sipResult.futureValue.toLocaleString()}`}</div>
                <div className="font-semibold text-lg text-gray-700 mt-2">
                  Total Withdrawn
                </div>
                <div className="text-2xl font-bold text-red-500 animate-count">{`₹${sipResult.totalWithdrawn.toLocaleString()}`}</div>
                <div className="font-semibold text-lg text-gray-700 mt-2">
                  Est. Returns
                </div>
                <div className="text-2xl font-bold text-green-700 animate-count">{`₹${sipResult.returns.toLocaleString()}`}</div>
              </div>
            </div>
          </div>
        );
      case "sipTopup":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
            <div className="animate-fade-in delay-200">
              <label className="block font-semibold mb-1">
                Initial SIP Amount (₹)
              </label>
              <input
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
              <label className="block font-semibold mb-1">SIP Frequency</label>
              <select className="w-full border rounded px-3 py-2 mb-3" disabled>
                <option>Monthly</option>
              </select>
              <label className="block font-semibold mb-1">
                Investment Timing
              </label>
              <select className="w-full border rounded px-3 py-2 mb-3" disabled>
                <option>End of Period</option>
              </select>
              <label className="block font-semibold mb-1">
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                value={topupRate}
                onChange={(e) => setTopupRate(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
              <label className="block font-semibold mb-1">
                Investment Period (Years)
              </label>
              <input
                type="number"
                value={topupYears}
                onChange={(e) => setTopupYears(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
              <div className="mt-4 mb-2 font-bold text-green-700">
                Top-up Settings
              </div>
              <label className="block font-semibold mb-1">Top-up Type</label>
              <select
                value={topupType}
                onChange={(e) => setTopupType(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Amount">Amount (₹)</option>
              </select>
              <label className="block font-semibold mb-1">Top-up Value</label>
              <input
                type="number"
                value={topupValue}
                onChange={(e) => setTopupValue(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
              <label className="block font-semibold mb-1">
                Top-up Frequency
              </label>
              <select
                value={topupFrequency}
                onChange={(e) => setTopupFrequency(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3"
              >
                <option>Annually</option>
              </select>
              <label className="block font-semibold mb-1">
                Adjust for Inflation
              </label>
              <input
                type="number"
                value={topupInflation}
                onChange={(e) => setTopupInflation(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-green-400 transition"
              />
            </div>
            <div className="flex flex-col items-center justify-center animate-fade-in delay-400">
              <div className="w-full flex justify-center">
                <Pie data={pieDataTopUp} />
              </div>
              <div className="mt-6 text-center">
                <div className="font-semibold text-lg text-gray-700">
                  Invested Amount
                </div>
                <div className="text-2xl font-bold text-green-700 animate-count">{`₹${topUpResult.invested.toLocaleString()}`}</div>
                <div className="font-semibold text-lg text-gray-700 mt-2">
                  Future Value
                </div>
                <div className="text-2xl font-bold text-yellow-500 animate-count">{`₹${topUpResult.futureValue.toLocaleString()}`}</div>
                <div className="font-semibold text-lg text-gray-700 mt-2">
                  Est. Returns
                </div>
                <div className="text-2xl font-bold text-green-700 animate-count">{`₹${topUpResult.returns.toLocaleString()}`}</div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center text-gray-500 py-20">
            Coming soon: {HEADERS.find((h) => h.key === activeTab)?.label}{" "}
            Calculator
          </div>
        );
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 relative overflow-hidden ${
        animate ? "animate-slide-in" : ""
      }`}
      style={{ minHeight: 700 }}
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute right-0 top-0 w-1/2 h-1/2 bg-gradient-to-br from-green-100 via-green-200 to-yellow-100 rounded-full blur-2xl opacity-40 animate-bgPulse"></div>
        <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-gradient-to-tr from-yellow-100 via-green-100 to-green-200 rounded-full blur-2xl opacity-30 animate-bgPulse"></div>
      </div>
      <h2 className="text-3xl font-extrabold mb-6 text-green-700 text-center animate-fade-in">
        <span className="bg-gradient-to-r from-green-700 via-yellow-400 to-green-700 bg-clip-text text-transparent">
          Mutual Fund Calculators
        </span>
      </h2>
      <div className="flex justify-center mb-8 gap-2 flex-wrap">
        {HEADERS.map((header) => (
          <button
            key={header.key}
            className={`px-6 py-2 rounded-full font-bold transition shadow ${
              activeTab === header.key
                ? "bg-green-700 text-white scale-105"
                : "bg-white text-green-700 border border-green-700 hover:bg-green-50"
            }`}
            onClick={() => {
              setActiveTab(header.key);
              setShowDetails(false);
              setShowTopupDetails(false);
            }}
          >
            {header.label}
          </button>
        ))}
      </div>
      {renderTabContent()}
      {(activeTab === "sip" || activeTab === "sipTopup") && (
        <button
          className="bg-gradient-to-r from-green-700 to-green-900 text-white px-6 py-2 rounded-full font-bold hover:scale-105 hover:shadow-xl transition mb-4 animate-fade-in delay-600"
          onClick={() =>
            activeTab === "sip"
              ? setShowDetails(!showDetails)
              : setShowTopupDetails(!showTopupDetails)
          }
        >
          {(activeTab === "sip" ? showDetails : showTopupDetails)
            ? "Hide Details"
            : "Show Details"}
        </button>
      )}
      {activeTab === "sip" && showDetails && (
        <div className="overflow-x-auto animate-fade-in delay-800">
          <table className="min-w-full border mt-4">
            <thead>
              <tr className="bg-green-100">
                <th className="px-2 py-1 border">YEAR</th>
                <th className="px-2 py-1 border">INVESTED</th>
                <th className="px-2 py-1 border">WITHDRAWALS</th>
                <th className="px-2 py-1 border">VALUE</th>
                <th className="px-2 py-1 border">PROFIT/(LOSS)</th>
              </tr>
            </thead>
            <tbody>
              {sipResult.details.map((row) => (
                <tr key={row.year} className="text-center">
                  <td className="border px-2 py-1">{row.year}</td>
                  <td className="border px-2 py-1">
                    ₹{row.invested.toLocaleString()}
                  </td>
                  <td className="border px-2 py-1">
                    ₹{row.withdrawals.toLocaleString()}
                  </td>
                  <td className="border px-2 py-1">
                    ₹{row.value.toLocaleString()}
                  </td>
                  <td className="border px-2 py-1">
                    ₹{row.profit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "sipTopup" && showTopupDetails && (
        <div className="overflow-x-auto animate-fade-in delay-800">
          <table className="min-w-full border mt-4">
            <thead>
              <tr className="bg-green-100">
                <th className="px-2 py-1 border">YEAR</th>
                <th className="px-2 py-1 border">SIP AMOUNT</th>
                <th className="px-2 py-1 border">INVESTED</th>
                <th className="px-2 py-1 border">VALUE</th>
                <th className="px-2 py-1 border">PROFIT/(LOSS)</th>
              </tr>
            </thead>
            <tbody>
              {topUpResult.details.map((row) => (
                <tr key={row.year} className="text-center">
                  <td className="border px-2 py-1">{row.year}</td>
                  <td className="border px-2 py-1">
                    ₹{row.sipAmount.toLocaleString()}
                  </td>
                  <td className="border px-2 py-1">
                    ₹{row.invested.toLocaleString()}
                  </td>
                  <td className="border px-2 py-1">
                    ₹{row.value.toLocaleString()}
                  </td>
                  <td className="border px-2 py-1">
                    ₹{row.profit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style jsx="true">{`
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
        .delay-800 {
          animation-delay: 0.8s;
        }
        @keyframes bgPulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        .animate-bgPulse {
          animation: bgPulse 4s infinite alternate;
        }
        @keyframes count {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-count {
          animation: count 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
