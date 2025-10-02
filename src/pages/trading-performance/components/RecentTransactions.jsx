import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentTransactions = ({ transactions }) => {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'buy': return 'ArrowUpCircle';
      case 'sell': return 'ArrowDownCircle';
      case 'dividend': return 'DollarSign';
      default: return 'Activity';
    }
  };

  const getTransactionColor = (type, pnl) => {
    if (type === 'buy') return 'text-primary';
    if (type === 'sell') return pnl >= 0 ? 'text-success' : 'text-error';
    if (type === 'dividend') return 'text-accent';
    return 'text-muted-foreground';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {transactions?.slice(0, 8)?.map((transaction, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/5 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getTransactionColor(transaction?.type, transaction?.pnl)} bg-current/10`}>
                <Icon 
                  name={getTransactionIcon(transaction?.type)} 
                  size={16} 
                  className={getTransactionColor(transaction?.type, transaction?.pnl)}
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-foreground">
                    {transaction?.symbol}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction?.type === 'buy' ? 'bg-primary/10 text-primary' :
                    transaction?.type === 'sell'? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                  }`}>
                    {transaction?.type?.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {transaction?.quantity} shares @ {formatCurrency(transaction?.price)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${
                transaction?.pnl >= 0 ? 'text-success' : 'text-error'
              }`}>
                {transaction?.pnl >= 0 ? '+' : ''}{formatCurrency(transaction?.pnl)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(transaction?.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total P&L (30d)</span>
          <span className={`font-medium ${
            transactions?.reduce((sum, t) => sum + t?.pnl, 0) >= 0 ? 'text-success' : 'text-error'
          }`}>
            {transactions?.reduce((sum, t) => sum + t?.pnl, 0) >= 0 ? '+' : ''}
            {formatCurrency(transactions?.reduce((sum, t) => sum + t?.pnl, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;