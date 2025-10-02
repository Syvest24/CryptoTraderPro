import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskMetricsHeatmap = ({ riskData }) => {
  const getRiskColor = (value, type) => {
    switch (type) {
      case 'volatility':
        if (value < 15) return 'bg-success/20 text-success';
        if (value < 25) return 'bg-warning/20 text-warning';
        return 'bg-error/20 text-error';
      case 'beta':
        if (value < 0.8) return 'bg-primary/20 text-primary';
        if (value < 1.2) return 'bg-warning/20 text-warning';
        return 'bg-error/20 text-error';
      case 'var':
        if (value < 5) return 'bg-success/20 text-success';
        if (value < 10) return 'bg-warning/20 text-warning';
        return 'bg-error/20 text-error';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  const riskMetrics = [
    {
      label: 'Volatility (30d)',
      value: `${riskData?.volatility?.toFixed(1)}%`,
      type: 'volatility',
      icon: 'Activity',
      description: 'Price fluctuation measure'
    },
    {
      label: 'Beta',
      value: riskData?.beta?.toFixed(2),
      type: 'beta',
      icon: 'TrendingUp',
      description: 'Market correlation'
    },
    {
      label: 'VaR (95%)',
      value: `${riskData?.var?.toFixed(1)}%`,
      type: 'var',
      icon: 'AlertTriangle',
      description: 'Value at Risk'
    },
    {
      label: 'Sortino Ratio',
      value: riskData?.sortino?.toFixed(2),
      type: 'sortino',
      icon: 'Target',
      description: 'Downside risk adjusted'
    },
    {
      label: 'Calmar Ratio',
      value: riskData?.calmar?.toFixed(2),
      type: 'calmar',
      icon: 'Shield',
      description: 'Return vs max drawdown'
    },
    {
      label: 'Information Ratio',
      value: riskData?.information?.toFixed(2),
      type: 'information',
      icon: 'Info',
      description: 'Active return efficiency'
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Risk Metrics</h3>
        <Icon name="BarChart3" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {riskMetrics?.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getRiskColor(parseFloat(metric?.value), metric?.type)}`}>
                <Icon name={metric?.icon} size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{metric?.label}</p>
                <p className="text-xs text-muted-foreground">{metric?.description}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getRiskColor(parseFloat(metric?.value), metric?.type)}`}>
              {metric?.value}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-muted/10 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Risk Assessment</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Current portfolio shows moderate risk profile with controlled volatility. 
          Beta indicates slight market correlation while VaR suggests manageable downside exposure.
        </p>
      </div>
    </div>
  );
};

export default RiskMetricsHeatmap;