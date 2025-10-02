import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TechnicalIndicators = ({ activeIndicators, onToggleIndicator }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const indicators = [
    { id: 'sma', name: 'Simple Moving Average', shortName: 'SMA', color: '#3B82F6' },
    { id: 'ema', name: 'Exponential Moving Average', shortName: 'EMA', color: '#10B981' },
    { id: 'bollinger', name: 'Bollinger Bands', shortName: 'BB', color: '#8B5CF6' },
    { id: 'rsi', name: 'Relative Strength Index', shortName: 'RSI', color: '#F59E0B' },
    { id: 'macd', name: 'MACD', shortName: 'MACD', color: '#EF4444' },
    { id: 'stochastic', name: 'Stochastic Oscillator', shortName: 'Stoch', color: '#06B6D4' },
    { id: 'volume', name: 'Volume', shortName: 'Vol', color: '#6B7280' },
    { id: 'fibonacci', name: 'Fibonacci Retracement', shortName: 'Fib', color: '#EC4899' }
  ];

  const handleToggle = (indicatorId) => {
    onToggleIndicator(indicatorId);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-card hover:bg-card/80 rounded-lg px-4 py-2 transition-colors duration-200"
      >
        <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Indicators</span>
        <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 font-medium">
          {activeIndicators?.length}
        </span>
        <Icon 
          name={showDropdown ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-muted-foreground" 
        />
      </button>
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 bg-popover border border-border rounded-lg shadow-dropdown z-50 w-80">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Technical Indicators</h3>
            <div className="space-y-2">
              {indicators?.map((indicator) => {
                const isActive = activeIndicators?.includes(indicator?.id);
                return (
                  <div
                    key={indicator?.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: indicator?.color }}
                      />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {indicator?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {indicator?.shortName}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle(indicator?.id)}
                      className={`w-10 h-6 rounded-full transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary' :'bg-muted'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        isActive ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
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
  );
};

export default TechnicalIndicators;