import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const AdvancedAnalytics = ({ correlationData, volatilityData, tradeDistribution }) => {
  const [activeTab, setActiveTab] = useState('correlation');

  const tabs = [
    { id: 'correlation', label: 'Correlation Matrix', icon: 'Grid3X3' },
    { id: 'volatility', label: 'Rolling Volatility', icon: 'Activity' },
    { id: 'distribution', label: 'Trade Distribution', icon: 'BarChart3' }
  ];

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
                {typeof entry?.value === 'number' ? entry?.value?.toFixed(2) : entry?.value}
                {activeTab === 'volatility' ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getCorrelationColor = (value) => {
    if (value > 0.7) return 'bg-success text-success-foreground';
    if (value > 0.3) return 'bg-warning text-warning-foreground';
    if (value > -0.3) return 'bg-muted text-muted-foreground';
    if (value > -0.7) return 'bg-error/50 text-error';
    return 'bg-error text-error-foreground';
  };

  const renderCorrelationMatrix = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        <div className="text-xs font-medium text-muted-foreground"></div>
        {correlationData?.assets?.map((asset, index) => (
          <div key={index} className="text-xs font-medium text-center text-muted-foreground p-2">
            {asset}
          </div>
        ))}
        {correlationData?.matrix?.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div className="text-xs font-medium text-muted-foreground p-2">
              {correlationData?.assets?.[rowIndex]}
            </div>
            {row?.map((value, colIndex) => (
              <div 
                key={colIndex} 
                className={`text-xs font-medium text-center p-2 rounded ${getCorrelationColor(value)}`}
              >
                {value?.toFixed(2)}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded" />
          <span className="text-muted-foreground">Strong Positive (&gt;0.7)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning rounded" />
          <span className="text-muted-foreground">Moderate (0.3-0.7)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error rounded" />
          <span className="text-muted-foreground">Negative (&lt;-0.3)</span>
        </div>
      </div>
    </div>
  );

  const renderVolatilityChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={volatilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#94A3B8"
            fontSize={12}
          />
          <YAxis 
            stroke="#94A3B8"
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="portfolio" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Portfolio Volatility"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="benchmark" 
            stroke="#6366F1" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Benchmark Volatility"
            dot={{ fill: '#6366F1', strokeWidth: 2, r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderTradeDistribution = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={tradeDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="range" 
            stroke="#94A3B8"
            fontSize={12}
          />
          <YAxis 
            stroke="#94A3B8"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            fill="#10B981" 
            name="Number of Trades"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'correlation':
        return renderCorrelationMatrix();
      case 'volatility':
        return renderVolatilityChart();
      case 'distribution':
        return renderTradeDistribution();
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Advanced Analytics</h3>
        <div className="flex items-center space-x-1 bg-muted/20 rounded-lg p-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {renderContent()}
      <div className="mt-6 p-4 bg-muted/10 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {activeTab === 'correlation' && 'Asset Correlation Analysis'}
            {activeTab === 'volatility' && 'Volatility Trend Analysis'}
            {activeTab === 'distribution' && 'Trade Performance Distribution'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {activeTab === 'correlation' && 'Monitor asset correlations to optimize diversification and reduce portfolio risk through strategic allocation adjustments.'}
          {activeTab === 'volatility' && 'Track rolling volatility patterns to identify market stress periods and adjust position sizing accordingly.'}
          {activeTab === 'distribution' && 'Analyze trade outcome distribution to identify performance patterns and optimize trading strategies.'}
        </p>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;