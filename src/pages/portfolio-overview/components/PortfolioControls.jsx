import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioControls = ({ 
  selectedPortfolio, 
  onPortfolioChange, 
  currency, 
  onCurrencyChange, 
  autoRefresh, 
  onAutoRefreshToggle,
  lastUpdate 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const portfolios = [
    { id: 'main', name: 'Main Portfolio', value: '$125,847.32' },
    { id: 'crypto', name: 'Crypto Only', value: '$89,234.12' },
    { id: 'stocks', name: 'Stock Portfolio', value: '$36,613.20' },
    { id: 'retirement', name: 'Retirement Fund', value: '$245,891.45' }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
    { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' }
  ];

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const formatLastUpdate = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    return timestamp?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Side - Portfolio Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Briefcase" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Portfolio Overview
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time portfolio monitoring and analytics
              </p>
            </div>
          </div>
          
          {/* Portfolio Dropdown */}
          <div className="relative">
            <select
              value={selectedPortfolio}
              onChange={(e) => onPortfolioChange(e?.target?.value)}
              className="appearance-none bg-muted/20 border border-border rounded-lg px-4 py-2 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200 min-w-48"
            >
              {portfolios?.map(portfolio => (
                <option key={portfolio?.id} value={portfolio?.id}>
                  {portfolio?.name} • {portfolio?.value}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>
        </div>

        {/* Right Side - Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Currency Selector */}
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} className="text-muted-foreground" />
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e?.target?.value)}
              className="appearance-none bg-muted/20 border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200"
            >
              {currencies?.map(curr => (
                <option key={curr?.code} value={curr?.code}>
                  {curr?.code} ({curr?.symbol})
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={14} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>

          {/* Auto Refresh Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onAutoRefreshToggle}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                autoRefresh 
                  ? 'bg-success/10 text-success hover:bg-success/20' :'bg-muted/20 text-muted-foreground hover:bg-muted/30 hover:text-foreground'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                autoRefresh ? 'bg-success animate-pulse' : 'bg-muted-foreground'
              }`} />
              <span>Auto Refresh</span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-muted/20 text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors duration-200 disabled:opacity-50"
              title="Manual Refresh"
            >
              <Icon 
                name="RefreshCw" 
                size={16} 
                className={isRefreshing ? 'animate-spin' : ''} 
              />
            </button>
          </div>

          {/* Last Update Indicator */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Updated {formatLastUpdate(lastUpdate)}</span>
          </div>
        </div>
      </div>
      {/* Live Data Status Bar */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Live Market Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-xs text-muted-foreground">WebSocket Connected</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Next update in {autoRefresh ? '30s' : 'Manual'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioControls;