import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample data representing mutual fund names with profit and loss
const data = [
  {
    fund: 'SBI Equity',
    profit: 4500,
    loss: 0,
  },
  {
    fund: 'ICICI Balanced',
    profit: 0,
    loss: 1800,
  },
  {
    fund: 'HDFC Growth',
    profit: 3200,
    loss: 0,
  },
  {
    fund: 'Axis Bluechip',
    profit: 0,
    loss: 2200,
  },
  {
    fund: 'Nippon India',
    profit: 1500,
    loss: 0,
  },
  {
    fund: 'Kotak Flexicap',
    profit: 0,
    loss: 1300,
  },
];

export default class MutualFundChart extends PureComponent {
  render() {
    return (
      <div className="col-lg-6">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Mutual Fund Performance</h5>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fund" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="profit"
                  name="Profit"
                  fill="#4CAF50"
                  activeBar={<Rectangle fill="#66bb6a" stroke="#2e7d32" />}
                />
                <Bar
                  dataKey="loss"
                  name="Loss"
                  fill="#f44336"
                  activeBar={<Rectangle fill="#ef5350" stroke="#b71c1c" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}
