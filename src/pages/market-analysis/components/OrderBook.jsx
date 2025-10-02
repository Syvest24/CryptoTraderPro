import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const OrderBook = ({ symbol }) => {
  const [orderBookData, setOrderBookData] = useState({ bids: [], asks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [spread, setSpread] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate real-time order book updates
    const generateOrderBook = () => {
      const basePrice = symbol?.price || 43250;
      const bids = [];
      const asks = [];
      
      // Generate bid orders (buy orders - below current price)
      for (let i = 0; i < 15; i++) {
        const price = basePrice - (i + 1) * (Math.random() * 10 + 1);
        const size = Math.random() * 5 + 0.1;
        const total = price * size;
        
        bids?.push({
          price: parseFloat(price?.toFixed(2)),
          size: parseFloat(size?.toFixed(4)),
          total: parseFloat(total?.toFixed(2))
        });
      }
      
      // Generate ask orders (sell orders - above current price)
      for (let i = 0; i < 15; i++) {
        const price = basePrice + (i + 1) * (Math.random() * 10 + 1);
        const size = Math.random() * 5 + 0.1;
        const total = price * size;
        
        asks?.push({
          price: parseFloat(price?.toFixed(2)),
          size: parseFloat(size?.toFixed(4)),
          total: parseFloat(total?.toFixed(2))
        });
      }
      
      // Calculate spread
      const bestBid = Math.max(...bids?.map(b => b?.price));
      const bestAsk = Math.min(...asks?.map(a => a?.price));
      const currentSpread = bestAsk - bestBid;
      
      setOrderBookData({ bids, asks });
      setSpread(currentSpread);
      setIsLoading(false);
    };

    generateOrderBook();
    
    // Update order book every 2 seconds
    const interval = setInterval(generateOrderBook, 2000);
    
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

  const getDepthPercentage = (orders, currentIndex) => {
    const maxTotal = Math.max(...orders?.map(o => o?.total));
    return (orders?.[currentIndex]?.total / maxTotal) * 100;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading order book...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Order Book</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={16} className="text-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      {/* Spread Info */}
      <div className="mb-4 p-3 bg-muted/20 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Spread:</span>
          <span className="font-mono text-foreground">{formatPrice(spread)}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">Spread %:</span>
          <span className="font-mono text-foreground">
            {((spread / (symbol?.price || 43250)) * 100)?.toFixed(3)}%
          </span>
        </div>
      </div>
      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground mb-2 px-1">
        <div className="text-left">Price</div>
        <div className="text-center">Size</div>
        <div className="text-right">Total</div>
      </div>
      <div className="space-y-4">
        {/* Ask Orders (Sell Orders) */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-error mb-2 flex items-center space-x-1">
            <Icon name="ArrowUp" size={12} />
            <span>Asks (Sell Orders)</span>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {orderBookData?.asks?.slice(0, 10)?.reverse()?.map((ask, index) => (
              <div
                key={`ask-${index}`}
                className="relative grid grid-cols-3 gap-2 text-xs py-1 px-1 hover:bg-error/10 transition-colors duration-200 rounded"
              >
                {/* Depth visualization */}
                <div
                  className="absolute inset-0 bg-error/10 rounded"
                  style={{ width: `${getDepthPercentage(orderBookData?.asks, orderBookData?.asks?.length - 1 - index)}%` }}
                />
                
                <div className="relative font-mono text-error font-medium">
                  {formatPrice(ask?.price)}
                </div>
                <div className="relative font-mono text-center text-foreground">
                  {formatSize(ask?.size)}
                </div>
                <div className="relative font-mono text-right text-foreground">
                  {formatPrice(ask?.total)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Price */}
        <div className="py-2 px-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Current Price</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-mono font-bold text-primary">
                {formatPrice(symbol?.price || 43250)}
              </span>
              <Icon 
                name={symbol?.change >= 0 ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className={symbol?.change >= 0 ? "text-success" : "text-error"} 
              />
            </div>
          </div>
        </div>

        {/* Bid Orders (Buy Orders) */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-success mb-2 flex items-center space-x-1">
            <Icon name="ArrowDown" size={12} />
            <span>Bids (Buy Orders)</span>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {orderBookData?.bids?.slice(0, 10)?.map((bid, index) => (
              <div
                key={`bid-${index}`}
                className="relative grid grid-cols-3 gap-2 text-xs py-1 px-1 hover:bg-success/10 transition-colors duration-200 rounded"
              >
                {/* Depth visualization */}
                <div
                  className="absolute inset-0 bg-success/10 rounded"
                  style={{ width: `${getDepthPercentage(orderBookData?.bids, index)}%` }}
                />
                
                <div className="relative font-mono text-success font-medium">
                  {formatPrice(bid?.price)}
                </div>
                <div className="relative font-mono text-center text-foreground">
                  {formatSize(bid?.size)}
                </div>
                <div className="relative font-mono text-right text-foreground">
                  {formatPrice(bid?.total)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;