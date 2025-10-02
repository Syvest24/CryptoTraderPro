import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const MarketSelector = ({ selectedMarket, onMarketChange, selectedSymbol, onSymbolChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const markets = [
    { id: 'crypto', label: 'Cryptocurrency', icon: 'Bitcoin' },
    { id: 'stocks', label: 'Stocks', icon: 'TrendingUp' }
  ];

  const cryptoSymbols = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: 43250.50, change: 2.34 },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: 2680.75, change: -1.23 },
    { symbol: 'ADAUSDT', name: 'Cardano', price: 0.4521, change: 5.67 },
    { symbol: 'SOLUSDT', name: 'Solana', price: 98.32, change: 3.45 },
    { symbol: 'DOTUSDT', name: 'Polkadot', price: 7.89, change: -0.89 }
  ];

  const stockSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 1.23 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2834.56, change: -0.45 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.92, change: 2.11 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.73, change: -3.21 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 456.78, change: 4.56 }
  ];

  const currentSymbols = selectedMarket === 'crypto' ? cryptoSymbols : stockSymbols;
  const filteredSymbols = currentSymbols?.filter(s => 
    s?.symbol?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    s?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleSymbolSelect = (symbol) => {
    onSymbolChange(symbol);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: selectedMarket === 'crypto' && price < 1 ? 4 : 2
    })?.format(price);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Market Type Selector */}
      <div className="flex bg-card rounded-lg p-1">
        {markets?.map((market) => (
          <button
            key={market?.id}
            onClick={() => onMarketChange(market?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedMarket === market?.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name={market?.icon} size={16} />
            <span>{market?.label}</span>
          </button>
        ))}
      </div>
      {/* Symbol Search */}
      <div className="relative">
        <div className="flex items-center space-x-2 bg-card rounded-lg px-4 py-2 min-w-64">
          <Icon name="Search" size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            onFocus={() => setShowDropdown(true)}
            className="bg-transparent text-foreground placeholder-muted-foreground outline-none flex-1"
          />
          {selectedSymbol && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium text-foreground">{selectedSymbol?.symbol}</span>
              <span className={`font-mono ${
                selectedSymbol?.change >= 0 ? 'text-success' : 'text-error'
              }`}>
                {selectedSymbol?.change >= 0 ? '+' : ''}{selectedSymbol?.change?.toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-dropdown z-50 max-h-80 overflow-y-auto">
            {filteredSymbols?.length > 0 ? (
              filteredSymbols?.map((symbol) => (
                <button
                  key={symbol?.symbol}
                  onClick={() => handleSymbolSelect(symbol)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors duration-200 text-left"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{symbol?.symbol}</span>
                    <span className="text-sm text-muted-foreground">{symbol?.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-foreground">{formatPrice(symbol?.price)}</span>
                    <span className={`text-sm font-mono ${
                      symbol?.change >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      {symbol?.change >= 0 ? '+' : ''}{symbol?.change?.toFixed(2)}%
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-muted-foreground">
                No symbols found
              </div>
            )}
          </div>
        )}

        {/* Overlay to close dropdown */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MarketSelector;