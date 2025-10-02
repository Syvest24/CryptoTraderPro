import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const StrategyBreakdown = ({ strategies }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            Return: <span className={`font-medium ${data?.return >= 0 ? 'text-success' : 'text-error'}`}>
              {data?.return >= 0 ? '+' : ''}{data?.return?.toFixed(2)}%
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Allocation: <span className="font-medium text-foreground">{data?.value?.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getStrategyIcon = (strategy) => {
    switch (strategy?.toLowerCase()) {
      case 'momentum': return 'TrendingUp';
      case 'value': return 'DollarSign';
      case 'growth': return 'BarChart3';
      case 'dividend': return 'Coins';
      case 'swing': return 'Activity';
      default: return 'Target';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Strategy Performance</h3>
        <Icon name="PieChart" size={20} className="text-muted-foreground" />
      </div>
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={strategies}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {strategies?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {strategies?.map((strategy, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/5">
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${COLORS?.[index % COLORS?.length]}20` }}
              >
                <Icon 
                  name={getStrategyIcon(strategy?.name)} 
                  size={14} 
                  style={{ color: COLORS?.[index % COLORS?.length] }}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{strategy?.name}</p>
                <p className="text-xs text-muted-foreground">{strategy?.trades} trades</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${
                strategy?.return >= 0 ? 'text-success' : 'text-error'
              }`}>
                {strategy?.return >= 0 ? '+' : ''}{strategy?.return?.toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground">{strategy?.value?.toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Best Strategy</p>
            <p className="font-medium text-success">
              {strategies?.reduce((best, current) => 
                current?.return > best?.return ? current : best
              )?.name}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Strategies</p>
            <p className="font-medium text-foreground">{strategies?.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyBreakdown;