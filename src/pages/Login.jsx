import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error?.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (error?.message?.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link.');
        } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
          setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
        } else {
          setError(error?.message);
        }
        return;
      }
      
      // Success - user will be redirected by useEffect
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
        return;
      }
      
      setError('Something went wrong. Please try again.');
      console.error('JavaScript error in auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(demoEmail, demoPassword);
      if (error) {
        setError(error?.message);
        return;
      }
    } catch (error) {
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      // On successful login, you might want to navigate to a dashboard page
      alert('Logged in successfully!');
      navigate('/dashboard'); // Example: navigate to a dashboard route
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-card-foreground">Sign in to Trading Pro</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your trading portfolio and analytics
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card shadow-lg rounded-lg p-8 border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                <div className="flex items-start">
                  <span className="font-medium">Error:</span>
                  <span className="ml-2 flex-1">{error}</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(error)}
                    className="ml-2 text-xs underline hover:no-underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Demo Credentials Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-card-foreground mb-3">Demo Credentials for Testing:</h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@tradingpro.com', 'admin123')}
                disabled={loading}
                className="w-full text-left px-3 py-2 text-sm bg-muted/50 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-card-foreground">Admin Account</div>
                <div className="text-xs text-muted-foreground">admin@tradingpro.com / admin123</div>
              </button>
              
              <button
                type="button"
                onClick={() => handleDemoLogin('trader@tradingpro.com', 'trader123')}
                disabled={loading}
                className="w-full text-left px-3 py-2 text-sm bg-muted/50 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-card-foreground">Trader Account</div>
                <div className="text-xs text-muted-foreground">trader@tradingpro.com / trader123</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;