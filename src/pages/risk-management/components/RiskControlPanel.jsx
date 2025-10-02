import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const RiskControlPanel = () => {
  const [riskTolerance, setRiskTolerance] = useState('moderate');
  const [stressTestScenario, setStressTestScenario] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoRebalance, setAutoRebalance] = useState(false);

  const riskToleranceOptions = [
    { value: 'conservative', label: 'Conservative', description: 'Low risk, stable returns' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced risk-return profile' },
    { value: 'aggressive', label: 'Aggressive', description: 'High risk, high potential returns' }
  ];

  const stressTestOptions = [
    { value: '', label: 'Select Scenario' },
    { value: 'market_crash', label: 'Market Crash (-30%)', description: '2008-style market decline' },
    { value: 'crypto_winter', label: 'Crypto Winter (-70%)', description: 'Severe crypto market downturn' },
    { value: 'inflation_spike', label: 'Inflation Spike (+5%)', description: 'High inflation environment' },
    { value: 'interest_rate_hike', label: 'Rate Hike (+3%)', description: 'Aggressive monetary tightening' },
    { value: 'geopolitical', label: 'Geopolitical Crisis', description: 'Global uncertainty event' }
  ];

  const [stressTestResults, setStressTestResults] = useState(null);
  const [isRunningTest, setIsRunningTest] = useState(false);

  const handleStressTest = async () => {
    if (!stressTestScenario) return;
    
    setIsRunningTest(true);
    
    // Simulate stress test calculation
    setTimeout(() => {
      const mockResults = {
        scenario: stressTestOptions?.find(opt => opt?.value === stressTestScenario)?.label,
        portfolioImpact: -15.2,
        worstAsset: 'TSLA (-45.3%)',
        bestAsset: 'GLD (+8.2%)',
        recoveryTime: '8-12 months',
        recommendations: [
          'Reduce tech sector exposure by 10%',
          'Increase defensive assets allocation',
          'Consider hedging strategies'
        ]
      };
      setStressTestResults(mockResults);
      setIsRunningTest(false);
    }, 2000);
  };

  const riskSettings = [
    {
      id: 'var_limit',
      label: 'VaR Limit',
      value: '5%',
      description: 'Maximum daily Value at Risk',
      status: 'normal'
    },
    {
      id: 'concentration_limit',
      label: 'Concentration Limit',
      value: '30%',
      description: 'Maximum single asset exposure',
      status: 'warning'
    },
    {
      id: 'volatility_threshold',
      label: 'Volatility Threshold',
      value: '20%',
      description: 'Portfolio volatility alert level',
      status: 'normal'
    },
    {
      id: 'drawdown_limit',
      label: 'Drawdown Limit',
      value: '15%',
      description: 'Maximum acceptable drawdown',
      status: 'normal'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Configuration Panel */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Risk Configuration</h3>
        </div>

        <div className="space-y-6">
          {/* Risk Tolerance */}
          <div>
            <Select
              label="Risk Tolerance"
              description="Adjust your overall risk appetite"
              options={riskToleranceOptions}
              value={riskTolerance}
              onChange={setRiskTolerance}
            />
          </div>

          {/* Risk Limits */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Risk Limits</h4>
            <div className="space-y-3">
              {riskSettings?.map((setting) => (
                <div key={setting?.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">{setting?.label}</span>
                      <Icon 
                        name={setting?.status === 'warning' ? 'AlertTriangle' : 'CheckCircle'} 
                        size={14} 
                        className={getStatusColor(setting?.status)} 
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{setting?.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">{setting?.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Settings */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Alert Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-foreground">Real-time Alerts</span>
                  <p className="text-xs text-muted-foreground">Instant notifications for risk breaches</p>
                </div>
                <button
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                    alertsEnabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                    alertsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-foreground">Auto Rebalancing</span>
                  <p className="text-xs text-muted-foreground">Automatic portfolio adjustments</p>
                </div>
                <button
                  onClick={() => setAutoRebalance(!autoRebalance)}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                    autoRebalance ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                    autoRebalance ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stress Testing Panel */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Stress Testing</h3>
        </div>

        <div className="space-y-6">
          {/* Scenario Selection */}
          <div>
            <Select
              label="Stress Test Scenario"
              description="Select a market scenario to test portfolio resilience"
              options={stressTestOptions}
              value={stressTestScenario}
              onChange={setStressTestScenario}
              placeholder="Choose a scenario"
            />
          </div>

          <Button
            variant="outline"
            onClick={handleStressTest}
            disabled={!stressTestScenario || isRunningTest}
            loading={isRunningTest}
            iconName="Play"
            iconPosition="left"
            fullWidth
          >
            {isRunningTest ? 'Running Stress Test...' : 'Run Stress Test'}
          </Button>

          {/* Stress Test Results */}
          {stressTestResults && (
            <div className="space-y-4">
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Results: {stressTestResults?.scenario}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-error/10 rounded-lg border border-error/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name="TrendingDown" size={16} className="text-error" />
                    <span className="text-sm font-medium text-error">Portfolio Impact</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {stressTestResults?.portfolioImpact}%
                  </p>
                </div>

                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name="Clock" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-warning">Recovery Time</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {stressTestResults?.recoveryTime}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Worst Performing:</span>
                  <span className="font-medium text-error">{stressTestResults?.worstAsset}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Best Performing:</span>
                  <span className="font-medium text-success">{stressTestResults?.bestAsset}</span>
                </div>
              </div>

              <div className="bg-muted/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Lightbulb" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-foreground">Recommendations</span>
                </div>
                <ul className="space-y-1">
                  {stressTestResults?.recommendations?.map((rec, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start space-x-2">
                      <Icon name="ArrowRight" size={12} className="mt-0.5 text-primary" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Monte Carlo Simulation */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Monte Carlo Simulation</h4>
              <Button variant="ghost" size="sm" iconName="BarChart3">
                View Details
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-success/10 rounded border border-success/20">
                <p className="text-xs text-success font-medium">95% Confidence</p>
                <p className="text-sm font-bold text-foreground">+12.5%</p>
              </div>
              <div className="p-2 bg-warning/10 rounded border border-warning/20">
                <p className="text-xs text-warning font-medium">50% Confidence</p>
                <p className="text-sm font-bold text-foreground">+8.2%</p>
              </div>
              <div className="p-2 bg-error/10 rounded border border-error/20">
                <p className="text-xs text-error font-medium">5% Confidence</p>
                <p className="text-sm font-bold text-foreground">-5.8%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskControlPanel;