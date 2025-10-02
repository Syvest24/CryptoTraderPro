import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const CandlestickChart = ({ symbol, timeframe, activeIndicators }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [crosshair, setCrosshair] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Mock candlestick data generation
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const generateMockData = () => {
        const data = [];
        let basePrice = symbol?.price || 43250;
        const now = new Date();
        
        for (let i = 100; i >= 0; i--) {
          const timestamp = new Date(now.getTime() - i * getTimeframeMs(timeframe));
          const volatility = basePrice * 0.02;
          
          const open = basePrice + (Math.random() - 0.5) * volatility;
          const close = open + (Math.random() - 0.5) * volatility;
          const high = Math.max(open, close) + Math.random() * volatility * 0.5;
          const low = Math.min(open, close) - Math.random() * volatility * 0.5;
          const volume = Math.floor(Math.random() * 1000000) + 100000;
          
          data?.push({
            timestamp: timestamp?.getTime(),
            time: timestamp?.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            open: parseFloat(open?.toFixed(2)),
            high: parseFloat(high?.toFixed(2)),
            low: parseFloat(low?.toFixed(2)),
            close: parseFloat(close?.toFixed(2)),
            volume,
            sma: parseFloat((open + close) / 2)?.toFixed(2),
            ema: parseFloat((open * 0.3 + close * 0.7))?.toFixed(2),
            rsi: Math.floor(Math.random() * 100),
            macd: (Math.random() - 0.5) * 100
          });
          
          basePrice = close;
        }
        
        return data;
      };
      
      setChartData(generateMockData());
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [symbol, timeframe]);

  const getTimeframeMs = (tf) => {
    const timeframes = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1D': 24 * 60 * 60 * 1000
    };
    return timeframes?.[tf] || timeframes?.['1h'];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(price);
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000)?.toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000)?.toFixed(1)}K`;
    }
    return volume?.toString();
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card rounded-lg p-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            {symbol?.symbol || 'BTCUSDT'} - {timeframe}
          </h3>
          {chartData?.length > 0 && (
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-muted-foreground">O:</span>
              <span className="font-mono text-foreground">
                {formatPrice(chartData?.[chartData?.length - 1]?.open)}
              </span>
              <span className="text-muted-foreground">H:</span>
              <span className="font-mono text-foreground">
                {formatPrice(chartData?.[chartData?.length - 1]?.high)}
              </span>
              <span className="text-muted-foreground">L:</span>
              <span className="font-mono text-foreground">
                {formatPrice(chartData?.[chartData?.length - 1]?.low)}
              </span>
              <span className="text-muted-foreground">C:</span>
              <span className="font-mono text-foreground">
                {formatPrice(chartData?.[chartData?.length - 1]?.close)}
              </span>
            </div>
          )}
        </div>
        
        {/* Chart Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            title="Zoom In"
          >
            <Icon name="ZoomIn" size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            title="Zoom Out"
          >
            <Icon name="ZoomOut" size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            title="Reset Zoom"
          >
            <Icon name="RotateCcw" size={16} className="text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200" title="Fullscreen">
            <Icon name="Maximize" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      {/* Price Chart */}
      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value?.toLocaleString()}`}
            />
            
            {/* Main Price Line */}
            <Line
              type="monotone"
              dataKey="close"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6' }}
            />
            
            {/* Technical Indicators */}
            {activeIndicators?.includes('sma') && (
              <Line
                type="monotone"
                dataKey="sma"
                stroke="#10B981"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
            
            {activeIndicators?.includes('ema') && (
              <Line
                type="monotone"
                dataKey="ema"
                stroke="#F59E0B"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Volume Chart */}
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatVolume}
            />
            <Bar 
              dataKey="volume" 
              fill="#6B7280" 
              opacity={0.6}
              radius={[1, 1, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CandlestickChart;