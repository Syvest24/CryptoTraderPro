import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetrics = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Total Return',
      value: `${metrics?.totalReturn >= 0 ? '+' : ''}${metrics?.totalReturn?.toFixed(2)}%`,
      icon: 'TrendingUp',
      color: metrics?.totalReturn >= 0 ? 'text-success' : 'text-error',
      bgColor: metrics?.totalReturn >= 0 ? 'bg-success/10' : 'bg-error/10',
      change: '+2.3% vs last month'
    },
    {
      title: 'Sharpe Ratio',
      value: metrics?.sharpeRatio?.toFixed(2),
      icon: 'Target',
      color: metrics?.sharpeRatio >= 1 ? 'text-success' : metrics?.sharpeRatio >= 0.5 ? 'text-warning' : 'text-error',
      bgColor: metrics?.sharpeRatio >= 1 ? 'bg-success/10' : 'bg-warning/10',
      change: 'Above benchmark'
    },
    {
      title: 'Max Drawdown',
      value: `${metrics?.maxDrawdown?.toFixed(2)}%`,
      icon: 'TrendingDown',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: 'Risk controlled'
    },
    {
      title: 'Win Rate',
      value: `${metrics?.winRate?.toFixed(1)}%`,
      icon: 'Target',
      color: metrics?.winRate >= 60 ? 'text-success' : metrics?.winRate >= 50 ? 'text-warning' : 'text-error',
      bgColor: metrics?.winRate >= 60 ? 'bg-success/10' : 'bg-warning/10',
      change: `${metrics?.totalTrades} total trades`
    },
    {
      title: 'Avg Trade Duration',
      value: `${metrics?.avgTradeDuration} days`,
      icon: 'Clock',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: 'Medium-term focus'
    },
    {
      title: 'Total Fees',
      value: `$${metrics?.totalFees?.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/10',
      change: `${(metrics?.totalFees / metrics?.totalVolume * 100)?.toFixed(3)}% of volume`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 mb-6">
      {metricCards?.map((metric, index) => (
        <div key={index} className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${metric?.bgColor}`}>
              <Icon name={metric?.icon} size={16} className={metric?.color} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{metric?.title}</p>
            <p className={`text-xl font-semibold ${metric?.color}`}>
              {metric?.value}
            </p>
            <p className="text-xs text-muted-foreground">{metric?.change}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceMetrics;