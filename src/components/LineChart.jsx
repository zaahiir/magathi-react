import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample data with 6 different investment categories
const data = [
  { month: 'Jan', Stocks: 4000, Bonds: 2400, RealEstate: 2400, Commodities: 1800, Cash: 1200, Others: 800 },
  { month: 'Feb', Stocks: 3000, Bonds: 1398, RealEstate: 2210, Commodities: 1908, Cash: 1000, Others: 600 },
  { month: 'Mar', Stocks: 2000, Bonds: 9800, RealEstate: 2290, Commodities: 2008, Cash: 800, Others: 400 },
  { month: 'Apr', Stocks: 2780, Bonds: 3908, RealEstate: 2000, Commodities: 2108, Cash: 600, Others: 200 },
  { month: 'May', Stocks: 1890, Bonds: 4800, RealEstate: 2181, Commodities: 2208, Cash: 400, Others: 100 },
  { month: 'Jun', Stocks: 2390, Bonds: 3800, RealEstate: 2500, Commodities: 2308, Cash: 200, Others: 50 },
  { month: 'Jul', Stocks: 3490, Bonds: 4300, RealEstate: 2100, Commodities: 2408, Cash: 100, Others: 25 },
];

export default function CustomLineChart() {
  return (
    <div className="col-lg-6">
      <div className="card h-100">
        <div className="card-header">
          <h5 className="card-title mb-0">Investment Trends</h5>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Stocks" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="Bonds" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="RealEstate" stroke="#ffc658" strokeWidth={2} />
              <Line type="monotone" dataKey="Commodities" stroke="#ff7300" strokeWidth={2} />
              <Line type="monotone" dataKey="Cash" stroke="#00C49F" strokeWidth={2} />
              <Line type="monotone" dataKey="Others" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 