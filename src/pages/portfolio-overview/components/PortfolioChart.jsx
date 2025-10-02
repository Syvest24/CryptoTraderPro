import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';

const PortfolioChart = ({ chartData, timeRange, onTimeRangeChange }) => {
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  const timeRanges = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1Y' },
    { label: 'All', value: 'All' }
  ];

  const formatTooltipValue = (value, name) => {
    if (name === 'portfolio') {
      return [`$${value?.toLocaleString()}`, 'Portfolio Value'];
    }
    if (name === 'benchmark') {
      return [`$${value?.toLocaleString()}`, 'S&P 500'];
    }
    return [value, name];
  };

  const formatTooltipLabel = (label) => {
    return new Date(label)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting chart data...');
  };

  const handleZoomReset = () => {
    setIsZoomed(false);
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Portfolio Performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Track your portfolio value over time with benchmark comparison
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* Time Range Selector */}
          <div className="flex items-center bg-muted/20 rounded-lg p-1">
            {timeRanges?.map((range) => (
              <button
                key={range?.value}
                onClick={() => onTimeRangeChange(range?.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  timeRange === range?.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {range?.label}
              </button>
            ))}
          </div>

          {/* Chart Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBenchmark(!showBenchmark)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showBenchmark 
                  ? 'bg-primary/10 text-primary' :'bg-muted/20 text-muted-foreground hover:text-foreground'
              }`}
              title="Toggle Benchmark"
            >
              <Icon name="BarChart3" size={16} />
            </button>
            
            {isZoomed && (
              <button
                onClick={handleZoomReset}
                className="p-2 rounded-lg bg-muted/20 text-muted-foreground hover:text-foreground transition-colors duration-200"
                title="Reset Zoom"
              >
                <Icon name="ZoomOut" size={16} />
              </button>
            )}
            
            <button
              onClick={handleExport}
              className="p-2 rounded-lg bg-muted/20 text-muted-foreground hover:text-foreground transition-colors duration-200"
              title="Export Chart"
            >
              <Icon name="Download" size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Chart Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
            />
            <Tooltip
              formatter={formatTooltipValue}
              labelFormatter={formatTooltipLabel}
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#F8FAFC'
              }}
            />
            
            <Line
              type="monotone"
              dataKey="portfolio"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6' }}
            />
            
            {showBenchmark && (
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#6B7280"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 3, fill: '#6B7280' }}
              />
            )}
            
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-primary rounded-full"></div>
          <span className="text-sm text-muted-foreground">Portfolio Value</span>
        </div>
        {showBenchmark && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-muted-foreground rounded-full opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(to right, #6B7280 0, #6B7280 3px, transparent 3px, transparent 8px)' }}></div>
            <span className="text-sm text-muted-foreground">S&P 500 Benchmark</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioChart;