import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, userProfile, signOut, isAuthenticated, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TP</span>
            </div>
            <span className="text-xl font-bold text-card-foreground">Trading Pro</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className="text-card-foreground hover:text-primary transition-colors"
            >
              Portfolio
            </a>
            <a 
              href="/trading-performance" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Performance
            </a>
            <a 
              href="/market-analysis" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Market Analysis
            </a>
            <a 
              href="/risk-management" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Risk Management
            </a>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="w-20 h-4 bg-muted rounded"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-card-foreground">
                      {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {userProfile?.role || 'trader'}
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {(userProfile?.full_name || user?.email)?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-card-foreground text-sm transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a 
                  href="/login" 
                  className="text-muted-foreground hover:text-card-foreground text-sm transition-colors"
                >
                  Sign In
                </a>
                <a 
                  href="/signup" 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;