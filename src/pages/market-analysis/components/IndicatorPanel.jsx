import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const IndicatorPanel = ({ symbol, timeframe, activeIndicators }) => {
  const [activeTab, setActiveTab] = useState('technical');
  const [indicatorData, setIndicatorData] = useState({});
  const [sentimentData, setSentimentData] = useState({});
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Generate mock indicator data
    const generateIndicatorData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 50; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60000);
        data?.push({
          time: timestamp?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          rsi: Math.random() * 100,
          macd: (Math.random() - 0.5) * 200,
          macdSignal: (Math.random() - 0.5) * 180,
          macdHistogram: (Math.random() - 0.5) * 50,
          stochK: Math.random() * 100,
          stochD: Math.random() * 100,
          volume: Math.floor(Math.random() * 1000000) + 100000
        });
      }
      
      setIndicatorData({
        rsi: data,
        macd: data,
        stochastic: data,
        volume: data
      });
    };

    // Generate mock sentiment data
    const generateSentimentData = () => {
      setSentimentData({
        overall: Math.random() * 100,
        bullish: Math.random() * 100,
        bearish: Math.random() * 100,
        neutral: Math.random() * 100,
        fearGreedIndex: Math.floor(Math.random() * 100),
        socialVolume: Math.floor(Math.random() * 10000) + 1000,
        socialSentiment: Math.random() * 100
      });
    };

    // Generate mock news data
    const generateNewsData = () => {
      const mockNews = [
        {
          id: 1,
          title: "Bitcoin Reaches New Monthly High Amid Institutional Interest",
          summary: "Major institutional investors continue to show strong interest in Bitcoin, driving prices to new monthly highs.",
          sentiment: 85,
          source: "CryptoNews",
          timestamp: new Date(Date.now() - 1800000),
          category: "Market"
        },
        {
          id: 2,
          title: "Federal Reserve Hints at Interest Rate Changes",
          summary: "Recent Fed statements suggest potential changes to interest rates, impacting cryptocurrency markets.",
          sentiment: 45,
          source: "Financial Times",
          timestamp: new Date(Date.now() - 3600000),
          category: "Regulation"
        },
        {
          id: 3,
          title: "Major Exchange Announces New Trading Features",
          summary: "Leading cryptocurrency exchange introduces advanced trading tools and improved user interface.",
          sentiment: 75,
          source: "TechCrunch",
          timestamp: new Date(Date.now() - 7200000),
          category: "Technology"
        },
        {
          id: 4,
          title: "Blockchain Adoption Increases in Enterprise Sector",
          summary: "More enterprises are adopting blockchain technology for supply chain and financial applications.",
          sentiment: 80,
          source: "Enterprise Today",
          timestamp: new Date(Date.now() - 10800000),
          category: "Adoption"
        },
        {
          id: 5,
          title: "Market Volatility Expected Due to Economic Uncertainty",
          summary: "Analysts predict increased market volatility as economic indicators show mixed signals.",
          sentiment: 35,
          source: "Market Watch",
          timestamp: new Date(Date.now() - 14400000),
          category: "Analysis"
        }
      ];
      
      setNewsData(mockNews);
    };

    generateIndicatorData();
    generateSentimentData();
    generateNewsData();
    setIsLoading(false);
  }, [symbol, timeframe]);

  const tabs = [
    { id: 'technical', label: 'Technical Indicators', icon: 'TrendingUp' },
    { id: 'sentiment', label: 'Market Sentiment', icon: 'Heart' },
    { id: 'news', label: 'News & Analysis', icon: 'Newspaper' }
  ];

  const getSentimentColor = (sentiment) => {
    if (sentiment >= 70) return 'text-success';
    if (sentiment >= 40) return 'text-warning';
    return 'text-error';
  };

  const getSentimentBg = (sentiment) => {
    if (sentiment >= 70) return 'bg-success/20';
    if (sentiment >= 40) return 'bg-warning/20';
    return 'bg-error/20';
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) return `${diffHours}h ago`;
    return `${diffMinutes}m ago`;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading indicators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card rounded-lg">
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === tab?.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="hidden lg:inline">{tab?.label}</span>
          </button>
        ))}
      </div>
      <div className="p-4 h-full overflow-y-auto">
        {/* Technical Indicators Tab */}
        {activeTab === 'technical' && (
          <div className="space-y-6">
            {/* RSI */}
            {activeIndicators?.includes('rsi') && indicatorData?.rsi && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">RSI (14)</h4>
                  <span className="text-sm font-mono text-foreground">
                    {indicatorData?.rsi?.[indicatorData?.rsi?.length - 1]?.rsi?.toFixed(2)}
                  </span>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={indicatorData?.rsi?.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} />
                      <Line type="monotone" dataKey="rsi" stroke="#F59E0B" strokeWidth={2} dot={false} />
                      {/* RSI levels */}
                      <Line type="monotone" dataKey={() => 70} stroke="#EF4444" strokeDasharray="2 2" strokeWidth={1} dot={false} />
                      <Line type="monotone" dataKey={() => 30} stroke="#10B981" strokeDasharray="2 2" strokeWidth={1} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* MACD */}
            {activeIndicators?.includes('macd') && indicatorData?.macd && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">MACD (12,26,9)</h4>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-primary">MACD</span>
                    <span className="text-warning">Signal</span>
                    <span className="text-muted-foreground">Histogram</span>
                  </div>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={indicatorData?.macd?.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={10} />
                      <Line type="monotone" dataKey="macd" stroke="#3B82F6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="macdSignal" stroke="#F59E0B" strokeWidth={2} dot={false} />
                      <Bar dataKey="macdHistogram" fill="#6B7280" opacity={0.6} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Stochastic */}
            {activeIndicators?.includes('stochastic') && indicatorData?.stochastic && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Stochastic (14,3,3)</h4>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-primary">%K</span>
                    <span className="text-secondary">%D</span>
                  </div>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={indicatorData?.stochastic?.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} />
                      <Line type="monotone" dataKey="stochK" stroke="#3B82F6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="stochD" stroke="#6366F1" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey={() => 80} stroke="#EF4444" strokeDasharray="2 2" strokeWidth={1} dot={false} />
                      <Line type="monotone" dataKey={() => 20} stroke="#10B981" strokeDasharray="2 2" strokeWidth={1} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Market Sentiment Tab */}
        {activeTab === 'sentiment' && (
          <div className="space-y-6">
            {/* Overall Sentiment */}
            <div className="p-4 bg-muted/10 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-3">Overall Market Sentiment</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Sentiment Score</span>
                <span className={`text-lg font-bold ${getSentimentColor(sentimentData?.overall)}`}>
                  {sentimentData?.overall?.toFixed(0)}/100
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    sentimentData?.overall >= 70 ? 'bg-success' :
                    sentimentData?.overall >= 40 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${sentimentData?.overall}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Bullish</div>
                  <div className="text-sm font-bold text-success">
                    {sentimentData?.bullish?.toFixed(0)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Neutral</div>
                  <div className="text-sm font-bold text-warning">
                    {sentimentData?.neutral?.toFixed(0)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Bearish</div>
                  <div className="text-sm font-bold text-error">
                    {sentimentData?.bearish?.toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Fear & Greed Index */}
            <div className="p-4 bg-muted/10 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-3">Fear & Greed Index</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getSentimentBg(sentimentData?.fearGreedIndex)}`}>
                    <span className={`text-xl font-bold ${getSentimentColor(sentimentData?.fearGreedIndex)}`}>
                      {sentimentData?.fearGreedIndex}
                    </span>
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${getSentimentColor(sentimentData?.fearGreedIndex)}`}>
                      {sentimentData?.fearGreedIndex >= 70 ? 'Extreme Greed' :
                       sentimentData?.fearGreedIndex >= 40 ? 'Neutral' : 'Extreme Fear'}
                    </div>
                    <div className="text-xs text-muted-foreground">Updated 1 hour ago</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Metrics */}
            <div className="p-4 bg-muted/10 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-3">Social Media Metrics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Social Volume</span>
                  <span className="text-sm font-bold text-foreground">
                    {sentimentData?.socialVolume?.toLocaleString()} mentions
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Social Sentiment</span>
                  <span className={`text-sm font-bold ${getSentimentColor(sentimentData?.socialSentiment)}`}>
                    {sentimentData?.socialSentiment?.toFixed(0)}% Positive
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News & Analysis Tab */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            {newsData?.map((news) => (
              <div key={news?.id} className="p-4 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSentimentBg(news?.sentiment)} ${getSentimentColor(news?.sentiment)}`}>
                      {news?.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{news?.source}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatTime(news?.timestamp)}</span>
                </div>
                
                <h5 className="text-sm font-semibold text-foreground mb-2 line-clamp-2">
                  {news?.title}
                </h5>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {news?.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Sentiment:</span>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        news?.sentiment >= 70 ? 'bg-success' :
                        news?.sentiment >= 40 ? 'bg-warning' : 'bg-error'
                      }`}></div>
                      <span className={`text-xs font-medium ${getSentimentColor(news?.sentiment)}`}>
                        {news?.sentiment >= 70 ? 'Positive' :
                         news?.sentiment >= 40 ? 'Neutral' : 'Negative'}
                      </span>
                    </div>
                  </div>
                  
                  <button className="text-xs text-primary hover:text-primary/80 transition-colors duration-200">
                    Read more
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndicatorPanel;