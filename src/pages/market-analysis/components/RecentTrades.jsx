import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const RecentTrades = ({ symbol }) => {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Generate initial trades
    const generateTrades = () => {
      const newTrades = [];
      const basePrice = symbol?.price || 43250;
      
      for (let i = 0; i < 20; i++) {
        const price = basePrice + (Math.random() - 0.5) * basePrice * 0.001;
        const size = Math.random() * 2 + 0.01;
        const isBuy = Math.random() > 0.5;
        const timestamp = new Date(Date.now() - i * 1000 * Math.random() * 60);
        
        newTrades?.push({
          id: `trade-${Date.now()}-${i}`,
          price: parseFloat(price?.toFixed(2)),
          size: parseFloat(size?.toFixed(4)),
          total: parseFloat((price * size)?.toFixed(2)),
          side: isBuy ? 'buy' : 'sell',
          timestamp: timestamp,
          time: timestamp?.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        });
      }
      
      setTrades(newTrades);
      setIsLoading(false);
    };

    generateTrades();
    
    // Simulate real-time trade updates
    const interval = setInterval(() => {
      const basePrice = symbol?.price || 43250;
      const price = basePrice + (Math.random() - 0.5) * basePrice * 0.001;
      const size = Math.random() * 2 + 0.01;
      const isBuy = Math.random() > 0.5;
      const timestamp = new Date();
      
      const newTrade = {
        id: `trade-${Date.now()}`,
        price: parseFloat(price?.toFixed(2)),
        size: parseFloat(size?.toFixed(4)),
        total: parseFloat((price * size)?.toFixed(2)),
        side: isBuy ? 'buy' : 'sell',
        timestamp: timestamp,
        time: timestamp?.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        isNew: true
      };
      
      setTrades(prevTrades => {
        const updatedTrades = [newTrade, ...prevTrades?.slice(0, 19)];
        // Remove the isNew flag after animation
        setTimeout(() => {
          setTrades(current => 
            current?.map(trade => 
              trade?.id === newTrade?.id ? { ...trade, isNew: false } : trade
            )
          );
        }, 1000);
        
        return updatedTrades;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [symbol]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(price);
  };

  const formatSize = (size) => {
    return size?.toFixed(4);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading trades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Trades</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={16} className="text-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      {/* Column Headers */}
      <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground mb-3 px-1">
        <div className="text-left">Time</div>
        <div className="text-right">Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
      </div>
      {/* Trades List */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {trades?.map((trade) => (
          <div
            key={trade?.id}
            className={`grid grid-cols-4 gap-2 text-xs py-2 px-1 rounded transition-all duration-1000 ${
              trade?.isNew 
                ? 'bg-primary/20 animate-fade-in' :'hover:bg-muted/30'
            } ${
              trade?.side === 'buy' ?'border-l-2 border-success/50' :'border-l-2 border-error/50'
            }`}
          >
            <div className="font-mono text-muted-foreground">
              {trade?.time}
            </div>
            <div className={`font-mono text-right font-medium ${
              trade?.side === 'buy' ? 'text-success' : 'text-error'
            }`}>
              {formatPrice(trade?.price)}
            </div>
            <div className="font-mono text-right text-foreground">
              {formatSize(trade?.size)}
            </div>
            <div className="font-mono text-right text-foreground">
              {formatPrice(trade?.total)}
            </div>
          </div>
        ))}
      </div>
      {/* Trade Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Buy Volume:</span>
              <span className="font-mono text-success">
                {trades?.filter(t => t?.side === 'buy')?.reduce((sum, t) => sum + t?.size, 0)?.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sell Volume:</span>
              <span className="font-mono text-error">
                {trades?.filter(t => t?.side === 'sell')?.reduce((sum, t) => sum + t?.size, 0)?.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg Buy:</span>
              <span className="font-mono text-foreground">
                {formatPrice(
                  trades?.filter(t => t?.side === 'buy')?.reduce((sum, t, _, arr) => sum + t?.price / arr?.length, 0)
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg Sell:</span>
              <span className="font-mono text-foreground">
                {formatPrice(
                  trades?.filter(t => t?.side === 'sell')?.reduce((sum, t, _, arr) => sum + t?.price / arr?.length, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTrades;