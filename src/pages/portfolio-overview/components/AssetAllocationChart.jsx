import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const AssetAllocationChart = ({ allocationData, onRebalanceClick }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);

  const COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316'  // Orange
  ];

  const formatTooltipValue = (value, name) => {
    const percentage = ((value / allocationData?.reduce((sum, item) => sum + item?.value, 0)) * 100)?.toFixed(1);
    return [`$${value?.toLocaleString()} (${percentage}%)`, name];
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const handleRebalanceClick = () => {
    setShowRebalanceModal(true);
    onRebalanceClick();
  };

  const totalValue = allocationData?.reduce((sum, item) => sum + item?.value, 0);

  const rebalanceRecommendations = [
    { asset: 'Bitcoin', current: 45, target: 40, action: 'Reduce by 5%' },
    { asset: 'Ethereum', current: 25, target: 30, action: 'Increase by 5%' },
    { asset: 'Stocks', current: 20, target: 20, action: 'Maintain' },
    { asset: 'Cash', current: 10, target: 10, action: 'Maintain' }
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Asset Allocation
          </h2>
          <p className="text-sm text-muted-foreground">
            Current portfolio distribution
          </p>
        </div>
        
        <button
          onClick={handleRebalanceClick}
          className="flex items-center space-x-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200"
        >
          <Icon name="RefreshCw" size={16} />
          <span className="text-sm font-medium">Rebalance</span>
        </button>
      </div>
      {/* Pie Chart */}
      <div className="h-64 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {allocationData?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS?.[index % COLORS?.length]}
                  stroke={activeIndex === index ? '#FFFFFF' : 'none'}
                  strokeWidth={activeIndex === index ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#F8FAFC'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Asset List */}
      <div className="space-y-3">
        {allocationData?.map((asset, index) => {
          const percentage = ((asset?.value / totalValue) * 100)?.toFixed(1);
          return (
            <div
              key={asset?.name}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                ></div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {asset?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${asset?.value?.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {percentage}%
                </div>
                <div className={`text-xs flex items-center ${
                  asset?.change >= 0 ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={asset?.change >= 0 ? 'ArrowUp' : 'ArrowDown'} 
                    size={12} 
                    className="mr-1"
                  />
                  {Math.abs(asset?.change)?.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Rebalance Recommendations */}
      {showRebalanceModal && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Rebalance Recommendations
            </h3>
            <button
              onClick={() => setShowRebalanceModal(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
          
          <div className="space-y-2">
            {rebalanceRecommendations?.map((rec, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{rec?.asset}</span>
                <span className="text-foreground">{rec?.current}% → {rec?.target}%</span>
                <span className={`font-medium ${
                  rec?.action?.includes('Reduce') ? 'text-error' :
                  rec?.action?.includes('Increase') ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {rec?.action}
                </span>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-3 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200">
            Apply Rebalancing
          </button>
        </div>
      )}
    </div>
  );
};

export default AssetAllocationChart;