import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import RiskManagement from './pages/risk-management';
import PortfolioOverview from './pages/portfolio-overview';
import MarketAnalysis from './pages/market-analysis';
import TradingPerformance from './pages/trading-performance';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<PortfolioOverview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/risk-management" element={<RiskManagement />} />
          <Route path="/portfolio-overview" element={<PortfolioOverview />} />
          <Route path="/market-analysis" element={<MarketAnalysis />} />
          <Route path="/trading-performance" element={<TradingPerformance />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
