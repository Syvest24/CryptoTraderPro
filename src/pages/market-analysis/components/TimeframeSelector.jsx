import React from 'react';

const TimeframeSelector = ({ selectedTimeframe, onTimeframeChange }) => {
  const timeframes = [
    { id: '1m', label: '1m', name: '1 Minute' },
    { id: '5m', label: '5m', name: '5 Minutes' },
    { id: '15m', label: '15m', name: '15 Minutes' },
    { id: '1h', label: '1h', name: '1 Hour' },
    { id: '4h', label: '4h', name: '4 Hours' },
    { id: '1D', label: '1D', name: '1 Day' }
  ];

  return (
    <div className="flex bg-card rounded-lg p-1">
      {timeframes?.map((timeframe) => (
        <button
          key={timeframe?.id}
          onClick={() => onTimeframeChange(timeframe?.id)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            selectedTimeframe === timeframe?.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
          title={timeframe?.name}
        >
          {timeframe?.label}
        </button>
      ))}
    </div>
  );
};

export default TimeframeSelector;