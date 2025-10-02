import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertFeed = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'concentration',
      severity: 'high',
      title: 'Concentration Risk Alert',
      message: 'BTC position exceeds 30% of total portfolio value',
      timestamp: new Date(Date.now() - 300000),
      asset: 'BTC',
      currentValue: '32.5%',
      threshold: '30%',
      recommendation: 'Consider reducing BTC position by $15,000',
      status: 'active'
    },
    {
      id: 2,
      type: 'volatility',
      severity: 'medium',
      title: 'Volatility Spike',
      message: 'Portfolio volatility increased significantly',
      timestamp: new Date(Date.now() - 900000),
      asset: 'Portfolio',
      currentValue: '18.5%',
      threshold: '15%',
      recommendation: 'Review high-volatility positions',
      status: 'active'
    },
    {
      id: 3,
      type: 'drawdown',
      severity: 'medium',
      title: 'Drawdown Warning',
      message: 'Maximum drawdown approaching limit',
      timestamp: new Date(Date.now() - 1800000),
      asset: 'TSLA',
      currentValue: '12.8%',
      threshold: '15%',
      recommendation: 'Consider stop-loss order',
      status: 'monitoring'
    },
    {
      id: 4,
      type: 'correlation',
      severity: 'low',
      title: 'Correlation Change',
      message: 'Asset correlation patterns shifted',
      timestamp: new Date(Date.now() - 3600000),
      asset: 'Tech Sector',
      currentValue: '0.85',
      threshold: '0.70',
      recommendation: 'Diversify sector exposure',
      status: 'resolved'
    },
    {
      id: 5,
      type: 'var',
      severity: 'high',
      title: 'VaR Breach',
      message: 'Value at Risk exceeded daily limit',
      timestamp: new Date(Date.now() - 7200000),
      asset: 'Portfolio',
      currentValue: '5.2%',
      threshold: '5%',
      recommendation: 'Reduce position sizes immediately',
      status: 'active'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Bell';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-error/10 text-error border-error/20';
      case 'monitoring': return 'bg-warning/10 text-warning border-warning/20';
      case 'resolved': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'concentration': return 'PieChart';
      case 'volatility': return 'Activity';
      case 'drawdown': return 'TrendingDown';
      case 'correlation': return 'GitBranch';
      case 'var': return 'Shield';
      default: return 'AlertCircle';
    }
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts?.filter(alert => alert?.status === filter);

  const handleTakeAction = (alertId, action) => {
    console.log(`Taking action for alert ${alertId}: ${action}`);
    // In a real app, this would trigger the recommended action
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId 
        ? { ...alert, status: 'resolved' }
        : alert
    ));
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      return `${hours}h ago`;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Risk Alerts</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {filteredAlerts?.length} alerts
            </span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex space-x-1 bg-muted/20 rounded-lg p-1">
          {['all', 'active', 'monitoring', 'resolved']?.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {filteredAlerts?.map((alert) => (
            <div key={alert?.id} className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors duration-200">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  alert?.severity === 'high' ? 'bg-error/10' :
                  alert?.severity === 'medium' ? 'bg-warning/10' : 'bg-success/10'
                }`}>
                  <Icon 
                    name={getTypeIcon(alert?.type)} 
                    size={16} 
                    className={getSeverityColor(alert?.severity)} 
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {alert?.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(alert?.status)}`}>
                        {alert?.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(alert?.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {alert?.message}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Asset:</span>
                      <span className="ml-1 font-medium text-foreground">{alert?.asset}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current:</span>
                      <span className="ml-1 font-medium text-foreground">{alert?.currentValue}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Threshold:</span>
                      <span className="ml-1 font-medium text-foreground">{alert?.threshold}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Severity:</span>
                      <span className={`ml-1 font-medium ${getSeverityColor(alert?.severity)}`}>
                        {alert?.severity?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/20 rounded-lg p-3 mb-3">
                    <div className="flex items-start space-x-2">
                      <Icon name="Lightbulb" size={14} className="text-warning mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">Recommendation:</p>
                        <p className="text-xs text-muted-foreground">{alert?.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  {alert?.status === 'active' && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTakeAction(alert?.id, 'implement')}
                        iconName="CheckCircle"
                        iconPosition="left"
                      >
                        Take Action
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismissAlert(alert?.id)}
                        iconName="X"
                        iconPosition="left"
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertFeed;