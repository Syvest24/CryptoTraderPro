import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import PortfolioControls from './components/PortfolioControls';
import PortfolioKPICards from './components/PortfolioKPICards';
import PortfolioChart from './components/PortfolioChart';
import AssetAllocationChart from './components/AssetAllocationChart';
import HoldingsTable from './components/HoldingsTable';
import { useAuth } from '../../contexts/AuthContext';
import { tradingService } from '../../services/tradingService';

const PortfolioOverview = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [allocationData, setAllocationData] = useState([]);
  const [portfolioData, setPortfolioData] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeRange, setTimeRange] = useState('1M');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user portfolios
  const loadPortfolios = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await tradingService?.getPortfolios(user?.id);
      if (error) {
        setError(error?.message);
        return;
      }

      setPortfolios(data || []);
      
      // Select default portfolio or first one
      const defaultPortfolio = data?.find(p => p?.is_default) || data?.[0];
      if (defaultPortfolio && !selectedPortfolio) {
        setSelectedPortfolio(defaultPortfolio?.id);
      }
    } catch (err) {
      setError('Failed to load portfolios');
    }
  };

  // Load portfolio data
  const loadPortfolioData = async (portfolioId) => {
    if (!portfolioId) return;

    try {
      setLoading(true);

      // Load portfolio summary
      const { data: summary, error: summaryError } = await tradingService?.getPortfolioSummary(portfolioId);
      if (summaryError) {
        setError(summaryError?.message);
        return;
      }

      setPortfolioData(summary);

      // Load holdings
      const { data: holdingsData, error: holdingsError } = await tradingService?.getHoldings(portfolioId);
      if (holdingsError) {
        setError(holdingsError?.message);
        return;
      }

      setHoldings(holdingsData || []);

      // Load performance data
      const { data: performance, error: performanceError } = await tradingService?.getPortfolioPerformance(
        portfolioId, 
        timeRange === '1D' ? 1 : timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : 90
      );
      if (performanceError) {
        setError(performanceError?.message);
        return;
      }

      // Transform performance data for charts
      const chartData = performance?.map(p => ({
        timestamp: p?.date,
        portfolio: Number(p?.total_value || 0),
        benchmark: Number(p?.total_value || 0) * (1 + (Number(p?.benchmark_return || 0) / 100))
      })) || [];

      setPerformanceData(chartData);

      // Load allocation data
      const { data: allocation, error: allocationError } = await tradingService?.getPortfolioAllocation(portfolioId);
      if (allocationError) {
        setError(allocationError?.message);
        return;
      }

      const allocationChartData = allocation?.map(a => ({
        name: a?.asset?.name || a?.asset?.symbol || 'Unknown',
        value: Number(a?.market_value || 0),
        change: ((Number(a?.market_value || 0) / Number(summary?.total_invested || 1)) - 1) * 100
      })) || [];

      setAllocationData(allocationChartData);

    } catch (err) {
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadPortfolios();
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (selectedPortfolio) {
      loadPortfolioData(selectedPortfolio);
    }
  }, [selectedPortfolio, timeRange]);

  useEffect(() => {
    let interval;
    if (autoRefresh && selectedPortfolio) {
      interval = setInterval(() => {
        loadPortfolioData(selectedPortfolio);
        setLastUpdate(new Date());
      }, 30000); // Update every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, selectedPortfolio]);

  // Event handlers
  const handlePortfolioChange = (portfolioId) => {
    setSelectedPortfolio(portfolioId);
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleRebalanceClick = () => {
    console.log('Rebalance recommendations requested');
    // TODO: Implement rebalancing logic
  };

  const handleExport = async () => {
    if (!holdings?.length) return;

    console.log('Exporting portfolio data...');
    const csvData = holdings?.map(holding => ({
      Symbol: holding?.asset?.symbol || 'N/A',
      Name: holding?.asset?.name || 'N/A',
      'Asset Class': holding?.asset?.asset_class || 'N/A',
      Price: holding?.current_price || 0,
      Quantity: holding?.quantity || 0,
      'Market Value': holding?.market_value || 0,
      'Unrealized P&L': holding?.unrealized_pnl || 0,
      'P&L %': holding?.unrealized_pnl_percentage || 0
    }));
    
    console.log('CSV Data:', csvData);
    // TODO: Implement actual CSV export
  };

  // Loading states
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8 text-center">
            <div className="bg-card rounded-lg shadow-sm border p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">Authentication Required</h2>
              <p className="text-muted-foreground mb-6">Please sign in to view your trading portfolio.</p>
              
              {/* Demo Credentials for Testing */}
              <div className="bg-muted/50 rounded-md p-4 text-left text-sm">
                <h3 className="font-medium text-card-foreground mb-2">Demo Credentials:</h3>
                <div className="space-y-1 text-muted-foreground">
                  <div>Admin: admin@tradingpro.com / admin123</div>
                  <div>Trader: trader@tradingpro.com / trader123</div>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = '/login'} 
                className="mt-6 w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8 text-center">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Data</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  if (selectedPortfolio) {
                    loadPortfolioData(selectedPortfolio);
                  } else {
                    loadPortfolios();
                  }
                }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Portfolio Controls */}
          <PortfolioControls
            selectedPortfolio={selectedPortfolio}
            portfolios={portfolios}
            onPortfolioChange={handlePortfolioChange}
            currency={currency}
            onCurrencyChange={handleCurrencyChange}
            autoRefresh={autoRefresh}
            onAutoRefreshToggle={handleAutoRefreshToggle}
            lastUpdate={lastUpdate}
          />

          {/* KPI Cards */}
          {portfolioData && (
            <PortfolioKPICards 
              portfolioData={{
                totalValue: Number(portfolioData?.current_balance || 0),
                dailyChange: Number(portfolioData?.return_percentage || 0),
                unrealizedPnL: Number(portfolioData?.total_return || 0),
                unrealizedPnLPercent: Number(portfolioData?.return_percentage || 0),
                totalReturn: Number(portfolioData?.return_percentage || 0),
                totalReturnValue: Number(portfolioData?.total_return || 0),
                cashBalance: Number(portfolioData?.initial_balance || 0) - Number(portfolioData?.total_invested || 0),
                cashChangePercent: 0.12
              }} 
            />
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
            {/* Portfolio Chart */}
            <div className="xl:col-span-8">
              <PortfolioChart
                chartData={performanceData}
                timeRange={timeRange}
                onTimeRangeChange={handleTimeRangeChange}
                loading={loading}
              />
            </div>

            {/* Asset Allocation */}
            <div className="xl:col-span-4">
              <AssetAllocationChart
                allocationData={allocationData}
                onRebalanceClick={handleRebalanceClick}
                loading={loading}
              />
            </div>
          </div>

          {/* Holdings Table */}
          <HoldingsTable
            holdings={holdings?.map(holding => ({
              symbol: holding?.asset?.symbol || 'N/A',
              name: holding?.asset?.name || 'N/A',
              assetClass: holding?.asset?.asset_class || 'N/A',
              logo: holding?.asset?.logo_url || '',
              currentPrice: Number(holding?.current_price || 0),
              quantity: Number(holding?.quantity || 0),
              marketValue: Number(holding?.market_value || 0),
              change24h: Number(holding?.unrealized_pnl_percentage || 0),
              change24hValue: Number(holding?.unrealized_pnl || 0)
            })) || []}
            onExport={handleExport}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
};

export default PortfolioOverview;