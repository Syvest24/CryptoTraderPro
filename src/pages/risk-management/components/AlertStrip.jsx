import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertStrip = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      severity: 'high',
      message: 'BTC position exceeds 30% concentration limit',
      action: 'Rebalance Portfolio',
      timestamp: new Date(Date.now() - 300000),
      asset: 'BTC'
    },
    {
      id: 2,
      severity: 'medium',
      message: 'Portfolio volatility increased by 15% in last 24h',
      action: 'Review Positions',
      timestamp: new Date(Date.now() - 900000),
      asset: 'Portfolio'
    },
    {
      id: 3,
      severity: 'low',
      message: 'Stop-loss triggered for AAPL position',
      action: 'View Details',
      timestamp: new Date(Date.now() - 1800000),
      asset: 'AAPL'
    }
  ]);

  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-error/10 border-error text-error';
      case 'medium': return 'bg-warning/10 border-warning text-warning';
      case 'low': return 'bg-success/10 border-success text-success';
      default: return 'bg-muted/10 border-muted text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Bell';
    }
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
    if (currentAlertIndex >= alerts?.length - 1) {
      setCurrentAlertIndex(Math.max(0, alerts?.length - 2));
    }
  };

  const nextAlert = () => {
    setCurrentAlertIndex((prev) => (prev + 1) % alerts?.length);
  };

  const prevAlert = () => {
    setCurrentAlertIndex((prev) => (prev - 1 + alerts?.length) % alerts?.length);
  };

  if (alerts?.length === 0) {
    return (
      <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <span className="text-success font-medium">All risk parameters within acceptable limits</span>
        </div>
      </div>
    );
  }

  const currentAlert = alerts?.[currentAlertIndex];

  return (
    <div className={`border rounded-lg p-4 mb-6 ${getSeverityColor(currentAlert?.severity)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Icon name={getSeverityIcon(currentAlert?.severity)} size={20} />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{currentAlert?.message}</span>
              <span className="text-xs opacity-75">
                ({currentAlert?.timestamp?.toLocaleTimeString()})
              </span>
            </div>
            <div className="text-xs opacity-75 mt-1">
              Asset: {currentAlert?.asset}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {alerts?.length > 1 && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevAlert}
                iconName="ChevronLeft"
                className="w-8 h-8 p-0"
              />
              <span className="text-xs px-2">
                {currentAlertIndex + 1} of {alerts?.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextAlert}
                iconName="ChevronRight"
                className="w-8 h-8 p-0"
              />
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('Action:', currentAlert?.action)}
          >
            {currentAlert?.action}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDismissAlert(currentAlert?.id)}
            iconName="X"
            className="w-8 h-8 p-0"
          />
        </div>
      </div>
    </div>
  );
};

export default AlertStrip;