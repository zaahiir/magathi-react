import React from 'react';
import MutualFundChart from './GraphChart';
import CustomPieChart from './PieChart';
import CustomLineChart from './LineChart';
import CustomAreaChart from './AreaChart';
import CustomRadarChart from './RadarChart';
import CustomScatterChart from './ScatterChart';

export default function ChartsDemo() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center mb-4">Investment Analytics Dashboard</h2>
        </div>
      </div>
      
      <div className="row">
        <MutualFundChart />
        <CustomPieChart />
      </div>
      
      <div className="row mt-4">
        <CustomLineChart />
        <CustomAreaChart />
      </div>
      
      <div className="row mt-4">
        <CustomRadarChart />
        <CustomScatterChart />
      </div>
    </div>
  );
} 