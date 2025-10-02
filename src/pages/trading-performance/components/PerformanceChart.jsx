import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceChart = ({ data, showBenchmark }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.dataKey}:</span>
              <span className="font-medium text-foreground">
                {entry?.dataKey?.includes('Return') ? `${entry?.value}%` : `$${entry?.value?.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Cumulative Performance</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-muted-foreground">Portfolio</span>
          </div>
          {showBenchmark && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full" />
              <span className="text-muted-foreground">S&P 500</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span className="text-muted-foreground">Monthly Returns</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="#94A3B8"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="#94A3B8"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#94A3B8"
              fontSize={12}
              tickFormatter={(value) => `$${value}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              yAxisId="right"
              dataKey="monthlyPnL" 
              fill="#10B981" 
              name="Monthly P&L"
              opacity={0.7}
              radius={[2, 2, 0, 0]}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="cumulativeReturn" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Cumulative Return"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
            />
            {showBenchmark && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="benchmarkReturn" 
                stroke="#6366F1" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Benchmark"
                dot={{ fill: '#6366F1', strokeWidth: 2, r: 3 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;