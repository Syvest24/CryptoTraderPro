import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CorrelationHeatMap = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  
  const assets = ['BTC', 'ETH', 'AAPL', 'GOOGL', 'TSLA', 'SPY', 'GLD', 'BOND'];
  
  // Mock correlation matrix data
  const correlationMatrix = [
    [1.00, 0.85, 0.12, 0.08, 0.15, 0.25, -0.18, -0.35],
    [0.85, 1.00, 0.18, 0.12, 0.22, 0.32, -0.15, -0.28],
    [0.12, 0.18, 1.00, 0.78, 0.45, 0.85, 0.05, -0.12],
    [0.08, 0.12, 0.78, 1.00, 0.52, 0.82, 0.02, -0.08],
    [0.15, 0.22, 0.45, 0.52, 1.00, 0.65, -0.05, -0.15],
    [0.25, 0.32, 0.85, 0.82, 0.65, 1.00, 0.08, -0.18],
    [-0.18, -0.15, 0.05, 0.02, -0.05, 0.08, 1.00, 0.45],
    [-0.35, -0.28, -0.12, -0.08, -0.15, -0.18, 0.45, 1.00]
  ];

  const getCorrelationColor = (value) => {
    if (value === 1) return 'bg-primary';
    if (value >= 0.7) return 'bg-error';
    if (value >= 0.3) return 'bg-warning';
    if (value >= 0) return 'bg-success/50';
    if (value >= -0.3) return 'bg-blue-500/50';
    if (value >= -0.7) return 'bg-blue-600';
    return 'bg-blue-700';
  };

  const getCorrelationIntensity = (value) => {
    const intensity = Math.abs(value);
    return `opacity-${Math.round(intensity * 100)}`;
  };

  const handleCellClick = (row, col, value) => {
    setSelectedCell({
      asset1: assets?.[row],
      asset2: assets?.[col],
      correlation: value,
      row,
      col
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Grid3X3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Asset Correlation Matrix</h3>
        </div>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-error rounded"></div>
            <span>High (+0.7)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span>Medium (+0.3)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success/50 rounded"></div>
            <span>Low (0)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Negative (-0.7)</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header row */}
          <div className="flex">
            <div className="w-16 h-12 flex items-center justify-center text-xs font-medium text-muted-foreground">
              Asset
            </div>
            {assets?.map((asset) => (
              <div key={asset} className="w-16 h-12 flex items-center justify-center text-xs font-medium text-muted-foreground">
                {asset}
              </div>
            ))}
          </div>

          {/* Matrix rows */}
          {correlationMatrix?.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              <div className="w-16 h-12 flex items-center justify-center text-xs font-medium text-muted-foreground bg-muted/20">
                {assets?.[rowIndex]}
              </div>
              {row?.map((value, colIndex) => (
                <div
                  key={colIndex}
                  className={`w-16 h-12 flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 relative ${getCorrelationColor(value)} ${
                    selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? 'ring-2 ring-primary scale-110 z-10' :''
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex, value)}
                  title={`${assets?.[rowIndex]} vs ${assets?.[colIndex]}: ${value?.toFixed(2)}`}
                >
                  <span className="text-white font-medium">
                    {value?.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Selected cell details */}
      {selectedCell && (
        <div className="mt-6 p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Correlation Analysis: {selectedCell?.asset1} vs {selectedCell?.asset2}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Correlation coefficient: {selectedCell?.correlation?.toFixed(3)}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                Math.abs(selectedCell?.correlation) >= 0.7 ? 'text-error' :
                Math.abs(selectedCell?.correlation) >= 0.3 ? 'text-warning' : 'text-success'
              }`}>
                {Math.abs(selectedCell?.correlation) >= 0.7 ? 'High Correlation' :
                 Math.abs(selectedCell?.correlation) >= 0.3 ? 'Medium Correlation' : 'Low Correlation'}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedCell?.correlation > 0 ? 'Positive' : 'Negative'} relationship
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Risk insights */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-error/10 rounded-lg border border-error/20">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">High Risk Pairs</span>
          </div>
          <p className="text-xs text-muted-foreground">BTC-ETH (0.85), AAPL-SPY (0.85)</p>
        </div>
        
        <div className="p-3 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Diversification</span>
          </div>
          <p className="text-xs text-muted-foreground">GLD-BTC (-0.18), BOND-BTC (-0.35)</p>
        </div>
        
        <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="TrendingUp" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Portfolio Beta</span>
          </div>
          <p className="text-xs text-muted-foreground">Overall correlation: 0.42</p>
        </div>
      </div>
    </div>
  );
};

export default CorrelationHeatMap;