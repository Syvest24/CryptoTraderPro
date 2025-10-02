import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const RiskBreakdownCharts = () => {
  const [activeChart, setActiveChart] = useState('sector');

  // Sector exposure data
  const sectorData = [
    { name: 'Technology', value: 35.2, color: '#3B82F6' },
    { name: 'Cryptocurrency', value: 28.5, color: '#F59E0B' },
    { name: 'Healthcare', value: 12.8, color: '#10B981' },
    { name: 'Finance', value: 10.5, color: '#8B5CF6' },
    { name: 'Energy', value: 8.3, color: '#EF4444' },
    { name: 'Consumer', value: 4.7, color: '#6B7280' }
  ];

  // Geographic allocation data
  const geoData = [
    { region: 'North America', percentage: 45.2, risk: 'Low' },
    { region: 'Europe', percentage: 22.8, risk: 'Medium' },
    { region: 'Asia Pacific', percentage: 18.5, risk: 'Medium' },
    { region: 'Emerging Markets', percentage: 8.9, risk: 'High' },
    { region: 'Other', percentage: 4.6, risk: 'Low' }
  ];

  // Drawdown timeline data
  const drawdownData = [
    { date: '2024-01', drawdown: 0, recovery: 0 },
    { date: '2024-02', drawdown: -2.3, recovery: 0 },
    { date: '2024-03', drawdown: -5.8, recovery: 0 },
    { date: '2024-04', drawdown: -8.2, recovery: 0 },
    { date: '2024-05', drawdown: -12.5, recovery: 0 },
    { date: '2024-06', drawdown: -8.9, recovery: 3.6 },
    { date: '2024-07', drawdown: -4.2, recovery: 8.3 },
    { date: '2024-08', drawdown: -1.8, recovery: 10.7 },
    { date: '2024-09', drawdown: 0, recovery: 12.5 },
    { date: '2024-10', drawdown: 0, recovery: 0 }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'High': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
              {entry?.name?.includes('drawdown') || entry?.name?.includes('recovery') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sector Exposure Chart */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="PieChart" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Sector Exposure</h3>
          </div>
          <div className="text-xs text-muted-foreground">
            Risk Distribution
          </div>
        </div>

        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {sectorData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {sectorData?.map((sector, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: sector?.color }}
                />
                <span className="text-foreground">{sector?.name}</span>
              </div>
              <span className="font-medium text-foreground">{sector?.value}%</span>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Concentration Risk</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Tech + Crypto sectors represent 63.7% of portfolio
          </p>
        </div>
      </div>
      {/* Geographic Allocation */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Globe" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Geographic Risk</h3>
          </div>
          <div className="text-xs text-muted-foreground">
            Regional Exposure
          </div>
        </div>

        <div className="space-y-4">
          {geoData?.map((region, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{region?.region}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">{region?.percentage}%</span>
                  <span className={`text-xs font-medium ${getRiskColor(region?.risk)}`}>
                    {region?.risk}
                  </span>
                </div>
              </div>
              <div className="w-full bg-muted/20 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    region?.risk === 'High' ? 'bg-error' :
                    region?.risk === 'Medium' ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${region?.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mock Google Map */}
        <div className="mt-6 h-32 bg-muted/20 rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Global Portfolio Distribution"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=40.7128,-74.0060&z=2&output=embed"
            className="border-0"
          />
        </div>

        <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Diversification Score</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Good geographic spread across 5 regions
          </p>
        </div>
      </div>
      {/* Drawdown Timeline */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingDown" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Drawdown Analysis</h3>
          </div>
          <div className="text-xs text-muted-foreground">
            Recovery Periods
          </div>
        </div>

        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={drawdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="drawdown" fill="#EF4444" name="Drawdown" />
              <Line 
                type="monotone" 
                dataKey="recovery" 
                stroke="#22C55E" 
                strokeWidth={2}
                name="Recovery"
                dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-error/10 rounded-lg border border-error/20">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="TrendingDown" size={16} className="text-error" />
              <span className="font-medium text-error">Max Drawdown</span>
            </div>
            <p className="text-lg font-bold text-foreground">-12.5%</p>
            <p className="text-xs text-muted-foreground">May 2024</p>
          </div>
          
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Clock" size={16} className="text-success" />
              <span className="font-medium text-success">Recovery Time</span>
            </div>
            <p className="text-lg font-bold text-foreground">4 months</p>
            <p className="text-xs text-muted-foreground">May - Sep 2024</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Risk Metrics</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Avg Recovery:</span>
              <span className="ml-1 font-medium text-foreground">3.2 months</span>
            </div>
            <div>
              <span className="text-muted-foreground">Volatility:</span>
              <span className="ml-1 font-medium text-foreground">15.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskBreakdownCharts;