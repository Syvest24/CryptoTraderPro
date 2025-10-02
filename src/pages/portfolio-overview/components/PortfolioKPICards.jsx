import React from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioKPICards = ({ portfolioData }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value?.toFixed(2)}%`;
  };

  const kpiCards = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(portfolioData?.totalValue),
      change: portfolioData?.dailyChange,
      changeType: portfolioData?.dailyChange >= 0 ? 'positive' : 'negative',
      icon: 'Wallet',
      subtitle: '24h Change'
    },
    {
      title: 'Unrealized P&L',
      value: formatCurrency(portfolioData?.unrealizedPnL),
      change: portfolioData?.unrealizedPnLPercent,
      changeType: portfolioData?.unrealizedPnL >= 0 ? 'positive' : 'negative',
      icon: 'TrendingUp',
      subtitle: 'Since Purchase'
    },
    {
      title: 'Total Return',
      value: formatPercentage(portfolioData?.totalReturn),
      change: portfolioData?.totalReturnValue,
      changeType: portfolioData?.totalReturn >= 0 ? 'positive' : 'negative',
      icon: 'Target',
      subtitle: 'Since Inception'
    },
    {
      title: 'Cash Balance',
      value: formatCurrency(portfolioData?.cashBalance),
      change: portfolioData?.cashChangePercent,
      changeType: 'neutral',
      icon: 'DollarSign',
      subtitle: 'Available'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards?.map((card, index) => (
        <div
          key={index}
          className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 transition-all duration-200 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              card?.changeType === 'positive' ? 'bg-success/10' :
              card?.changeType === 'negative' ? 'bg-error/10' : 'bg-primary/10'
            }`}>
              <Icon 
                name={card?.icon} 
                size={24} 
                className={
                  card?.changeType === 'positive' ? 'text-success' :
                  card?.changeType === 'negative' ? 'text-error' : 'text-primary'
                }
              />
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {card?.subtitle}
              </div>
              {card?.changeType !== 'neutral' && (
                <div className={`text-sm font-medium flex items-center ${
                  card?.changeType === 'positive' ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={card?.changeType === 'positive' ? 'ArrowUp' : 'ArrowDown'} 
                    size={14} 
                    className="mr-1"
                  />
                  {typeof card?.change === 'number' ? formatPercentage(card?.change) : formatCurrency(card?.change)}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {card?.title}
            </h3>
            <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
              {card?.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioKPICards;