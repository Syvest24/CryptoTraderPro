import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ControlBar = ({ 
  dateRange, 
  setDateRange, 
  selectedStrategy, 
  setSelectedStrategy, 
  assetClasses, 
  setAssetClasses, 
  benchmark, 
  setBenchmark,
  onExport,
  onRefresh 
}) => {
  const dateRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'all', label: 'All Time' }
  ];

  const strategyOptions = [
    { value: 'all', label: 'All Strategies' },
    { value: 'momentum', label: 'Momentum' },
    { value: 'value', label: 'Value Investing' },
    { value: 'growth', label: 'Growth' },
    { value: 'dividend', label: 'Dividend' },
    { value: 'swing', label: 'Swing Trading' }
  ];

  const benchmarkOptions = [
    { value: 'sp500', label: 'S&P 500' },
    { value: 'nasdaq', label: 'NASDAQ' },
    { value: 'bitcoin', label: 'Bitcoin' },
    { value: 'custom', label: 'Custom Benchmark' }
  ];

  const assetClassButtons = [
    { id: 'stocks', label: 'Stocks', icon: 'TrendingUp' },
    { id: 'crypto', label: 'Crypto', icon: 'Coins' },
    { id: 'forex', label: 'Forex', icon: 'DollarSign' },
    { id: 'commodities', label: 'Commodities', icon: 'BarChart3' }
  ];

  const toggleAssetClass = (assetClass) => {
    setAssetClasses(prev => 
      prev?.includes(assetClass) 
        ? prev?.filter(ac => ac !== assetClass)
        : [...prev, assetClass]
    );
  };

  return (
    <div className="bg-card rounded-lg p-4 border border-border mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Date Range Selector */}
          <div className="min-w-[140px]">
            <Select
              options={dateRangeOptions}
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select period"
            />
          </div>

          {/* Strategy Filter */}
          <div className="min-w-[160px]">
            <Select
              options={strategyOptions}
              value={selectedStrategy}
              onChange={setSelectedStrategy}
              placeholder="Select strategy"
            />
          </div>

          {/* Benchmark Selector */}
          <div className="min-w-[140px]">
            <Select
              options={benchmarkOptions}
              value={benchmark}
              onChange={setBenchmark}
              placeholder="Select benchmark"
            />
          </div>
        </div>

        {/* Center Section - Asset Class Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {assetClassButtons?.map((asset) => (
            <button
              key={asset?.id}
              onClick={() => toggleAssetClass(asset?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                assetClasses?.includes(asset?.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              }`}
            >
              <Icon name={asset?.icon} size={16} />
              <span className="hidden sm:inline">{asset?.label}</span>
            </button>
          ))}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={onRefresh}
          >
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
      {/* Active Filters Display */}
      {(selectedStrategy !== 'all' || assetClasses?.length < 4) && (
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-border">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedStrategy !== 'all' && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {strategyOptions?.find(s => s?.value === selectedStrategy)?.label}
            </span>
          )}
          {assetClasses?.length < 4 && assetClasses?.map(ac => (
            <span key={ac} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
              {assetClassButtons?.find(a => a?.id === ac)?.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ControlBar;