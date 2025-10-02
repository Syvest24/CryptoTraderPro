import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MarketSelector from './components/MarketSelector';
import TimeframeSelector from './components/TimeframeSelector';
import TechnicalIndicators from './components/TechnicalIndicators';
import CandlestickChart from './components/CandlestickChart';
import OrderBook from './components/OrderBook';
import RecentTrades from './components/RecentTrades';
import MarketStats from './components/MarketStats';
import IndicatorPanel from './components/IndicatorPanel';

const MarketAnalysis = () => {
  const [selectedMarket, setSelectedMarket] = useState('crypto');
  const [selectedSymbol, setSelectedSymbol] = useState({
    symbol: 'BTCUSDT',
    name: 'Bitcoin',
    price: 43250.50,
    change: 2.34
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [activeIndicators, setActiveIndicators] = useState(['sma', 'volume']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMarketChange = (market) => {
    setSelectedMarket(market);
    // Reset to default symbol when market changes
    if (market === 'crypto') {
      setSelectedSymbol({
        symbol: 'BTCUSDT',
        name: 'Bitcoin',
        price: 43250.50,
        change: 2.34
      });
    } else {
      setSelectedSymbol({
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.43,
        change: 1.23
      });
    }
  };

  const handleSymbolChange = (symbol) => {
    setSelectedSymbol(symbol);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  const handleToggleIndicator = (indicatorId) => {
    setActiveIndicators(prev => 
      prev?.includes(indicatorId)
        ? prev?.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-lg text-muted-foreground">Loading Market Analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Top Controls Bar */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Left Side - Market & Symbol Selection */}
              <div className="flex items-center space-x-4">
                <MarketSelector
                  selectedMarket={selectedMarket}
                  onMarketChange={handleMarketChange}
                  selectedSymbol={selectedSymbol}
                  onSymbolChange={handleSymbolChange}
                />
              </div>

              {/* Right Side - Timeframe & Indicators */}
              <div className="flex items-center space-x-4">
                <TimeframeSelector
                  selectedTimeframe={selectedTimeframe}
                  onTimeframeChange={handleTimeframeChange}
                />
                <TechnicalIndicators
                  activeIndicators={activeIndicators}
                  onToggleIndicator={handleToggleIndicator}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-16 gap-6 h-[calc(100vh-200px)]">
            {/* Main Chart Area - 12 columns on desktop */}
            <div className="xl:col-span-12 h-full">
              <CandlestickChart
                symbol={selectedSymbol}
                timeframe={selectedTimeframe}
                activeIndicators={activeIndicators}
              />
            </div>

            {/* Right Sidebar - 4 columns on desktop */}
            <div className="xl:col-span-4 space-y-6 h-full overflow-y-auto">
              {/* Order Book */}
              <div className="h-80">
                <OrderBook symbol={selectedSymbol} />
              </div>

              {/* Recent Trades */}
              <div className="h-80">
                <RecentTrades symbol={selectedSymbol} />
              </div>

              {/* Market Statistics */}
              <div className="h-96">
                <MarketStats 
                  symbol={selectedSymbol} 
                  selectedMarket={selectedMarket}
                />
              </div>
            </div>
          </div>

          {/* Bottom Panel - Technical Indicators, Sentiment, News */}
          <div className="mt-6">
            <div className="h-96">
              <IndicatorPanel
                symbol={selectedSymbol}
                timeframe={selectedTimeframe}
                activeIndicators={activeIndicators}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketAnalysis;