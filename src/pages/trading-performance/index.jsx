import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ControlBar from './components/ControlBar';
import PerformanceMetrics from './components/PerformanceMetrics';
import PerformanceChart from './components/PerformanceChart';
import RiskMetricsHeatmap from './components/RiskMetricsHeatmap';
import RecentTransactions from './components/RecentTransactions';
import StrategyBreakdown from './components/StrategyBreakdown';
import AdvancedAnalytics from './components/AdvancedAnalytics';

const TradingPerformance = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [assetClasses, setAssetClasses] = useState(['stocks', 'crypto', 'forex', 'commodities']);
  const [benchmark, setBenchmark] = useState('sp500');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for performance metrics
  const performanceMetrics = {
    totalReturn: 24.67,
    sharpeRatio: 1.34,
    maxDrawdown: -8.45,
    winRate: 67.3,
    totalTrades: 156,
    avgTradeDuration: 12,
    totalFees: 2847,
    totalVolume: 485000
  };

  // Mock data for performance chart
  const performanceChartData = [
    { month: 'Jan', cumulativeReturn: 5.2, benchmarkReturn: 3.1, monthlyPnL: 2500 },
    { month: 'Feb', cumulativeReturn: 8.7, benchmarkReturn: 4.8, monthlyPnL: 1800 },
    { month: 'Mar', cumulativeReturn: 12.3, benchmarkReturn: 7.2, monthlyPnL: 3200 },
    { month: 'Apr', cumulativeReturn: 9.8, benchmarkReturn: 8.1, monthlyPnL: -1200 },
    { month: 'May', cumulativeReturn: 15.4, benchmarkReturn: 10.5, monthlyPnL: 4100 },
    { month: 'Jun', cumulativeReturn: 18.9, benchmarkReturn: 12.8, monthlyPnL: 2800 },
    { month: 'Jul', cumulativeReturn: 22.1, benchmarkReturn: 14.2, monthlyPnL: 3500 },
    { month: 'Aug', cumulativeReturn: 19.6, benchmarkReturn: 15.7, monthlyPnL: -1800 },
    { month: 'Sep', cumulativeReturn: 24.3, benchmarkReturn: 17.1, monthlyPnL: 4200 },
    { month: 'Oct', cumulativeReturn: 24.67, benchmarkReturn: 18.4, monthlyPnL: 800 }
  ];

  // Mock data for risk metrics
  const riskMetrics = {
    volatility: 18.7,
    beta: 1.12,
    var: 7.3,
    sortino: 1.67,
    calmar: 2.92,
    information: 0.84
  };

  // Mock data for recent transactions
  const recentTransactions = [
    {
      symbol: 'AAPL',
      type: 'sell',
      quantity: 50,
      price: 175.23,
      pnl: 1247.50,
      date: '2025-09-28T14:30:00Z'
    },
    {
      symbol: 'BTC',
      type: 'buy',
      quantity: 0.5,
      price: 43250.00,
      pnl: 0,
      date: '2025-09-27T09:15:00Z'
    },
    {
      symbol: 'TSLA',
      type: 'sell',
      quantity: 25,
      price: 248.67,
      pnl: -324.75,
      date: '2025-09-26T16:45:00Z'
    },
    {
      symbol: 'MSFT',
      type: 'dividend',
      quantity: 100,
      price: 2.75,
      pnl: 275.00,
      date: '2025-09-25T10:00:00Z'
    },
    {
      symbol: 'ETH',
      type: 'buy',
      quantity: 2,
      price: 2650.00,
      pnl: 0,
      date: '2025-09-24T11:20:00Z'
    },
    {
      symbol: 'GOOGL',
      type: 'sell',
      quantity: 15,
      price: 138.45,
      pnl: 892.25,
      date: '2025-09-23T13:10:00Z'
    },
    {
      symbol: 'NVDA',
      type: 'buy',
      quantity: 30,
      price: 425.80,
      pnl: 0,
      date: '2025-09-22T15:30:00Z'
    },
    {
      symbol: 'SPY',
      type: 'sell',
      quantity: 100,
      price: 428.90,
      pnl: 567.00,
      date: '2025-09-21T12:45:00Z'
    }
  ];

  // Mock data for strategy breakdown
  const strategyBreakdown = [
    { name: 'Momentum', value: 35.2, return: 28.4, trades: 45 },
    { name: 'Value', value: 24.8, return: 18.7, trades: 32 },
    { name: 'Growth', value: 18.5, return: 31.2, trades: 28 },
    { name: 'Dividend', value: 12.3, return: 12.8, trades: 18 },
    { name: 'Swing', value: 9.2, return: 22.1, trades: 33 }
  ];

  // Mock data for advanced analytics
  const correlationData = {
    assets: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'BTC'],
    matrix: [
      [1.00, 0.72, 0.68, 0.45, 0.23],
      [0.72, 1.00, 0.81, 0.52, 0.18],
      [0.68, 0.81, 1.00, 0.48, 0.15],
      [0.45, 0.52, 0.48, 1.00, 0.34],
      [0.23, 0.18, 0.15, 0.34, 1.00]
    ]
  };

  const volatilityData = [
    { date: 'Jan', portfolio: 15.2, benchmark: 12.8 },
    { date: 'Feb', portfolio: 18.7, benchmark: 14.2 },
    { date: 'Mar', portfolio: 22.1, benchmark: 16.5 },
    { date: 'Apr', portfolio: 19.8, benchmark: 15.1 },
    { date: 'May', portfolio: 16.4, benchmark: 13.7 },
    { date: 'Jun', portfolio: 17.9, benchmark: 14.8 },
    { date: 'Jul', portfolio: 20.3, benchmark: 16.2 },
    { date: 'Aug', portfolio: 23.5, benchmark: 18.1 },
    { date: 'Sep', portfolio: 18.7, benchmark: 15.4 },
    { date: 'Oct', portfolio: 17.2, benchmark: 14.9 }
  ];

  const tradeDistribution = [
    { range: '-10% to -5%', count: 8 },
    { range: '-5% to 0%', count: 23 },
    { range: '0% to 5%', count: 45 },
    { range: '5% to 10%', count: 38 },
    { range: '10% to 15%', count: 28 },
    { range: '15% to 20%', count: 12 },
    { range: '20%+', count: 6 }
  ];

  const handleExport = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would trigger a download
      console.log('Exporting performance report...');
    }, 2000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      console.log('Data refreshed');
    }, 1500);
  };

  useEffect(() => {
    // Simulate initial data loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [dateRange, selectedStrategy, assetClasses, benchmark]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Trading Performance</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics for strategy evaluation and risk management across all trading activities
            </p>
          </div>

          {/* Control Bar */}
          <ControlBar
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedStrategy={selectedStrategy}
            setSelectedStrategy={setSelectedStrategy}
            assetClasses={assetClasses}
            setAssetClasses={setAssetClasses}
            benchmark={benchmark}
            setBenchmark={setBenchmark}
            onExport={handleExport}
            onRefresh={handleRefresh}
          />

          {/* Performance Metrics */}
          <PerformanceMetrics metrics={performanceMetrics} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Performance Chart - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <PerformanceChart 
                data={performanceChartData} 
                showBenchmark={benchmark !== 'custom'} 
              />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <RiskMetricsHeatmap riskData={riskMetrics} />
              <StrategyBreakdown strategies={strategyBreakdown} />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2">
              <RecentTransactions transactions={recentTransactions} />
            </div>
          </div>

          {/* Advanced Analytics - Full Width */}
          <AdvancedAnalytics
            correlationData={correlationData}
            volatilityData={volatilityData}
            tradeDistribution={tradeDistribution}
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-card rounded-lg p-6 border border-border shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-foreground font-medium">Loading performance data...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TradingPerformance;