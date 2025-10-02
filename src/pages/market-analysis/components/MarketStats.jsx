import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MarketStats = ({ symbol, selectedMarket }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Generate mock market statistics
    const generateStats = () => {
      const basePrice = symbol?.price || 43250;
      const change24h = symbol?.change || 2.34;
      
      const mockStats = {
        currentPrice: basePrice,
        change24h: change24h,
        changePercent24h: change24h,
        high24h: basePrice * (1 + Math.random() * 0.05),
        low24h: basePrice * (1 - Math.random() * 0.05),
        volume24h: Math.floor(Math.random() * 1000000000) + 100000000,
        volumeUsd24h: Math.floor(Math.random() * 50000000000) + 1000000000,
        marketCap: selectedMarket === 'crypto' 
          ? Math.floor(Math.random() * 1000000000000) + 100000000000
          : Math.floor(Math.random() * 3000000000000) + 500000000000,
        circulatingSupply: selectedMarket === 'crypto' 
          ? Math.floor(Math.random() * 21000000) + 19000000
          : Math.floor(Math.random() * 10000000000) + 1000000000,
        totalSupply: selectedMarket === 'crypto' 
          ? 21000000
          : null,
        dominance: selectedMarket === 'crypto' 
          ? Math.random() * 50 + 40
          : null,
        rank: Math.floor(Math.random() * 100) + 1,
        ath: basePrice * (1 + Math.random() * 2),
        athDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        atl: basePrice * (1 - Math.random() * 0.8),
        atlDate: new Date(Date.now() - Math.random() * 1000 * 24 * 60 * 60 * 1000)
      };
      
      setStats(mockStats);
      setIsLoading(false);
    };

    generateStats();
    
    // Update stats every 10 seconds
    const interval = setInterval(generateStats, 10000);
    
    return () => clearInterval(interval);
  }, [symbol, selectedMarket]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(price);
  };

  const formatLargeNumber = (num) => {
    if (num >= 1e12) {
      return `$${(num / 1e12)?.toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9)?.toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6)?.toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3)?.toFixed(2)}K`;
    }
    return `$${num?.toFixed(2)}`;
  };

  const formatSupply = (num) => {
    if (num >= 1e9) {
      return `${(num / 1e9)?.toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6)?.toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `${(num / 1e3)?.toFixed(2)}K`;
    }
    return num?.toLocaleString();
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading || !stats) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Market Statistics</h3>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="space-y-4">
        {/* Price Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold text-foreground font-mono">
                {formatPrice(stats?.currentPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">24h Change</p>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={stats?.change24h >= 0 ? "TrendingUp" : "TrendingDown"} 
                  size={16} 
                  className={stats?.change24h >= 0 ? "text-success" : "text-error"} 
                />
                <span className={`text-lg font-bold font-mono ${
                  stats?.change24h >= 0 ? "text-success" : "text-error"
                }`}>
                  {stats?.change24h >= 0 ? '+' : ''}{stats?.changePercent24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* High/Low */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">24h High</p>
              <p className="text-lg font-bold text-success font-mono">
                {formatPrice(stats?.high24h)}
              </p>
            </div>
            <div className="p-3 bg-muted/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">24h Low</p>
              <p className="text-lg font-bold text-error font-mono">
                {formatPrice(stats?.low24h)}
              </p>
            </div>
          </div>
        </div>

        {/* Volume & Market Cap */}
        <div className="space-y-3">
          <div className="p-3 bg-muted/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">24h Volume</span>
              <Icon name="BarChart3" size={16} className="text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground font-mono">
              {formatLargeNumber(stats?.volumeUsd24h)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatSupply(stats?.volume24h)} {symbol?.symbol?.replace('USDT', '') || 'BTC'}
            </p>
          </div>

          <div className="p-3 bg-muted/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Market Cap</span>
              <Icon name="PieChart" size={16} className="text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground font-mono">
              {formatLargeNumber(stats?.marketCap)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Rank #{stats?.rank}
            </p>
          </div>
        </div>

        {/* Supply Information */}
        {selectedMarket === 'crypto' && (
          <div className="space-y-3">
            <div className="p-3 bg-muted/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Circulating Supply</span>
                <Icon name="Coins" size={16} className="text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground font-mono">
                {formatSupply(stats?.circulatingSupply)}
              </p>
              {stats?.totalSupply && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{((stats?.circulatingSupply / stats?.totalSupply) * 100)?.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stats?.circulatingSupply / stats?.totalSupply) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {stats?.dominance && (
              <div className="p-3 bg-muted/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Market Dominance</span>
                  <Icon name="Target" size={16} className="text-muted-foreground" />
                </div>
                <p className="text-lg font-bold text-foreground font-mono">
                  {stats?.dominance?.toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        )}

        {/* All-Time High/Low */}
        <div className="space-y-3">
          <div className="p-3 bg-muted/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">All-Time High</span>
              <Icon name="TrendingUp" size={16} className="text-success" />
            </div>
            <p className="text-lg font-bold text-success font-mono">
              {formatPrice(stats?.ath)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(stats?.athDate)}
            </p>
          </div>

          <div className="p-3 bg-muted/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">All-Time Low</span>
              <Icon name="TrendingDown" size={16} className="text-error" />
            </div>
            <p className="text-lg font-bold text-error font-mono">
              {formatPrice(stats?.atl)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(stats?.atlDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketStats;