import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const RiskMetricsGauges = () => {
  const riskMetrics = [
    {
      id: 'beta',
      title: 'Portfolio Beta',
      value: 1.23,
      maxValue: 2.0,
      status: 'moderate',
      description: 'Market sensitivity',
      change: '+0.05',
      icon: 'TrendingUp'
    },
    {
      id: 'var',
      title: 'Value at Risk (VaR)',
      value: 4.7,
      maxValue: 10.0,
      status: 'low',
      description: '95% confidence, 1-day',
      change: '-0.3',
      icon: 'Shield'
    },
    {
      id: 'concentration',
      title: 'Concentration Risk',
      value: 28.5,
      maxValue: 50.0,
      status: 'moderate',
      description: 'Single asset exposure',
      change: '+2.1',
      icon: 'PieChart'
    },
    {
      id: 'volatility',
      title: 'Volatility Index',
      value: 15.8,
      maxValue: 30.0,
      status: 'low',
      description: '30-day rolling',
      change: '-1.2',
      icon: 'Activity'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'low': return 'text-success';
      case 'moderate': return 'text-warning';
      case 'high': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getGaugeData = (value, maxValue) => {
    const percentage = (value / maxValue) * 100;
    return [
      { name: 'value', value: percentage },
      { name: 'remaining', value: 100 - percentage }
    ];
  };

  const getGaugeColor = (status) => {
    switch (status) {
      case 'low': return '#22C55E';
      case 'moderate': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {riskMetrics?.map((metric) => (
        <div key={metric?.id} className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon name={metric?.icon} size={20} className="text-primary" />
              <h3 className="text-sm font-medium text-foreground">{metric?.title}</h3>
            </div>
            <div className={`text-xs font-medium ${
              metric?.change?.startsWith('+') ? 'text-error' : 'text-success'
            }`}>
              {metric?.change}
            </div>
          </div>

          <div className="relative w-32 h-32 mx-auto mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getGaugeData(metric?.value, metric?.maxValue)}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={40}
                  outerRadius={60}
                  dataKey="value"
                >
                  <Cell fill={getGaugeColor(metric?.status)} />
                  <Cell fill="rgba(255, 255, 255, 0.1)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">
                {metric?.value}
                {metric?.id === 'concentration' || metric?.id === 'var' || metric?.id === 'volatility' ? '%' : ''}
              </span>
              <span className={`text-xs font-medium ${getStatusColor(metric?.status)}`}>
                {metric?.status?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">{metric?.description}</p>
            <div className="mt-2 bg-muted/20 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(metric?.value / metric?.maxValue) * 100}%`,
                  backgroundColor: getGaugeColor(metric?.status)
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiskMetricsGauges;