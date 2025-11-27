import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample data with 6 different performance metrics
const data = [
  { metric: 'Risk', Value: 80, Benchmark: 60 },
  { metric: 'Return', Value: 70, Benchmark: 85 },
  { metric: 'Liquidity', Value: 90, Benchmark: 75 },
  { metric: 'Diversification', Value: 85, Benchmark: 80 },
  { metric: 'Cost', Value: 75, Benchmark: 70 },
  { metric: 'Stability', Value: 80, Benchmark: 90 },
];

export default function CustomRadarChart() {
  return (
    <div className="col-lg-6">
      <div className="card h-100">
        <div className="card-header">
          <h5 className="card-title mb-0">Portfolio Analysis</h5>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Portfolio"
                dataKey="Value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="Benchmark"
                dataKey="Benchmark"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 