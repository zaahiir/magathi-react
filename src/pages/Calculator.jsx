import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

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
  // Basic SIP calculation with annual compounding
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
    for (
      let p = 0;
      p < (frequency === "Monthly" ? 12 : 1);
      p++
    ) {
      if (!limitedPeriod || y <= limitedPeriod) {
        yearInvested += periodAmount;
        value += periodAmount;
      }
      value *= 1 + periodRate;
    }
    // Withdrawals
    let withdrawal = withdrawals[y - 1] || 0;
    value -= withdrawal;
    totalWithdrawn += withdrawal;

    details.push({
      year: y,
      invested: (y * periodAmount * (frequency === "Monthly" ? 12 : 1)) + (lumpsum || 0),
      withdrawals: withdrawal,
      value: Math.round(value),
      profit: Math.round(value - (y * periodAmount * (frequency === "Monthly" ? 12 : 1)) - (lumpsum || 0)),
    });
  }

  invested = years * periodAmount * (frequency === "Monthly" ? 12 : 1) + (lumpsum || 0);
  return {
    invested,
    futureValue: Math.round(value),
    totalWithdrawn,
    returns: Math.round(value - invested),
    details,
  };
}

export default function Calculator() {
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

  const result = calculateSIP({
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

  const pieData = {
    labels: ["Invested Amount", "Est. Returns"],
    datasets: [
      {
        data: [result.invested, result.returns],
        backgroundColor: ["#16a34a", "#fde047"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Mutual Fund Calculator</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block font-semibold mb-1">Investment Amount (₹)</label>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full border rounded px-3 py-2 mb-3" />
          <label className="block font-semibold mb-1">Payment Frequency</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full border rounded px-3 py-2 mb-3">
            <option>Monthly</option>
            <option>Annually</option>
          </select>
          <label className="block font-semibold mb-1">Investment Timing</label>
          <select className="w-full border rounded px-3 py-2 mb-3" disabled>
            <option>End of Period</option>
          </select>
          <label className="block font-semibold mb-1">Expected Annual Return (%)</label>
          <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full border rounded px-3 py-2 mb-3" />
          <label className="block font-semibold mb-1">Total Investment Period (Years)</label>
          <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full border rounded px-3 py-2 mb-3" />
          <label className="block font-semibold mb-1">Limited SIP period</label>
          <input type="number" value={limitedPeriod} onChange={e => setLimitedPeriod(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" />
          <label className="block font-semibold mb-1">Lumpsum</label>
          <input type="number" value={lumpsum} onChange={e => setLumpsum(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" />
          <label className="block font-semibold mb-1">SIP Top-up</label>
          <input type="number" value={topup} onChange={e => setTopup(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" />
          <label className="block font-semibold mb-1">Adjust for Inflation</label>
          <input type="number" value={inflation} onChange={e => setInflation(Number(e.target.value))} className="w-full border rounded px-3 py-2 mb-3" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <Pie data={pieData} />
          <div className="mt-6">
            <div className="font-semibold text-lg text-gray-700">Invested Amount</div>
            <div className="text-2xl font-bold text-green-700">₹{result.invested.toLocaleString()}</div>
            <div className="font-semibold text-lg text-gray-700 mt-2">Future Value</div>
            <div className="text-2xl font-bold text-yellow-500">₹{result.futureValue.toLocaleString()}</div>
            <div className="font-semibold text-lg text-gray-700 mt-2">Total Withdrawn</div>
            <div className="text-2xl font-bold text-red-500">₹{result.totalWithdrawn.toLocaleString()}</div>
            <div className="font-semibold text-lg text-gray-700 mt-2">Est. Returns</div>
            <div className="text-2xl font-bold text-green-700">₹{result.returns.toLocaleString()}</div>
          </div>
        </div>
      </div>
      <button
        className="bg-green-700 text-white px-6 py-2 rounded-full font-bold hover:bg-green-900 transition mb-4"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
      {showDetails && (
        <div className="overflow-x-auto">
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
              {result.details.map((row) => (
                <tr key={row.year} className="text-center">
                  <td className="border px-2 py-1">{row.year}</td>
                  <td className="border px-2 py-1">₹{row.invested.toLocaleString()}</td>
                  <td className="border px-2 py-1">₹{row.withdrawals.toLocaleString()}</td>
                  <td className="border px-2 py-1">₹{row.value.toLocaleString()}</td>
                  <td className="border px-2 py-1">₹{row.profit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export { calculateSIP };