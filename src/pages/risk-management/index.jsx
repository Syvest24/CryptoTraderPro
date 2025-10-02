import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all components
import RiskMetricsGauges from './components/RiskMetricsGauges';
import AlertStrip from './components/AlertStrip';
import CorrelationHeatMap from './components/CorrelationHeatMap';
import AlertFeed from './components/AlertFeed';
import RiskBreakdownCharts from './components/RiskBreakdownCharts';
import RiskControlPanel from './components/RiskControlPanel';

const RiskManagement = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [riskScore, setRiskScore] = useState(7.2);
  const [portfolioHealth, setPortfolioHealth] = useState('moderate');

  useEffect(() => {
    // Simulate real-time risk calculations every 5 minutes
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate risk score fluctuation
      setRiskScore(prev => Math.max(1, Math.min(10, prev + (Math.random() - 0.5) * 0.5)));
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-success';
      case 'moderate': return 'text-warning';
      case 'poor': return 'text-error';
      case 'critical': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'excellent': return 'CheckCircle';
      case 'good': return 'CheckCircle';
      case 'moderate': return 'AlertCircle';
      case 'poor': return 'AlertTriangle';
      case 'critical': return 'XCircle';
      default: return 'HelpCircle';
    }
  };

  const formatTime = (date) => {
    return date?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Risk Management - CryptoTrader Pro</title>
        <meta name="description" content="Real-time portfolio risk monitoring and alert management for proactive investment protection" />
      </Helmet>
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="flex items-center space-x-3 mb-4 lg:mb-0">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon name="Shield" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Risk Management</h1>
                <p className="text-muted-foreground">
                  Real-time portfolio risk monitoring and protection
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Portfolio Health Indicator */}
              <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border border-border">
                <Icon 
                  name={getHealthIcon(portfolioHealth)} 
                  size={16} 
                  className={getHealthColor(portfolioHealth)} 
                />
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    Portfolio Health
                  </div>
                  <div className={`text-xs font-medium ${getHealthColor(portfolioHealth)}`}>
                    {portfolioHealth?.charAt(0)?.toUpperCase() + portfolioHealth?.slice(1)}
                  </div>
                </div>
              </div>

              {/* Risk Score */}
              <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border border-border">
                <Icon name="Gauge" size={16} className="text-primary" />
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    Risk Score
                  </div>
                  <div className="text-xs font-mono font-bold text-foreground">
                    {riskScore?.toFixed(1)}/10
                  </div>
                </div>
              </div>

              {/* Last Update */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>Updated: {formatTime(lastUpdate)}</span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  onClick={() => console.log('Export risk report')}
                >
                  Export Report
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="RefreshCw"
                  onClick={() => {
                    setLastUpdate(new Date());
                    console.log('Refreshing risk data...');
                  }}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Alert Strip */}
          <AlertStrip />

          {/* Risk Metrics Gauges */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Activity" size={20} className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Risk Metrics Overview</h2>
            </div>
            <RiskMetricsGauges />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
            {/* Correlation Heat Map */}
            <div className="xl:col-span-8">
              <CorrelationHeatMap />
            </div>

            {/* Alert Feed */}
            <div className="xl:col-span-4">
              <AlertFeed />
            </div>
          </div>

          {/* Risk Breakdown Charts */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="BarChart3" size={20} className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Risk Breakdown Analysis</h2>
            </div>
            <RiskBreakdownCharts />
          </div>

          {/* Risk Control Panel */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="Settings" size={20} className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Risk Controls & Stress Testing</h2>
            </div>
            <RiskControlPanel />
          </div>

          {/* Risk Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <Icon name="TrendingUp" size={20} className="text-success" />
                <span className="text-xs text-success font-medium">STABLE</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Sharpe Ratio</h3>
              <p className="text-2xl font-bold text-foreground">1.42</p>
              <p className="text-xs text-muted-foreground">Risk-adjusted returns</p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <Icon name="Activity" size={20} className="text-warning" />
                <span className="text-xs text-warning font-medium">ELEVATED</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Beta</h3>
              <p className="text-2xl font-bold text-foreground">1.23</p>
              <p className="text-xs text-muted-foreground">Market sensitivity</p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <Icon name="Shield" size={20} className="text-success" />
                <span className="text-xs text-success font-medium">NORMAL</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Max Drawdown</h3>
              <p className="text-2xl font-bold text-foreground">-12.5%</p>
              <p className="text-xs text-muted-foreground">Historical peak decline</p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <Icon name="Zap" size={20} className="text-primary" />
                <span className="text-xs text-primary font-medium">ACTIVE</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Alerts</h3>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RiskManagement;