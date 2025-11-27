import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample data with 6 different investment categories
const data = [
  { month: 'Jan', Tech: 4000, Finance: 2400, Healthcare: 2400, Energy: 1800, Consumer: 1200, Industrial: 800 },
  { month: 'Feb', Tech: 3000, Finance: 1398, Healthcare: 2210, Energy: 1908, Consumer: 1000, Industrial: 600 },
  { month: 'Mar', Tech: 2000, Finance: 9800, Healthcare: 2290, Energy: 2008, Consumer: 800, Industrial: 400 },
  { month: 'Apr', Tech: 2780, Finance: 3908, Healthcare: 2000, Energy: 2108, Consumer: 600, Industrial: 200 },
  { month: 'May', Tech: 1890, Finance: 4800, Healthcare: 2181, Energy: 2208, Consumer: 400, Industrial: 100 },
  { month: 'Jun', Tech: 2390, Finance: 3800, Healthcare: 2500, Energy: 2308, Consumer: 200, Industrial: 50 },
  { month: 'Jul', Tech: 3490, Finance: 4300, Healthcare: 2100, Energy: 2408, Consumer: 100, Industrial: 25 },
];

export default function CustomAreaChart() {
  return (
    <div className="col-lg-6">
      <div className="card h-100">
        <div className="card-header">
          <h5 className="card-title mb-0">Sector Performance</h5>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
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
              <Area type="monotone" dataKey="Tech" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Finance" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Healthcare" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Energy" stackId="1" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Consumer" stackId="1" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Industrial" stackId="1" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 